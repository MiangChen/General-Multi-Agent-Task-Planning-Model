---
id: 2025-uwm-coupling-video-action-diffusion
title: "Unified World Models: Coupling Video and Action Diffusion for Pretraining on Large Robotic Datasets"
short_title: UWM
year: 2025
published: 2025-04
venue: RSS 2025
status: read
scope: in_scope
readiness: high
action: deep_read
tech_paradigm: coupled_video_action_diffusion_world_model
primary_domain: World Action Model
domains: [World Action Model, World Model, Diffusion, VLA]
primary_technical_layer: dynamics_prediction
primary_task_family: joint_video_action_diffusion_pretraining
platform: large_robot_and_video_datasets
planning_relevance: UWM 把 video diffusion 和 action diffusion 放进同一个 DiT，用独立的 observation/action diffusion timesteps 控制谁被生成、谁作为条件、谁被 mask；这为 joint WAM 提供了一个清晰接口：同一模型既能做 policy，也能做 forward dynamics、inverse dynamics 和 video prediction。
multi_robot_relevance: 对多机器人规划的直接价值在于数据接口和联合生成机制。机器人轨迹数据可写成 (o, a, o')，action-free 网络视频可写成 (o, o')；缺失 action 被视为全噪声，使模型可以从大规模无动作视频中学习世界动态，再迁移到需要动作输出的机器人策略。
system_roles: [world_simulator, executor, planner_critic, world_encoder]
reusable_modules: [coupled_video_action_diffusion, modality_specific_diffusion_timesteps, joint_dit_denoiser, action_free_video_pretraining, forward_inverse_dynamics_modes, policy_as_conditional_generation]
evidence_level: paper_read
next_action: map_uwm_to_joint_wam_graph_interface
tags: [UWM, Unified World Models, World Action Model, video diffusion, action diffusion, DiT, action-free video, DROID]
authors: [Chuning Zhu, Raymond Yu, Siyuan Feng, Benjamin Burchfiel, Paarth Shah, Abhishek Gupta]
institutions: [University of Washington, Toyota Research Institute]
doi: 10.48550/arXiv.2504.02792
arxiv: 2504.02792
url: https://arxiv.org/abs/2504.02792
project_url: https://weirdlabuw.github.io/uwm/
code_url: https://github.com/weirdlabuw/uwm
pdf_path:
image_url:
zotero_key:
citekey: zhu2025uwm
cites: [2020-ddpm-denoising-diffusion-probabilistic-models, 2023-diffusion-policy-action-diffusion]
extends: [2023-diffusion-policy-action-diffusion]
uses: [2020-ddpm-denoising-diffusion-probabilistic-models]
enables: [2026-world-action-models-zero-shot-policies, 2026-fast-wam-test-time-future-imagination]
contrasts: [2025-pi05-open-world-generalization]
---

## 一句话结论

UWM 是 joint World Action Model 路线里的关键中间节点：它用一个多模态 DiT 同时耦合 video diffusion 和 action diffusion，并通过独立的扩散时间步控制 action、future observation 的生成与条件化。

## 研究问题

大规模机器人 imitation learning 依赖高质量动作标注，数据扩展困难；但互联网上和机器人采集中存在大量只有视觉、没有 action label 的视频。传统 action policy 只能吃 `(o, a, o')` 轨迹，传统 video world model 又不直接产出动作。

UWM 追问的是：能否用同一个扩散模型同时覆盖机器人动作数据和 action-free 视频数据，让模型既学习世界动态，又学习从观测到动作的策略。

## 方法

UWM 把当前观测 `o`、动作 `a` 和未来观测 `o'` 放进一个 unified transformer / DiT。模型不是分别训练一个 action model 和一个 video model，而是在同一个 denoiser 中预测两类噪声：

- `epsilon_a`：动作 token 上的噪声，对应 action diffusion。
- `epsilon_o`：未来观测/video token 上的噪声，对应 video diffusion / future observation diffusion。

关键控制量是两组独立扩散时间步：`t_a` 控制 action 的噪声水平，`t_o` 控制 future observation 的噪声水平。通过设置 `t_a` 和 `t_o`，同一个模型可以切换不同条件分布：

```text
policy:           generate a      | condition on o
forward dynamics: generate o'     | condition on o, a
inverse dynamics: generate a      | condition on o, o'
video prediction: generate o'     | condition on o
```

训练数据支持两种格式：

- `(o, a, o')`：真实机器人采集轨迹。随机采样 `t_a` 和 `t_o`，模型同时预测 action epsilon 和 future observation epsilon。
- `(o, o')`：action-free 视频。把缺失动作视为 fully noised / masked，等价于手动设置 `t_a = T`，让模型主要从视觉变化中学习动态表示。

这使 UWM 可以把动作标注数据和无动作视频数据放在同一训练目标里，而不是为两类数据写两套模型。

## 关键贡献

- 把 video diffusion 和 action diffusion 耦合到一个 unified DiT，而不是两个分离模块。
- 用 modality-specific diffusion timesteps 作为统一控制接口，决定 action / future obs 哪个被生成、哪个作为条件、哪个被 mask。
- 同时支持 `(o, a, o')` 机器人轨迹和 `(o, o')` action-free 视频，解决视频数据缺少动作标注时无法直接用于 policy learning 的问题。
- 同一个模型可表示 policy、forward dynamics、inverse dynamics 和 video prediction，连接 imitation learning 与 world modeling。
- 在 DROID 子集预训练、真实机器人任务、LIBERO 和 OOD 设置中展示了 pretraining 与 cotraining 的收益。

## 局限

UWM 仍主要是单机器人 manipulation / robot learning 范式。它联合建模的是 observation 和 action，但还没有显式处理多机器人之间的通信、资源竞争、角色分配和任务依赖。把它扩展到多智能体任务规划时，`a` 需要从单体 action chunk 升级为 agent-time action graph，`o'` 也需要从视频帧升级为可解释的 scene graph / belief state。

另一个风险是，action-free 视频只提供视觉动态，不提供执行意图和低层控制，因此它更适合增强 world representation，而不是直接替代机器人轨迹。

## 和其他论文的关系

和 Diffusion Policy 相比，UWM 不只在动作空间做 diffusion policy，而是把 action diffusion 和 future observation diffusion 绑在一个模型中。Diffusion Policy 是动作生成根路线，UWM 把它推进到 world-action joint modeling。

和 DreamZero / WAM 相比，UWM 更像前置的统一训练范式：它明确给出了 `(o, a, o')` 与 `(o, o')` 两类数据如何共训，以及如何用 `t_a/t_o` 切换 policy、forward dynamics、inverse dynamics 和 video prediction。DreamZero 更强调用 world action model 形成 zero-shot policy 和实时执行。

和 Fast-WAM 相比，UWM 保留了训练/推理时的联合 video-action diffusion 接口；Fast-WAM 则进一步追问测试时是否需要显式 future imagination。两者可以形成一个很好的设计轴：UWM 负责说明“怎么统一训练”，Fast-WAM 负责说明“部署时哪些分支可以省掉”。

## 对多智能体任务规划模型的启发

UWM 可以直接启发我们的 joint graph WAM 设计。把单机器人格式推广为：

```text
o_t       -> scene graph + agent graph + resource belief
a_t       -> agent-time action graph G_{I_t}
o_{t+H}   -> future scene / agent / resource graph
```

对应地，`t_a` 变成 action graph 的噪声水平，`t_o` 变成 future graph 的噪声水平。通过控制两者，可以让同一个模型完成：

- 只生成计划：给定当前图，生成 `G_{I_t}`。
- 只预测后果：给定当前图和候选计划，预测未来图。
- 反推计划：给定当前图和目标未来图，生成可达计划。
- 纯世界建模：用无动作视频或无动作轨迹学习未来状态。

这比单纯 VLA 更接近任务规划，因为输出不只是低层动作，而是可以进一步约束、验证和调度的结构化 plan object。

## 可复用模块

coupled video-action diffusion、modality-specific timesteps、joint DiT denoiser、action-free video pretraining、missing-action-as-noise masking、forward / inverse dynamics mode switching、policy as conditional generation。

## 证据与风险

证据来自 RSS 2025 论文、arXiv `2504.02792` 和项目页。项目页明确说明 UWM 使用 separate diffusion timesteps for actions and videos，并支持从 `(o, a, o')` 机器人轨迹与 `(o, o')` action-free 视频共训。风险在于它尚未验证多智能体联合计划、图结构输出和资源约束；迁移到我们的任务规划模型时，需要把 video/action token 接口改成 typed graph token 接口。

## 开放问题

在 joint graph WAM 中，`t_a/t_o` 是否足够表达所有条件化模式？例如有时我们还需要 mask 某些 agent、某些资源或某些时间段。更通用的版本可能需要 `t_plan`、`t_world`、`t_agent_i` 或 per-token mask schedule，而不是只有 action / observation 两个全局时间步。
