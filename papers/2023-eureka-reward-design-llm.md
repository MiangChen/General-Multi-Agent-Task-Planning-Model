---
id: 2023-eureka-reward-design-llm
title: "Eureka: Human-Level Reward Design via Coding Large Language Models"
short_title: Eureka
year: 2023
published: 2023-10
venue: ICLR 2024 / arXiv
status: skimmed
scope: in_scope
readiness: medium
action: build_note
tech_paradigm: llm_reward_design
primary_domain: RL
domains: [LLM, RL, Planning]
primary_technical_layer: reward_design
primary_task_family: reward_shaping
platform: simulated_control_domains
planning_relevance: 把自然语言任务目标转成可执行 reward code，为端到端任务规划提供“语言目标到优化信号”的桥。
multi_robot_relevance: 多机器人任务规划可以借鉴其 reward 生成机制，但需要把协同、等待、冲突和任务依赖编码进奖励。
system_roles: [reward_designer, planner_critic]
reusable_modules: [reward_code_generation, evaluator_feedback_loop, task_objective_synthesis]
evidence_level: paper_read
next_action: link_to_genswarm
tags: [Eureka, LLM, reward design, reinforcement learning, reward code]
authors: [Ma, Liang, Wang, Huang, Bastani, Jayaraman, Zhu, Fan, Anandkumar]
institutions: [NVIDIA, University of Pennsylvania, Caltech, UT Austin]
doi: 10.48550/arXiv.2310.12931
arxiv: 2310.12931
url: https://arxiv.org/abs/2310.12931
project_url: https://eureka-research.github.io/
image_url:
zotero_key:
citekey: ma2023eureka
cites: []
extends: []
uses: []
enables: []
contrasts: []
---

## 一句话结论

Eureka 用 LLM 生成和迭代 reward code，再让 RL 在这些奖励函数下学习技能，是“语言理解 + 优化学习”的典型组合。

## 研究问题

低层机器人技能往往需要精细 reward，人工设计成本高且难泛化。论文想回答：LLM 能否根据任务描述和环境代码自动写出接近人类专家水平的奖励函数。

## 方法

Eureka 把环境源码和任务描述提供给 LLM，让模型生成 reward 函数代码；随后用 RL 训练策略，并把训练表现反馈给 LLM 迭代改进 reward。

## 关键贡献

它证明 LLM 不只可以做 symbolic planner，还可以参与优化环节，把自然语言目标转成可训练的 reward signal。

## 局限

LLM 生成 reward 的步骤本身不可微，不能直接作为端到端模型的一部分参与梯度更新。多机器人任务中的协同失败归因也比单体技能 reward 更复杂。

## 和其他论文的关系

GenSwarm 用 LLM 生成可执行代码策略；Eureka 用 LLM 生成 reward code。两者都把 LLM 放在“可执行结构生成器”的位置，而不是直接作为低层策略。

## 对多智能体任务规划模型的启发

可以让语义理解模块输出 reward 或 critic 参数，用于训练任务分配模块。多机器人场景中，reward 需要同时考虑 makespan、等待时间、路径冲突、能力匹配和失败恢复。

## 可复用模块

reward code generator、evaluator loop、language-to-objective translation。可用于给多机器人任务分配方案生成可执行评分函数。

## 证据与风险

证据来自 reward 生成和 RL 训练闭环；风险是 reward hacking 与环境源码依赖，真实多机器人系统需要安全约束和人工审查。

## 开放问题

如何把 LLM 生成的 reward 从离散代码生成，改造成可学习、可微或可被端到端系统持续更新的 reward representation。
