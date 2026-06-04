---
id: 2025-cosmos-world-foundation-model-platform
title: "Cosmos World Foundation Model Platform for Physical AI"
short_title: Cosmos WFM
year: 2025
published: 2025-01
venue: arXiv
status: read
scope: in_scope
readiness: high
action: deep_read
tech_paradigm: world_foundation_model_platform
primary_domain: World Action Model
domains: [World Action Model, World Model, Diffusion, VLA]
primary_technical_layer: world_model_pretraining
primary_task_family: physical_ai_world_simulation
platform: physical_ai_world_foundation_model
planning_relevance: Cosmos 提供面向 Physical AI 的 world foundation model 平台：视频数据处理、视频 tokenizer、预训练 world model 和 post-training 工具链。放在 joint WAM 分支，是因为它和 DreamZero 一样服务“用未来世界预测/生成支撑机器人策略和评估”，但它更偏平台和世界模拟基础模型，不是显式 action-output policy。
multi_robot_relevance: 对多机器人任务规划的价值在于大规模世界模拟、合成场景生成和行动后果预测。它可以作为 planner critic / simulator 的基础模型来源，用于生成不同场景、遮挡、相机视角、环境扰动和机器人动作后的未来视频，再投影成结构化状态检查。
system_roles: [world_simulator, planner_critic, data_curator, world_encoder]
reusable_modules: [world_foundation_model_pretraining, video_curation_pipeline, video_tokenizer, text_to_world_generation, video_to_world_generation, action_based_video_prediction, physical_ai_post_training]
evidence_level: paper_read
next_action: map_cosmos_to_joint_wam_simulator_interface
tags: [Cosmos, NVIDIA, World Foundation Model, Physical AI, world model, video generation, video tokenizer, robotics simulation]
authors: [NVIDIA, Niket Agarwal, Arslan Ali, Maciej Bala, Yogesh Balaji, Erik Barker, Sanja Fidler, Dieter Fox, Ming-Yu Liu]
institutions: [NVIDIA]
doi: 10.48550/arXiv.2501.03575
arxiv: 2501.03575
url: https://arxiv.org/abs/2501.03575
project_url: https://research.nvidia.com/labs/cosmos-lab/cosmos-predict1/
code_url: https://github.com/nvidia-cosmos
pdf_path:
image_url:
zotero_key:
citekey: nvidia2025cosmosworldfoundationmodel
cites: [2020-ddpm-denoising-diffusion-probabilistic-models, 2024-pyramidal-flow-matching-video]
extends: []
uses: [2020-ddpm-denoising-diffusion-probabilistic-models]
enables: [2026-world-action-models-zero-shot-policies, 2026-fast-wam-test-time-future-imagination]
contrasts: [2025-uwm-coupling-video-action-diffusion]
---

## 一句话结论

Cosmos 是 NVIDIA 面向 Physical AI 的 World Foundation Model 平台：它不是单篇窄方法，而是一套用于构建、微调和部署世界模型的基础设施，覆盖视频数据处理、tokenizer、预训练 WFM、post-training 和物理场景生成。

## 研究问题

Physical AI 需要在真实部署前先在数字世界中训练和验证。机器人和自动驾驶系统不仅需要 policy model，还需要一个“世界的数字孪生”：能够预测、生成和评估未来物理场景的 world model。

Cosmos 关注的问题是：如何把互联网级视频数据、物理 AI 场景数据、视频生成模型和后训练工具链组织成一个可复用平台，让开发者能为自己的机器人或自动驾驶系统定制 world model。

## 方法

Cosmos 把 World Foundation Model 定义为可被下游 Physical AI 系统微调的通用世界模型。平台主要包含四部分：

- video curation pipeline：从大规模视频中清洗、筛选和组织对物理动态有用的数据。
- video tokenizer：把高维视频压成可建模 token，使长视频生成和预测更可训练。
- pre-trained WFMs：在大规模、多样视频数据上预训练的世界模型，学习通用物理动态、场景变化和时空一致性。
- post-training recipes：把通用 WFM 适配到目标机器人、自动驾驶或仿真设置，prompt 可以是动作命令、轨迹、语言指令或其他控制信号。

从 WAM 视角看，Cosmos 最重要的能力不是直接输出低层动作，而是提供未来世界生成和行动后果预测的基础模型接口，例如 text-to-world、video-to-world、camera control、instruction-based robotics prediction、action-based video prediction 和多视角驾驶生成。

## 关键贡献

- 把 world model 扩展成 foundation model platform，而不是单任务视频预测器。
- 给 Physical AI 明确提出“policy model + world model”双数字孪生结构。
- 提供开放模型、开放权重、video tokenizer 和视频处理工具链，降低机器人/自动驾驶团队训练专用 world model 的成本。
- 支持通过 action command、trajectory、instruction 等 prompt 做 post-training，使 WFM 能适配具体 physical AI setup。
- 在 robotics prediction 和 autonomous driving generation 等场景中展示世界生成能力。

## 局限

Cosmos 更像世界模拟平台，不是完整的 action policy 或任务 planner。它能生成未来视频和物理场景，但默认输出仍偏像素/视频层，和我们的多智能体任务规划需要的 typed graph、资源约束、agent-time plan、依赖关系、可执行 JSON / Gantt 之间还有表示鸿沟。

同时，Cosmos 本身不等价于 UWM 那种显式耦合 `(o, a, o')` 的 action-output 模型。它可以支持 action-based video prediction，但不一定天然产出结构化动作图或多机器人联合计划。

## 和其他论文的关系

和 DreamZero 同分支：两者都属于 joint WAM 视角下“世界模型支撑策略”的路线。Cosmos 更上游，提供通用 WFM、tokenizer、数据管线和 post-training；DreamZero 更下游，把未来视频预测和动作生成组织成 zero-shot policy。

和 UWM 对比：UWM 的核心是一个 DiT 同时建模 action epsilon 和 future observation epsilon，用 `t_a/t_o` 控制谁生成、谁当条件。Cosmos 的重点不是这个双时间步动作-视频耦合，而是 world foundation model 平台、视频 tokenization、视频生成和面向 Physical AI 的数据/微调闭环。

和 Fast-WAM 对比：Fast-WAM 追问测试时是否需要显式 future imagination；Cosmos 则提供可用于训练期世界建模、合成数据生成和离线评估的基础模型。两者结合时，Cosmos 可以主要服务训练/评估，Fast-WAM 思路决定部署时是否保留显式视频生成。

## 对多智能体任务规划模型的启发

Cosmos 可以作为 joint graph WAM 的视觉世界基础模型来源，但需要加一个结构化投影层：

```text
Cosmos video/world simulation
  -> scene graph extraction
  -> agent/resource/belief graph update
  -> planner critic / feasibility score
  -> revise agent-time task graph
```

对多智能体任务规划来说，它最适合承担三类功能：

- 生成多样环境和扰动场景，用于训练 planner 的鲁棒性。
- 对候选计划做未来视频/状态 rollout，暴露遮挡、碰撞、资源不可达等问题。
- 作为数据飞轮的一部分，把真实失败案例扩展成更多 counterfactual 场景。

因此它应该放在 DreamZero 同一 joint WAM 分支，但在概念上更偏“world simulator / data engine”，不是直接的低层执行器。

## 可复用模块

world foundation model pretraining、video curation pipeline、video tokenizer、text-to-world、video-to-world、action-based video prediction、camera control、physical AI post-training、synthetic data generation。

## 证据与风险

证据来自 arXiv `2501.03575` 和 NVIDIA Cosmos-Predict1 项目页。论文摘要说明 Cosmos 覆盖 video curation pipeline、pre-trained WFMs、post-training examples 和 video tokenizers；项目页展示 text-to-world、video-to-world、instruction-based robotics prediction、action-based video prediction 等能力。

风险是 Cosmos 的论文和平台粒度较大，很多能力以平台组件和 demo 形式呈现，不像 UWM / DreamZero 那样直接给出一个清晰的 action-generation objective。纳入图谱时应避免把它误读成已经解决多智能体任务规划。

## 开放问题

Cosmos 生成的 future video 如何可靠地变成 planner 可用的 symbolic / graph state？第一版可以把它当作视觉 world simulator；真正接入多智能体规划时，需要额外的 scene graph parser、uncertainty estimator 和 plan validator。
