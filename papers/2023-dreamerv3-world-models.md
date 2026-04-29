---
id: 2023-dreamerv3-world-models
title: "Mastering Diverse Control Tasks through World Models"
short_title: DreamerV3
year: 2023
published: 2023-01
venue: arXiv 2023 / Nature 2025
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: world_model_rl
primary_domain: World Model
domains: [World Model, RL]
primary_technical_layer: imagination_planning
primary_task_family: latent_world_model_control
platform: simulated_control_domains
planning_relevance: 提供从环境模型中想象未来并学习策略的基础范式，Nature 版本进一步强调跨 150+ 控制任务和 Minecraft 长程目标。
multi_robot_relevance: 可迁移为多智能体 latent world model，但需要额外处理多主体状态、联合动作和非平稳性。
system_roles: [world_simulator, planner_critic, policy_trainer]
reusable_modules: [latent_world_model, imagination_rollout, long_horizon_value_learning]
evidence_level: paper_read
next_action: map_to_planner_critic
tags: [DreamerV3, world model, model-based RL, latent imagination, reinforcement learning, Minecraft]
authors: [Hafner, Pasukonis, Ba, Lillicrap]
institutions: [Google DeepMind]
doi: 10.1038/s41586-025-08744-2
arxiv: 2301.04104
url: https://www.nature.com/articles/s41586-025-08744-2
project_url: https://danijar.com/project/dreamerv3/
image_url:
zotero_key:
citekey: hafner2023dreamerv3
cites: [2023-daydreamer-world-models-for-physical-robot-learning]
extends: []
uses: []
enables: []
complements: []
contrasts: []
---

## 一句话结论

DreamerV3 是 world model RL 的重要基线：先学环境模型，再在想象轨迹中优化行为，并在 Nature 版本中展示了跨多控制域和 Minecraft 长程任务的泛化能力。

## 研究问题

能否用一个相对统一的模型化 RL 算法，在很多差异很大的控制任务上减少人工调参并保持稳定学习，甚至从零开始完成 Minecraft 挖钻石这类长程稀疏奖励任务。

## 方法

Dreamer 学习潜在状态空间中的世界模型，用该模型预测未来并在 imagined trajectories 上训练 actor-critic。Nature 版本强调同一套算法在固定超参数下覆盖连续控制、离散控制、视觉输入、低维输入和 Minecraft 等多种环境。

## 关键贡献

它证明 world model 可以成为通用控制算法的核心，而不只是辅助模拟器；其中 Minecraft 结果说明 world model 可以支撑长时程、稀疏奖励、多步骤技术树式任务。

## 局限

DreamerV3 的核心评测不针对语言任务，也不直接解决机器人多智能体协同。它能做强控制学习，但还没有处理自然语言任务分解、异构机器人能力约束、通信和联合调度。

## 和其他论文的关系

DayDreamer 把 Dreamer 类方法带到真实机器人在线学习；DreamZero 则借视频扩散模型把 world model 推向 zero-shot policy。对你的路线来说，DreamerV3 / Nature 版本是“world model 可以做长程控制推演”的核心证据。

## 对多智能体任务规划模型的启发

对多机器人 planner 来说，Dreamer 的价值是“可学习的任务级 transition model”：可以用来评估分配方案的长期后果，而不只是贪心分配当前任务。Minecraft 技术树式任务也提示，多机器人任务可以被建模为长程状态推进和资源转换过程。

## 可复用模块

latent transition model、imagination rollout、value model。可作为上层 planner 的 critic，用来评估任务分配、重规划和长期资源转换。

## 证据与风险

证据强在跨领域 benchmark 和长程控制；风险在于多机器人场景需要显式建模 agent identity、通信动作和局部观测。

## 开放问题

多机器人任务规划中，latent state 应该显式分解为每个机器人和任务对象，还是使用端到端共享 latent 表示。
