---
id: multi-robot-task-allocation
type: topic
title: 多机器人任务分配
tags: [MRTA, multi-robot, task allocation, scheduling, GNN, RL]
---

# 多机器人任务分配

多机器人任务分配负责把已经分解好的任务分派给具备相应能力的机器人，并处理位置、时间、等待、协作和资源冲突。

## 关键论文

- [[2026-genswarm-multi-robot-code-policy]]
- [[2025-heterogeneous-mrta-rl]]

## 和端到端模型的关系

当前更合理的拆法是：语言/视觉模型负责把开放目标转成结构化任务图，GNN/Transformer/RL 模块在 agent-task 图上做任务分配，再由 VLA/WAM 作为执行器或执行结果评估器。

## 需要补的空白

- 任务分解和任务分配如何联合训练。
- VLA 执行失败率如何反馈到任务分配模块。
- 多机器人任务分配是否应该输出离散甘特图，还是输出可被执行器持续调整的 latent plan。
