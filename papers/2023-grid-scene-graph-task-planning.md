---
id: 2023-grid-scene-graph-task-planning
title: "GRID: Scene-Graph-based Instruction-driven Robotic Task Planning"
short_title: GRID
year: 2023
published: 2023-09
venue: arXiv 2023
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: scene_graph_task_planning
primary_domain: Scene Graph
domains: [Scene Graph, GNN, LLM]
primary_technical_layer: scene_graph_grounding
primary_task_family: instruction_driven_task_planning
platform: large_scene_robot_planning
planning_relevance: GRID 用 scene graph 替代单张图像作为全局环境表示，再用 LLM 编码节点语义、GAT 融合 instruction 与 node/edge 信息，最后由 task decoder 生成机器人动作和目标物体，是大场景指令驱动任务规划的直接参考。
multi_robot_relevance: 虽然论文主要验证单机器人任务规划，但 robot graph + scene graph 的接口可以扩展到多机器人：把机器人能力、位置和可执行动作作为 robot graph，把场景物体和关系作为 scene graph，再由上层 planner 做任务分解与分配。
system_roles: [semantic_planner, graph_encoder, task_allocator, planner_baseline]
reusable_modules: [scene_graph_representation, llm_node_tokenization, instruction_conditioned_gat, instruction_feature_enhancer, robot_scene_graph_decoder]
evidence_level: paper_read
next_action: extract_scene_graph_planner
tags: [Scene Graph, GNN, LLM, scene graph, robotic task planning, instruction following, graph attention]
authors: [Zhe Ni, Xiaoxin Deng, Cong Tai, Xinyue Zhu, Qinghongbing Xie, Weihang Huang, Xiang Wu, Long Zeng]
institutions: [Tsinghua University, Shenzhen Pudu Technology Inc.]
doi:
arxiv: 2309.07726
url: https://arxiv.org/abs/2309.07726
project_url: https://jackyzengl.github.io/GRID.github.io/
pdf_path: pdfs/2023-09-01-GRID-scene-graph-task-planning.pdf
image_url:
zotero_key:
citekey: ni2023grid
cites: []
extends: []
uses: [2021-hierarchical-scene-graph-navigation-gnn, 2023-combinatorial-optimization-gnn-reasoning]
enables: []
contrasts: []
---

## 一句话结论

GRID 的核心价值是：把大场景机器人任务规划从“看一张局部图片再问 LLM”改成“把环境表示成 scene graph，再用 instruction-conditioned GNN 选择与任务相关的物体、关系和动作”。

## 研究问题

LLM 做机器人任务规划时，需要同时理解用户指令和环境语义。直接把图片喂给多模态模型有两个问题：第一，图片观察范围有限，容易看不到全局场景；第二，多模态训练成本高，且模型很大。

GRID 关心的问题是：能不能用更结构化、更轻量的 scene graph 表达大场景信息，让机器人根据自然语言指令逐步分解子任务。

## 方法

论文提出 Graph-based Robotic Instruction Decomposer，也就是 GRID。它的输入包括 instruction、scene graph 和 robot graph，输出是一系列子任务，每个子任务由预定义机器人动作和目标物体组成。

它的关键流程可以拆成四步：

1. **Scene graph 表示环境**：节点表示物体、房间、桌子、杯子等实体，边表示 on、in、beside 等空间或语义关系。这样机器人不只看到一个局部图像，而是拿到整张大场景的结构化地图。
2. **LLM 编码节点 token**：图网络中的 node 首先经过 LLM，变成带语义知识的 node token。相比只用 one-hot 或类别 id，这一步让节点携带更多自然语言语义。
3. **GAT 融合 instruction 与 graph**：Graph Attention Network 会把 node token 和 instruction token 拼接，并融入 node/edge 信息。第一轮重点关注和 instruction 有关的节点与边，例如把“水杯”理解成“在桌子上的水杯”。
4. **Feature enhancer 与 task decoder**：feature enhancer 根据 instruction token 再次增强图中相关节点的 attention；最后 task decoder 结合 robot graph 和 scene graph，生成机器人需要执行的动作以及要操作的目标物体。

## 关键贡献

GRID 把机器人任务规划里的环境理解从 raw image 推向 scene graph。它不是让 LLM 独自“想象”场景，而是先给 LLM/GNN 一个结构化的环境图，再让模型在图上做 instruction-conditioned attention。

这有三个直接好处：

- 场景范围更大：scene graph 能覆盖房间、家具、物体和关系，不受单张图像视野限制。
- 语义 grounding 更明确：节点和边让“物体是什么、在哪里、和谁有关”变成显式结构。
- 规划输出更可控：task decoder 输出的是预定义动作和目标物体，而不是自由文本计划，更容易接机器人执行接口。

## 阅读高光

最值得拿出来讲的是它的“水杯”例子：模型不是只看到一个孤立的 cup node，而是通过 GAT 和 edge 信息把它提升成“在桌子上的水杯”。这一步很关键，因为机器人真正需要操作的不是抽象物体类别，而是处在具体空间关系里的目标实例。

这和我们做多智能体任务规划的需求很像。上层 goal 不能直接变成动作，必须先 grounding 到场景中的对象、位置、约束和可执行动作。

## 局限

GRID 依赖已有或可生成的 scene graph。如果场景图本身漏检、关系错误或更新不及时，planner 会在错误结构上做推理。

它也不是 VLA 或 WAM 执行器，不负责学习连续控制动作。论文输出的是预定义动作和目标物体，真正执行还需要底层导航、抓取、避障或操作策略。

另外，论文主要验证单机器人任务规划。要用于多机器人系统，还需要加入 agent-agent 关系、能力约束、通信约束、任务分配和冲突消解。

## 和其他论文的关系

和 CO + GNN Survey 相比，GRID 是一个具体的机器人任务规划实例：综述解释 GNN 适合做结构化推理和求解器辅助，GRID 则把图推理落到 scene graph grounding 与 instruction-driven subtask decoding。

和 GMATANN 相比，GRID 更靠近自然语言和场景语义，负责把 instruction 变成 grounded subtask；GMATANN 更靠近多机器人任务分配，负责在 agent-task graph 上做 allocation。

和 GenSwarm 相比，GRID 可以放在 GenSwarm 前面或旁边：GenSwarm 更像 language-to-code policy generator，GRID 更像 scene-aware task decomposer，负责告诉系统“要操作哪个物体、执行哪类动作”。

## 对多智能体任务规划模型的启发

如果我们要做 General Multi-Agent Task Planning Model，GRID 提醒我们必须保留一个显式 world / scene representation 层。比较稳的架构是：

```text
Language goal
  -> scene graph / object-relation graph
  -> instruction-conditioned graph encoder
  -> grounded subtask sequence
  -> multi-agent task allocation
  -> VLA / WAM / diffusion executor
```

也就是说，scene graph 不是一个可有可无的可视化材料，而是 planner 能够严肃 grounding 的中间表示。

## 可复用模块

scene graph representation、LLM node tokenization、instruction-conditioned GAT、instruction-aware feature enhancer、robot graph + scene graph task decoder。

## 证据与风险

论文报告 GRID 在 subtask accuracy 上超过 GPT-4 25.4%，task accuracy 上超过 GPT-4 43.6%，并达到 0.11s per inference 的实时推理速度；在 unseen scenes 和不同物体数量场景上，task accuracy 最大下降 3.8%，说明 scene graph 路线有较好的跨场景泛化。

风险在于这些结果依赖数据构造流程、预定义动作集合和 scene graph 质量。对真实多机器人系统来说，还必须验证 scene graph 更新延迟、动态物体、机器人之间的冲突，以及底层执行失败如何反馈给 planner。

## 开放问题

- Scene graph 应该由视觉模型实时生成，还是由 SLAM / semantic map / human annotation 组合维护？
- 多机器人版本里，robot graph 应该包含哪些字段：位置、能力、电量、负载、通信质量、当前任务还是可用动作集合？
- GRID 输出的子任务如何与 GMATANN 这类 task allocator 对接？
- 当底层执行失败时，scene graph 和 task decoder 应该如何更新计划？
