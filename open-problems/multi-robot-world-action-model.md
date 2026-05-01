---
id: multi-robot-world-action-model
type: open_problem
title: 多机器人 World Action Model
tags: [World Action Model, multi-robot, world model]
---

# 多机器人 World Action Model

现有 WAM 主要建模单机器人动作和世界视频变化。多机器人任务规划需要联合动作世界模型。

## 研究问题

- 多机器人联合动作空间如何表示。
- 模型是否需要显式 robot token 和 object token。
- 通信动作、等待动作、避让动作是否应纳入 action model。
- 预测目标应是视频、状态图，还是两者结合。
- 哪些未来预测只需要作为训练期 representation learning，哪些必须在测试时显式 rollout。
- 多机器人 AC-WM 是否需要显式失败样本、触觉/接触标签和资源占用标签，才能支持 world-model 内策略优化。
- 多机器人 action diffusion 应该采用每机器人独立 action chunk，还是联合 action chunk；如果是联合扩散，如何控制组合爆炸和硬约束违反。

## 相关论文

- [[2026-world-action-models-zero-shot-policies]]
- [[2023-diffusion-policy-action-diffusion]]
- [[2026-fast-wam-test-time-future-imagination]]
- [[2026-psibot-from-human-skill-to-robotic-mastery]]
- [[2023-dreamerv3-world-models]]
