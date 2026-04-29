---
id: 2026-world-action-models-zero-shot-policies
title: "World Action Models are Zero-shot Policies"
short_title: DreamZero / WAM
year: 2026
published: 2026-02
venue: arXiv
status: read
scope: in_scope
readiness: high
action: deep_read
tech_paradigm: world_action_model
primary_domain: World Action Model
domains: [World Action Model, VLA, World Model]
primary_technical_layer: dynamics_prediction
primary_task_family: zero_shot_policy
platform: heterogeneous_robot_data
planning_relevance: 可作为 planner 的世界 rollout / action feasibility 模型，而不只是末端执行策略。
multi_robot_relevance: 视频预测和动作联合建模为多机器人协同仿真提供方向，但论文主要验证单机器人真实实验。
system_roles: [world_simulator, planner_critic, executor]
reusable_modules: [video_action_world_model, zero_shot_policy_rollout, action_feasibility_prediction]
evidence_level: paper_read
next_action: extend_to_multi_agent_rollout
tags: [World Action Model, DreamZero, video diffusion, zero-shot policy, cross-embodiment]
authors: [Ye, Ge, Zheng, Gao, Du, Chebotar, Reed, Kautz, Zhu, Fan, Jang]
institutions: [NVIDIA, University of Texas at Austin, Georgia Tech]
doi: 10.48550/arXiv.2602.15922
arxiv: 2602.15922
url: https://arxiv.org/abs/2602.15922
project_url: https://dreamzero0.github.io/
image_url:
zotero_key:
citekey: ye2026world
cites: [2024-pyramidal-flow-matching-video, 2025-pi05-open-world-generalization, 2024-pi0-vla-flow-model, 2023-rt-2-vla, 2023-dreamerv3-world-models]
extends: []
uses: [2024-pyramidal-flow-matching-video, 2023-dreamerv3-world-models]
enables: []
complements: []
contrasts: [2025-pi05-open-world-generalization, 2024-pi0-vla-flow-model, 2023-rt-2-vla]
---

## 一句话结论

World Action Model 的关键转向是：不只从视觉语言直接输出动作，而是联合预测未来视频世界状态和动作，用世界演化本身支持零样本策略。

## 研究问题

VLA 语义泛化强，但对未见物理运动和新环境动作泛化弱。能否用预训练视频扩散模型学习物理动态，从而成为零样本策略。

## 方法

DreamZero 基于预训练视频扩散/生成骨干，联合建模视频和动作，并做系统优化，使大规模视频生成模型能以约 7Hz 做实时闭环控制。

## 关键贡献

论文报告相比当时 VLA 在新任务和新环境上有显著泛化提升，并展示视频-only 演示和少量新具身数据下的跨具身迁移。

## 局限

WAM 当前仍主要面向机器人操作策略。对于多机器人，关键挑战会变成多主体状态预测、交互建模、通信动作和联合任务奖励。

## 和其他论文的关系

DreamZero 和 Dreamer 都是 world model 思路，但侧重点不同：Dreamer 在 latent world model 中用 RL 学行为，DreamZero 借视频生成模型和动作联合预测直接成为策略。Pyramidal Flow 是其视频生成和 flow matching 技术背景之一。

## 对多智能体任务规划模型的启发

WAM 可以不只做执行器，还可以做 planner 的“行动后果预测器”：给定多个候选子任务分配，预测世界状态变化、冲突风险和可行性。

## 可复用模块

video-action world model、zero-shot policy rollout、action feasibility predictor。适合作为 planner critic 和多机器人联合 rollout 的核心候选。

## 证据与风险

证据强在 zero-shot policy 和视频-动作建模；风险是多主体交互、联合动作空间和通信动作尚未直接验证。

## 开放问题

如何把 WAM 从单机器人视频-动作预测扩展到多机器人联合动作预测，例如同时建模 A 机器人移动、B 机器人抓取、C 机器人等待带来的全局状态变化。
