---
id: 2024-seadag-semi-autoregressive-diffusion-dag-generation
title: "SeaDAG: Semi-Autoregressive Diffusion for Conditional Directed Acyclic Graph Generation"
short_title: SeaDAG
year: 2024
published: 2024-10
venue: arXiv
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: semi_autoregressive_diffusion_dag_generation
primary_domain: Diffusion
domains: [Diffusion, Graph Generation, Task Graph, Planning]
primary_technical_layer: task_graph_generation
primary_task_family: conditional_dag_diffusion_generation
platform: directed_acyclic_graph_generation
planning_relevance: SeaDAG 的关键启发不是要求提前知道完整 task graph，而是让不同 DAG layer 以不同速度去噪，使当前层在决策时既能看见较清晰的历史层，也能参考仍然 noisy 的未来层。对 TOPG 来说，这提供了一种淡化严格逐层 LayerDAG 的方案：先构思粗糙后续 layer，再用它辅助当前 layer 去噪。
multi_robot_relevance: 多机器人任务规划通常无法提前定义完整任务图，但可以维护一个粗糙的未来任务层草图，包括可能的子任务、资源冲突、协作约束和目标状态。SeaDAG 的半自回归 diffusion 思路可以把这些 future sketch 作为低清晰度条件，让当前任务层生成更少短视。
system_roles: [task_graph_generator, generative_planner, graph_prior_model, conditional_dag_generator, future_sketch_planner]
reusable_modules: [layerwise_denoising_speed, complete_noisy_graph_state, local_timestep_mapping, semi_autoregressive_dag_diffusion, condition_loss, graph_property_decoder, future_layer_sketch_conditioning]
evidence_level: paper_read
next_action: design_future_sketch_layer_for_topg
tags: [SeaDAG, Diffusion, DAG generation, Task Graph, semi-autoregressive diffusion, conditional generation, future sketch]
authors: [Xinyi Zhou, Xing Li, Yingzhao Lian, Yiwen Wang, Lei Chen, Mingxuan Yuan, Jianye Hao, Guangyong Chen, Pheng Ann Heng]
institutions: [The Chinese University of Hong Kong, Huawei Noah's Ark Lab, Zhejiang Lab]
doi:
arxiv: 2410.16119
url: https://arxiv.org/abs/2410.16119
project_url:
pdf_path: pdfs/2024-10-21-SeaDAG-semi-autoregressive-diffusion-dag-generation.pdf
image_url:
zotero_key:
citekey: zhou2024seadag
cites: [2020-ddpm-denoising-diffusion-probabilistic-models, 2021-d3pm-structured-denoising-diffusion-discrete-state-spaces]
extends: [2021-d3pm-structured-denoising-diffusion-discrete-state-spaces]
uses: [2020-ddpm-denoising-diffusion-probabilistic-models]
enables: [2025-layerdag-diffusion-dag-generation]
complements: [2025-layerdag-diffusion-dag-generation]
contrasts: [2023-unsupervised-task-graph-generation]
---

## 一句话结论

SeaDAG 是一篇很适合放在 LayerDAG 旁边读的 DAG diffusion 论文：它不是严格一层一层生成，而是在每个 diffusion step 都维护完整图，只是让不同 layer 以不同速度从 noisy 变 clean，从而模拟 semi-autoregressive generation。

对我们的 task graph 方向，最重要的启发是：即使未来完整任务图不可知，也可以先生成一个粗糙的后续 layer 草图，让当前 layer 的去噪不只依赖过去结构，也能参考低置信度的未来结构。

## 研究问题

DAG 生成比一般图生成更难，因为 DAG 有方向性、层级结构和跨层依赖。严格 autoregressive 方法可以按部分生成，但会带来三个问题。

第一，part-by-part generation 会阻断后续层到前面层的信息流。当前层一旦生成完，后续结构很难反过来影响它。

第二，严格 AR 方法直到最后才有完整图视图。对于 conditional DAG generation，这很麻烦，因为很多属性、功能或约束必须在完整图上才能检查。

第三，很多条件图生成方法只在采样时加 guidance，而不是在训练时显式学习 condition。这样容易在图真实性和条件满足之间摇摆。

SeaDAG 的问题是：能不能保留 DAG 层级生成的好处，同时在每个 diffusion step 都保留完整图视图，让全图属性和条件学习可以提前进入训练。

## 方法

SeaDAG 的核心是 layer-wise semi-autoregressive diffusion。

它先把 DAG 看成带层级的结构，每个节点有自己的 level。然后在同一个全局 diffusion timestep `t` 下，为不同 layer 分配不同的 local timestep：

```text
tau_i^t = T(t, l_i)
```

这里 `l_i` 是节点所在层级，`tau_i^t` 是该节点自己的 local timestep。不同层的 `tau` 不同，就意味着它们处在不同噪声水平。

直觉上：

```text
完整 noisy graph 一直存在
不同 layer 去噪速度不同
较 clean 的 layer 可以给较 noisy 的 layer 提供条件
```

这和严格 LayerDAG 很不一样。LayerDAG 更像：

```text
已生成历史层 -> 生成下一层 -> 接回历史图
```

SeaDAG 更像：

```text
完整图画布一直存在
过去层 / 当前层 / 未来层清晰度不同
消息可以在不同清晰度的 layer 之间流动
```

## 条件学习

SeaDAG 不只是采样时用 condition guidance。它在训练时加入 graph property decoder，用预测出的 clean graph 去估计目标属性，并把条件损失放进训练目标：

```text
f_theta(G_t, c) = (p_theta(X), p_theta(E))
```

```text
L(theta) = L_graph + lambda L_cond
```

其中 `L_graph` 让生成图接近真实 DAG，`L_cond` 让图满足指定条件。论文在 AIG circuit generation 和 molecule generation 上验证这个设计。

## 关键贡献

- 提出 semi-autoregressive DAG diffusion：所有 layer 同时演化，但以不同速度去噪。
- 在每个 diffusion step 都维护完整图视图，避免严格 AR 方法直到最后才看到全图。
- 用 local timestep mapping 把一个全局时间转换成每层自己的噪声水平。
- 在训练中引入 condition loss，让模型显式学习 graph structure 和 condition/property 的关系。
- 对 conditional DAG generation 给出一个介于 one-shot graph diffusion 和 strict autoregressive generation 之间的折中方案。

## 局限

SeaDAG 默认采样时可以确定一个完整图画布，包括 level 数、每层 node 数和节点 level。论文中会从训练集分布采样这些结构先验，再在这个画布上去噪。

这对电路 DAG 或 junction-tree molecule DAG 是合理的，但对开放世界多机器人任务规划不完全成立。真实 task graph 往往一边感知、一边分解、一边执行，后续 node 可能还没有被发现，资源冲突和失败恢复也会动态改变图结构。

因此 SeaDAG 不能直接等价成“提前知道完整任务图再扩散”。真正可迁移的是它的不同清晰度层级交互机制。

## 和其他论文的关系

DDPM 提供基础去噪生成范式：训练时加噪，推理时逐步去噪。D3PM 把这个思想搬到离散 category/token 状态空间，使节点类型和边类型这类离散对象可以被 diffusion 建模。

LayerDAG 和 SeaDAG 都关注 DAG generation，但二者的生成哲学不同。

LayerDAG 更强调严格 layerwise autoregressive decomposition：已经生成的前缀图决定下一层，天然保证 DAG 方向性。

SeaDAG 更强调 semi-autoregressive global view：完整图一直存在，只是不同 layer 清晰度不同，因此当前层可以参考已经较 clean 的层，也能被 noisy 的后续层影响。

对 TOPG 来说，LayerDAG 适合作为“合法 DAG 生成”的强结构 baseline；SeaDAG 更适合作为“当前层与未来粗草图共同去噪”的灵感来源。

## 对多智能体任务规划模型的启发

用户 note 里的关键点可以整理成一个 TOPG 设计方向：

```text
past confirmed layers
  + current layer under denoising
  + rough future layer sketch
  -> denoise current task graph layer
```

也就是说，我们不必强制执行“必须先完整生成第 1 层，再生成第 2 层，再生成第 3 层”的 LayerDAG 思路。对于真实任务规划，模型可以先构思一个粗糙后续 layer：

- 后续可能出现的子任务
- 可能的资源占用或空间冲突
- 多机器人协作点
- 目标状态或验证节点
- 潜在失败恢复分支

这些未来 layer 不需要是 clean graph，也不需要完全正确。它们可以只是 low-confidence / noisy sketch。当前 layer 在去噪时同时接收：

```text
已确定历史结构
当前观测和语言目标
粗糙未来层草图
机器人能力和资源状态
```

这样，当前 layer 的生成会少一些短视。例如当前选择某个子任务顺序时，可以提前感知后续可能出现的资源竞争、协同需求或验证步骤。

这会把 TOPG 从严格逐层扩散放松成：

```text
局部层逐渐变清晰
未来层先以低清晰度参与条件
执行反馈再不断修正后续 sketch
```

## 可复用模块

layerwise denoising speed、complete noisy graph state、local timestep mapping、semi-autoregressive DAG diffusion、condition loss、graph property decoder、future layer sketch conditioning。

## 证据与风险

证据来自 SeaDAG 论文对 conditional DAG generation 的实验，包括 AIG circuit generation from truth tables 和 molecule generation based on quantum properties。论文报告 semi-autoregressive diffusion 能更好平衡图真实性与条件满足。

风险是 SeaDAG 的实验对象不是机器人任务规划，且依赖可预设的 DAG level/node canvas。迁移到 TOPG 时，不能假设完整 future task graph 已知；应该把 future layer 当成可修正的 latent sketch，而不是硬约束。

## 开放问题

TOPG 里的 future sketch 应该如何产生：由 LLM 先草拟、由 denoiser 自回归预测、由 world model rollout 给出，还是由执行反馈不断维护。

future sketch 应该参与哪些变量的去噪：task node、dependency edge、allocation hint、resource conflict edge、time window，还是 failure recovery branch。

如果未来 sketch 是错的，模型应该如何降低它的权重，避免当前 layer 被错误未来牵着走。
