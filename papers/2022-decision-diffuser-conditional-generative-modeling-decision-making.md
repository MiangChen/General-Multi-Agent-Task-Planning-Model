---
id: 2022-decision-diffuser-conditional-generative-modeling-decision-making
title: "Is Conditional Generative Modeling all you need for Decision-Making?"
short_title: Decision Diffuser
year: 2022
published: 2022-11
venue: ICLR 2023 Notable Top 5%
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: decision_diffusion_modeling
primary_domain: Diffusion
domains: [Diffusion, Planning, RL, Trajectory Generation]
primary_technical_layer: state_trajectory_planning
primary_task_family: conditional_generative_decision_making
platform: offline_rl_control
planning_relevance: Decision Diffuser 和 Diffuser 很接近，都是把 decision-making 变成条件生成问题；关键区别是它更分层：diffusion model 主要生成未来 state trajectory，再用 inverse dynamics / action model 从相邻 state 还原 action。对 TOPG 来说，这提示高层 planner 可以先生成状态/任务进展，再由执行器补动作。
multi_robot_relevance: 间接但有启发。多机器人系统可以先生成联合状态进展或任务图状态序列，再让各机器人局部 policy / inverse dynamics 生成动作；这样比直接在巨大联合 action space 上 diffusion 更稳。
system_roles: [diffusion_foundation, state_trajectory_planner, planner_sampler, inverse_dynamics_executor]
reusable_modules: [state_trajectory_diffusion, inverse_dynamics_action_model, return_conditioning, constraint_conditioning, classifier_free_planning_guidance, hierarchical_decision_generation]
evidence_level: paper_read
next_action: compare_decision_diffuser_with_diffuser_and_topg
tags: [Decision Diffuser, diffusion planning, state trajectory, inverse dynamics, offline RL, ICLR 2023]
authors: [Anurag Ajay, Yilun Du, Abhi Gupta, Joshua B. Tenenbaum, Tommi Jaakkola, Pulkit Agrawal]
institutions: [MIT]
doi: 10.48550/arXiv.2211.15657
arxiv: 2211.15657
url: https://openreview.net/forum?id=sP1fo2K9DFG
project_url: https://anuragajay.github.io/decision-diffuser/
pdf_path: pdfs/2022-11-01-Decision-Diffuser-conditional-generative-modeling-decision-making.pdf
image_url:
zotero_key:
citekey: ajay2022decisiondiffuser
cites: [2022-diffuser-planning-with-diffusion-flexible-behavior-synthesis, 2020-ddpm-denoising-diffusion-probabilistic-models]
extends: [2022-diffuser-planning-with-diffusion-flexible-behavior-synthesis]
uses: []
enables: [2023-diffusion-policy-action-diffusion]
complements: [2025-layerdag-diffusion-dag-generation]
contrasts: []
---

## 一句话结论

Decision Diffuser 把 decision-making 看成 conditional generative modeling：先用 diffusion 生成未来 state trajectory，再用 inverse dynamics / action model 把相邻状态转成动作，因此比直接生成 action trajectory 更分层。

正式发表信息：论文 arXiv 版本是 `2211.15657`，正式会议为 **ICLR 2023 Notable Top 5%**。

## 研究问题

Diffuser 已经说明 diffusion 可以生成 trajectory 并用于规划。但直接生成包含 action 的完整 trajectory 仍然会把状态建模和动作建模绑在一起。

Decision Diffuser 问的是：是否可以把 decision-making 更彻底地写成条件生成问题，并把“想要到达什么状态序列”和“具体怎么动作”拆开。

对 TOPG 来说，这个拆分很重要。高层任务规划通常更关心状态进展、子任务完成顺序和约束满足，而不是一开始就决定每个低层 action。

## 方法

Decision Diffuser 的核心是分层。

第一层，用 diffusion 生成未来 state trajectory：

```text
s_0, s_1, ..., s_H
```

模型从 noisy state sequence 开始去噪，生成一段符合条件的未来状态序列。条件可以包括 return、goal、constraint 等。

第二层，用 inverse dynamics / action model 生成动作：

```text
a_t = f(s_t, s_{t+1})
```

也就是说，它不要求 diffusion model 直接把 action 全部学出来，而是先想清楚“状态应该怎么变化”，再由另一个模型把相邻状态转换成可执行动作。

这和你的理解一致：

```text
Diffuser:
  diffusion 直接生成 state-action trajectory

Decision Diffuser:
  diffusion 生成 state trajectory
  inverse dynamics / policy 生成 action
```

这种分层让 diffusion 更专注于长程结构和目标达成，动作层则交给更局部、更容易学习的模型。

## 关键贡献

- 把 offline decision-making 表述成 conditional generative modeling。
- 用 diffusion 生成 state trajectory，而不是必须直接生成 action。
- 用 inverse dynamics action model 从相邻状态恢复动作，实现 state planning 和 action execution 的分工。
- 支持 return conditioning、goal conditioning、constraint conditioning 等多种测试时条件。
- 为后续“先生成计划状态，再调用执行器”的分层 planner 提供清晰范式。

## 局限

Decision Diffuser 主要验证在 offline RL / control benchmark 上，状态空间通常是连续或低维结构化状态。它不直接处理语言任务、离散 task graph、DAG 依赖、资源约束或多机器人协同。

如果迁移到真实机器人，inverse dynamics 模型必须足够可靠；否则状态序列看起来合理，但动作无法执行。多机器人场景还需要考虑联合状态和个体动作之间的可分解性。

## 和其他论文的关系

Diffuser 直接把 trajectory 作为 diffusion 生成对象，包含状态和动作；Decision Diffuser 更强调分层，把 state trajectory generation 和 action recovery 分开。

Diffusion Policy 更像低层 action chunk executor；Decision Diffuser 更像高层状态轨迹 planner + 局部 action model。

LayerDAG 生成的是离散 task graph，Decision Diffuser 生成的是连续 state trajectory。它们可以组成两级系统：LayerDAG 规划任务依赖，Decision Diffuser 为每个任务或任务片段生成状态进展，执行器再产生动作。

## 对多智能体任务规划模型的启发

TOPG 可以借鉴 Decision Diffuser 的分层思想：

```text
high-level graph planner
  -> desired state / task progress sequence
  -> inverse dynamics / executor policy
  -> robot actions
```

这比“直接生成所有机器人的联合动作”更稳。多机器人任务规划可以先生成任务状态流：

```text
object located
area cleared
robot A at room 1
robot B carrying item
handoff completed
```

然后由每个机器人自己的 policy 或 inverse dynamics model 负责把状态变化转成动作。这样 high-level planner 只管“世界怎么变”，executor 负责“身体怎么动”。

## 可复用模块

state trajectory diffusion、inverse dynamics action model、return conditioning、constraint conditioning、classifier-free planning guidance、hierarchical decision generation。

## 证据与风险

证据来自 ICLR 2023 notable top 5% 正式发表论文、OpenReview 页面和 arXiv `2211.15657`。PDF 已保存为本地 arXiv 版本：`pdfs/2022-11-01-Decision-Diffuser-conditional-generative-modeling-decision-making.pdf`。

风险在于：state trajectory 在 benchmark 里容易定义，但 TOPG 的“状态”可能是 scene graph、task graph、object relation、robot capability 和 execution status 的混合结构。迁移时最难的是定义可学习、可验证、可执行的 state representation。

## 开放问题

TOPG 是否应该先生成 task graph，再生成 state trajectory，最后生成 action；还是把 task graph 和 state trajectory 合成一个统一的 planning graph。第一版建议保留分层：task graph 负责结构，state trajectory 负责连续进展，executor 负责动作。
