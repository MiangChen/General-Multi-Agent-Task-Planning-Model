---
id: 2025-heterogeneous-mrta-rl
title: "Heterogeneous Multi-robot Task Allocation and Scheduling via Reinforcement Learning"
short_title: Heterogeneous MRTA RL
year: 2025
published: 2025-03
venue: IEEE Robotics and Automation Letters 2025
status: skimmed
scope: in_scope
readiness: high
action: build_note
tech_paradigm: multi_robot_allocation_rl
primary_domain: GNN
domains: [GNN, RL, Planning]
primary_technical_layer: decentralized_task_allocation
primary_task_family: heterogeneous_task_allocation
platform: heterogeneous_multi_robot_systems
planning_relevance: 直接研究异构多机器人任务分配与调度，是当前仓库里最贴近任务分配模块的论文之一。
multi_robot_relevance: 核心对象就是异构机器人、任务能力需求、协作等待和 makespan 优化。
system_roles: [task_allocator, scheduler, planner_baseline]
reusable_modules: [heterogeneous_agent_task_graph, rl_scheduler, allocation_objective]
evidence_level: paper_read
next_action: turn_into_baseline
tags: [MRTA, heterogeneous robots, reinforcement learning, scheduling, attention, task allocation]
authors: [Dai, Rai, Chiun, Cao, Sartoretti]
institutions: [National University of Singapore, IIIT Hyderabad]
doi: 10.1109/LRA.2025.3534682
arxiv:
url: https://ieeexplore.ieee.org/document/10854527
project_url: https://www.marmotlab.org/publications/73-RAL2025-HetMRTA.pdf
pdf_path: pdfs/2025-03-01-HetMRTA-RL-gnn-task-allocation.pdf
image_url:
zotero_key:
citekey: dai2025heterogeneous
cites: []
extends: []
uses: []
enables: []
complements: []
contrasts: []
---

## 一句话结论

这篇论文用 RL 学习异构多机器人任务分配和调度策略，让机器人根据任务能力需求动态组队，并减少等待和总完成时间。

## 研究问题

异构机器人任务往往要求多个具备不同能力的机器人同时到达同一任务点。如何在任务依赖、能力约束和等待成本下快速分配任务。

## 方法

论文采用全局观测、分布式决策的 RL 框架，用 agent encoder、task encoder 和 cross encoder 学习 agent-agent、task-task、agent-task 关系，再由 decoder 输出任务选择策略。

## 关键贡献

它把多机器人任务分配从集中式 MILP/启发式方法推进到可快速反应的学习型策略，并显式考虑协作任务中的等待问题。

## 局限

论文主要处理已经给定的原子任务集合，不负责从自然语言目标中自动分解任务。它也不直接处理 VLA/WAM 执行器的不确定性反馈。

## 和其他论文的关系

GenSwarm 更关注自然语言到多机器人代码策略的自动生成；本论文更关注给定任务后的异构机器人分配和调度。两者对应 planner 的不同层。

## 对多智能体任务规划模型的启发

你的系统可以把任务分解和任务分配分成两层：LLM/VLM 负责把目标转为结构化任务图，GNN/Transformer/RL 模块负责在 agent-task 图上做可优化分配。

## 可复用模块

heterogeneous agent-task graph、RL scheduler、allocation objective。适合作为多智能体任务规划模型的 baseline 和监督信号来源。

## 证据与风险

证据直接来自多机器人任务分配；风险是语义任务理解和低层执行器接口较弱，需要和 VLA/WAM 结合。

## 开放问题

如何把 VLA 执行成功率、WAM 预测风险和机器人实时状态一起输入到任务分配网络，而不只是使用静态能力和距离信息。
