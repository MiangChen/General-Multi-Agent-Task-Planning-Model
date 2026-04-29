---
id: 2025-pistar06-recap
title: "π*0.6: a VLA That Learns From Experience"
short_title: π*0.6 / RECAP
year: 2025
published: 2025-11
venue: Technical Report / Physical Intelligence
status: skimmed
scope: in_scope
readiness: high
action: deep_read
tech_paradigm: vla_rl
primary_domain: RL
domains: [VLA, RL]
primary_technical_layer: policy_improvement
primary_task_family: experience_driven_recovery
platform: multi_embodiment_manipulation
planning_relevance: 提供从失败轨迹、人工纠错和自主经验中更新执行策略的闭环。
multi_robot_relevance: 多机器人系统可借鉴其“失败状态定向采样 + 纠错”的经验收集机制。
system_roles: [executor, recovery_policy, experience_learner]
reusable_modules: [recap_experience_loop, correction_data_pipeline, policy_improvement_from_failures]
evidence_level: skimmed
next_action: map_recovery_loop
tags: [π*0.6, RECAP, reinforcement learning, corrections, experience, VLA]
authors: [Physical Intelligence]
institutions: [Physical Intelligence]
doi:
arxiv:
url: https://www.physicalintelligence.company/download/pistar06.pdf
project_url: https://physicalintelligence.company/
image_url:
zotero_key:
citekey: physicalintelligence2025pistar06
cites: [2025-pi06-model-card, 2025-pi05-open-world-generalization, 2024-pi0-vla-flow-model]
extends: [2025-pi06-model-card]
uses: [2025-pi05-open-world-generalization, 2024-pi0-vla-flow-model]
enables: []
complements: []
contrasts: []
---

## 一句话结论

π*0.6 的重点不是再做一个 VLA，而是让 VLA 从真实执行失败、人工纠错和自主经验中继续改进。

## 研究问题

仅靠示范学习的 VLA 遇到分布外状态容易失败，如何让它利用自己的失败轨迹学习恢复策略。

## 方法

RECAP 大体思路是结合示范、专家纠错和机器人自主经验，通过价值函数和 advantage-conditioned policy 把坏轨迹中的有用信息也纳入训练。

## 关键贡献

它把“部署后学习”推到 VLA 路线中央：机器人不只是执行预训练策略，也应从失败中收集针对性数据。

## 局限

公开材料主要集中于单体机器人任务吞吐和成功率。多机器人场景中的信用分配、协同失败归因和共享经验池仍未解决。

## 和其他论文的关系

π*0.6 是 π0.6 的经验学习扩展，和 Dreamer 的“通过模型想象改进策略”形成互补：一个更偏真实世界纠错数据，一个更偏学习世界模型和想象 rollout。

## 对多智能体任务规划模型的启发

多机器人 planner 可以记录失败发生在哪个子任务、哪个机器人、哪个协作边界，再将失败样本反哺给执行策略或能力模型。

## 可复用模块

RECAP experience loop、correction data pipeline、failure recovery policy。适合多机器人系统的持续学习和失败后再规划。

## 证据与风险

证据来自真实世界经验学习方向；风险是公开材料细节有限，且多机器人失败归因更复杂。

## 开放问题

多机器人任务失败通常不是单个动作失败，而是调度、同步或通信失败。如何把这类系统级失败转成可训练的 advantage 或 reward。
