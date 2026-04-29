---
id: world-model-as-planner-critic
type: finding
title: World model 更适合作为 planner critic
tags: [world model, WAM, planning]
---

# World model 更适合作为 planner critic

对多机器人任务规划，world model 最直接的价值不是替代 symbolic planner，而是评估候选计划的后果。

## 可用方式

- 给定任务分配方案，预测未来状态。
- 给定机器人动作组合，估计冲突概率。
- 给定失败历史，更新执行成功率。
- 给定候选顺序，评估长期 reward 或 makespan。

## 关联论文

- [[2026-world-action-models-zero-shot-policies]]
- [[2024-pyramidal-flow-matching-video]]
- [[2023-dreamerv3-world-models]]
- [[2023-daydreamer-world-models-for-physical-robot-learning]]
