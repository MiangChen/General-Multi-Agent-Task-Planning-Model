---
id: 2021-improved-ddpm-improved-denoising-diffusion-probabilistic-models
title: "Improved Denoising Diffusion Probabilistic Models"
short_title: Improved DDPM
year: 2021
published: 2021-02
venue: ICML 2021
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: improved_diffusion_modeling
primary_domain: Diffusion
domains: [Diffusion, Generative Model, Sampling, Training Objective]
primary_technical_layer: diffusion_training_and_sampling
primary_task_family: improved_diffusion_modeling
platform: image_generation
planning_relevance: Improved DDPM 对现在 diffusion 的最大贡献主要有两点：第一，把噪声日程从线性扩散改成更合理的非线性 schedule，尤其是 cosine 风格的累积噪声设计；第二，引入按时刻重要性采样的训练方式，让 loss 大的 timestep 被更频繁地学习。对 TOPG 来说，这意味着 graph diffusion 不只要考虑怎么去噪，还要考虑在哪些时间步破坏、在哪些时间步重点训练。
multi_robot_relevance: 间接但很实用。多机器人任务图生成如果要稳定训练，必须知道哪些时间步最容易学坏、哪些状态最常出错，因此 Improved DDPM 的 timestep weighting 和 schedule design 可以直接借鉴到离散图规划模型里。
system_roles: [diffusion_foundation, training_objective_refiner, sampler_optimizer]
reusable_modules: [nonlinear_noise_schedule, cosine_alpha_bar_schedule, timestep_importance_sampling, hybrid_loss_objective, learned_variance_modeling, diffusion_training_reweighting]
evidence_level: paper_read
next_action: map_improved_ddpm_schedule_and_sampling_to_graph_diffusion
tags: [Improved DDPM, diffusion schedule, importance sampling, noise schedule, ICML 2021, DDPM]
authors: [Alexander Quinn Nichol, Prafulla Dhariwal]
institutions: [OpenAI]
doi: 10.48550/arXiv.2102.09672
arxiv: 2102.09672
url: https://proceedings.mlr.press/v139/nichol21a.html
project_url:
pdf_path: pdfs/2021-02-01-Improved-DDPM-improved-denoising-diffusion-probabilistic-models.pdf
image_url:
zotero_key:
citekey: nichol2021improved
cites: [2020-ddpm-denoising-diffusion-probabilistic-models]
extends: [2020-ddpm-denoising-diffusion-probabilistic-models]
uses: []
enables: [2020-ddim-denoising-diffusion-implicit-models, 2022-classifier-free-diffusion-guidance, 2023-diffusion-policy-action-diffusion, 2025-layerdag-diffusion-dag-generation]
complements: []
contrasts: []
---

## 一句话结论

Improved DDPM 的核心贡献不是“又发明了一种新的 diffusion”，而是把 DDPM 训练得更稳、更省步、更容易扩展：一方面改进噪声日程，让不同时间步的加噪更符合学习难度分布；另一方面用 timestep importance sampling 让训练更关注 loss 高、最难学的时刻。

正式发表信息：论文 arXiv 版本是 `2102.09672`，正式会议为 **ICML 2021**。

## 研究问题

原始 DDPM 已经证明 diffusion 可以做出高质量样本，但它的训练和采样设计还有很多空间：噪声日程是不是太粗糙，某些时间步是不是太容易、某些时间步是不是太难，训练是不是把太多预算浪费在低价值时刻上。

Improved DDPM 关心的问题是：如何让 diffusion 的训练目标和时间步分配更合理，从而在不改变整体框架的前提下，提升样本质量、似然和采样效率。

## 方法

这篇论文最重要的两点，可以直接记成你说的那版。

第一，非线性的 noise schedule。原始 DDPM 常见的是比较机械的线性加噪日程，但 Improved DDPM 发现不同时间步的破坏强度不应该平均铺开，而应该用更平滑、更符合生成难度分布的 schedule，代表性做法就是 cosine 风格的 `alpha_bar(t)` 设计。直觉上，模型不应该在每个时间步都被同样程度地“折磨”；有些阶段应该保留更多语义，有些阶段再慢慢推向噪声。

第二，timestep importance sampling。不是所有时间步都同等重要。论文观察到某些 timestep 的 loss 更大、学习更难，于是训练时对这些时刻采样更频繁，相当于把训练预算向难点倾斜。这样模型不会被简单时间步“刷分”掩盖真实困难。

除了这两点，论文还讨论了 learned variances 和 hybrid objective 等工程改进，但如果只抓主线，最值得记住的就是：

```text
更合理的 noise schedule
+ 更聪明的 timestep sampling
= 更稳的 DDPM
```

## 关键贡献

- 把 noise schedule 从朴素线性思路推进到更合理的非线性设计，代表性是 cosine 风格的累积噪声日程。
- 引入 timestep importance sampling，让训练更关注 loss 大、学习难的时间步，而不是平均分配预算。
- 通过这些改动，在不改变 DDPM 主体框架的情况下提升样本质量和训练效率。
- 说明 diffusion 的成败不只取决于网络结构，也取决于时间步怎么安排、怎么采样、怎么分配训练资源。

## 局限

Improved DDPM 仍然是图像生成语境里的方法，核心对象是连续像素空间，不直接处理离散图、任务图合法性、条件约束或多机器人规划。

它也不是把 diffusion 从根上改成另一种模型，而是在 DDPM 框架内部做训练和 schedule 层面的增强。对后续任务图 diffusion 来说，它更像“训练策略的参考”，不是最终结构答案。

## 和其他论文的关系

DDPM 是基础骨架，Improved DDPM 是把这副骨架调得更顺手、更稳的版本。

DDIM 关注采样路径和速度，Improved DDPM 关注训练日程和 timestep 预算。一个偏 sampler，一个偏 trainer，但二者都在回答“同一个 diffusion 模型怎么变得更实用”。

Classifier-Free Guidance 继续把条件控制做强；Diffusion Policy 和 LayerDAG 则把这个更稳的 DDPM 训练范式迁移到动作和离散图上。

## 对多智能体任务规划模型的启发

对 TOPG 来说，Improved DDPM 最有价值的不是图像质量，而是训练哲学。

第一，任务图生成的噪声日程不该均匀。比如任务数量、依赖边、技能标签、位置 grounding、资源约束，这些对象在不同阶段的破坏难度并不一样，应该设计不同的 schedule。

第二，训练时要对难时刻加权。某些 graph denoising timestep 会更容易出错，应该像 importance sampling 一样更频繁地训练这些时刻，而不是让 easy timestep 冲掉梯度预算。

第三，TOPG 的 graph denoiser 以后也许不只是“会去噪”，而是“知道该重点学哪一段噪声过程”。

## 可复用模块

nonlinear noise schedule、cosine alpha_bar schedule、timestep importance sampling、hybrid loss objective、learned variance modeling、diffusion training reweighting。

## 证据与风险

证据来自 ICML 2021 正式发表论文和 arXiv `2102.09672`。PDF 已保存为 ICML proceedings 版本：`pdfs/2021-02-01-Improved-DDPM-improved-denoising-diffusion-probabilistic-models.pdf`，正式 venue 是 **ICML 2021**。

风险在于：Improved DDPM 的改进主要针对连续高维生成，迁移到离散图时需要重新定义 schedule 和 importance 的对象。对 task graph 来说，`timestep` 不一定还是像素噪声步，可能是节点/边破坏步、layerwise graph corruption step，或者 mask ratio step。

## 开放问题

TOPG 应该把 importance sampling 挂在什么上：训练时的扩散时间步、graph corruption 强度、还是不同类型的结构对象。第一版可以先把 `timestep` 直接映射到离散图的噪声步，再根据每个 step 的 loss 分布做重采样。
