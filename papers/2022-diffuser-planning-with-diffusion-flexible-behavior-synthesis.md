---
id: 2022-diffuser-planning-with-diffusion-flexible-behavior-synthesis
title: "Planning with Diffusion for Flexible Behavior Synthesis"
short_title: Diffuser
year: 2022
published: 2022-05
venue: ICML 2022
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: diffusion_planning
primary_domain: Diffusion
domains: [Diffusion, Planning, RL, Trajectory Generation]
primary_technical_layer: trajectory_planning
primary_task_family: diffusion_trajectory_planning
platform: offline_rl_control
planning_relevance: Diffuser 把 trajectory / path 本身当作 diffusion 生成对象：从随机噪声开始逐步 denoise 出一段状态-动作轨迹，并在采样时用 reward/value guidance 或条件 inpainting 引导计划。它把“采样轨迹”和“做路径规划”几乎合成同一个过程，是 diffusion 用于 planning 的核心源头论文。
multi_robot_relevance: 间接但重要。多机器人可以把每个机器人或联合系统的计划轨迹作为 diffusion sample，再用约束或 value guidance 引入避碰、资源占用、目标到达和协同奖励。不过直接扩展到多机器人会遇到联合状态空间和约束合法性问题。
system_roles: [diffusion_foundation, trajectory_planner, planner_sampler, behavior_prior_model]
reusable_modules: [trajectory_diffusion_model, value_guided_sampling, classifier_guided_planning, trajectory_inpainting, receding_horizon_diffusion_planning, flexible_test_time_conditioning]
evidence_level: paper_read
next_action: compare_diffuser_with_task_graph_generation
tags: [Diffuser, diffusion planning, trajectory generation, path planning, offline RL, ICML 2022]
authors: [Michael Janner, Yilun Du, Joshua B. Tenenbaum, Sergey Levine]
institutions: [UC Berkeley, MIT]
doi:
arxiv: 2205.09991
url: https://proceedings.mlr.press/v162/janner22a.html
project_url: https://diffusion-planning.github.io/
pdf_path: pdfs/2022-05-01-Diffuser-planning-with-diffusion-flexible-behavior-synthesis.pdf
image_url:
zotero_key:
citekey: janner2022diffuser
cites: [2020-ddpm-denoising-diffusion-probabilistic-models, 2022-classifier-free-diffusion-guidance]
extends: [2020-ddpm-denoising-diffusion-probabilistic-models]
uses: []
enables: [2023-diffusion-policy-action-diffusion]
complements: [2022-digress-discrete-denoising-diffusion-graph-generation, 2025-layerdag-diffusion-dag-generation]
contrasts: []
---

## 一句话结论

Diffuser 把 diffusion model 用到路径规划 / 轨迹规划上：模型不是生成图像，而是从噪声中逐步 denoise 出一段状态-动作 trajectory，让“采样”和“规划”几乎变成同一个过程。

正式发表信息：论文 arXiv 版本是 `2205.09991`，正式会议为 **ICML 2022**。

## 研究问题

传统 model-based RL 常把学习模型和规划器分开：模型负责预测 dynamics，真正决策交给 trajectory optimizer。这个组合听起来清晰，但实践里会有问题：学到的 dynamics 不一定适合优化器，优化器也可能在模型误差上投机。

Diffuser 问的是：能不能把尽可能多的 trajectory optimization pipeline 折叠进生成模型本身，让模型直接生成可执行的行为轨迹。

对我们做 TOPG 来说，这篇论文的价值在于它第一次很清楚地把 diffusion 从“生成图片/动作”推到“生成计划轨迹”：路径本身就是生成对象。

## 方法

Diffuser 把一段行为表示成 trajectory：

```text
tau = (s_0, a_0, s_1, a_1, ..., s_H)
```

训练时，把数据集里的轨迹加噪，然后训练 denoiser 从 noisy trajectory 中恢复 clean trajectory。推理时，从随机噪声轨迹开始，逐步 denoise，最后得到一段状态-动作路径。

核心直觉是：

```text
random trajectory noise
  -> denoise
  -> plausible behavior trajectory
  -> execute first action / receding horizon
```

为了让生成轨迹满足测试时任务，Diffuser 使用两类 conditioning。

第一，value / reward guidance。采样时用 value function 或 reward gradient 引导 denoising，让 trajectory 往高回报区域移动。这和 classifier guidance 的思想类似：生成模型给出行为先验，外部目标函数把采样推向想要的计划。

第二，trajectory inpainting。像图像修补一样固定 trajectory 的一部分，例如起点、终点、某些中间状态，再让 diffusion 补全其余部分。这让同一个模型可以在测试时适配不同目标、不同约束和不同路径片段。

## 关键贡献

- 把 diffusion 从图像生成迁移到 trajectory / path planning。
- 把 planning 解释成 iterative trajectory denoising：采样轨迹就是生成计划。
- 用 value-guided sampling 把 reward / objective 接进 diffusion 采样过程。
- 用 trajectory inpainting 支持灵活的测试时条件，例如指定目标状态或局部路径约束。
- 展示 diffusion planner 在 long-horizon decision-making 和 test-time flexibility 上的潜力。

## 局限

Diffuser 主要在控制和 offline RL 环境里验证，trajectory 通常是连续状态-动作序列。它不直接生成离散 task graph，也不保证符号前置依赖、资源约束或多机器人协同合法性。

扩展到多机器人时，联合 trajectory 维度会快速变大；如果每个机器人独立采样，又可能破坏全局避碰、资源占用和任务同步约束。因此它更像 trajectory-level planner 或低层行为 prior，不是完整的 task graph planner。

## 和其他论文的关系

DDPM 提供基础 denoising 生成框架，Diffuser 把生成对象从图像换成 trajectory。

Diffusion Policy 后来把 diffusion 用于机器人 action chunk，更靠近低层 visuomotor execution；Diffuser 更强调规划，把整段状态-动作序列当作计划。

DiGress / LayerDAG 生成的是 graph 结构，Diffuser 生成的是 trajectory。对 TOPG 来说，两者可以分工：LayerDAG 生成高层 task graph，Diffuser 或 Diffusion Policy 生成某个子任务的连续路径/动作轨迹。

## 对多智能体任务规划模型的启发

TOPG 可以把 Diffuser 放在 task graph 之后：

```text
task graph node
  -> local goal / constraint
  -> trajectory diffuser
  -> executable path / action sequence
  -> feedback to graph planner
```

也可以把它作为 planner sampler 的类比：如果 trajectory 可以通过 diffusion denoise 出来，那么 task graph 也可以通过 discrete graph denoising 生成。不同之处是，trajectory 是时间序列，task graph 是带 typed node/edge 和 partial order 的结构对象。

对于多机器人，Diffuser 的 value guidance 可以扩展成：

```text
reward = task progress
       - collision risk
       - resource conflict
       - communication delay
       - energy cost
```

但这需要强约束或 repair 机制，否则 diffusion 生成的轨迹可能高分但不可执行。

## 可复用模块

trajectory diffusion model、value-guided sampling、classifier-guided planning、trajectory inpainting、receding-horizon diffusion planning、flexible test-time conditioning。

## 证据与风险

证据来自 ICML 2022 正式发表论文、PMLR 页面和 arXiv `2205.09991`。PDF 已保存为本地 arXiv 版本：`pdfs/2022-05-01-Diffuser-planning-with-diffusion-flexible-behavior-synthesis.pdf`。

风险在于：Diffuser 强在连续 trajectory planning，不直接处理离散 task graph、DAG 结构或多机器人约束。TOPG 需要把它和 graph-level planner 分层使用，而不是把它直接当成多机器人任务规划总模型。

## 开放问题

TOPG 应该把 Diffuser 用作低层 trajectory generator，还是把它的 value-guided sampling 思想迁移到高层 task graph generation。第一版更稳的是：LayerDAG 负责生成 task graph，Diffuser 类方法负责生成单个 task node 的路径或动作轨迹。
