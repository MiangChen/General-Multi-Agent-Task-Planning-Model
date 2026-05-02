---
id: 2026-world-action-models-zero-shot-policies
title: "World Action Models are Zero-shot Policies"
short_title: DreamZero / WAM
year: 2026
published: 2026-02
venue: arXiv
status: read
scope: in_scope
readiness: high
action: deep_read
tech_paradigm: world_action_model
primary_domain: World Action Model
domains: [World Action Model, VLA, World Model]
primary_technical_layer: dynamics_prediction
primary_task_family: zero_shot_policy
platform: heterogeneous_robot_data
planning_relevance: 可作为 planner 的世界 rollout / action feasibility 模型，而不只是末端执行策略。
multi_robot_relevance: 视频预测和动作联合建模为多机器人协同仿真提供方向，但论文主要验证单机器人真实实验。
system_roles: [world_simulator, planner_critic, executor]
reusable_modules: [video_action_world_model, zero_shot_policy_rollout, action_feasibility_prediction, dreamzero_flash, decoupled_noise_schedule, async_chunk_execution, diversity_first_data_collection, cross_embodiment_adaptation]
evidence_level: paper_read
next_action: extend_to_multi_agent_rollout
tags: [World Action Model, DreamZero, video diffusion, zero-shot policy, cross-embodiment]
authors: [Ye, Ge, Zheng, Gao, Du, Chebotar, Reed, Kautz, Zhu, Fan, Jang]
institutions: [NVIDIA, University of Texas at Austin, Georgia Tech]
doi: 10.48550/arXiv.2602.15922
arxiv: 2602.15922
url: https://arxiv.org/abs/2602.15922
project_url: https://dreamzero0.github.io/
pdf_path: pdfs/2026-02-01-DreamZero-world-action-model.pdf
image_url:
zotero_key:
citekey: ye2026world
cites: [2024-pyramidal-flow-matching-video, 2025-pi05-open-world-generalization, 2024-pi0-vla-flow-model, 2023-rt-2-vla, 2023-dreamerv3-world-models]
extends: []
uses: [2024-pyramidal-flow-matching-video, 2023-dreamerv3-world-models]
enables: []
complements: []
contrasts: [2025-pi05-open-world-generalization, 2024-pi0-vla-flow-model, 2023-rt-2-vla]
---

## 一句话结论

World Action Model 的关键转向是：不只从视觉语言直接输出动作，而是联合预测未来视频世界状态和动作，用世界演化本身支持零样本策略。

## 研究问题

VLA 语义泛化强，但对未见物理运动和新环境动作泛化弱。能否用预训练视频扩散模型学习物理动态，从而成为零样本策略。

## 方法

DreamZero 基于预训练视频扩散/生成骨干，联合建模未来视频和动作，并做系统优化，使大规模视频生成模型能以约 7Hz 做实时闭环控制。关键工程链路包括：用 teacher forcing attention mask 降低闭环滚动中的误差累积，用 KV-cache 缓存历史视觉 token 以支持实时推理，并用 DreamZero-Flash 把扩散式多步生成压缩到更接近实时控制的单步推理。

DreamZero-Flash 的核心是 decoupled noise schedules：训练时把视频噪声和动作噪声解绑，让视频更多处于高噪声、模糊状态，而动作仍保持可学习的均匀噪声。这样模型在单步推理时即使只能看到“模糊未来”，也要学会输出干净动作。这个设计可以理解成“抗大雾训练法”：故意让模型在视觉未来很不确定的条件下学习稳定控制。

执行层采用 asynchronous execution：模型每次输出一段约 1.6 秒的 action chunk，机器人执行当前 chunk 的同时，GPU 在后台计算下一段动作。这样大模型推理不必阻塞低层控制循环，避免“停下思考再动一下”的同步卡顿。

## 关键贡献

论文报告相比当时 VLA 在新任务和新环境上有显著泛化提升，并展示视频-only 演示和少量新具身数据下的跨具身迁移。更重要的是，它把 robotics 里的几个关键假设往前推了一步：

- 速度：DreamZero-Flash、KV-cache 和 Asynchronous Execution 共同服务于实时闭环，让 video diffusion 不再只是离线生成器。
- 数据：采用 Diversity > Repetition 的数据哲学，不把采集预算耗在单任务重复熟练度上，而是通过 data deprecation 机制限制单任务重复次数，强迫数据覆盖更多任务和环境。
- 跨具身：Cross-Embodiment 利用人类第一人称纯视频和少量新机器人 play data，把视频模型里的物理常识和语义能力迁移到不同机器人身体上。
- 策略形式：WAM 不只是“看图出动作”的 VLA，而是用未来世界预测来支撑动作选择。

## 阅读高光：Robotics 视角的 4 个 Idea

1. DreamZero-Flash：为单步去噪设计的抗噪训练。通过解耦视频噪声和动作噪声，让模型习惯在模糊未来里仍输出精确动作。
2. Diversity > Repetition：数据收集强调任务和场景广度，而不是对同一任务反复示教。data deprecation 让单任务达到上限后被停止采集，逼迫数据集覆盖新任务。
3. Asynchronous Execution：大脑推理和身体执行并行。动作 chunk 正在执行时，GPU 计算下一段 chunk，从而让大模型控制看起来连续。
4. Cross-Embodiment：模型不只学习某个机器人身体的动作映射，还尝试从人类视频和少量新机器人 play data 中迁移技能与逆动力学。

## 局限

WAM 当前仍主要面向机器人操作策略。对于多机器人，关键挑战会变成多主体状态预测、交互建模、通信动作和联合任务奖励。

## 和其他论文的关系

DreamZero 和 Dreamer 都是 world model 思路，但侧重点不同：Dreamer 在 latent world model 中用 RL 学行为，DreamZero 借视频生成模型和动作联合预测直接成为策略。Pyramidal Flow 是其视频生成和 flow matching 技术背景之一。

## 对多智能体任务规划模型的启发

WAM 可以不只做执行器，还可以做 planner 的“行动后果预测器”：给定多个候选子任务分配，预测世界状态变化、冲突风险和可行性。

对多机器人任务规划尤其关键的是三点。第一，diversity-first 数据策略提示我们不应只收集同一协作任务的大量重复轨迹，而要覆盖更多机器人组合、场景布局、任务依赖和失败模式。第二，asynchronous execution 可以变成多机器人系统的执行协议：每个机器人执行自己的 action chunk，同时中央 planner 或分布式 critic 在后台更新下一段联合计划。第三，cross-embodiment adaptation 提示多机器人系统可以把“机器人能力模型”和“任务语义模型”分开：少量 play data 用来适配新机器人身体，语义和世界预测能力尽量保留。

## 可复用模块

video-action world model、zero-shot policy rollout、action feasibility predictor、DreamZero-Flash / decoupled noise schedule、asynchronous action chunk executor、diversity-first data collector、cross-embodiment adapter。适合作为 planner critic、多机器人联合 rollout 和 planner-to-executor 接口的核心候选。

## 证据与风险

证据强在 zero-shot policy、视频-动作联合建模、实时推理工程、数据广度策略和跨具身迁移；风险是多主体交互、联合动作空间、通信动作和多机器人任务级同步尚未直接验证。DreamZero 证明了 WAM 可以成为强执行器和单机器人世界预测器，但把它升级成多机器人 planner critic 还需要额外验证：联合状态表示、冲突预测、角色分工、通信延迟和失败恢复是否能被同一个视频-动作模型稳定建模。

## 开放问题

如何把 WAM 从单机器人视频-动作预测扩展到多机器人联合动作预测，例如同时建模 A 机器人移动、B 机器人抓取、C 机器人等待带来的全局状态变化。
