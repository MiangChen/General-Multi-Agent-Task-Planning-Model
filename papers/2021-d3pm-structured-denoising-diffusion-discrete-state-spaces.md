---
id: 2021-d3pm-structured-denoising-diffusion-discrete-state-spaces
title: "Structured Denoising Diffusion Models in Discrete State-Spaces"
short_title: D3PM
year: 2021
published: 2021-07
venue: NeurIPS 2021
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: discrete_denoising_diffusion
primary_domain: Diffusion
domains: [Diffusion, Discrete Generation, Graph Generation, Generative Model]
primary_technical_layer: discrete_diffusion
primary_task_family: discrete_state_space_diffusion
platform: categorical_token_generation
planning_relevance: D3PM 把连续 diffusion 推广到离散 category / token 状态空间：前向过程不再加高斯噪声，而是用状态转移矩阵 Q_t 把 token 逐步 corrupt；反向过程用模型预测 x_t 更像哪个 x_0，再结合离散后验得到 x_{t-1}。对 TOPG 来说，这是把 DDPM 思想迁移到 task node、edge type、skill label、location token 和 graph slot 的关键基础。
multi_robot_relevance: 多机器人任务规划中的任务类型、机器人能力、依赖边、资源约束大多是离散符号。D3PM 提供了把这些符号作为 category/token 进行扩散建模的基础机制。
system_roles: [diffusion_foundation, discrete_denoiser, graph_token_generator, task_graph_generator]
reusable_modules: [categorical_state_space, transition_matrix_forward_process, discrete_corruption_kernel, x0_prediction_parameterization, posterior_reverse_kernel, absorbing_state_diffusion]
evidence_level: paper_read
next_action: map_d3pm_to_task_graph_tokens
tags: [D3PM, discrete diffusion, categorical diffusion, token diffusion, transition matrix, NeurIPS 2021]
authors: [Jacob Austin, Daniel D. Johnson, Jonathan Ho, Daniel Tarlow, Rianne van den Berg]
institutions: [Google Research, Brain Team]
doi: 10.48550/arXiv.2107.03006
arxiv: 2107.03006
url: https://proceedings.neurips.cc/paper/2021/hash/958c530554f78bcd8e97125b70e6973d-Abstract.html
project_url:
pdf_path: pdfs/2021-07-01-D3PM-structured-denoising-diffusion-discrete-state-spaces.pdf
image_url:
zotero_key:
citekey: austin2021d3pm
cites: [2020-ddpm-denoising-diffusion-probabilistic-models, 2020-score-sde-score-based-generative-modeling-sde]
extends: [2020-ddpm-denoising-diffusion-probabilistic-models]
uses: []
enables: [2025-layerdag-diffusion-dag-generation]
complements: [2021-improved-ddpm-improved-denoising-diffusion-probabilistic-models]
contrasts: []
---

## 一句话结论

D3PM 是把 continuous diffusion 推进到 discrete category / token state space 的关键论文：它把高斯加噪换成离散状态转移矩阵，把“预测噪声”改成“预测原始 token / category”，从而让 diffusion 可以处理文本 token、离散图节点、边类型等符号对象。

正式发表信息：论文 arXiv 版本是 `2107.03006`，正式会议为 **NeurIPS 2021**。

## 研究问题

DDPM 的原始形式主要面向连续空间，例如图像像素或连续 latent。可是很多重要生成对象天然是离散的：文本 token、类别标签、离散图节点类型、边类型、mask 状态、任务类型和机器人 skill label。

D3PM 关心的问题是：能不能保留 diffusion 的逐步 corruption / denoising 思想，但把状态空间从连续值改成有限 category / token 集合。

对 TOPG 来说，这正好对应 task graph generation 的基础问题：任务节点、依赖边、资源约束和机器人能力都不是连续像素，而是 typed discrete symbols。

## 方法

D3PM 需要先定义原始的离散 category / token 空间。也就是说，模型不是在连续实数上加噪，而是先约定：

```text
x_0 in {1, 2, ..., K}
```

这里的 `K` 可以是词表大小、类别数，也可以迁移成 TOPG 里的 task type、edge type、skill token、location bucket 或 graph slot state。

前向过程用状态转移矩阵 `Q_t` 进行离散 corruption：

```text
q(x_t | x_{t-1}) = Cat(x_t; p = x_{t-1} Q_t)
```

如果把 token 写成 one-hot 向量，`Q_t` 就定义了一个 category 在第 `t` 步会以什么概率变成另一个 category。连续 DDPM 里是“加高斯噪声”，D3PM 里是“按矩阵转移到别的 token / mask / uniform category”。

多步前向过程可以合并成累积转移矩阵：

```text
q(x_t | x_0) = Cat(x_t; p = x_0 \bar{Q}_t)
```

其中：

```text
\bar{Q}_t = Q_1 Q_2 ... Q_t
```

反向过程的关键不是直接凭空猜 `x_{t-1}`，而是先预测当前 `x_t` 更像哪个原始 `x_0`。模型输出：

```text
p_theta(x_0 | x_t)
```

然后把这个预测和离散后验结合，得到反向一步：

```text
p_theta(x_{t-1} | x_t)
  = sum_{x_0} q(x_{t-1} | x_t, x_0) p_theta(x_0 | x_t)
```

直觉上就是：先问“这个被污染的 token 最可能来自哪个干净 token”，再根据前向矩阵推导出的后验，决定上一时刻 `x_{t-1}` 应该是什么。

## 关键贡献

- 把 DDPM 的连续加噪过程推广到有限离散状态空间。
- 用状态转移矩阵 `Q_t` 表示 forward corruption，使 token/category 的噪声过程可设计、可解释。
- 支持多种 corruption kernel，例如 uniform transition、absorbing / mask state transition、nearest-neighbor-like transition。
- 采用 `x_0` prediction parameterization：先预测干净 token 分布，再通过离散后验得到 `x_{t-1}`。
- 为后续文本 diffusion、离散 graph diffusion、LayerDAG 这类离散结构生成提供基础。

## 局限

D3PM 本身不是 graph planning 论文，也不直接处理 DAG constraint、任务依赖合法性、资源约束或多机器人执行反馈。它主要解决“离散状态怎么 diffusion”的底层建模问题。

如果直接把每个 task graph slot 当成独立 token，会丢失图结构约束；如果把 edge type 也做 token diffusion，则还需要额外保证 DAG、连通性、前置依赖和执行可行性。

## 和其他论文的关系

DDPM 给出连续 diffusion 的基本框架，D3PM 把这个框架改造成离散 token/category 的状态转移过程。

Score SDE 提供连续 score / SDE 统一视角；D3PM 走的是离散转移矩阵路线。二者都在解释“从噪声逐步回到数据”，但数学对象不同。

LayerDAG 可以看成 D3PM 思想在 DAG generation 里的后续应用之一：节点属性和边都可以用离散 diffusion / categorical denoising 处理，只是 LayerDAG 额外加入了 layerwise DAG 结构约束。

## 对多智能体任务规划模型的启发

TOPG 可以先把任务规划图拆成离散 token 空间：

```text
task node type
skill requirement
agent capability
location / object token
dependency edge type
resource constraint type
execution status token
```

然后用 D3PM 式前向过程 corrupt 这些 token：

```text
clean task graph tokens
  -> Q_t transition / mask / random category
  -> noisy task graph tokens
  -> predict p_theta(x_0 | x_t, language, scene, agents)
  -> posterior step to x_{t-1}
  -> valid task graph
```

这里最关键的是 `Q_t` 不能随便设。TOPG 可以为不同对象设计不同 transition matrix：task type 可以往语义近邻转，edge type 可以先转 mask，再转 random；agent allocation 可以按 capability-compatible categories 做转移。

## 可复用模块

categorical state space、transition matrix forward process、discrete corruption kernel、`x_0` prediction parameterization、posterior reverse kernel、absorbing state diffusion。

## 证据与风险

证据来自 NeurIPS 2021 正式发表论文和 arXiv `2107.03006`。PDF 已保存为本地 arXiv 版本：`pdfs/2021-07-01-D3PM-structured-denoising-diffusion-discrete-state-spaces.pdf`。

风险在于：D3PM 解决的是单个或序列离散 token 的扩散机制。task graph generation 还需要结构层约束，例如节点数量、边合法性、DAG acyclicity、并行层、资源互斥和执行状态一致性。D3PM 是底层 token diffusion，不是完整 graph planner。

## 开放问题

TOPG 的第一版离散 diffusion 应该用 absorbing mask kernel，还是用语义相似的 transition matrix。mask kernel 更简单，语义 transition 更贴近 task/skill ontology，但需要先定义可靠的离散类别相似度。
