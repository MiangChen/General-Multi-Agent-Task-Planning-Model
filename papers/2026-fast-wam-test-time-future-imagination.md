---
id: 2026-fast-wam-test-time-future-imagination
title: "Fast-WAM: Do World Action Models Need Test-time Future Imagination?"
short_title: Fast-WAM
year: 2026
published: 2026-03
venue: arXiv
status: read
scope: in_scope
readiness: high
action: deep_read
tech_paradigm: world_action_model
primary_domain: World Action Model
domains: [World Action Model, VLA, World Model]
primary_technical_layer: dynamics_prediction
primary_task_family: test_time_imagination_ablation
platform: heterogeneous_robot_data
planning_relevance: 直接回答 WAM 在测试时是否必须显式生成未来画面，为 planner critic 和实时执行器的接口设计提供关键消融证据。
multi_robot_relevance: 多机器人规划若依赖联合未来视频想象，推理成本会更高；Fast-WAM 提示可以把视频建模保留在训练期，把测试时接口简化为直接动作生成或低延迟 critic。
system_roles: [world_encoder, executor, planner_critic]
reusable_modules: [video_cotraining_world_encoder, no_test_time_imagination, single_pass_action_generation, structured_attention_mask, wam_ablation_protocol]
evidence_level: paper_read
next_action: compare_test_time_imagination
tags: [Fast-WAM, World Action Model, test-time imagination, video co-training, action generation, real-time control]
authors: [Tianyuan Yuan, Zibin Dong, Yicheng Liu, Hang Zhao]
institutions: [IIIS Tsinghua University, Galaxea AI]
doi: 10.48550/arXiv.2603.16666
arxiv: 2603.16666
url: https://arxiv.org/abs/2603.16666
project_url: https://yuantianyuan01.github.io/FastWAM/
pdf_path: pdfs/2026-03-01-Fast-WAM-world-action-model.pdf
code_url: https://github.com/yuantianyuan01/FastWAM
image_url:
zotero_key:
citekey: yuan2026fastwam
cites: [2026-world-action-models-zero-shot-policies, 2024-pi0-vla-flow-model, 2025-pi05-open-world-generalization]
extends: []
uses: []
enables: []
contrasts: [2026-world-action-models-zero-shot-policies, 2024-pi0-vla-flow-model, 2025-pi05-open-world-generalization]
---

## 一句话结论

Fast-WAM 的核心结论是：WAM 的主要收益可能来自训练期的视频协同建模，而不是测试时显式生成未来画面；因此测试时可以跳过 future imagination，直接用当前真实观测生成动作，并显著降低推理延迟。

## 研究问题

DreamZero 代表的 WAM 路线把未来视频预测和动作生成绑在一起，默认认为机器人需要先“想象未来画面”再执行动作。但这一步会带来扩散去噪和视频生成的推理开销。Fast-WAM 直接追问：预测未来画面这一步真的有必要吗？还是说，视频预测的价值主要发生在训练期，用来塑造更好的 world representation？

## 方法

论文把 WAM 拆成几个可比较范式。Figure 1A 对应 DreamZero 式路线：视频和动作在扩散过程中联合生成，测试时显式想象未来画面。Figure 1B 把未来视频生成和动作生成拆成两个过程，先想象视频，再由后续模块产出动作。Figure 1C 是 Fast-WAM：训练时仍保留 video co-training，让模型学习世界动态表征；测试时生成动作只使用当前真实观测，不再显式生成未来画面。

Fast-WAM 使用预训练视频 DiT 作为视觉世界编码器，并加入 action expert DiT 做 action chunk 生成。训练阶段同时优化动作预测和未来视频预测，让视觉 backbone 通过视频建模学习动态敏感的 latent representation。推理阶段丢弃未来视频分支，只保留当前观测的 clean latent tokens，一次前向直接生成动作，从而避开 imagine-then-execute WAM 的主要延迟来源。

论文还通过结构化 attention mask 避免信息泄漏：action tokens 不能直接看到未来视频 tokens，否则模型可能只是借用了测试时不存在的未来画面。这个 mask 让消融更干净：可以区分“训练期视频建模让 representation 变好”和“测试时生成未来画面带来额外信息”。

## 关键贡献

- 提出了一个更尖锐的 WAM 消融问题：WAM 到底需要测试时想象，还是只需要训练时被视频预测任务塑形。
- 提出 Fast-WAM：保留 video co-training，但在测试时移除显式 future video generation，用当前真实观测直接生成动作。
- 通过 A / B / C 三种范式比较 DreamZero 式联合生成、两阶段想象-执行和 Fast-WAM 的直接动作生成。
- 实验显示 Fast-WAM 接近 imagine-then-execute 变体，而移除 video co-training 会造成更大性能下降，支持“训练期世界建模比测试时想象更关键”的解释。
- 在 LIBERO、RoboTwin 和真实毛巾折叠任务中取得强结果，并报告 190ms 推理延迟，比显式想象式 WAM 更适合实时控制。

## 阅读高光：WAM 设计范式的反转

1. DreamZero 证明了未来视频和动作联合建模可以成为策略；Fast-WAM 则追问测试时是否真的需要生成未来视频。
2. Figure 1 的 A/B/C 对比很重要：A 是联合训练视频和动作扩散生成，B 是先预测未来视频再生成动作，C 是 Fast-WAM 只用当前真实观测直接动作生成。
3. 最有价值的不是“模型会不会想象未来画面”，而是“视频预测任务是否把视觉 backbone 训练成了更好的世界编码器”。
4. 对机器人部署来说，Fast-WAM 把 WAM 从昂贵的 runtime imagination 转成了低延迟 world representation learning。

## 局限

Fast-WAM 主要验证单机器人控制和标准机器人 benchmark。它削弱了测试时未来视频生成的必要性，但不等于未来预测在所有规划层级都没用。对于多机器人任务规划，显式预测未来状态、冲突和资源占用仍可能对高层 planner 有价值，只是不一定需要像 DreamZero 那样在每个低层动作步都生成视频。

## 和其他论文的关系

Fast-WAM 和 DreamZero 不是继承关系，而是 WAM 框架下的两条对比路线：DreamZero 代表测试时显式 future imagination / imagine-then-execute，Fast-WAM 代表训练期 video co-training 加测试时 direct action generation。Fast-WAM 的价值在于把 DreamZero 隐含的“执行时需要想象未来画面”假设拆出来做消融，而不是沿着 DreamZero 继续扩展。它也和 π0、π0.5 等 VLA 路线形成对比：VLA 通常直接从观测和语言到动作，Fast-WAM 则保留训练期 world modeling，但测试时表现得更像一个低延迟 action policy。

## 对多智能体任务规划模型的启发

Fast-WAM 对我们的多智能体任务规划很关键：多机器人联合未来视频预测会非常昂贵，尤其当机器人数量、遮挡、通信和任务依赖增加时。如果 Fast-WAM 的结论成立，多机器人模型可以把“未来预测”主要用于训练世界表征或 planner critic，而不是每一步执行时都显式生成未来视频。

更具体地，可以把系统分成两层：训练期用视频/状态预测任务学习 world encoder，让模型理解动作对环境的影响；测试时高层 planner 只调用低延迟 encoder + action/critic head，必要时再对少量关键候选计划做显式 rollout。这样能兼顾实时执行和世界模型能力。

## 可复用模块

video co-training world encoder、no-test-time-imagination inference、single-pass action generation、structured attention mask、WAM ablation protocol。对我们的仓库来说，它不是又一个单纯执行器，而是一个判断“什么时候需要显式想象未来”的实验模板。

## 证据与风险

证据来自官方论文报告的 LIBERO、RoboTwin 和真实毛巾折叠任务：Fast-WAM 在去掉测试时 future generation 后仍保持强性能，同时 190ms 延迟明显更利于实时控制。风险是这些结果还不能直接推出多机器人高层规划也不需要显式未来预测；多主体冲突、资源竞争、通信延迟和任务依赖可能仍需要在 planner 层做显式 rollout 或结构化状态预测。

## 开放问题

多机器人系统中，哪些预测应该只作为训练期 representation learning，哪些预测必须在测试时显式执行？例如：低层动作控制也许可以用 Fast-WAM 式直接生成，但任务分配、冲突检测和失败恢复可能仍需要对候选联合计划做未来状态想象。
