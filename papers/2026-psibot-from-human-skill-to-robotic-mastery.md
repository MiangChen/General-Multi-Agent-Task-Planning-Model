---
id: 2026-psibot-from-human-skill-to-robotic-mastery
title: "From Human Skill to Robotic Mastery"
short_title: Psi-R2 / Psi-W0
year: 2026
published: 2026-03
venue: PsiBot Technical Blog
status: read
scope: in_scope
readiness: high
action: deep_read
tech_paradigm: world_action_model
primary_domain: World Action Model
domains: [World Action Model, VLA, World Model, RL]
primary_technical_layer: human_to_robot_world_action_model
primary_task_family: human_data_scaling
platform: dexterous_manipulation
planning_relevance: 提供一条工业化 WAM 路线：用 Psi-R2 做未来视频和动作联合预测，用 Psi-W0 做动作条件世界模型、策略评估和世界模型内 RL。
multi_robot_relevance: 多机器人系统可以借鉴其数据飞轮与 AC-WM critic：用世界模型评估候选动作后果、失败风险和数据质量，再回流改进执行策略。
system_roles: [executor, world_simulator, planner_critic, policy_trainer, data_curator]
reusable_modules: [raw_data_in_raw_data_out, action_conditioned_world_model, rl_in_world_model, counterfactual_failure_modeling, human_robot_kinematic_mapping, tactile_world_model_training, data_quality_autolabeling, high_precision_human_data, dit_inference_cache]
evidence_level: technical_blog
next_action: extract_data_flywheel
tags: [PsiBot, Psi-R2, Psi-W0, World Action Model, action-conditioned world model, human data, tactile data, RL in world model]
authors: [Yuanpei Chen, PsiBot]
institutions: [PsiBot, Lingchu Intelligence]
doi:
arxiv:
url: https://cypypccpy.github.io/tech-blog.github.io/
project_url: https://cypypccpy.github.io/tech-blog.github.io/
image_url:
zotero_key:
citekey: chen2026fromhuman
cites: [2026-world-action-models-zero-shot-policies, 2026-fast-wam-test-time-future-imagination, 2023-dreamerv3-world-models]
extends: []
uses: []
enables: []
complements: [2026-world-action-models-zero-shot-policies, 2023-dreamerv3-world-models]
contrasts: [2026-fast-wam-test-time-future-imagination]
---

## 一句话结论

这篇技术博客把 PsiBot 的 Psi-R2 / Psi-W0 路线讲得非常清楚：Psi-R2 是基于视频生成骨干的 WAM/VLA 策略模型，联合预测未来视频和机器人动作；Psi-W0 是动作条件世界模型，用来建模反事实失败、做策略评估、在人类数据到机器人数据的转换过程中执行 world-model 内强化学习。

## 研究问题

具身智能缺少像互联网文本或自动驾驶日志那样自然沉淀的大规模数据。人类日常和工业操作数据规模巨大，但直接迁移到机器人存在 embodiment gap：人手和机械手的关节、摩擦、动力学和接触规律都不同。博客要回答的是：如何把近 10 万小时人类操作数据真正变成可训练、可评估、可回流的机器人策略数据。

## 方法

Psi-R2 以图像和语言为输入，输出未来视觉帧和机器人可执行动作。博客明确说它基于预训练视频生成模型，技术定义上与 WAM 契合，同时因为输入视觉语言、输出动作，也具备 VLA 能力。其骨干使用 Wan2.2-IT2V-5B-480P，训练目标是未来视频和动作联合预测。

数据处理上，PsiBot 放弃复杂的人手/机械手视觉对齐，只做底层运动学维度映射：图像原始输入，动作标签按人手关节到机械手关节的映射处理。早期尝试过 image inpainting、keypoint auxiliary loss、跨空间对齐等精巧模块，但在大规模数据下这些模块会成为瓶颈。最后选择 Raw Data In, Raw Data Out：只做必要的输入输出维度对齐，让模型从足够大的原始数据中学习跨实体对应关系。

Psi-W0 则是动作条件世界模型。它输入图像、语言和动作轨迹，输出未来视频。和 Psi-R2 的区别是动作作为条件控制未来视频生成，因此更适合做反事实推理：如果动作偏了、接触早了或夹爪闭合时机错了，未来会怎样。

博客里最关键的闭环是 RL in World Model。人类动作经运动学映射后会有细小偏差，传统做法是在仿真器里用 RL 微调，但有 sim-to-real gap。PsiBot 用 Psi-W0 替代传统仿真器：把策略动作放入世界模型中 rollout，用 RL 在世界模型里微调动作，直到预测结果满足任务目标，再筛选高质量轨迹回流到 Psi-R2 / Psi-W0 训练中。

## 关键贡献

- 把 Psi-R2 明确定位成 WAM/VLA 融合路线：视频生成骨干 + 未来视频/动作联合预测。
- 把 Psi-W0 明确定位成 Action-Conditioned World Model，用于反事实评估、数据转换和策略优化。
- 提出强工程判断：大规模高质量数据下，复杂视觉对齐模块反而会阻碍长程高精度操作。
- 披露了数据规模：约 5,417 小时真机数据 + 95,472 小时人类数据，覆盖 294 场景、4,821 任务和 1,382 物体。
- 给出数据价值排序：任务多样性 > 物体多样性 >> 场景多样性；精准 3D 位姿 >> 触觉模态 > 2D 图像特征。
- 说明失败数据对世界模型的重要性：Psi-W0 额外加入约 30% 失败/无意义样本，用来学习反事实后果。
- 披露 WAM 推理工程优化：通过 DiT 缓存、Torch Compile、量化等把单次推理从 2.2 秒压到 100ms 以内。

## 阅读高光

1. 最反直觉的是放弃视觉伪对齐：不把人手修成机械手，不强行对齐 latent，只用运动学映射和大规模原始数据。
2. Psi-W0 的价值不只是预测视频，而是把世界模型变成策略评估器、失败解释器、数据质检器和训练飞轮。
3. 失败数据不是脏数据。对于 AC-WM，失败样本是学习反事实和做策略改进的必要分布。
4. 触觉被当成跨实体的共同语言：人和机器人外观不同，但接触事件和接触状态是物理上可迁移的。
5. 这条路线更像工业化 scaling law：不是靠一个漂亮模块取胜，而是靠高精度人类数据、世界模型评估和闭环回流。

## 局限

博客不是正式论文，缺少完整 benchmark 表、训练细节、消融图和可复现代码。其重点也不是跨所有机器人具身的通用模型，而是用人类数据增强特定机器人本体的预训练。对多机器人任务规划来说，还需要额外验证联合动作、通信、协同约束、资源冲突和多主体失败恢复能否进入同一个 AC-WM 数据飞轮。

## 和其他论文的关系

Psi-R2 / Psi-W0 与 DreamZero 属于同一条 WAM 大路线：都把未来视频预测和动作生成结合起来，让世界演化参与策略学习。区别是 DreamZero 更像论文定义 WAM 的通用策略范式，PsiBot 这篇博客更像工业化实现路线，重点放在人类数据规模化、触觉/3D 位姿采集、数据质检和世界模型内 RL。

它和 Fast-WAM 形成对比。Fast-WAM 追问测试时是否必须显式想象未来画面；PsiBot 路线则明确保留 Psi-W0 作为动作条件世界模型，用它做策略评估、失败建模和 RL 优化。它和 DreamerV3 也有互补关系：Dreamer 在 latent world model 中做 imagination rollout，Psi-W0 则把视频生成式世界模型当成更贴近真实视觉后果的 AC-WM。

## 对多智能体任务规划模型的启发

对我们的多智能体任务规划模型来说，这篇博客最有价值的是数据飞轮设计。多机器人系统不能只训练“成功动作执行器”，还必须有一个能理解失败后果的 critic / world model。Psi-W0 的思路可以迁移成 Multi-Agent AC-WM：输入多机器人状态、语言目标、联合动作和通信动作，预测未来世界状态、冲突、接触事件和失败后果。

另一个关键启发是数据价值排序。多机器人数据采集时，不应把预算平均花在背景场景变化上，而应优先扩任务类型、物体类型、接触事件、失败模式和高精度轨迹。若要做 No.1 仓库，这类工业技术博客应当和论文同等索引，因为它直接揭示了真实系统能跑起来的训练细节。

## 可复用模块

Raw Data In Raw Data Out、人机运动学映射、动作条件世界模型、失败样本反事实建模、world-model 内 RL、Psi-W0 数据质检、触觉预测标签、高精度人类 3D 轨迹采集、DiT 推理缓存与量化优化。适合作为多机器人 WAM 数据飞轮和 planner critic 的重要参考。

## 证据与风险

证据来自 PsiBot 技术博客和 MolmoSpaces 榜单表现披露，强在工业系统经验、数据规模、训练策略和架构分工。风险是技术博客没有论文级可复现细节，也没有公开完整训练代码和消融表；因此在仓库中应标为 technical_blog evidence，而不是 paper_read evidence。

## 开放问题

多机器人版本的 Psi-W0 应该预测什么？是未来视频、对象状态图、接触事件、资源占用、通信状态，还是这些的组合？如果要做 world-model 内 RL，联合动作空间和奖励信号如何设计，才能避免多机器人协同中的信用分配和组合爆炸问题？
