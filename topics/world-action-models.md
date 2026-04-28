---
id: world-action-models
type: topic
title: World Action Model
tags: [World Action Model, WAM, DreamZero, video diffusion]
---

# World Action Model

World Action Model 的核心是联合建模视频世界状态和动作。它比直接 VLA 多一个“未来世界如何变化”的建模目标。

## 对多机器人任务规划的价值

- 作为动作可行性评估器。
- 作为任务顺序的 rollout 模型。
- 预测多个候选分配方案的世界状态变化。
- 发现空间冲突、对象占用冲突和失败风险。

## 关键论文

- [[2026-world-action-models-zero-shot-policies]]

## 需要补的空白

现有 WAM 主要还是单机器人真实操作实验。多机器人版本需要显式处理联合动作、机器人间遮挡、通信动作和协同奖励。
