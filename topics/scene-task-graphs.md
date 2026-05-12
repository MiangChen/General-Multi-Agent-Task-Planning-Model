---
id: scene-task-graphs
type: topic
title: Scene Graph / Task Graph
tags: [scene graph, task graph, TOPG, grounding, planning]
---

# Scene Graph / Task Graph

这个二级栏目收集和 TOPG 直接相关的图表示论文：scene graph 负责把空间、物体、房间、关系和局部观测组织成世界表示；task graph 负责把开放目标拆成带依赖关系的可执行步骤。

## 为什么单独成类

- Scene graph 是从传感器、SLAM、语义理解到 planner 的结构化桥梁。
- Task graph 是从自然语言目标到多机器人分配、调度和执行的结构化桥梁。
- TOPG 的目标是把 scene、agent、skill、feedback 和 task 统一进 task-oriented planning graph，所以这两类论文是最直接的应用基线。

## 对 TOPG 的价值

- 定义 scene node、object node、room/place node、robot/action node 等基本实体。
- 定义 task node、dependency edge、precondition edge、resource edge 和 grounding edge。
- 说明为什么开放世界规划不能只靠 LLM 文本链路，需要显式 graph grounding。
- 给出从 instruction 到 grounded subtask，再到 allocation/scheduling 的接口。

## 关键论文

- [[2021-hierarchical-scene-graph-navigation-gnn]]
- [[2023-grid-scene-graph-task-planning]]
- [[2023-unsupervised-task-graph-generation]]
- [[2025-dart-llm-dependency-aware-task-graph]]
- [[2025-lip-llm-dependency-graph-planning]]
- [[2025-layerdag-diffusion-dag-generation]]

## 需要补的论文

- Hydra / Dynamic Scene Graph：用于多机器人上传 local scene graph 后的全局 scene graph 融合。
- TASKOGRAPHY / SayPlan：用于大 3D scene graph 上的机器人任务规划和 graph sparsification。
- Task and motion planning / PDDL grounding：用于把 task graph 接到可验证的约束求解器。
