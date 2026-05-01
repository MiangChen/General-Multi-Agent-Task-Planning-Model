---
id: vision-language-action-models
type: topic
title: VLA 模型
tags: [VLA, robot foundation model, action model]
---

# VLA 模型

VLA 把视觉、语言和动作合到同一个策略模型中。对多机器人任务规划来说，VLA 的价值不是直接替代 planner，而是提供可泛化的执行接口。

## 研究脉络

- RT-2：动作 token 化，证明网页语义知识可以迁移到机器人控制。
- π0：VLM + flow matching，强调连续动作和多平台数据。
- FAST：用频域动作 tokenization 提升高频动作数据训练效率。
- π0.5：开放世界泛化，加入高层语义子任务预测。
- LAP：把 action chunk 自动转成自然语言动作，让 VLM 直接输出较长时间尺度的离散语言动作。
- π0.6 / π*0.6：部署和经验学习。
- MEM：给 VLA 加入短期视频记忆和长期文本记忆。
- π0.7：多模态上下文条件，增强 steerability 和组合泛化。

## 对 planner 的接口

理想接口不是“给一句自然语言然后祈祷模型做好”，而是结构化上下文：

- robot_id
- robot_capability
- subgoal
- precondition
- expected_postcondition
- forbidden_region
- collaboration_role
- recovery_policy

## 动作表示路线

- 连续动作专家：π0、π0.5，用 flow matching 输出连续 action chunk。
- 频域动作 token：FAST，把高频动作块压缩成更适合自回归模型学习的 token。
- 语言动作：LAP，把动作块写成 `move forward 5 cm; close gripper` 这类文本，使动作预测和 VQA 共享 VLM 的语言输出空间。

Diffusion Policy 这类方法不归入 VLA 主路线，而是单独作为 Diffusion 动作生成路线；VLA 可以在执行层调用 diffusion / flow action head，但二者解决的问题不同。
