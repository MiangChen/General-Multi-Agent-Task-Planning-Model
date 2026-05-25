---
id: graph-generation
type: topic
title: Graph Generation
tags: [graph generation, discrete diffusion, DAG generation, task graph, TOPG]
---

# Graph Generation

这个类收集“生成图本身”的方法论文，重点不是用 GNN 在已有图上做分类/预测，而是从条件输入中生成 node、edge、attribute 和依赖结构。

对 TOPG 来说，Graph Generation 是从 LLM 生成 JSON 计划走向可训练 task graph generator 的方法线。

## 为什么单独成类

- D3PM 解决离散 category / token 如何 diffusion。
- DiGress 把离散 diffusion 用到 graph 上，让 node 和 edge 同时扩散。
- LayerDAG 把 autoregression 和 diffusion 结合起来，一层一层生成 DAG，比一次性生成整张图更适合有时序依赖的任务图。

## 对 TOPG 的价值

- 把任务规划表示成 typed graph，而不是文本步骤列表。
- 同时生成 task node、dependency edge、resource edge、skill label 和 grounding attribute。
- 用 diffusion 处理不确定性和多候选计划。
- 用 DAG / layerwise generation 保证前置依赖和可并行层结构。

## 方法线

```text
DDPM
  -> D3PM: continuous diffusion -> discrete category/token diffusion
  -> DiGress: discrete token diffusion -> joint node/edge graph diffusion
  -> LayerDAG: graph diffusion -> autoregressive layerwise DAG generation
```

## 关键论文

- [[2021-d3pm-structured-denoising-diffusion-discrete-state-spaces]]
- [[2022-digress-discrete-denoising-diffusion-graph-generation]]
- [[2025-layerdag-diffusion-dag-generation]]

## 需要补的空白

下一步需要把 graph generation 从 benchmark graph 迁移到 task graph schema：节点类型、边类型、方向性、无环性、资源约束、机器人能力和执行反馈都要进入生成过程。
