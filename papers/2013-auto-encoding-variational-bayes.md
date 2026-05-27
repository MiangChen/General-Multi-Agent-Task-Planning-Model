---
id: 2013-auto-encoding-variational-bayes
title: "Auto-Encoding Variational Bayes"
short_title: AEVB / VAE
year: 2013
published: 2013-12
venue: ICLR 2014 / arXiv
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: variational_autoencoder
primary_domain: Generative Model
domains: [Generative Model, VAE, Variational Inference, Latent Model]
primary_technical_layer: latent_representation_learning
primary_task_family: variational_latent_variable_modeling
platform: general_generative_modeling
planning_relevance: AEVB/VAE 提供了把离散或高维观测压缩成连续 latent，再从 latent 解码回数据的基础框架；对 PlanObject 和 Cola DLM 式 latent diffusion 来说，它是“先学可微 latent 空间，再在 latent 中生成/规划”的上游思想。
multi_robot_relevance: 间接但重要。多机器人任务规划可以把 language、scene graph、agent graph 和 skill graph 编码到连续 latent belief，再由 diffusion 或 planner 在 latent 中生成候选计划，最后解码成可执行图或 Gantt。
system_roles: [latent_encoder, latent_decoder, representation_learning, generative_prior]
reusable_modules: [amortized_variational_inference, reparameterization_trick, encoder_decoder_latent_model, elbo_objective, gaussian_latent_space]
evidence_level: paper_read
next_action: map_vae_to_planobject_latent
tags: [AEVB, VAE, variational inference, latent variable model, reparameterization trick, ELBO, generative model]
authors: [Diederik P. Kingma, Max Welling]
institutions: [University of Amsterdam]
doi: 10.48550/arXiv.1312.6114
arxiv: 1312.6114
url: https://arxiv.org/abs/1312.6114
project_url:
pdf_path:
image_url:
zotero_key:
citekey: kingma2013autoencoding
cites: []
extends: []
uses: []
enables: [2026-cola-dlm-continuous-latent-diffusion-language-model]
contrasts: [2020-ddpm-denoising-diffusion-probabilistic-models]
---

## 一句话结论

AEVB/VAE 把深度生成模型、变分推断和 autoencoder 结合起来：encoder 学近似后验，decoder 学生成模型，中间用可微的 reparameterization trick 让 latent-variable model 可以端到端训练。

## 研究问题

很多有用的数据生成过程都包含不可观测的 latent variable，但真实后验通常难以解析计算。传统变分推断可以优化证据下界，却很难和大规模神经网络、连续 latent variable、随机采样训练自然结合。

AEVB 要回答的是：能否用神经网络参数化近似后验 `q_phi(z|x)` 和生成模型 `p_theta(x|z)`，并通过一个可微采样技巧，让整个 latent-variable model 像 autoencoder 一样用梯度下降训练。

## 方法

模型由两部分组成：

- encoder / recognition model：输入观测 `x`，输出 latent 后验分布参数，例如 `mu` 和 `sigma`。
- decoder / generative model：从 latent `z` 重构或生成观测 `x`。

关键是 reparameterization trick：不直接从 `q_phi(z|x)` 采样阻断梯度，而是写成 `z = mu_phi(x) + sigma_phi(x) * epsilon`，其中 `epsilon` 来自固定噪声分布。这样随机性和可学习参数分离，ELBO 可以用 Monte Carlo 估计并反向传播。

## 关键贡献

- 提出 Auto-Encoding Variational Bayes，把 amortized variational inference 做成可扩展神经网络训练流程。
- 用 reparameterization trick 解决连续 latent variable 的低方差梯度估计问题。
- 给出了 VAE 的标准结构：encoder 近似后验、decoder 生成数据、ELBO 同时约束重构质量和 latent prior。
- 为后续 latent generative model、latent diffusion、text VAE、representation learning 和可微世界模型提供基础接口。

## 局限

VAE 的 latent space 通常需要依赖先验假设和 KL 正则，容易出现 posterior collapse 或重构模糊。它本身不解决复杂条件生成中的高保真采样，也不直接表达任务图约束、资源冲突或多机器人执行逻辑。

对我们的路线来说，VAE 更适合作为 latent interface，而不是完整 planner。它负责把复杂输入压进可微 latent；真正的生成、约束修复和计划选择还需要 diffusion / graph decoder / validator。

## 和其他论文的关系

和 DDPM 相比，VAE 是一次前向的 latent-variable generator，训练核心是 ELBO 和 approximate posterior；DDPM 是逐步加噪-去噪的 iterative generator。两者都属于生成模型基础，但建模对象和采样机制不同。

和 Cola DLM 的关系最直接：Cola DLM 用 Text VAE 把文本压缩到连续 latent，再用 diffusion / DiT 在 latent prior 中建模。因此 AEVB 是 Cola DLM 的 latent compression 思想来源。

## 对多智能体任务规划模型的启发

PlanObject 可以采用 VAE 式边界：

```text
language + scene graph + agent graph + skill graph
  -> encoder q_phi(z | context)
  -> continuous latent PlanObject z
  -> diffusion / planner prior edits z
  -> decoder projects to task graph / Gantt / JSON plan
```

这个分工的好处是：belief、partial observation、资源状态和技能约束可以先进入连续 latent；后续 diffusion planner 不必直接在离散 JSON 上采样，而是在更平滑的 latent space 中生成候选。

## 可复用模块

amortized variational inference、reparameterization trick、encoder-decoder latent model、ELBO objective、Gaussian latent space、latent compression interface。

## 证据与风险

证据来自 ICLR 2014 / arXiv `1312.6114`。风险是 VAE 的 reconstruction-oriented objective 不保证计划可执行性；迁移到任务规划时必须额外加入 graph validity、resource constraints、execution feedback 和 uncertainty calibration。

## 开放问题

PlanObject latent 应该压缩哪些东西：自然语言任务、scene graph、agent state、skill library、belief uncertainty，还是完整历史轨迹。第一版可以只做 context encoder，后续再加入 decoder 到 typed graph。
