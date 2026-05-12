---
id: structure-generation
type: topic
title: Structure Generation / Structured Prediction
tags: [AlphaFold, structure generation, pair representation, diffusion, scientific AI]
---

# Structure Generation / Structured Prediction

这个类不是普通的 graph generation。它关注的是：模型如何把一个复杂系统转成 tokens、pair relations 和几何/结构约束，再预测或生成一个可验证的结构对象。

AlphaFold 系列和 RFdiffusion 是这个类别的核心参考。它们的输出不是传统意义上的抽象 graph，而是蛋白质或生物分子复合体的三维结构；但其中的 residue pair、atom pair、interaction pair、motif constraint 和 scaffold 又非常接近我们在 TOPG 里需要的 typed relation representation。

## 为什么不直接叫 Graph Generation

- Graph generation 通常强调离散节点和边，例如 molecular graph、task graph、dependency graph。
- AlphaFold2/3 更强调结构生成或结构预测：节点/边关系只是中间表示，最终目标是空间结构与相互作用。
- 对 TOPG 来说，真正可迁移的是 “token + pair representation + structure denoising / refinement + confidence” 这套范式，而不是生物分子任务本身。

## 对 TOPG 的价值

- 把开放世界任务规划里的 intent、scene、agent、skill、feedback、task-slot 统一成 typed tokens。
- 用 pair representation 建模 task-scene、task-skill、task-agent、task-task、feedback-task 等关系。
- 用 denoising/refinement 方式从 noisy plan hypothesis 生成或修复 task graph。
- 用 confidence head 给 task node、grounding edge、dependency edge 和整体 plan 打分。

## 关键论文

- [[2020-alphafold-potentials-deep-learning]]
- [[2021-alphafold2-highly-accurate-structure-prediction]]
- [[2023-rfdiffusion-protein-structure-function]]
- [[2024-alphafold3-biomolecular-interactions]]

## 后续可扩展论文

- ProteinMPNN：给定结构生成序列，可作为 “结构先行、属性补全” 的两阶段范式。
- DiffDock：把 docking pose 当成几何扩散生成问题。
- GNoME / MatterGen：把材料晶体结构发现纳入 scientific structure generation。
