---
id: general-multi-agent-task-planning-model
type: topic
title: 通用多智能体任务规划模型
tags: [multi-agent, task planning, VLA, world model, end-to-end model]
---

# 通用多智能体任务规划模型

这个知识库的目标不是复现单机器人操作控制，而是研究 VLA、World Action Model 和 Dreamer 类 world model 能否成为端到端多智能体任务规划模型中的组件。

## 关键层次

- 高层任务分解：把自然语言目标拆成可执行子任务。
- 任务分配：根据机器人能力、位置、负载和风险分派子任务。
- 执行策略：由 VLA 或 WAM 执行局部子任务。
- Diffusion 动作生成：把局部子任务转成连续 action chunk，作为独立于 VLA 语义路线的低层执行接口。
- 世界预测：用 world model 评估任务顺序、冲突风险和长期后果。
- 失败恢复：把真实执行失败转成能力模型更新或策略再训练数据。

## 相关论文

- [[scene-task-graphs]]
- [[structure-generation]]
- [[2026-foundation-models-robot-swarms]]
- [[2026-genswarm-multi-robot-code-policy]]
- [[2025-heterogeneous-mrta-rl]]
- [[2023-eureka-reward-design-llm]]
- [[2023-diffusion-policy-action-diffusion]]
- [[2023-rt-2-vla]]
- [[2024-pi0-vla-flow-model]]
- [[2025-fast-action-tokenization-vla]]
- [[2025-pi05-open-world-generalization]]
- [[2026-lap-language-action-pretraining]]
- [[2026-mem-multi-scale-embodied-memory]]
- [[2026-pi07-steerable-generalist-robotic-foundation-model]]
- [[2026-world-action-models-zero-shot-policies]]
- [[2026-psibot-from-human-skill-to-robotic-mastery]]
- [[2023-dreamerv3-world-models]]
