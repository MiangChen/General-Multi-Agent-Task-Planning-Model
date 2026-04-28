---
id: dreamer-world-models
type: topic
title: Dreamer 与 World Model RL
tags: [Dreamer, world model, model-based RL]
---

# Dreamer 与 World Model RL

Dreamer 系列通过学习潜在世界模型并在想象轨迹中优化策略。它和 WAM 的共同点是都强调世界预测，不同点是 Dreamer 更偏 RL 训练框架，WAM 更偏视频生成式 action model。

## 关键论文

- [[2023-dreamerv3-world-models]]
- [[2023-daydreamer-world-models-for-physical-robot-learning]]

## 多机器人问题

多机器人任务规划需要的 world model 不只是预测一个 agent 的观察变化，还要预测多个机器人和任务对象的联合状态变化。
