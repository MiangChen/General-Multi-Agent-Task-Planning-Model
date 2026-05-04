---
id: 2021-hierarchical-scene-graph-navigation-gnn
title: "Hierarchical Representations and Explicit Memory: Learning Effective Navigation Policies on 3D Scene Graphs using Graph Neural Networks"
short_title: 3DSG Navigation
year: 2021
published: 2021-08
venue: ICRA 2022
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: scene_graph_navigation_policy
primary_domain: Scene Graph
domains: [Scene Graph, GNN, RL]
primary_technical_layer: hierarchical_scene_graph_memory
primary_task_family: object_search_navigation
platform: indoor_3d_navigation
planning_relevance: 这篇把 3D Dynamic Scene Graph 变成 agent-centric 的导航观测，用 action layer 显式加入离散可行动作节点，再用 GNN 聚合环境、记忆和碰撞风险，最终选择平台无关的导航动作。
multi_robot_relevance: 论文主要验证单机器人 object search，但它提供了一个很适合扩展到多机器人规划的模块：把全局 3D scene graph 压缩成每个机器人视角下的动作候选图，再让分配器或协同 planner 在 action node 上做联合决策。
system_roles: [semantic_planner, graph_encoder, memory_module, planner_baseline]
reusable_modules: [hierarchical_3d_scene_graph, action_layer_discrete_navigation, collision_checked_action_nodes, explicit_visit_memory, agent_centric_scene_graph_embedding, platform_agnostic_navigation_policy]
evidence_level: paper_read
next_action: extract_scene_graph_navigation_policy
tags: [Scene Graph, GNN, RL, 3D scene graph, dynamic scene graph, navigation, object search, explicit memory]
authors: [Zachary Ravichandran, Lisa Peng, Nathan Hughes, J. Daniel Griffith, Luca Carlone]
institutions: [MIT Lincoln Laboratory, MIT Laboratory for Information and Decision Systems]
doi: 10.1109/ICRA46639.2022.9812179
arxiv: 2108.01176
url: https://arxiv.org/abs/2108.01176
project_url: https://github.com/MIT-TESSE/dsg-rl
pdf_path: pdfs/2021-08-01-3DSG-GNN-navigation-policy.pdf
image_url:
zotero_key:
citekey: ravichandran2021hierarchical
cites: []
extends: []
uses: []
enables: []
contrasts: []
---

## 一句话结论

这篇论文的核心价值是：把分层 3D Scene Graph 变成机器人导航策略的显式空间记忆，并通过 GNN 在 action node 上做决策，而不是让策略从 RGB 或局部深度图里自己学出场景结构。

## 研究问题

机器人导航策略如果只看 raw image、depth 或 2D semantic segmentation，需要自己从低层观测里学出三维结构、拓扑关系、语义关联和历史访问记忆。这个学习负担很重，也不利于泛化到新场景。

论文的问题是：如果机器人已经有一个 3D Dynamic Scene Graph，它能不能直接在这张结构化图上学习导航策略，并利用图中显式的层级信息和访问记忆提升 object search 表现。

## 方法

作者引入分层 3D Scene Graph 作为导航策略的输入。在执行规划时，系统保留高层 node 信息，例如 room、object、place 等语义和拓扑节点，同时去掉底层 mesh node，避免低层几何过密导致图过大、消息传递低效。

关键预处理是加入一个 action layer。作者在机器人当前位置附近加入 8 个离散 action node，用来表示 8 个方向上的移动候选动作。然后通过避碰算法检查这些动作是否会和场景里的物体 node 或占据区域发生碰撞，把碰撞风险编码进动作节点，从而构成论文图 1(b) 中的 agent-centric DSG observation。

每个 node 会被编码成一个 size=10 的特征向量：

- 位置 x 3。
- 尺寸 x 3。
- 类型 x 2。
- 访问记录 x 1。
- 碰撞风险 x 1。

这个充满 10 维特征的 graph 会被送进 GNN 做消息传递。公式 1 中，v_i^t 表示当前中心节点，N(v_i^t) 表示它的邻居节点，y 是前面这组 10 维节点特征。AGG 表示每个 node 都会对邻居 node 的信息做一次聚合，论文里这个聚合过程重复 3 次。

经过消息传递后，每个 action node 已经吸收了周围场景、语义、访问历史和碰撞信息。公式 2 里的 V_a 只收集那 8 个 action node 的特征；然后把这 8 个动作特征拼接起来，输入 MLP 的 READ 模块，最终得到 y_G^t。策略基于这个图级输出选择最终动作，例如前进、左转或右转。

## 关键贡献

这篇论文把 3D Scene Graph 从“地图表示”推进到“策略输入”。它不是只把 scene graph 用来做可视化，也不是只预测 graph 上的 subgoal，而是把全局 DSG 转换成机器人中心的局部动作图，然后直接学习从图到导航动作的 policy。

它的贡献可以概括成三点：

- 用分层 3D Scene Graph 显式提供 geometry、topology 和 semantics。
- 用 explicit memory 记录访问历史，让策略知道哪些区域已经搜索过。
- 用 action node 把连续导航空间离散成可检查、可聚合、可决策的候选动作。

## 阅读高光

最漂亮的设计是 action layer。普通 scene graph 只有场景里的物体、房间、地点和关系，但策略真正要选的是“下一步往哪里走”。作者把 8 个离散动作也变成图节点，并在 GNN 消息传递前就用碰撞检测给它们加上风险信息。

这样一来，GNN 最终不是在抽象场景节点上做分类，而是在一组已经吸收环境上下文的 action node 上做选择。这非常适合后续扩展到 multi-agent planner：每个机器人都可以生成自己的 action layer，上层再协调多个 action layer 的冲突和覆盖效率。

## 局限

这篇主要处理导航和 object search，不处理复杂操作任务，也不负责从自然语言指令生成子任务。它依赖已有的 3D Dynamic Scene Graph，图构建质量、语义检测和场景更新都会直接影响策略表现。

另外，动作空间被压缩成平台无关的导航动作，例如 go straight、turn left、turn right。这对导航很干净，但还不能直接覆盖机械臂操作、协作搬运或需要精细连续控制的任务。

## 和其他论文的关系

和 GRID 相比，这篇更早，也更底层：GRID 关注 instruction 如何 grounding 到 scene graph 并生成子任务；3DSG Navigation 关注 scene graph 如何变成 navigation policy 的动作选择。

和 GMATANN 相比，这篇的图是 scene-centric/action-centric，用来做导航动作决策；GMATANN 的图是 task-agent graph，用来做异构多智能体任务分配。

和 CO + GNN Survey 的观点一致，这篇没有让 GNN 脱离结构做纯黑盒决策，而是先把问题设计成一个强结构图：高层 scene graph 保留语义和拓扑，action node 表示候选决策，GNN 负责在结构上做信息聚合和启发式判断。

## 对多智能体任务规划模型的启发

这篇给我们的启发很直接：多机器人 planner 不应该只维护一个全局任务列表，还应该维护一个可被每个机器人投影成 action candidates 的 3D scene graph。

一个更稳的结构是：

```text
Global 3D scene graph
  -> remove low-level mesh nodes
  -> keep room / place / object / semantic nodes
  -> add per-robot action layer
  -> collision check action nodes
  -> GNN message passing
  -> per-robot action scores
  -> multi-agent conflict resolution / task allocation
```

它和 GRID 可以拼在一起：GRID 负责从 instruction 和 scene graph 得到 grounded subtask，这篇负责把 scene graph 和当前机器人状态变成可执行导航动作。

## 可复用模块

hierarchical 3D scene graph pruning、8-direction action layer、collision-checked action nodes、10D node feature schema、explicit visit memory、3-step GNN message passing、action-node readout policy。

## 证据与风险

论文在 multi-object search 任务中和常见 visuomotor policy 对比，展示了 3D Scene Graph 表示、层级信息和 explicit memory 对搜索效率和泛化的提升。消融结果也支持 room / object 等高层节点对导航目标选择有帮助。

风险在于实验仍然是导航类任务，且依赖模拟环境和 DSG 构建流程。要用于真实多机器人任务规划，还需要补充动态图更新、跨机器人 map fusion、通信延迟、行动冲突和执行失败反馈。

## 开放问题

- action node 是否只能是 8 个方向，还是可以扩展成导航、抓取、观察、等待等多类型 action layer？
- 多机器人系统中，每个机器人独立生成 action layer，还是共享一个联合 action graph？
- explicit visit memory 如何区分“我访问过”和“队友访问过”？
- 如果 scene graph 中的语义节点错误，GNN policy 是否有纠错机制？
