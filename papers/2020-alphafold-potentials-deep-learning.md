---
id: 2020-alphafold-potentials-deep-learning
title: "Improved protein structure prediction using potentials from deep learning"
short_title: AlphaFold1
year: 2020
published: 2020-01
venue: Nature
status: skimmed
scope: candidate
readiness: medium
action: build_note
tech_paradigm: protein_structure_prediction_potentials
primary_domain: Structure Generation
domains: [Structure Generation, Scientific AI, Pair Representation]
primary_technical_layer: structure_prediction
primary_task_family: protein_structure_prediction
platform: protein_folding
planning_relevance: AlphaFold1 是从 pairwise distance/contact 预测到结构优化的早期路线。对 TOPG 的价值主要是说明 pair relation 可以作为结构生成的中间约束，但它还不是 AF2/AF3 那种端到端 trunk + structure module 范式。
multi_robot_relevance: 间接相关。它提示 TOPG 不一定要直接输出完整计划，可以先预测节点对之间的约束势能或关系分布，再通过后续优化/生成模块形成结构。
system_roles: [structure_predictor, pair_relation_prior]
reusable_modules: [distance_distribution_prediction, pairwise_constraint_potential, structure_refinement_from_pair_constraints]
evidence_level: skimmed
next_action: compare_af1_af2_architecture_shift
tags: [AlphaFold, AlphaFold1, protein structure prediction, pairwise distance, potentials, CASP13]
authors: [Andrew W. Senior, Richard Evans, John Jumper, James Kirkpatrick, Laurent Sifre, Tim Green, Chongli Qin, Augustin Žídek, Alexander W. R. Nelson, Alex Bridgland, Hugo Penedones, Stig Petersen, Karen Simonyan, Steve Crossan, Pushmeet Kohli, David T. Jones, David Silver, Koray Kavukcuoglu, Demis Hassabis]
institutions: [DeepMind, Francis Crick Institute, University College London]
doi: 10.1038/s41586-019-1923-7
arxiv:
url: https://www.nature.com/articles/s41586-019-1923-7
project_url: https://github.com/deepmind/deepmind-research/tree/master/alphafold_casp13
image_url:
zotero_key:
citekey: senior2020alphafold
cites: []
extends: []
uses: []
enables: [2021-alphafold2-highly-accurate-structure-prediction]
complements: []
contrasts: []
---

## 一句话结论

AlphaFold1 是 AlphaFold 系列的历史起点：它用深度网络预测残基间距离分布，并把这些 pairwise predictions 转成结构优化的势能函数。对 TOPG 的启发是 “先预测关系约束，再生成结构”，但它还不是我们最想参考的 AF3-style 结构生成架构。

## 研究问题

给定蛋白质氨基酸序列，能否不依赖昂贵实验测定，预测蛋白质三维结构。传统方法严重依赖模板、物理采样和共进化分析；AlphaFold1 的问题意识是用深度学习直接学习残基对之间的距离约束。

## 方法

模型预测 residue-residue distance distribution，而不是只预测 contact map。然后把预测出的距离信息转换成 potential of mean force，并结合梯度下降等结构优化过程得到 3D protein model。

## 关键贡献

第一，AlphaFold1 把深度学习预测的 pairwise distance 从辅助信号提升为结构优化的核心约束。

第二，它在 CASP13 中显著超过传统方法，证明 learned pair constraints 可以带来结构预测跃迁。

第三，它为后续 AF2 的 pair representation 和端到端结构模块奠定了问题表述基础。

## 局限

AlphaFold1 仍然是 “预测约束 + 优化结构” 的路线，模块之间不如 AF2/AF3 端到端。对我们做 TOPG 来说，它更像历史铺垫，不是直接可复用主架构。

## 和其他论文的关系

AlphaFold2 继承了 pairwise relation 的重要性，但把模型改造成 end-to-end differentiable 的 single/pair representation、Evoformer 和 structure module。AlphaFold3 进一步扩展到多分子 token、Pairformer 和 diffusion-based structure generation。

## 对多智能体任务规划模型的启发

TOPG 可以从 AlphaFold1 借鉴 “关系约束先行” 的思想：先预测 task-task、task-skill、task-location、agent-skill 等 pairwise compatibility 或 dependency potential，再由生成/优化模块形成完整 task graph。

## 可复用模块

distance_distribution_prediction、pairwise_constraint_potential、structure_refinement_from_pair_constraints。

## 证据与风险

Nature 论文报告 AlphaFold 在 CASP13 中对 free modelling domains 有明显领先。风险是这个证据来自蛋白结构预测，不能直接推出 TOPG 规划成功；迁移时只能借鉴表示和优化范式。

## 开放问题

TOPG 的 pairwise potential 是否应该显式建成可解释的打分矩阵，还是作为 neural pair representation 留在模型内部。
