---
id: 2026-genswarm-multi-robot-code-policy
title: "GenSwarm: Scalable Multi-Robot Code-Policy Generation and Deployment via Language Models"
short_title: GenSwarm
year: 2026
published: 2026-01
venue: npj Robotics 2026
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: llm_code_policy
primary_domain: LLM
domains: [LLM, Planning]
primary_technical_layer: code_policy_generation
primary_task_family: swarm_policy_generation
platform: multi_robot_swarm
planning_relevance: 直接从自然语言生成并部署多机器人代码策略，是多机器人自然语言任务规划的重要系统基线。
multi_robot_relevance: 论文核心就是真实多机器人系统中的自然语言任务、代码策略生成、仿真验证和自动部署。
system_roles: [semantic_planner, code_policy_generator, task_allocator, planner_baseline]
reusable_modules: [language_to_skill_graph, code_policy_generation, deployment_loop]
evidence_level: paper_read
next_action: extract_system_architecture
tags: [GenSwarm, multi-robot, LLM agent, code policy, deployment, skill graph]
authors: [Ji, Chen, Chen, Zhu, Xu, Groß, Zhou, Cao, Zhao]
institutions: [Westlake University, Huzhou Institute, University of Groningen, University of Sheffield]
doi: 10.1038/s44182-025-00065-w
arxiv: 2503.23875
url: https://www.nature.com/articles/s44182-025-00065-w
project_url: https://github.com/wenkangji/GenSwarm
pdf_path: pdfs/2026-01-01-GenSwarm-llm-code-policy.pdf
image_url:
zotero_key:
citekey: ji2026genswarm
cites: []
extends: []
uses: []
enables: []
contrasts: []
---

## 一句话结论

GenSwarm 用多 LLM agent 把自然语言任务转成多机器人代码策略，并自动部署到仿真和真实机器人，是“自然语言到多机器人执行”的强相关系统。

## 研究问题

多机器人系统开发通常需要任务分析、算法设计、代码实现、仿真验证和真实部署。论文想降低这条链路的人工成本，并支持新任务快速适配。

## 方法

系统分为任务分析、代码生成、代码部署与改进三部分。LLM agent 先抽取约束和技能，再生成 skill graph 与 Python skill 函数，随后通过仿真/VLM反馈和人类反馈迭代，并用自动化软件栈部署到真实机器人。

## 关键贡献

GenSwarm 把 LLM code policy 从单机器人/玩具环境推进到多机器人真实部署，强调 zero-shot 任务生成、全流程自动化和本地可执行代码策略。

## 局限

它生成的是白盒代码策略，通用性和可解释性强，但最优性、持续学习和端到端可微训练不足。论文也主要面向移动集群任务，不覆盖复杂 VLA 操作能力。

## 和其他论文的关系

Eureka 生成 reward code，GenSwarm 生成 policy code。Heterogeneous MRTA RL 关注可学习任务分配；GenSwarm 更关注把自然语言目标转成可部署多机器人行为。

## 对多智能体任务规划模型的启发

GenSwarm 可以作为系统级 baseline：当前端到端多机器人任务规划至少需要语言理解、技能图、任务分配、执行反馈和部署接口。你的方案可以尝试把其中不可微的代码生成和 MILP 部分替换成可学习模块。

## 可复用模块

language-to-skill graph、multi-agent code policy generation、deployment loop。适合作为我们的系统结构 baseline 和 ablation 对象。

## 证据与风险

证据直接来自多机器人系统；风险是代码生成路线可解释但不一定端到端可学习，真实部署约束可能强依赖工程系统。

## 开放问题

如何从 GenSwarm 式“生成代码再部署”的范式，过渡到可端到端优化的“自然语言 + 状态图 -> 任务排班/技能调用”的神经模型。
