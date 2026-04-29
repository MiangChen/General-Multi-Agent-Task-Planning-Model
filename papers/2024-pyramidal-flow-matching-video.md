---
id: 2024-pyramidal-flow-matching-video
title: "Pyramidal Flow Matching for Efficient Video Generative Modeling"
short_title: Pyramidal Flow
year: 2024
published: 2024-10
venue: ICLR 2025 / arXiv
status: skimmed
scope: in_scope
readiness: medium
action: buffer
tech_paradigm: video_flow_model
primary_domain: World Action Model
domains: [World Action Model, World Model]
primary_technical_layer: video_generation
primary_task_family: video_dynamics_generation
platform: video_generation_models
planning_relevance: 为 WAM/DreamZero 一类视频世界预测模型提供高效 flow matching 生成路线。
multi_robot_relevance: 多机器人 WAM 需要高效预测长时空、多主体交互视频，Pyramidal Flow 是可借鉴的生成骨干。
system_roles: [world_simulator, video_generator]
reusable_modules: [pyramidal_flow_matching, efficient_video_generation, future_video_rollout]
evidence_level: skimmed
next_action: connect_to_wam_only
tags: [Pyramidal Flow, flow matching, video generation, world model, diffusion transformer]
authors: [Jin, Sun, Li, Xu, Jiang, Zhuang, Huang, Song, Mu, Lin]
institutions: [Peking University, Kuaishou Technology, Beijing University of Posts and Telecommunications]
doi: 10.48550/arXiv.2410.05954
arxiv: 2410.05954
url: https://arxiv.org/abs/2410.05954
project_url: https://pyramid-flow.github.io/
image_url:
zotero_key:
citekey: jin2024pyramidal
cites: []
extends: []
uses: []
enables: []
complements: []
contrasts: []
---

## 一句话结论

Pyramidal Flow Matching 用多尺度金字塔式 flow matching 降低视频生成训练成本，是 WAM 做未来视频预测时可借鉴的底层生成技术。

## 研究问题

高分辨率长视频生成需要建模巨大的时空空间，训练成本高。论文关注如何在统一模型中更高效地学习视频生成轨迹。

## 方法

论文把 denoising / flow 轨迹重解释为多个 pyramid stage，低分辨率阶段先建模粗动态，最终阶段再处理完整分辨率，并用统一 DiT 端到端优化。

## 关键贡献

它给出了高效视频 flow matching 的实现范式，对 DreamZero 这类需要未来视频 rollout 的 World Action Model 有基础支撑价值。

## 局限

它本身不是机器人策略论文，也不直接建模 action。要进入机器人任务规划，还需要把视频预测与机器人状态、动作和任务约束对齐。

## 和其他论文的关系

World Action Models / DreamZero 需要把未来视频和动作关联起来。Pyramidal Flow 更偏视频生成骨干，是 WAM 的底层技能树之一。

## 对多智能体任务规划模型的启发

多机器人 world action model 可能需要预测较长时间范围内的场景演化。分层/多尺度生成可以先预测粗任务进展，再预测局部机器人交互细节。

## 可复用模块

pyramidal flow matching、efficient video rollout、video world backbone。主要作为 WAM 的底层视频生成能力，而不是 planner 本体。

## 证据与风险

证据来自视频生成质量和效率；风险是没有直接验证机器人控制或多机器人任务规划。

## 开放问题

如何把视频 flow matching 的多尺度结构扩展到结构化状态图，例如 agent-task-object graph，而不只输出像素级视频。
