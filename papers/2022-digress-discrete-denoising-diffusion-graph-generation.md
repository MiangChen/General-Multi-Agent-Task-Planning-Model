---
id: 2022-digress-discrete-denoising-diffusion-graph-generation
title: "DiGress: Discrete Denoising diffusion for graph generation"
short_title: DiGress
year: 2022
published: 2022-09
venue: ICLR 2023 Poster
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: discrete_graph_diffusion
primary_domain: Diffusion
domains: [Diffusion, Graph Generation, Discrete Generation, Task Graph]
primary_technical_layer: graph_generation
primary_task_family: discrete_graph_diffusion_generation
platform: graph_generation
planning_relevance: DiGress 把 D3PM 的离散 diffusion 直接应用到 graph generation：node features 和 edge features 同时作为离散变量扩散，前向过程逐步破坏图，反向过程用 graph transformer 去恢复节点类型和边类型。对 TOPG 来说，这是从 token diffusion 迈向 task graph diffusion 的关键桥梁。
multi_robot_relevance: 多机器人任务规划图天然包含任务节点、依赖边、资源边、协作边和 agent/skill 属性。DiGress 提供了同时生成 node 和 edge 的离散图扩散框架，可迁移到 typed task graph 生成。
system_roles: [graph_generator, discrete_denoiser, task_graph_generator, graph_prior_model]
reusable_modules: [joint_node_edge_diffusion, discrete_graph_corruption, graph_transformer_denoiser, marginal_transition_kernel, graph_level_conditioning, molecule_planarity_metrics]
evidence_level: paper_read
next_action: adapt_digress_to_task_graph_schema
tags: [DiGress, graph diffusion, discrete diffusion, node-edge denoising, graph generation, ICLR 2023]
authors: [Clément Vignac, Igor Krawczuk, Antoine Siraudin, Bohan Wang, Volkan Cevher, Pascal Frossard]
institutions: [EPFL]
doi: 10.48550/arXiv.2209.14734
arxiv: 2209.14734
url: https://openreview.net/forum?id=UaAD-Nu86WX
project_url: https://github.com/cvignac/DiGress
pdf_path: pdfs/2022-09-01-DiGress-discrete-denoising-diffusion-graph-generation.pdf
image_url:
zotero_key:
citekey: vignac2022digress
cites: [2021-d3pm-structured-denoising-diffusion-discrete-state-spaces, 2020-ddpm-denoising-diffusion-probabilistic-models]
extends: [2021-d3pm-structured-denoising-diffusion-discrete-state-spaces]
uses: []
enables: [2025-layerdag-diffusion-dag-generation]
complements: [2020-score-sde-score-based-generative-modeling-sde]
contrasts: []
---

## 一句话结论

DiGress 是把离散 diffusion 真正推进到 graph generation 的关键论文：它让 node features 和 edge features 同时扩散、同时去噪，从而生成带节点类型和边类型的完整离散图。

正式发表信息：论文 arXiv 版本是 `2209.14734`，正式会议为 **ICLR 2023 Poster**。

## 研究问题

D3PM 说明了离散 token/category 可以做 diffusion，但 graph 不是一串独立 token。图同时有节点、边、节点属性、边属性和全局结构约束。如果只生成节点而不生成边，或者只生成邻接矩阵而不处理节点类型，生成结果就很难成为真实可用的结构对象。

DiGress 关心的问题是：如何把离散 denoising diffusion 扩展到 graph，使模型能够联合生成节点类型和边类型，并保留图结构分布。

对 TOPG 来说，这就是 task graph generation 的直接前置问题：任务规划不是生成一个 token 序列，而是生成 typed nodes + typed dependency edges。

## 方法

DiGress 把一张图表示成三类对象：

```text
X: node features
E: edge features
y: graph-level features / condition
```

其中 `X` 和 `E` 都是离散类别。节点可以是 atom type，边可以是 bond type；迁移到 TOPG 时，节点可以是 task type / skill type，边可以是 dependency / sync / resource / same-agent-continuity 等类型。

前向过程对 node 和 edge 同时做离散 corruption：

```text
q(G_t | G_{t-1})
  = q(X_t | X_{t-1}) q(E_t | E_{t-1}) q(y_t | y_{t-1})
```

直觉上，就是每一步都同时扰乱节点类别和边类别。连续 diffusion 里加的是高斯噪声，D3PM 里对 token 用转移矩阵，DiGress 则把这套离散转移扩展到整张图的 nodes 和 edges。

反向过程用 graph transformer denoiser 接收 noisy graph：

```text
(X_t, E_t, y_t)
```

然后预测干净图或前一步图的分布。模型通过 graph transformer 在节点、边和全局特征之间传递信息，因此边的预测不是独立的，节点类型也会受邻接结构和全局图条件影响。

DiGress 还强调 transition kernel 可以利用数据边际分布，而不是完全均匀地随机替换类别。这样生成过程更贴近真实图分布。

## 关键贡献

- 把离散 diffusion 从 token/category 推进到 graph generation。
- 同时扩散 node features 和 edge features，而不是只生成节点或只生成邻接矩阵。
- 使用 graph transformer 作为 denoiser，让节点、边和全局图特征交互更新。
- 用离散 transition kernel 处理 categorical node / edge corruption，可使用 marginal distribution 提高稳定性。
- 在分子图和非分子图任务上验证，成为后续 graph diffusion 和 LayerDAG 类方法的重要参考。

## 局限

DiGress 生成的是一般图，不天然保证 DAG、partial order、任务前置依赖、资源约束或可执行调度。对于 task graph，边不只是“有无连接”或 bond type，还包含方向、语义、时序和执行约束。

此外，DiGress 原始任务更偏分子图和通用图生成。TOPG 需要额外引入语言条件、场景 grounding、机器人能力、执行反馈和 graph validity checker。

## 和其他论文的关系

D3PM 解决离散 category/token 如何 diffusion；DiGress 把这个思想扩展到 graph，让 nodes 和 edges 都参与离散扩散。

Score SDE 提供连续理论视角；DiGress 更靠近我们需要的离散结构生成路线。LayerDAG 则进一步处理 DAG 的方向性和层级生成问题，可以看成 DiGress 之后更贴近 task graph 的结构约束版本。

和 LayerDAG 相比，DiGress 的优势是直接联合建模 node/edge；弱点是没有天然 DAG 保证。LayerDAG 的优势是 layerwise DAG validity；弱点是结构流程更专门。

## 对多智能体任务规划模型的启发

TOPG 可以把 DiGress 作为第一版 graph diffusion generator 的蓝本：

```text
X = task node types / skill requirements / object-location tokens
E = dependency edge types / resource edges / sync edges / handoff edges
y = language goal + scene summary + robot team profile
```

前向过程：

```text
clean task graph
  -> corrupt node categories
  -> corrupt edge categories
  -> noisy task graph
```

反向过程：

```text
graph transformer denoiser
  -> predict clean node types
  -> predict clean edge types
  -> validity repair / DAG projection
  -> executable task graph candidate
```

关键问题是：TOPG 的 edge feature 必须比分子 bond 更丰富。至少需要区分 prerequisite、parallel-sync、resource-conflict、same-agent-continuity、communication、failure-recovery 等边类型。

## 可复用模块

joint node-edge diffusion、discrete graph corruption、graph transformer denoiser、marginal transition kernel、graph-level conditioning、validity metric / graph property evaluation。

## 证据与风险

证据来自 ICLR 2023 Poster 正式发表论文、OpenReview 页面和 arXiv `2209.14734`。PDF 已保存为本地 arXiv 版本：`pdfs/2022-09-01-DiGress-discrete-denoising-diffusion-graph-generation.pdf`。

风险在于：DiGress 证明了离散图生成可行，但没有直接证明能生成可执行 task graph。TOPG 还需要方向性、无环性、调度可行性和执行反馈闭环；否则生成出来的 graph 可能像图，但不像计划。

## 开放问题

TOPG 第一版应该先用 DiGress-style joint node-edge denoising 生成一般 typed task graph，再用 DAG projection 修复；还是一开始就采用 LayerDAG-style layerwise generation 保证无环。前者实现更直接，后者结构合法性更强。
