---
id: planning-vs-execution-boundary
type: finding
title: VLA 不是 planner，至少现在更像执行器
tags: [VLA, task planning, system architecture]
---

# VLA 不是 planner，至少现在更像执行器

RT-2 和 π 系列证明了语言到动作的泛化能力，但它们主要处理单机器人局部执行。多机器人任务规划仍需要显式的外层结构处理任务依赖、资源竞争、空间冲突、通信和失败恢复。

## 架构判断

当前更稳的架构是：

```text
goal -> task decomposition -> multi-robot allocation -> VLA/WAM execution -> world model feedback
```

而不是：

```text
goal -> one giant VLA controls all robots
```

## 关联论文

- [[2026-genswarm-multi-robot-code-policy]]
- [[2025-heterogeneous-mrta-rl]]
- [[2023-rt-2-vla]]
- [[2024-pi0-vla-flow-model]]
- [[2026-pi07-steerable-generalist-robotic-foundation-model]]
