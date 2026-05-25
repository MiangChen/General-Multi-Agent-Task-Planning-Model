---
id: 2026-cola-dlm-continuous-latent-diffusion-language-model
title: "Continuous Latent Diffusion Language Model"
short_title: Cola DLM
year: 2026
published: 2026-05
venue: arXiv
status: read
scope: candidate
readiness: medium
action: build_note
tech_paradigm: continuous_latent_diffusion_language_model
primary_domain: Diffusion
domains: [LLM, Diffusion]
primary_technical_layer: language_generation
primary_task_family: diffusion_language_modeling
platform: text_generation
planning_relevance: Cola DLM 把语言生成拆成 Text VAE 的 text-to-latent / latent-to-text 与 block-causal DiT 的 latent prior transport，对我们的 PlanObject 路线有借鉴意义：先建连续高层 latent，再投影成离散文本或结构。
multi_robot_relevance: 直接多机器人相关性较弱，但可作为“连续 latent 先组织全局语义，再解码为局部可执行计划”的语言侧参考。
system_roles: [semantic_planner, foundation_policy]
reusable_modules: [text_vae_latent_mapping, block_causal_dit_prior, latent_prior_transport, conditional_text_decoder]
evidence_level: paper_read
next_action: compare_with_elf
tags: [Cola DLM, ByteDance Seed, diffusion language model, latent diffusion, Text VAE, DiT, flow matching, LLM]
authors: [Hongcan Guo, Qinyu Zhao, Yian Zhao, Shen Nie, Rui Zhu, Qiushan Guo, Feng Wang, Tao Yang, Hengshuang Zhao, Guoqiang Wei, Yan Zeng]
institutions: [ByteDance Seed, Peking University, University of Hong Kong]
doi: 10.48550/arXiv.2605.06548
arxiv: 2605.06548
url: https://arxiv.org/abs/2605.06548
project_url: https://hongcanguo.github.io/Cola-DLM/
image_url:
zotero_key:
citekey: guo2026coladlm
cites: [2020-ddpm-denoising-diffusion-probabilistic-models, 2024-pi0-vla-flow-model]
extends: [2020-ddpm-denoising-diffusion-probabilistic-models]
uses: []
enables: []
complements: [2026-elf-embedded-language-flows]
contrasts: []
---

## 一句话结论

Cola DLM 是 ByteDance Seed 的层级连续潜在扩散语言模型：先用 Text VAE 把文本压到连续 latent，再用 block-causal DiT 做 latent prior transport，最后条件解码回文本。

## 研究问题

自回归 LLM 绑定固定的从左到右 token 顺序；离散 DLM 又常常面临全局语义组织、可扩展表示学习和高效生成之间的冲突。

Cola DLM 要回答的是：能否把语言生成拆成“全局语义 latent 建模”和“局部文本实现”两层，使 diffusion 主要承担连续 latent prior 的建模，而不是每一步都恢复 token。

## 方法

模型由两个主要部分组成：

- Text VAE：负责 text-to-latent 和 latent-to-text，把离散文本变成稳定的连续 latent 序列。
- block-causal DiT：在连续 latent 空间中用 Flow Matching / diffusion prior transport 建模全局语义。

生成时，DiT 先组织 latent 空间中的全局语义轨迹，再由条件 decoder 把 latent realization 成文本。

## 关键贡献

第一，Cola DLM 明确把语言生成分解为层级信息建模：高层 semantic prior 和低层 textual realization 分离。

第二，它把 diffusion 的对象从 token observation recovery 转向 latent prior transport，更适合连续空间的 scaling。

第三，它提供了开源模型和 HuggingFace checkpoint，便于后续实测采样速度、生成质量和接口可用性。

## 局限

Cola DLM 仍是语言模型，不直接处理任务图合法性、执行资源、POMDP 状态不确定性或多机器人调度。

Text VAE 的压缩质量会成为关键瓶颈：如果 latent 丢失任务约束、依赖关系或资源冲突信息，后续 diffusion prior 很难恢复。

## 和其他论文的关系

和 ELF 相比，Cola DLM 更强调层级 latent decomposition：ELF 主要在 token embedding 空间做 flow，Cola DLM 则先通过 VAE 建立更抽象的连续 latent，再用 DiT 建模 prior。

和 π0 一样，它说明 flow / diffusion 不一定只服务图像，也可以作为连续决策或语言生成的核心 prior。但 Cola DLM 的输出仍是文本，不是机器人动作。

## 对多智能体任务规划模型的启发

我们的 PlanObject 可以参考 Cola DLM 的分层：`scene / agent / skill graph` 先编码成连续 latent evidence，diffusion planner 在 latent PlanObject 空间中生成高维决策，再由 mapping module 投影成 Gantt、task graph 或 JSON。

这里的关键不是把 Cola DLM 直接当 planner，而是借鉴它的分工：连续 latent 负责全局组织，decoder / projector 负责离散可读输出。

## 可复用模块

Text VAE 式的结构压缩、block-causal DiT prior、latent prior transport、conditional decoder、HuggingFace / OpenAI-compatible serving adapter。

## 证据与风险

证据来自 arXiv 报告和 ByteDance Seed 公开模型仓库；风险是当前 benchmark 主要验证语言生成，不验证规划可执行性或状态约束一致性。

## 开放问题

如果把 Cola DLM 的层级 latent 思路迁移到任务规划，Text VAE 对应的模块应该学习自然语言文本 latent，还是直接学习 typed graph / PlanObject latent。
