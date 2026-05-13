---
id: 2020-score-sde-score-based-generative-modeling-sde
title: "Score-Based Generative Modeling through Stochastic Differential Equations"
short_title: Score SDE
year: 2020
published: 2020-11
venue: ICLR 2021 Oral
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: score_based_sde_diffusion
primary_domain: Diffusion
domains: [Diffusion, Score Matching, SDE, Generative Model]
primary_technical_layer: diffusion_theory_and_sampling
primary_task_family: score_based_generative_modeling
platform: image_generation
planning_relevance: Score SDE 把 DDPM、score matching、Langevin dynamics、SDE / ODE sampler 统一到一个连续时间框架里。对 TOPG 来说，它提供的是理论接口：graph denoiser 不只是预测噪声，也可以被理解成估计数据分布的 score，从而把采样、概率流 ODE 和条件引导放到同一个语言里。
multi_robot_relevance: 间接但基础。多机器人 task graph generation 如果要比较随机采样、确定性采样、少步采样和 guidance，需要 Score SDE 这种统一视角来解释 sampler 的差别和风险。
system_roles: [diffusion_foundation, score_model_reference, sampler_theory, planner_sampling_strategy]
reusable_modules: [score_matching_objective, forward_sde_noise_process, reverse_time_sde_sampling, probability_flow_ode, predictor_corrector_sampler, continuous_time_diffusion]
evidence_level: paper_read
next_action: map_score_sde_to_discrete_graph_diffusion
tags: [Score SDE, score matching, diffusion theory, reverse SDE, probability flow ODE, ICLR 2021]
authors: [Yang Song, Jascha Sohl-Dickstein, Diederik P. Kingma, Abhishek Kumar, Stefano Ermon, Ben Poole]
institutions: [Stanford University, Google Research]
doi: 10.48550/arXiv.2011.13456
arxiv: 2011.13456
url: https://openreview.net/forum?id=PxTIG12RRHS
project_url: https://github.com/yang-song/score_sde
pdf_path: pdfs/2020-11-01-Score-SDE-score-based-generative-modeling-sde.pdf
image_url:
zotero_key:
citekey: song2020scoresde
cites: [2020-ddpm-denoising-diffusion-probabilistic-models]
extends: [2020-ddpm-denoising-diffusion-probabilistic-models]
uses: []
enables: [2020-ddim-denoising-diffusion-implicit-models, 2021-improved-ddpm-improved-denoising-diffusion-probabilistic-models, 2022-classifier-free-diffusion-guidance, 2023-diffusion-policy-action-diffusion, 2025-layerdag-diffusion-dag-generation]
complements: []
contrasts: []
---

## 一句话结论

Score SDE 是 diffusion 理论线的关键统一论文：它把 DDPM、score matching、Langevin dynamics、随机 SDE 采样和确定性 probability flow ODE 放到同一个连续时间框架里。

正式发表信息：论文 arXiv 版本是 `2011.13456`，正式会议为 **ICLR 2021 Oral**。

## 研究问题

DDPM、NCSN / score matching、Langevin dynamics 看起来像不同路线：有的讲逐步加噪，有的讲估计 `score = grad_x log p(x)`，有的讲从噪声里用随机动力学采样。Score SDE 关心的问题是：这些方法能不能被统一成同一个连续时间生成建模框架。

对 TOPG 来说，这个问题很关键。我们不只想知道“怎么训练一个去噪网络”，还想知道采样器、随机性、确定性路径、条件引导和概率流之间是什么关系。

## 方法

Score SDE 把数据到噪声的过程写成一个 forward SDE：

```text
dx = f(x, t) dt + g(t) dw
```

这个过程把真实数据逐渐扰动成简单噪声分布。生成时，则使用 reverse-time SDE 从噪声走回数据：

```text
dx = [f(x, t) - g(t)^2 score_t(x)] dt + g(t) d\bar{w}
```

这里最核心的是 `score_t(x)`：

```text
score_t(x) = grad_x log p_t(x)
```

也就是在每个噪声强度下，模型估计当前 noisy sample 应该往哪个方向移动，才能更接近数据分布。

论文还给出了对应的 probability flow ODE。它和 reverse SDE 有相同的边际分布，但采样路径是确定性的：

```text
dx = [f(x, t) - 1/2 g(t)^2 score_t(x)] dt
```

这就把 stochastic sampling 和 deterministic sampling 接到了一起。

## 关键贡献

- 把 score-based generative modeling 和 diffusion probabilistic modeling 统一成连续时间 SDE 框架。
- 明确指出 reverse-time SDE 可以用 learned score 从噪声分布生成数据。
- 引入 probability flow ODE，让同一个 score model 支持确定性采样和 likelihood computation。
- 提出 predictor-corrector sampler，把数值 SDE predictor 和 Langevin corrector 组合起来提升采样质量。
- 给后续 DDIM、采样器设计、ODE/SDE 解释、conditional guidance 和 diffusion likelihood 提供共同语言。

## 局限

Score SDE 的理论框架主要在连续空间里展开，图像是主要实验对象。离散 graph diffusion 不能直接套用连续 SDE，需要决定离散节点、边和属性的 score 如何定义，或者用 categorical diffusion / score-like logits 近似。

它也不直接解决 task graph validity、DAG constraint、resource constraint 或多机器人执行反馈。它更像 diffusion 的“物理学语言”，不是任务规划系统本身。

## 和其他论文的关系

DDPM 可以看成 Score SDE 框架下的一种离散时间扩散模型。DDIM 和 probability flow ODE 在直觉上相近：都强调同一个模型可以走更确定、更少步的生成路径。

Improved DDPM 更偏训练和噪声日程优化；Score SDE 更偏统一理论和采样解释。CFG 等 guidance 方法可以被理解成修改 score / denoising direction，使采样更贴近条件分布。

LayerDAG / TOPG 如果要做离散 graph diffusion，Score SDE 不会直接给出图算法，但它能帮助我们理解：模型预测的不是“答案”，而是在不同噪声水平下指向 clean graph manifold 的方向。

## 对多智能体任务规划模型的启发

TOPG 可以把 Score SDE 的思想迁移成：

```text
noisy task graph state
  -> graph score / denoising direction
  -> sampler updates graph hypothesis
  -> validity checker / constraint repair
  -> clean executable task graph
```

如果用连续 latent graph representation，可以更直接借鉴 SDE / ODE sampler。如果用离散节点和边，则需要把 score 改写成 categorical logits、mask prediction 或 edge transition probability。

最重要的启发是：采样器可以成为可替换模块。随机 reverse process 用于探索多个候选计划；deterministic ODE-like sampler 用于调试和稳定复现；corrector step 可以对应 constraint repair 或 planner critic feedback。

## 可复用模块

score matching objective、forward SDE noise process、reverse-time SDE sampling、probability flow ODE、predictor-corrector sampler、continuous-time diffusion。

## 证据与风险

证据来自 ICLR 2021 Oral 正式发表论文、OpenReview 页面和 arXiv `2011.13456`。PDF 已保存为本地 arXiv 版本：`pdfs/2020-11-01-Score-SDE-score-based-generative-modeling-sde.pdf`。

风险在于：SDE / ODE 统一视角很强，但它可能让我们过早沉入连续数学细节。对 TOPG 来说，关键不是复刻图像生成的 SDE，而是把“不同噪声水平下的修复方向”和“可替换采样器”迁移到 typed task graph。

## 开放问题

TOPG 应该先做连续 latent graph score model，还是直接做离散 categorical graph denoising。前者更贴近 Score SDE，后者更贴近 LayerDAG / DiGress 和真实任务图 schema。
