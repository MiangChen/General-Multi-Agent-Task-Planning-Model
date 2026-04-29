---
id: 2024-pi0-vla-flow-model
title: "π0: A Vision-Language-Action Flow Model for General Robot Control"
short_title: π0
year: 2024
published: 2024-10
venue: RSS 2025
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: vla_flow_policy
primary_domain: VLA
domains: [LLM, VLA]
primary_technical_layer: action_representation
primary_task_family: generalist_robot_control
platform: multi_embodiment_manipulation
planning_relevance: 可作为从语言子任务到连续动作片段的通用执行器。
multi_robot_relevance: 多机器人侧重点不在模型本身，而在如何给不同机器人分派可由 π0 执行的子任务。
tags: [π0, VLA, flow matching, action chunks, robot foundation model]
authors: [Black, Brown, Driess, Finn, Hausman, Ichter, Levine, Pertsch]
institutions: [Physical Intelligence]
doi: 10.48550/arXiv.2410.24164
arxiv: 2410.24164
url: https://arxiv.org/abs/2410.24164
project_url: https://physicalintelligence.company/blog/pi0
image_url:
zotero_key:
citekey: black2024pi0
cites: [2023-rt-2-vla]
---

## 一句话结论

π0 的核心是把预训练 VLM 和 flow matching 动作头结合起来，面向跨平台、长程、灵巧操作学习连续动作策略。

## 研究问题

通用机器人策略如何同时继承互联网语义知识，并在多种机器人平台和复杂真实任务上输出稳定动作。

## 方法

模型在预训练视觉语言骨干上添加 flow matching 动作生成结构，训练数据覆盖单臂、双臂和移动操作平台。

## 关键贡献

相比 RT-2 的动作 token 化，π0 更重视连续动作分布和高频控制接口，适合复杂真实操作任务。

## 局限

论文重点仍是机器人操作执行，不是任务规划算法。它不直接处理多机器人之间的任务分配、队形、通信、协商或冲突消解。

## 和其他论文的关系

π0 是 π0.5、π0.6、π0.7 的基础。π0.5 强化开放环境泛化，π0.6 和 π*0.6 强调部署与经验学习，π0.7 强调可控上下文和组合泛化。

## 对多智能体任务规划模型的启发

可以把 π0 视为“技能执行模型”，让上层 multi-agent planner 输出语言或子目标，再由不同机器人实例调用策略执行。

## 开放问题

多机器人 planner 应该把 π0 的能力建模成离散技能库，还是建模成带不确定性的连续可行动作模型。
