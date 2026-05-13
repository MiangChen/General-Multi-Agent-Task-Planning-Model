---
id: 2020-ddim-denoising-diffusion-implicit-models
title: "Denoising Diffusion Implicit Models"
short_title: DDIM
year: 2020
published: 2020-10
venue: ICLR 2021
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: denoising_diffusion_implicit_model
primary_domain: Diffusion
domains: [Diffusion, Generative Model, Sampling, Score Matching]
primary_technical_layer: diffusion_sampling
primary_task_family: fast_diffusion_sampling
platform: image_generation
planning_relevance: DDIM 说明 diffusion 模型的训练目标和采样路径可以解耦：在不重新训练 DDPM denoiser 的情况下，可以通过非马尔可夫采样、跳步时间序列和确定性路径更快生成样本。对 TOPG 来说，这意味着 task graph denoiser 也可以先训练一个通用去噪模型，再为快速规划、确定性复现或候选多样性选择不同采样器。
multi_robot_relevance: 间接但重要。多机器人任务规划需要实时性和可复现性，DDIM 的少步采样与 deterministic sampling 给 graph plan generation 提供了速度和调试友好的采样参考。
system_roles: [diffusion_foundation, fast_sampler, deterministic_generator, planner_sampling_strategy]
reusable_modules: [non_markovian_forward_process, marginal_preserving_sampling, predicted_x0_reconstruction, eta_or_sigma_stochasticity_control, timestep_subsampling, deterministic_ddim_sampling]
evidence_level: paper_read
next_action: map_ddim_sampler_to_task_graph_denoising
tags: [DDIM, diffusion sampling, non-Markovian diffusion, deterministic sampling, fast sampling, DDPM]
authors: [Jiaming Song, Chenlin Meng, Stefano Ermon]
institutions: [Stanford University]
doi: 10.48550/arXiv.2010.02502
arxiv: 2010.02502
url: https://arxiv.org/abs/2010.02502
project_url: https://github.com/ermongroup/ddim
pdf_path: pdfs/2020-10-01-DDIM-denoising-diffusion-implicit-models.pdf
image_url:
zotero_key:
citekey: song2020ddim
cites: [2020-ddpm-denoising-diffusion-probabilistic-models]
extends: [2020-ddpm-denoising-diffusion-probabilistic-models]
uses: []
enables: [2023-diffusion-policy-action-diffusion, 2025-layerdag-diffusion-dag-generation]
complements: [2022-classifier-free-diffusion-guidance]
contrasts: []
---

## 一句话结论

DDIM 的核心贡献是：在不重新训练 DDPM 模型的情况下，构造一族保持相同边际分布的非马尔可夫采样过程，让同一个噪声预测模型可以更快、甚至确定性地生成样本。

正式发表信息：论文 arXiv 版本是 `2010.02502`，正式会议为 **ICLR 2021**。

## 研究问题

DDPM 的生成质量很强，但原始采样过程通常需要很多步，并且每一步都按马尔可夫链随机去噪。论文关心的问题是：如果训练好的 DDPM denoiser 已经学会预测噪声，是否必须沿用原始随机马尔可夫采样链，还是可以换一条更短、更快、更可控的采样路径。

对 TOPG 来说，对应问题是：如果我们训练了一个 task graph denoiser，能不能在不重训模型的前提下，用不同采样器切换“快速出图”“稳定复现”“多候选探索”等模式。

## 方法

DDIM 不是简单地“用了 `x_0`”。它做了三件关键事。

第一，引入非马尔可夫的 forward / inference process。DDPM 通常把扩散链写成：

```text
x_t 只依赖 x_{t-1}
```

DDIM 构造的是：

```text
q_sigma(x_{t-1} | x_t, x_0)
```

也就是每一步还显式依赖 `x_0`。这里的 `x_0` 是理论推导中定义路径用的真实干净样本；真正生成时没有真实 `x_0`，而是用模型根据当前 `x_t` 估计：

```text
x_hat_0 = f_theta(x_t)
```

所以 DDIM 的关键不是“直接拿真实 `x_0` 来生成”，而是训练/推导时用 `x_0` 定义合理路径，生成时用预测的 `x_hat_0` 替代它。

第二，保持和 DDPM 相同的边际分布。DDIM 改了路径，但不乱改每个时间步单独看时的数据分布：

```text
q(x_t | x_0) = N(sqrt(alpha_t) x_0, (1 - alpha_t) I)
```

这很关键，因为 DDPM 的噪声预测训练目标主要依赖这些边际分布。只要边际不变，原来训练好的 `epsilon_theta` 仍然可用。

第三，用 `sigma_t` 控制随机性。DDIM 给采样过程加了一个旋钮：

```text
sigma_t
```

当 `sigma_t` 取特定值时，可以恢复 DDPM 式随机采样；当 `sigma_t = 0` 时，采样变成确定性路径，也就是经典 DDIM sampling。再配合跳步时间序列，模型可以用更少步数生成样本。

## 关键贡献

- 证明 diffusion 的训练过程和采样过程可以解耦：不重新训练模型，也能换采样路径。
- 构造了一族保持相同 `q(x_t | x_0)` 边际的非马尔可夫过程，因此原 DDPM 噪声预测模型仍然可用。
- 用 `sigma_t` / `eta` 控制采样随机性，在 DDPM 式随机采样和 DDIM 确定性采样之间切换。
- 支持少步采样，让 diffusion 从“必须慢慢采很多步”走向更实用的快速生成。
- 提供 deterministic sampling，使同一个初始噪声和条件可以复现同一个生成路径，方便调试和插值。

## 局限

DDIM 主要解决采样速度和采样路径问题，不直接解决条件遵循、离散结构合法性、图拓扑约束或规划可执行性。它的实验语境仍以图像生成为主，迁移到 task graph generation 时需要重新定义 `x_t`、`x_hat_0`、噪声类型和合法性检查。

确定性采样虽然更快、更稳定，但也可能降低候选多样性。TOPG 如果只用确定性 DDIM 采样，可能得到可复现但单一的计划；如果需要多个可替代计划，仍需要保留随机性、不同初始噪声或多条件 guidance。

## 和其他论文的关系

DDPM 提供基础训练目标：把干净样本加噪，再训练 `epsilon_theta` 预测噪声。DDIM 接在 DDPM 后面，回答“同一个训练好的 `epsilon_theta` 能不能更快采样”。

Classifier-Free Guidance 解决条件强度控制，DDIM 解决采样路径和速度。二者可以组合：CFG 调整条件方向，DDIM 调整从噪声到样本的路径和步数。

Diffusion Policy、LayerDAG 和未来 TOPG graph diffusion 都会遇到采样效率问题。DDIM 的价值不是图像本身，而是提醒我们：训练 graph denoiser 后，可以把 sampler 当成独立模块优化。

## 对多智能体任务规划模型的启发

TOPG 可以把 DDIM 映射成一个 planner sampler 设计：

```text
noisy / masked task graph
  -> graph denoiser predicts clean graph x_hat_0
  -> sampler chooses next graph state
  -> repeat over selected timesteps
  -> output task graph + confidence + validity checks
```

其中不同模式可以对应不同采样策略：

```text
fast mode: fewer timesteps
debug mode: deterministic DDIM
exploration mode: stochastic sampler / multiple seeds
repair mode: keep executed subgraph fixed, denoise only failed or unknown parts
```

这对多机器人规划尤其重要：如果每次生成的 plan graph 都不可复现，调试失败恢复会很痛苦；如果采样太慢，在线重规划又不可用。DDIM 提供了速度、随机性和可复现性之间的基本旋钮。

## 可复用模块

non-Markovian forward process、marginal-preserving sampling、predicted `x_0` reconstruction、`sigma_t` / `eta` stochasticity control、timestep subsampling、deterministic DDIM sampling。

## 证据与风险

证据来自 ICLR 2021 正式发表论文和 arXiv `2010.02502`。PDF 已保存到本地 `pdfs/2020-10-01-DDIM-denoising-diffusion-implicit-models.pdf`。DDIM 后续成为 diffusion sampler 设计的重要基础之一。

风险在于：DDIM 的数学对象是连续图像空间里的采样过程。TOPG 的 task graph 是离散 typed graph，必须决定如何表示 noisy graph state、如何预测 `x_hat_0`、如何处理节点数变化、如何保持 DAG / constraint validity，以及确定性采样是否会让计划候选过少。

## 开放问题

TOPG 的 DDIM-like sampler 应该在什么空间里跳步：节点类型 logits、边类型 logits、masked graph slots、layerwise DAG state，还是完整 task graph latent。第一版可以先用 fixed-slot graph denoising 做确定性少步采样，再评估它和随机采样在 plan validity、diversity、repair success 上的差异。
