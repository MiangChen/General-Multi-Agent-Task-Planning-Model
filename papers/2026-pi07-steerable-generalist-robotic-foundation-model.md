---
id: 2026-pi07-steerable-generalist-robotic-foundation-model
title: "π0.7: a Steerable Generalist Robotic Foundation Model with Emergent Capabilities"
short_title: π0.7
year: 2026
published: 2026-04
venue: arXiv / Physical Intelligence
status: read
scope: in_scope
readiness: high
action: deep_read
tech_paradigm: vla
primary_domain: VLA
domains: [LLM, VLA, Planning]
primary_technical_layer: compositional_generalization
primary_task_family: steerable_long_horizon_execution
platform: cross_embodiment_manipulation
planning_relevance: 通过多模态上下文条件控制策略选择，接近 planner 对执行器进行策略参数化调用。
multi_robot_relevance: 对多机器人很关键的是 prompt/context 可控性：planner 可把角色、策略、子目标和约束编码给不同机器人。
system_roles: [executor, foundation_policy, steerable_policy]
reusable_modules: [context_conditioned_policy, steerable_executor_interface, compositional_generalization]
evidence_level: paper_read
next_action: use_as_executor_target
tags: [π0.7, VLA, compositional generalization, steerable policy, cross-embodiment]
authors: [Physical Intelligence, Ai, Amin, Black, Driess, Finn, Hausman, Ichter, Levine, Pertsch]
institutions: [Physical Intelligence]
doi: 10.48550/arXiv.2604.15483
arxiv: 2604.15483
url: https://arxiv.org/abs/2604.15483
project_url: https://physicalintelligence.company/
image_url:
zotero_key:
citekey: physicalintelligence2026pi07
cites: [2026-mem-multi-scale-embodied-memory, 2025-pistar06-recap, 2025-pi06-model-card, 2025-pi05-open-world-generalization, 2024-pi0-vla-flow-model]
extends: [2026-mem-multi-scale-embodied-memory, 2025-pistar06-recap, 2025-pi06-model-card]
uses: [2025-pi05-open-world-generalization, 2024-pi0-vla-flow-model]
enables: []
complements: []
contrasts: []
---

## 一句话结论

π0.7 把 PI 系列推进到“可 steer 的通用机器人基础模型”，重点是用更丰富的上下文条件支持组合泛化和策略选择。

## 研究问题

当训练数据包含多种策略和质量差异时，通用 VLA 如何避免平均化，并根据任务上下文选择正确执行方式。

## 方法

论文使用 diverse context conditioning：不仅给语言命令，还给任务表现元数据、策略信息、子目标图像和记忆相关上下文等多模态条件。

## 关键贡献

π0.7 显示出更强的开箱表现、跨具身零样本泛化和多阶段任务能力，是目前 PI 系列中最接近“可由 planner 调用”的策略模型。

## 局限

论文展示的是通用机器人策略能力，不等于完整任务规划系统。多机器人中的协同、任务竞价、路径冲突和通信延迟仍需外部系统处理。

## 和其他论文的关系

相对 π0.5 的开放世界泛化、π*0.6 的经验学习和 MEM 的长程记忆，π0.7 更强调上下文条件对策略行为的可控性。它和 WAM 的区别在于：π0.7 仍偏直接策略，WAM 偏预测世界状态和动作。

## 对多智能体任务规划模型的启发

对你的方向最有价值的是“上下文可控执行器”这个接口：多机器人 planner 可以为不同机器人生成不同上下文，例如角色、目标、路径约束、协作顺序和失败恢复策略。

## 可复用模块

context-conditioned policy、steerable executor interface、compositional generalization setup。适合作为最终 executor 形态的参考目标。

## 证据与风险

证据来自 PI 系列最新路线；风险是仍以直接策略为主，缺少团队规划、显式世界模型和多机器人通信机制。

## 开放问题

如何设计标准化的 planner-to-VLA context schema，让多机器人任务规划器稳定调用不同 VLA，而不依赖脆弱的自然语言提示。
