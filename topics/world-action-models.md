---
id: world-action-models
type: topic
title: World Action Model
tags: [World Action Model, WAM, DreamZero, video diffusion]
---

# World Action Model

World Action Model 的核心是联合建模视频世界状态和动作。它比直接 VLA 多一个“未来世界如何变化”的建模目标，但 Fast-WAM 进一步提醒：这个建模目标未必必须在测试时显式生成未来画面，视频预测也可能主要作为训练期的 world representation 学习信号。

## 对多机器人任务规划的价值

- 作为动作可行性评估器。
- 作为任务顺序的 rollout 模型。
- 预测多个候选分配方案的世界状态变化。
- 发现空间冲突、对象占用冲突和失败风险。

## 关键论文

- [[2026-world-action-models-zero-shot-policies]]
- [[2026-fast-wam-test-time-future-imagination]]
- [[2026-psibot-from-human-skill-to-robotic-mastery]]
- [[2024-pyramidal-flow-matching-video]]

## 相邻源头

- [[2023-diffusion-policy-action-diffusion]]：不是严格 WAM，但提供了机器人动作扩散生成范式，后续 WAM 可以把它视为低层 action head 的祖先。

## 需要补的空白

现有 WAM 主要还是单机器人真实操作实验。多机器人版本需要显式处理联合动作、机器人间遮挡、通信动作和协同奖励。Fast-WAM 也提出了一个新的拆分问题：低层执行也许不需要每一步 runtime imagination，但高层任务分配、冲突检测和失败恢复可能仍需要显式 rollout 或结构化状态预测。
