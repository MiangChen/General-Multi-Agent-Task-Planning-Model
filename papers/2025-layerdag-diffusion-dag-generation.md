---
id: 2025-layerdag-diffusion-dag-generation
title: "LayerDAG: A Layerwise Autoregressive Diffusion Model for Directed Acyclic Graph Generation"
short_title: LayerDAG
year: 2025
published: 2025-03
venue: ICLR 2025
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: layerwise_diffusion_dag_generation
primary_domain: Diffusion
domains: [Diffusion, Graph Generation, Task Graph, Planning]
primary_technical_layer: task_graph_generation
primary_task_family: diffusion_dag_task_graph_generation
platform: directed_acyclic_graph_generation
planning_relevance: LayerDAG 不是机器人规划论文，但它提供了用 autoregression + diffusion 生成 DAG 的核心机制：autoregression 负责一层一层生成图，diffusion 负责每层内部的 node attributes 和 cross-layer edges。相比 DiGress 一次性对整张图做 node/edge denoising，LayerDAG 更适合具备时序依赖、前置依赖和 partial order 的任务图。
multi_robot_relevance: 对多机器人任务规划来说，可以把 layer 理解为并行可执行的任务阶段，把 node attribute 映射为 robot skill / task intent，把 edge 映射为前置依赖或同步约束，再把生成出的有效 DAG 交给任务分配和调度模块。
system_roles: [task_graph_generator, generative_planner, graph_prior_model, planner_research_direction]
reusable_modules: [layerwise_dag_partition, source_task_layer_generation, discrete_diffusion_node_attributes, diffusion_edge_generation, conditional_dag_generation, cross_layer_dependency_generation]
evidence_level: paper_read
next_action: adapt_layerdag_to_multi_robot_task_graph_schema
tags: [LayerDAG, Diffusion, Graph Generation, DAG generation, Task Graph, layerwise generation, autoregressive diffusion, discrete diffusion]
authors: [Zhuo Li, Yifei Shen, Lei Chen, Mingming Sun, Wei Liu]
institutions: []
doi:
arxiv: 2411.02322
url: https://arxiv.org/abs/2411.02322
project_url: https://github.com/Graph-COM/LayerDAG
pdf_path: pdfs/2025-03-04-LayerDAG-layerwise-autoregressive-diffusion-dag-generation.pdf
image_url:
zotero_key:
citekey: li2025layerdag
cites: [2021-d3pm-structured-denoising-diffusion-discrete-state-spaces, 2022-digress-discrete-denoising-diffusion-graph-generation]
extends: [2021-d3pm-structured-denoising-diffusion-discrete-state-spaces, 2022-digress-discrete-denoising-diffusion-graph-generation]
uses: []
enables: [2025-dart-llm-dependency-aware-task-graph, 2025-lip-llm-dependency-graph-planning]
complements: [2024-seadag-semi-autoregressive-diffusion-dag-generation]
contrasts: [2023-unsupervised-task-graph-generation]
---

## 一句话结论

LayerDAG 是目前我们看到的、最接近“用 diffusion 生成 task graph”的方法论文：它用 **autoregression + diffusion** 一层一层生成 DAG，而不是像 DiGress 那样直接对整张图做一次式 node/edge diffusion，因此更适合具备时序依赖、前置依赖和 partial order 的任务规划图。

## 研究问题

DAG 广泛用于计算图、编译器 flow graph、硬件设计、项目依赖和任务依赖。普通 graph generation 方法往往不显式处理 DAG 的方向性和 partial order；纯 diffusion 一次性生成整张图，也不天然保证无环。

LayerDAG 的核心问题是：如何生成具有强方向依赖和逻辑规则的大规模 DAG，同时保留生成模型的表达能力和泛化能力。

对 TOPG 来说，这正好对应“任务规划都在 graph 上操作”时最核心的问题：任务图不是一般无向图，通常有先后顺序、并行层、前置条件和不能成环的依赖结构。

## 核心思想

作者把 DAG 重新看成一串 layerwise bipartite graphs。

第一层是 source nodes：

```text
V(1) = 没有前置依赖的节点
```

之后每一层定义为：

```text
V(l+1) = 所有前置节点都已经包含在 V(<=l) 中的节点
```

因此，如果把前面已经生成的层移除，当前层里的节点就可以看成剩余图里的 source nodes。同一层中的节点彼此不可比较，也就是它们之间不应该有有向依赖边。

边的生成也按层拆开：

```text
E(l+1) = {(u, v) in E | u in V(<=l), v in V(l+1)}
```

也就是说，第 `l+1` 层的边只从前面所有已生成层指向当前层。这样天然避免 cycle。

## 生成过程

LayerDAG 把整张图的概率拆成逐层条件生成。这里 autoregression 负责外层顺序：先生成第 1 层，再生成第 2 层，后面每层都条件于已经生成的 partial DAG。

```text
P(G) = product_l P(G(l+1) | G(<=l))
```

每一层又分成三步：

```text
P(G(l+1) | G(<=l))
  = P(|V(l+1)| | G(<=l))
  * P(X(l+1) | G(<=l), |V(l+1)|)
  * P(A(l+1) | G(<=l), X(l+1))
```

对应到自然语言：

1. 预测下一层有多少个新节点。
2. 用 diffusion 生成这一层的 node attributes。
3. 用 diffusion 生成从前面所有已生成层到当前层的 edges。

当模型预测下一层节点数为 0 时，生成终止。

所以它不是“一次性生成整张图”的 graph diffusion，而是：

```text
autoregression: 控制层级和时序展开
diffusion: 生成每层内部属性和跨层边
```

## Diffusion 在哪里

LayerDAG 不是用 diffusion 控制整个自回归过程，而是在每一层内部使用 diffusion 做多轮 refinement。

它使用两个 diffusion process：

- **Node attribute diffusion**：生成当前层节点的类别属性。
- **Edge / structure diffusion**：生成前面层到当前层的边。

在原论文里，node attributes 是计算图里的 operator type 等离散类别，因此采用 D3PM 这种离散 diffusion。迁移到 task graph 时，node attributes 可以对应：

```text
task type
robot skill type
required capability
target object / region
expected duration bucket
```

edge attributes 可以对应：

```text
precondition
synchronization
resource constraint
same-agent continuity
human approval
failure recovery
```

## 网络实现

LayerDAG 用 BiMPNN 编码已经生成的 partial DAG `G(<=l)`。BiMPNN 同时沿原始边和反向边传播信息：

```text
forward neighbors + reverse neighbors + self information
```

这让模型理解一个节点既依赖谁，也会影响谁。之后：

- 用 pooling 后的 graph representation 预测下一层节点数量。
- 用 transformer 对 noisy node attributes 做 denoising。
- 对每条候选边 `(u, v)` 拼接 `u` 的表示、`v` 的表示和 diffusion timestep，再用 MLP 预测边概率。

## 和多机器人开放世界任务规划的关系

如果迁移到多机器人 task graph，可以这样映射：

```text
LayerDAG 原论文:
node = 计算 operator
edge = 数据依赖
layer = DAG partial order 层

Multi-robot task graph:
node = task intent / robot skill
edge = task dependency / synchronization
layer = 可并行执行的任务阶段
```

输入条件可以是：

```text
task language + robot team information + scene graph
```

生成过程可以是：

```text
Layer 1: source tasks / no prerequisites
Layer 2: dependent tasks
Layer 3: executable task intents
...
```

最终输出是有效 DAG，然后交给下一个模块做 task allocation、scheduling 和 Gantt chart 生成。

## 用户笔记

本文作者使用 diffusion model 来生成 DAG 图。思路是分层：先定义 source nodes，也就是没有依赖关系的节点，作为图的起点。后续每一层是所有前置节点都已经在前面层中的节点；局部看，这些节点也像剩余图中的 source nodes。

生成过程是：先生成第几层，再生成这一层节点，再生成这一层和前面所有已生成层连接的边，每一步的概率相乘。同一层节点之间不应该有 dependency arrow，因为同层节点在 partial order 中是不可比较的，理论上可以并行。

## 关键贡献

第一，它解决了通用 graph diffusion 不天然保证 DAG 的问题。通过 layerwise autoregressive generation，边只从前面层指向当前层，因此天然无环。

第二，它避免了普通 topological ordering 不唯一的问题。LayerDAG 的 layerwise partition 是唯一的，能把一张 DAG 转成可逆的层级序列。

第三，它把 autoregressive 和 diffusion 分工清楚：autoregressive 负责生成方向和层级，diffusion 负责每一层内部 node/edge 的多轮 refinement。

第四，它支持 conditional generation，可以根据目标属性生成 DAG。这对应到我们的任务规划里，就是根据自然语言、scene graph、机器人能力和 deadline 生成符合条件的 task graph。

## 局限

LayerDAG 本身不是机器人任务规划模型。它没有处理自然语言 grounding、机器人 skill schema、执行反馈、资源约束、持续时间估计或多机器人 allocation。

它生成的是 DAG，但 task graph 在真实系统里可能还需要非前置依赖边，例如通信关系、资源冲突、协同约束、时间窗和软约束。这些边需要区分清楚，否则会破坏 DAG layer 的定义。

此外，迁移到开放世界任务规划需要训练数据：历史任务图、仿真生成任务图、人类修正任务图，或者 LLM/规则生成后再用执行反馈筛选的 task graph 数据。

## 和其他论文的关系

D3PM 解决的是离散 token/category 怎么做 diffusion。DiGress 把 D3PM 推到一般 graph generation，让 node features 和 edge features 同时扩散。LayerDAG 再往前走一步：承认很多图不是一般图，而是带方向、时序和依赖层级的 DAG，因此把 graph generation 拆成 layerwise autoregression + intra-layer diffusion。

和 DiGress 相比，LayerDAG 更适合 task graph，因为它直接面向 DAG generation，而不是一般 graph generation。

和 DART-LLM / LiP-LLM 相比，LayerDAG 不是 prompt engineering，而是一个可训练的 DAG generative model。它提供了从“LLM 输出依赖 JSON”走向“训练模型生成 task graph”的方法路线。

和 Diffusion-CCSP 相比，Diffusion-CCSP 的 graph 是输入的 constraint graph，diffusion 输出连续变量解；LayerDAG 的 diffusion 参与生成 DAG 本身。

## 对多智能体任务规划模型的启发

我们可以把未来方向定义为：

```text
Layerwise Diffusion Task Graph Generator
```

系统形式：

```text
instruction + scene graph + robot skills
  -> conditional LayerDAG generator
  -> valid task DAG
  -> task allocation / scheduling module
  -> execution feedback
  -> local re-denoising
```

这个方向比单纯 LLM prompt 生成 task graph 更有研究空间，因为它可以学习领域内常见的 dependency pattern，并支持逐层、局部、可反馈的 task graph 生成。

## 可复用模块

layerwise DAG partition、source task layer generation、discrete diffusion for node attributes、diffusion edge generation、conditional DAG generation、cross-layer dependency generation、local re-denoising。

## 证据与风险

论文在 synthetic DAG 和真实计算系统 DAG 数据上验证，能生成最多约 400 个节点的大规模 DAG，并在条件生成和 out-of-distribution label setting 中优于多个 baseline。

风险是这些实验领域是计算图和硬件/编译器 flow graph，不是机器人任务图。迁移时最关键的是设计 task graph schema 和训练数据生成机制。

## 开放问题

如何把自然语言、scene graph 和 robot skill library 编码成 LayerDAG 的 conditioning signal。

如何把 task graph 的软约束和非 DAG 关系区分开：dependency edge 保持 DAG，coordination/resource/time-window edge 作为额外约束图交给 scheduler。

如何在执行中只对受影响的局部 layer 进行 re-denoising，而不是重生成整张任务图。
