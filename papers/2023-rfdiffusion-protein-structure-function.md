---
id: 2023-rfdiffusion-protein-structure-function
title: "De novo design of protein structure and function with RFdiffusion"
short_title: RFdiffusion
year: 2023
published: 2023-07
venue: Nature
status: read
scope: candidate
readiness: high
action: extract_structure_first_generation
tech_paradigm: protein_backbone_diffusion_generation
primary_domain: Structure Generation
domains: [Structure Generation, Scientific AI, Diffusion, Pair Representation]
primary_technical_layer: structure_generation
primary_task_family: de_novo_protein_backbone_design
platform: protein_design
planning_relevance: RFdiffusion 是 TOPG “先生成结构，再补全执行细节” 思路的重要参考。它从约束、motif 或噪声 backbone 出发，用 diffusion 生成可设计的蛋白结构；TOPG 可类比为从 intent/scene/agent/skill 条件出发生成 task graph scaffold，再补全 skill、agent、location 和 temporal fields。
multi_robot_relevance: 间接但架构价值高。它提示多机器人任务规划可以先生成满足约束的任务图骨架，再由 allocation/scheduling/executor 模块补全具体机器人、时间和动作参数。
system_roles: [structure_generator, diffusion_generator, architecture_reference, graph_prior_model]
reusable_modules: [structure_first_generation, motif_conditioned_diffusion, scaffold_generation, denoising_trajectory, constraint_conditioning]
evidence_level: paper_read
next_action: map_rfdiffusion_scaffold_to_topg_task_graph_scaffold
tags: [RFdiffusion, RoseTTAFold, protein design, diffusion, structure generation, scaffold generation, motif conditioning]
authors: [Joseph L. Watson, David Juergens, Nathaniel R. Bennett, Brian L. Trippe, Jason Yim, Helen E. Eisenach, Woody Ahern, Andrew J. Borst, Robert J. Ragotte, Lukas F. Milles, Basile I. M. Wicky, Nikita Hanikel, Samuel J. Pellock, Alexis Courbet, William Sheffler, Jue Wang, Preetham Venkatesh, Iva Sappington, Susana Vázquez Torres, Anna Lauko, Valentin De Bortoli, Emile Mathieu, Regina Barzilay, Tommi S. Jaakkola, Frank DiMaio, Minkyung Baek, David Baker]
institutions: [University of Washington, Institute for Protein Design, Massachusetts Institute of Technology]
doi: 10.1038/s41586-023-06415-8
arxiv:
url: https://www.nature.com/articles/s41586-023-06415-8
project_url: https://github.com/RosettaCommons/RFdiffusion
image_url:
zotero_key:
citekey: watson2023rfdiffusion
cites: [2021-alphafold2-highly-accurate-structure-prediction]
extends: []
uses: [2021-alphafold2-highly-accurate-structure-prediction]
enables: [2024-alphafold3-biomolecular-interactions]
complements: [2025-layerdag-diffusion-dag-generation]
contrasts: []
---

## 一句话结论

RFdiffusion 是 “结构先行” 生成范式的关键参考：它不是先生成蛋白序列，而是先用 diffusion 生成满足 motif、拓扑或功能约束的 protein backbone，再把序列设计和实验验证接在后面。

## 研究问题

蛋白设计不只是预测一个已知序列会折叠成什么结构，还要从功能目标出发设计一个新的结构。传统路线依赖人工 scaffold 搜索、物理采样和大量筛选，难以稳定生成复杂拓扑或功能位点约束下的新结构。

RFdiffusion 关心的问题是：能不能把 RoseTTAFold 学到的结构先验转成 diffusion 生成器，让模型从噪声结构逐步去噪，生成满足条件的新蛋白 backbone。

## 方法

RFdiffusion 在蛋白 backbone 结构上做去噪生成。输入可以是纯噪声，也可以包含固定 motif、对称约束、binder target 或 partial structure。模型在多个 diffusion step 中逐步修正坐标和结构关系，最终输出一个 protein backbone scaffold。

生成 backbone 后，系统通常再用 ProteinMPNN 等序列设计模型为 backbone 填充 amino acid sequence，并通过 AlphaFold/RoseTTAFold 预测和实验筛选验证结构是否可靠。

## 关键贡献

第一，它把 RoseTTAFold 的结构建模能力转成 de novo protein structure generator，而不只是 structure predictor。

第二，它让 motif scaffolding、binder design、symmetric oligomer design 等任务进入统一 diffusion 框架。

第三，它展示了 “先生成结构 scaffold，再补全序列和功能细节” 的实用路线，这一点对 TOPG 很重要。

## 局限

RFdiffusion 的输出是三维蛋白 backbone，强依赖蛋白几何、氨基酸物理约束和训练数据。TOPG 的输出是离散 typed planning graph，不能照搬坐标扩散和蛋白结构约束。

此外，RFdiffusion 后面仍需要序列设计、结构预测和实验筛选。类比到 TOPG，生成 task graph scaffold 后也必须接 allocation、scheduling、constraint checking 和 execution feedback。

## 和其他论文的关系

和 AlphaFold2 相比，RFdiffusion 更偏生成而不是预测：AF2 从序列到结构，RFdiffusion 从约束/噪声到新结构 scaffold。

和 AlphaFold3 相比，RFdiffusion 更早地展示了 diffusion 在结构生成里的设计能力；AF3 则把 diffusion structure module 放进更统一的 biomolecular interaction prediction 框架。

和 LayerDAG 相比，RFdiffusion 生成连续几何 scaffold，LayerDAG 生成离散 DAG。TOPG 可以把两者结合：RFdiffusion-style structure-first denoising + LayerDAG-style valid dependency graph generation。

## 对多智能体任务规划模型的启发

TOPG 可以借鉴 RFdiffusion 的两阶段思想：

```text
language / scene / agent / skill constraints
  -> generate task graph scaffold
  -> fill skill, agent, location, duration fields
  -> allocation / scheduling / constraint checking
  -> execution feedback and local re-denoising
```

也就是说，第一阶段不急着预测每个机器人和每个时间点，而是先生成一个可解释、可修复、可评估的任务结构骨架。

## 可复用模块

structure_first_generation、motif_conditioned_diffusion、scaffold_generation、constraint_conditioning、denoising_trajectory。

## 证据与风险

Nature 论文展示 RFdiffusion 可用于多类蛋白设计任务，并结合后续设计与验证流程得到可工作的结构。风险是证据来自蛋白工程，不代表 TOPG 一定能提升任务规划成功率；迁移价值主要在结构先行、约束条件化和多步去噪生成范式。

## 开放问题

TOPG 的 “motif” 应该是什么：固定关键任务节点、必须保留的 scene grounding、用户指定的安全约束，还是 repair_context 中不能改动的 previous plan fragment。
