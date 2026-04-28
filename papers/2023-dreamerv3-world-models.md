---
id: 2023-dreamerv3-world-models
title: "Mastering Diverse Domains through World Models"
short_title: DreamerV3
year: 2023
venue: arXiv / Nature 2025
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: world_model_rl
primary_technical_layer: imagination_planning
primary_task_family: latent_world_model_control
platform: simulated_control_domains
planning_relevance: 提供从环境模型中想象未来并学习策略的基础范式。
multi_robot_relevance: 可迁移为多智能体 latent world model，但需要额外处理多主体状态、联合动作和非平稳性。
tags: [DreamerV3, world model, model-based RL, latent imagination, reinforcement learning]
authors: [Hafner, Pasukonis, Ba, Lillicrap]
institutions: [Google DeepMind]
doi: 10.48550/arXiv.2301.04104
arxiv: 2301.04104
url: https://arxiv.org/abs/2301.04104
project_url: https://danijar.com/project/dreamerv3/
image_url:
zotero_key:
citekey: hafner2023dreamerv3
---

## 一句话结论

DreamerV3 是 world model RL 的重要基线：先学环境模型，再在想象轨迹中优化行为。

## 研究问题

能否用一个相对统一的模型化 RL 算法，在很多差异很大的任务上减少人工调参并保持稳定学习。

## 方法

Dreamer 学习潜在状态空间中的世界模型，用该模型预测未来并在 imagined trajectories 上训练 actor-critic。

## 关键贡献

它证明 world model 可以成为通用控制算法的核心，而不只是辅助模拟器。

## 局限

DreamerV3 的核心评测不针对语言任务，也不直接解决机器人多智能体协同。多机器人环境会带来非平稳性和联合动作空间爆炸。

## 和其他论文的关系

DayDreamer 把 Dreamer 类方法带到真实机器人在线学习；DreamZero 则借视频扩散模型把 world model 推向 zero-shot policy。

## 对多智能体任务规划模型的启发

对多机器人 planner 来说，Dreamer 的价值是“可学习的任务级 transition model”：可以用来评估分配方案的长期后果，而不只是贪心分配当前任务。

## 开放问题

多机器人任务规划中，latent state 应该显式分解为每个机器人和任务对象，还是使用端到端共享 latent 表示。
