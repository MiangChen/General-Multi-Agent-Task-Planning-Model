---
id: 2024-alphafold3-biomolecular-interactions
title: "Accurate structure prediction of biomolecular interactions with AlphaFold 3"
short_title: AlphaFold3
year: 2024
published: 2024-06
venue: Nature
status: read
scope: candidate
readiness: high
action: extract_system_architecture
tech_paradigm: biomolecular_structure_generation_diffusion
primary_domain: Structure Generation
domains: [Structure Generation, Scientific AI, Diffusion, Pair Representation]
primary_technical_layer: structure_generation
primary_task_family: biomolecular_complex_structure_prediction
platform: biomolecular_interactions
planning_relevance: AlphaFold3 是 AF3-inspired TOPG Planner 的主要参考。它把多种生物分子统一 token 化，用 single/pair representations 和 Pairformer-style trunk 编码上下文，再用 diffusion module 生成结构，并用 confidence/ranking 评估结果。
multi_robot_relevance: 间接但架构价值很高。TOPG 可把 language、scene、agent、skill、feedback 和 task slots 统一成 typed tokens，用 pair representation 建模规划关系，再用 graph diffusion/denoising 生成或修复 task graph。
system_roles: [structure_generator, pair_representation_encoder, diffusion_generator, confidence_estimator, architecture_reference]
reusable_modules: [unified_tokenization, single_representation, pair_representation, pairformer_trunk, diffusion_structure_module, confidence_ranking]
evidence_level: paper_read
next_action: design_af3_inspired_topg_pairdiffuser
tags: [AlphaFold3, biomolecular interaction, Pairformer, diffusion, structure generation, confidence, scientific AI]
authors: [Josh Abramson, Jonas Adler, Jack Dunger, Richard Evans, Tim Green, Alexander Pritzel, Olaf Ronneberger, Lindsay Willmore, Andrew J. Ballard, Joshua Bambrick, Sebastian W. Bodenstein, David A. Evans, Chia-Chun Hung, Michael O'Neill, David Reiman, Kathryn Tunyasuvunakool, Zachary Wu, Akvilė Žemgulytė, Eirini Arvaniti, Charles Beattie, Ottavia Bertolli, Alex Bridgland, Alexey Cherepanov, Miles Congreve, Alexander I. Cowen-Rivers, Andrew Cowie, Michael Figurnov, Fabian B. Fuchs, Hannah Gladman, Rishub Jain, Yousuf A. Khan, Caroline M. R. Low, Kuba Perlin, Anna Potapenko, Pascal Savy, Sukhdeep Singh, Adrian Stecula, Ashok Thillaisundaram, Catherine Tong, Sergei Yakneen, Ellen D. Zhong, Michal Zielinski, Augustin Žídek, Victor Bapst, Pushmeet Kohli, Max Jaderberg, Demis Hassabis, John M. Jumper]
institutions: [Google DeepMind, Isomorphic Labs]
doi: 10.1038/s41586-024-07487-w
arxiv:
url: https://www.nature.com/articles/s41586-024-07487-w
project_url: https://github.com/google-deepmind/alphafold3
image_url:
zotero_key:
citekey: abramson2024alphafold3
cites: [2021-alphafold2-highly-accurate-structure-prediction]
extends: [2021-alphafold2-highly-accurate-structure-prediction]
uses: []
enables: []
complements: []
contrasts: [2025-layerdag-diffusion-dag-generation]
---

## 一句话结论

AlphaFold3 是我们做 TOPG 结构生成最值得参考的论文：它不是普通 graph generation，而是把复杂多实体系统统一 token 化，通过 pair representation 与 Pairformer-style trunk 建模关系，再用 diffusion 生成结构并输出 confidence。

## 研究问题

AlphaFold2 主要解决蛋白结构预测。AlphaFold3 想解决更一般的 biomolecular interactions：蛋白、DNA、RNA、小分子、离子、修饰残基等多类实体组成的复合体结构。

这个问题与 TOPG 的相似点在于：输入实体类型多、关系类型多，输出不是一串文字，而是一个必须满足约束的结构对象。

## 方法

AlphaFold3 将不同分子实体统一成 tokens，维护 single representation 和 pair representation。上下文编码由 Pairformer-style trunk 处理。最终结构生成使用 diffusion module，从 noisy atom coordinates 逐步去噪得到结构预测。

模型还输出 confidence，用于判断预测结构、相互作用和局部区域是否可靠。

## 关键贡献

第一，统一多实体 tokenization。AF3 不再只面向蛋白残基，而是把多种生物分子纳入同一结构预测框架。

第二，Pairformer-style trunk 强化了 pair relation 的中心地位。复杂系统不是只靠单节点 embedding，而是依赖 token-token relation 的持续更新。

第三，diffusion module 让结构生成更接近从噪声到结构的生成范式，这对 TOPG 的 noised plan hypothesis view 很有启发。

## 局限

AlphaFold3 的开源与复现条件、训练数据规模和领域特化先验都不是 TOPG 可以直接复制的。TOPG 也没有原子坐标这样的连续几何输出，生成对象是离散 typed task graph。

## 和其他论文的关系

AlphaFold3 继承 AlphaFold2 的 single/pair representation 思想，但在实体类型、结构生成方式和相互作用建模上更通用。

和 LayerDAG 这类任务 DAG 生成相比，AF3 更强调 pair representation 和结构生成 trunk；LayerDAG 更直接处理离散 DAG。TOPG 可以把两者结合：AF3-style pair trunk + task graph denoising decoder。

## 对多智能体任务规划模型的启发

TOPG-PairDiffuser 可以直接借鉴 AF3 的抽象范式：

```text
language / scene / agent / skill / feedback
  -> typed TOPG tokens
  -> single node representation
  -> pair representation
  -> TOPG-Pairformer trunk
  -> graph diffusion / denoising decoder
  -> task graph + allocation hints + confidence
```

区别是 AF3 生成 biomolecular structure，TOPG 生成 task planning graph。

## 可复用模块

unified_tokenization、single_representation、pair_representation、pairformer_trunk、diffusion_structure_module、confidence_ranking。

## 证据与风险

Nature 论文报告 AF3 可以预测包含多种分子类型的复合体结构，并在多个相互作用类型上提升准确性。风险是这是生物结构预测证据，不是任务规划证据；迁移到 TOPG 时需要小规模 ablation 来验证 pair representation、diffusion 和 confidence 是否真的提升规划图质量。

## 开放问题

TOPG 是否需要 full pair representation。H100 80GB 让 1000 节点 dense pair 可实验，但考虑规划边稀疏、语义类型复杂，主架构可能应采用 block-dense pair + sparse candidate decoder。
