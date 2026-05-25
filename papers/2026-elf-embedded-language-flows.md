---
id: 2026-elf-embedded-language-flows
title: "ELF: Embedded Language Flows"
short_title: ELF
year: 2026
published: 2026-05
venue: arXiv
status: read
scope: candidate
readiness: medium
action: build_note
tech_paradigm: continuous_embedding_language_flow
primary_domain: Diffusion
domains: [LLM, Diffusion]
primary_technical_layer: language_generation
primary_task_family: diffusion_language_modeling
platform: text_generation
planning_relevance: ELF 把语言生成从离散 token diffusion 推向连续 embedding-space flow matching，为“语言条件 -> 连续 latent -> 离散结构/文本”的接口提供参考。对任务规划来说，它更像是可微语言/结构中间层的建模路线，而不是直接 planner。
multi_robot_relevance: 对多机器人系统的直接贡献较弱，但它提示可以把高层指令、任务图草案和执行反馈放在连续 latent 空间中优化，再在最后投影成可读计划。
system_roles: [semantic_planner, foundation_policy]
reusable_modules: [embedding_space_flow_matching, shared_weight_token_projection, classifier_free_guidance_for_language]
evidence_level: paper_read
next_action: compare_with_cola_dlm
tags: [ELF, diffusion language model, continuous diffusion, flow matching, embedding space, classifier-free guidance, LLM]
authors: [Keya Hu, Linlu Qiu, Yiyang Lu, Hanhong Zhao, Tianhong Li, Yoon Kim, Jacob Andreas, Kaiming He]
institutions: [MIT]
doi: 10.48550/arXiv.2605.10938
arxiv: 2605.10938
url: https://arxiv.org/abs/2605.10938
project_url: https://github.com/lillian039/ELF
image_url:
zotero_key:
citekey: hu2026elf
cites: [2020-ddpm-denoising-diffusion-probabilistic-models, 2022-classifier-free-diffusion-guidance]
extends: [2020-ddpm-denoising-diffusion-probabilistic-models, 2022-classifier-free-diffusion-guidance]
uses: []
enables: []
complements: [2026-cola-dlm-continuous-latent-diffusion-language-model, 2024-pi0-vla-flow-model]
contrasts: []
---

## 一句话结论

ELF 是一条连续语言扩散路线：主要在 embedding space 里用 continuous-time Flow Matching 生成语言表示，只在最后一步映射回离散 token，因此更接近图像/视频扩散模型的连续建模范式。

## 研究问题

扩散语言模型长期受离散 token 空间限制：如果直接对 token 做 mask / categorical denoising，和图像扩散的连续空间经验不完全兼容；如果做连续语言模型，又容易卡在离散文本映射和采样质量上。

ELF 关心的问题是：语言生成是否可以主要留在连续 embedding 空间里完成，并复用 Flow Matching、CFG 等图像扩散领域已经成熟的训练和采样技巧。

## 方法

ELF 将离散文本映射到连续 embedding 表示，在连续时间 flow matching 目标下学习从噪声到 clean embedding 的速度场。生成过程中，模型大部分时间都在连续空间中迭代，最终通过共享权重网络投影回离散 token。

这个设计避免了每个去噪步都要直接恢复离散 token，也让 classifier-free guidance 这类条件采样方法可以自然迁移到语言生成。

## 关键贡献

第一，ELF 把语言扩散重新表述为 embedding-space flow，而不是 token-level denoising。

第二，它说明连续 DLM 并不一定需要复杂的离散适配，关键是把离散投影推迟到最后阶段。

第三，它为“语言 latent 可微优化”提供了一个更清楚的参照：模型可以先在连续空间中推理、规划或重写，再转成符号输出。

## 局限

ELF 仍是语言生成模型，不直接解决开放世界任务规划中的状态估计、资源约束、执行失败恢复或多机器人调度。

它对我们的价值主要是范式借鉴：连续 latent 空间里的 diffusion / flow 如何连接到最终离散计划对象。

## 和其他论文的关系

ELF 继承 DDPM / Flow Matching 一类连续生成思想，并显式借用 classifier-free guidance。和 Cola DLM 相比，ELF 更靠近 token embedding 层，强调 embedding-space flow；Cola DLM 更强调层级 latent decomposition 和 Text VAE。

它也和 π0 有概念相似性：两者都把最终输出之外的核心生成过程放在连续 flow 空间中，只是 π0 面向机器人动作，ELF 面向语言。

## 对多智能体任务规划模型的启发

我们的 diffusion graph planner 可以借鉴 ELF 的边界设计：内部保持连续 latent `z_t / Y_t`，只在输出层投影为 task graph、Gantt 或 JSON。这样比显式离散 belief / token 链更容易保留可微性质。

## 可复用模块

embedding-space Flow Matching、最后一步 token projection、language CFG conditioning、连续 latent 到离散符号的投影边界。

## 证据与风险

证据来自 arXiv 技术报告中的语言生成实验；风险是它尚未证明可直接承担任务图生成、长程规划或真实执行反馈闭环。

## 开放问题

如果把 ELF 的 embedding-space flow 迁移到任务规划，输出层应该投影成自然语言计划、Typed PlanObject，还是直接投影成 task graph delta。
