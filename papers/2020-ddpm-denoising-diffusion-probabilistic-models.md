---
id: 2020-ddpm-denoising-diffusion-probabilistic-models
title: "Denoising Diffusion Probabilistic Models"
short_title: DDPM
year: 2020
published: 2020-06
venue: NeurIPS 2020
status: skimmed
scope: in_scope
readiness: high
action: build_note
tech_paradigm: denoising_diffusion_probabilistic_model
primary_domain: Diffusion
domains: [Diffusion, Generative Model, Denoising, Score Matching]
primary_technical_layer: diffusion_generation
primary_task_family: denoising_diffusion_modeling
platform: image_generation
planning_relevance: DDPM 是后续 action diffusion、video diffusion、structure diffusion 和 graph diffusion 的基础范式：训练时加噪，推理时逐步去噪。对 TOPG 来说，它提供了把 noisy plan hypothesis 逐步修正成 clean task graph 的最小数学骨架。
multi_robot_relevance: 间接但基础。多机器人任务规划可以把任务图、分配图或局部 action chunk 当成被噪声扰动的结构对象，再用条件去噪模型结合 language、scene、agent、skill 和 feedback 逐步修复。
system_roles: [diffusion_foundation, denoising_generator, architecture_reference]
reusable_modules: [forward_noise_process, reverse_denoising_process, timestep_conditioning, noise_prediction_objective, iterative_refinement_sampling]
evidence_level: skimmed
next_action: map_ddpm_to_graph_denoising
tags: [DDPM, diffusion model, denoising, score matching, generative model, iterative refinement]
authors: [Jonathan Ho, Ajay Jain, Pieter Abbeel]
institutions: [UC Berkeley, Google Research]
doi: 10.48550/arXiv.2006.11239
arxiv: 2006.11239
url: https://arxiv.org/abs/2006.11239
project_url: https://github.com/hojonathanho/diffusion
pdf_path:
image_url:
zotero_key:
citekey: ho2020ddpm
cites: []
extends: []
uses: []
enables: [2023-diffusion-policy-action-diffusion, 2023-rfdiffusion-protein-structure-function, 2025-layerdag-diffusion-dag-generation]
complements: [2024-pyramidal-flow-matching-video]
contrasts: []
---

## 一句话结论

DDPM 是现代 diffusion 生成模型的基础节点：它把生成过程写成“正向逐步加噪 + 反向逐步去噪”，并用简化的噪声预测目标让模型学会从噪声中恢复数据结构。

## 研究问题

传统生成模型在高质量图像生成上常依赖 GAN、VAE 或 autoregressive decoder。DDPM 关心的问题是：能否用一个清晰的概率扩散过程，把复杂数据分布逐步扰动成高斯噪声，再训练一个神经网络学习反向去噪链，从噪声生成样本。

对我们做 TOPG 来说，真正重要的不是图像任务，而是“结构可以被逐步破坏，也可以被条件模型逐步修复”这个范式。

## 方法

DDPM 定义两个过程。

第一，forward process 从真实样本 `x_0` 开始，按照预设噪声日程逐步加入高斯噪声，得到 `x_t`。当 `t` 足够大时，样本接近标准高斯噪声。

第二，reverse process 训练神经网络估计每个时间步应该如何去噪。实践中常用 U-Net 接收 noisy sample 和 timestep embedding，并预测噪声项。推理时从随机噪声开始，反复调用去噪网络，逐步得到干净样本。

论文还把 weighted variational bound、denoising score matching 和 Langevin-style sampling 联系起来，使 diffusion 不只是经验技巧，而是有概率建模解释的生成框架。

## 关键贡献

- 把扩散概率模型推进到高质量图像生成，成为后续 diffusion family 的关键起点之一。
- 给出了可操作的训练目标：预测加到数据上的噪声，而不是直接建模复杂数据分布。
- 明确了 timestep-conditioned denoising 的工程形式，让后续模型可以把图像、视频、动作、结构或图都放进同一“加噪-去噪”框架。
- 为后续 DDIM、score-based diffusion、latent diffusion、action diffusion、video diffusion 和 graph diffusion 提供了共同语言。

## 局限

DDPM 本身主要验证无条件图像生成，不处理语言条件、机器人状态、任务图约束或多机器人协作。原始采样通常需要很多去噪步，推理速度慢；后续大量工作才围绕采样加速、条件控制、离散结构生成和实时执行展开。

对 TOPG 而言，不能直接照搬连续像素扩散。任务图包含离散节点类型、边类型、约束、可执行性和拓扑合法性，因此需要把 DDPM 的连续去噪思想改造成 typed graph denoising。

## 和其他论文的关系

Diffusion Policy 把 DDPM 的去噪生成思想从图像迁移到机器人 action chunk：目标不再是像素，而是一段连续控制序列。

RFdiffusion 把去噪生成从图像迁移到 protein backbone scaffold：目标不再是图片，而是满足 motif/结构约束的三维骨架。

LayerDAG 则把 diffusion 进一步放到离散 DAG 生成里，接近我们要做的 task graph denoising。它不是直接使用原始 DDPM 生成整张图，而是把 DDPM-style iterative refinement 用在 layer 内节点属性和边生成上。

## 对多智能体任务规划模型的启发

DDPM 给 TOPG 的最小迁移形式是：

```text
clean task graph
  -> add node / edge / attribute noise
  -> condition on language + scene + agents + skills + feedback
  -> denoise into a valid plan graph
  -> check constraints and optionally denoise again
```

这说明 TOPG 生成器不一定要一次性输出完整计划。它可以先产生一个 noised / masked plan hypothesis view，再逐步修正 task count、skill label、location grounding、dependency edge 和 allocation hints。

## 可复用模块

forward noise process、reverse denoising process、timestep conditioning、noise prediction objective、iterative refinement sampling。

## 证据与风险

证据来自 NeurIPS 2020 论文和公开实现，DDPM 已成为 diffusion 系列方法的基础参考。风险是原始证据来自图像生成；迁移到 TOPG 必须重新定义噪声空间、合法性约束、离散边预测和 planner confidence，不能只把图像 U-Net 换成 GNN 就期待规划成功。

## 开放问题

TOPG 的 noise schedule 应该破坏什么：任务节点数量、任务技能、location grounding、dependency edge，还是 allocation hint。第一版可以从 mask-denoising 开始，后续再扩展到 multi-step discrete diffusion。
