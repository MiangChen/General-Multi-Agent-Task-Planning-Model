---
id: 2022-classifier-free-diffusion-guidance
title: "Classifier-Free Diffusion Guidance"
short_title: CFG
year: 2022
published: 2022-07
venue: arXiv 2022
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: classifier_free_diffusion_guidance
primary_domain: Diffusion
domains: [Diffusion, Generative Model, Conditional Generation, Guidance]
primary_technical_layer: diffusion_conditioning
primary_task_family: conditional_diffusion_guidance
platform: image_generation
planning_relevance: Classifier-Free Diffusion Guidance 提供了一个非常适合 TOPG 的条件强度控制机制：同一个去噪模型同时学习有条件和无条件预测，采样时用 guidance scale 调节 language、scene、agent、skill 或 safety constraint 对生成任务图的影响。
multi_robot_relevance: 间接但关键。多机器人任务规划可以把 CFG 看成 plan graph denoising 的条件旋钮：低 guidance 保持多样候选，高 guidance 强化用户目标、场景 grounding、资源约束和 repair feedback 的遵循程度。
system_roles: [diffusion_foundation, conditional_generator, planner_critic]
reusable_modules: [classifier_free_guidance, condition_dropout, guidance_scale, conditional_unconditional_interpolation, constraint_strength_control]
evidence_level: paper_read
next_action: map_cfg_to_topg_guidance
tags: [classifier-free guidance, diffusion guidance, conditional diffusion, CFG, guidance scale]
authors: [Jonathan Ho, Tim Salimans]
institutions: [Google Research]
doi: 10.48550/arXiv.2207.12598
arxiv: 2207.12598
url: https://arxiv.org/abs/2207.12598
project_url:
pdf_path: https://arxiv.org/pdf/2207.12598
image_url:
zotero_key:
citekey: ho2022classifierfree
cites: [2020-ddpm-denoising-diffusion-probabilistic-models]
extends: [2020-ddpm-denoising-diffusion-probabilistic-models]
uses: []
enables: [2023-diffusion-policy-action-diffusion, 2023-rfdiffusion-protein-structure-function, 2025-layerdag-diffusion-dag-generation]
contrasts: []
---

## 一句话结论

Classifier-Free Diffusion Guidance 是条件 diffusion 的核心控制方法：它不用额外训练 classifier，而是在同一个模型里同时学习 conditional 和 unconditional denoising，采样时通过 guidance scale 控制生成结果对条件的服从强度。

## 研究问题

Classifier guidance 可以提高条件生成质量，但需要单独训练一个 classifier，并且在很多任务里 classifier 本身很难定义。论文关心的问题是：能不能只训练一个 diffusion model，就同时获得无条件生成能力和强条件引导能力。

对 TOPG 来说，对应问题是：生成任务图时，如何让模型既能探索多种可行计划，又能在需要时强遵循语言目标、场景事实、机器人能力、技能兼容性和 repair feedback。

## 方法

训练阶段，模型以一定概率丢弃条件输入，让同一个 denoiser 同时见到有条件样本和无条件样本。这样模型可以学到两种预测：`eps_cond` 表示给定条件时的噪声预测，`eps_uncond` 表示没有条件时的噪声预测。

采样阶段，把两者按 guidance scale 组合：

```text
eps_guided = eps_uncond + scale * (eps_cond - eps_uncond)
```

当 `scale` 较低时，采样更接近无条件模型，结果更多样；当 `scale` 较高时，采样更强地贴合条件，但可能牺牲多样性或产生过度约束。

## 关键贡献

- 去掉了 classifier guidance 中额外 classifier 的训练和推理依赖。
- 用 condition dropout 把 conditional / unconditional 两种能力合进同一个 diffusion model。
- 把 guidance scale 变成一个简单、可调、工程上很有用的生成控制旋钮。
- 为后续 text-to-image、robot action diffusion、protein structure diffusion 和 graph diffusion 提供了常用的条件增强机制。

## 局限

论文主要在图像生成语境中验证，不能直接证明它对任务图、DAG、分配图或多机器人规划一定有效。高 guidance 虽然能增强条件遵循，但也可能降低候选计划多样性，让 planner 更容易陷入单一路线。

TOPG 里还需要处理离散结构合法性：任务节点数量、依赖边、location grounding、skill label 和 agent allocation 不能只靠 guidance scale 保证，需要额外的 schema check、constraint repair 或 executor feedback。

## 和其他论文的关系

DDPM 提供了基础的加噪和去噪生成框架，CFG 则解决条件 diffusion 中“条件该有多强”的控制问题。

Diffusion Policy 可以把 CFG 用在 action chunk 条件生成里，例如强化视觉状态或语言目标的影响。RFdiffusion / AlphaFold3 一类结构生成系统也可以类比使用条件强度控制，让固定 motif、binding target 或结构约束更强地进入去噪轨迹。

对 LayerDAG / TOPG 来说，CFG 的价值不是图像质量，而是把 condition adherence 做成可调参数：同一套图生成模型可以在探索、严格执行、失败修复之间切换。

## 对多智能体任务规划模型的启发

TOPG 生成器可以把 CFG 映射成多类 guidance：

```text
unconditional graph prior
  + language instruction guidance
  + scene grounding guidance
  + agent / skill compatibility guidance
  + repair feedback guidance
  -> guided task graph denoising
```

一个实用设计是保留多个 scale：`language_scale`、`scene_scale`、`safety_scale`、`repair_scale`。初始规划可以使用中等 guidance 保留多样性；执行失败后的 repair 模式可以提高 repair / safety guidance，减少对已执行成功部分的破坏。

## 可复用模块

classifier-free guidance、condition dropout、guidance scale、conditional / unconditional prediction interpolation、constraint strength control。

## 证据与风险

正式来源按 arXiv 记录为 `2207.12598`，提交时间是 2022-07-26，作者为 Jonathan Ho 和 Tim Salimans；arXiv 页面同时备注 short version appeared in the NeurIPS 2021 Workshop on Deep Generative Models and Downstream Applications。PDF 链接已放入 dashboard。CFG 已成为 diffusion 系列系统中非常常见的条件控制机制。风险在于它只控制生成分布的方向，不等价于符号约束满足；TOPG 中仍需要显式合法性检查和失败反馈闭环。

## 开放问题

TOPG 应该把 guidance scale 设计成全局单旋钮，还是针对 language、scene、agent、skill、safety、repair context 分别设置多个 scale。第一版可以先实现全局 `condition_scale`，后续再拆成多条件 guidance。
