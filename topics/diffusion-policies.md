---
id: diffusion-policies
type: topic
title: Diffusion 动作生成
tags: [Diffusion Policy, action diffusion, robot policy, action chunk]
---

# Diffusion 动作生成

Diffusion 路线的核心不是语言语义，而是连续动作分布建模：给定视觉、状态或任务条件，在动作空间里从噪声逐步去噪出一段可执行 action chunk。

## 和 VLA / World Model / WAM 的区别

- VLA：重点是视觉语言语义 grounding，把自然语言目标接到机器人动作接口。
- Diffusion：重点是连续动作生成，把专家动作分布学成可采样、可闭环执行的 action chunk policy。
- World Model：重点是预测未来状态或 latent dynamics，用于评估和规划。
- WAM：把动作生成和未来世界预测结合起来，既建模 action，也建模 action 后世界怎么变。

## 对多机器人任务规划的价值

- 给每个机器人提供局部连续控制 executor。
- 用 action chunk 接口承接高层 planner 的子任务。
- 支持多峰动作选择，避免平均动作导致的不可执行控制。
- 和 receding horizon control 结合，允许执行中持续读取新观测并重规划。

## 关键论文

- [[2023-diffusion-policy-action-diffusion]]

## 需要补的空白

多机器人版本不能只把单机器人 diffusion policy 复制 N 次。关键问题是：联合动作空间如何表示，机器人之间的碰撞、遮挡、资源占用和通信动作如何进入条件输入或约束，以及独立采样的局部 action chunk 如何被全局 planner 约束到同一个协作计划中。
