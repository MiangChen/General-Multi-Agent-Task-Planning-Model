---
id: 2020-robognn-multi-robot-scheduling-gat
title: "Learning Scheduling Policies for Multi-Robot Coordination With Graph Attention Networks"
short_title: RoboGNN Scheduler
year: 2020
published: 2020-07
venue: IEEE Robotics and Automation Letters 2020
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: robognn_scheduling_policy
primary_domain: GNN
domains: [GNN, Planning, RL]
primary_technical_layer: graph_scheduling_policy
primary_task_family: st_sr_ta_xd_scheduling
platform: homogeneous_multi_robot_systems
planning_relevance: 这篇把多机器人调度写成 STN 任务图，并用带方向和边权的 GAT 学习快速 scheduling heuristic，是给定任务图后的调度层 baseline。
multi_robot_relevance: 论文直接处理多机器人协调调度，但问题设定是 SR、ST、TA、XD 且机器人同构，不处理异构能力匹配或自然语言任务分解。
system_roles: [scheduler, graph_encoder, solver_heuristic, planner_baseline]
reusable_modules: [simple_temporal_network, robot_specific_node_features, directed_weighted_gat, imitation_scheduling_policy, q_value_schedule_decoder, opportunistic_time_rollout]
evidence_level: paper_read
next_action: extract_robognn_scheduler_baseline
tags: [RoboGNN, GAT, multi-robot scheduling, imitation learning, STN, Q learning, homogeneous robots]
authors: [Zheyuan Wang, Matthew Gombolay]
institutions: [Georgia Institute of Technology]
doi: 10.1109/LRA.2020.3002198
arxiv:
url: https://ieeexplore.ieee.org/document/9119835
project_url:
pdf_path: pdfs/2020-07-01-RoboGNN-multi-robot-scheduling-gat.pdf
image_url:
zotero_key:
citekey: wang2020robognn
cites: []
extends: []
uses: [2023-combinatorial-optimization-gnn-reasoning]
enables: []
contrasts: []
---

## 一句话结论

RoboGNN Scheduler 用模仿学习把传统优化器生成的小规模高质量调度数据蒸馏进 GAT + Q network，从而在同构多机器人 ST/SR/TA/XD 调度问题上快速生成接近最优的任务分配与排序。

## 研究问题

这篇论文处理的是经典多机器人调度问题：多个机器人要完成一批任务，任务之间有时序约束、等待约束、deadline、地点互斥和 makespan 目标。

用 iTax 语言说，它的问题设定是 SR、ST、TA、XD：每个任务只需要一个机器人，每个机器人一次只做一个任务，任务有时间扩展，并且不同机器人日程之间存在 cross-schedule dependency。论文还假设机器人同构，所以不处理不同机器人能力不同的问题。

传统 MILP / CP / exact solver 能给高质量解，但大规模时太慢；手工启发式更快，但需要领域专家调参。论文的问题就是：能不能让 GAT 从优化器生成的示范解里学一个快速调度策略。

## 方法

论文提出 RoboGNN scheduler。整体思路是 imitation learning + graph attention network + Q-value decoder。

1. **专家数据生成**：先用传统优化方法在小规模问题上求出高质量或最优任务分配数据，把这些 schedule 拆成状态-动作对，作为模仿学习数据。
2. **任务图输入**：输入是一个 task graph / Simple Temporal Network。节点是任务的 start-time event，边表示任务之间的时序约束、等待关系、deadline 或地点互斥信息。edge 不只是连接关系，还带有重要的时间权重。
3. **机器人特定 node feature**：对某个机器人 i，节点特征会编码该任务是否已经分给机器人 i、是否分给其他机器人、是否未调度、任务持续时间和任务位置。也就是说，同一张任务图会因为“当前评估哪个机器人”而有不同 node feature。
4. **有向加权 GAT**：GAT 提取机器人 i 周围 neighbor node 和 edge 的信息。论文对原始 GAT 做了适配：消息沿有向边传递，edge weight 会进入 attention coefficient 和 node feature aggregation。经过多层处理后，每个 node 得到包含局部时序结构和邻居信息的描述。
5. **Q network 打分**：对机器人 i 和候选任务 x，Q network 读取 state embedding 与 action embedding，估计“把任务 x 分给机器人 i”的未来累计收益。调度时按得分最高的候选动作贪心分配，决定该机器人下一步去哪一个任务。

## 关键贡献

它把 STN-based multi-robot scheduling 接进了 GNN 框架，而且不是把 GAT 当成普通无向图编码器，而是让 GAT 处理 directed weighted edges。这一点很重要，因为调度问题的边不是普通相似度，边里有方向、时间差、等待和 deadline 语义。

第二个贡献是训练路线务实：不直接用 RL 从零学调度，而是用优化器或专家 schedule 生成 imitation learning 数据。这样小规模 exact solver 的强质量可以迁移成大规模快速 heuristic。

第三个贡献是模型对任务数和机器人数量 non-parametric，可以从小问题学到策略，再用于更大任务图。

## 局限

这篇的设定比较窄：SR、ST、TA、XD，再加同构机器人。它不处理异构能力匹配，也不处理一个任务需要多个不同能力机器人协作的情况。

它也不负责自然语言任务分解、场景 grounding 或底层 VLA/WAM 执行。输入已经是结构化任务图和约束，输出是调度决策。

另外，它的策略本质上是从优化器生成的数据里学 heuristic，因此质量上限和泛化边界会受专家数据分布、目标函数和约束形式影响。

## 和其他论文的关系

和 CO + GNN Survey 的关系很直接：综述说 GNN 更适合作为组合优化求解流程里的 heuristic guide，而 RoboGNN 是这个判断在多机器人 STN 调度中的具体实现。

和 GMATANN 相比，RoboGNN 更早、更偏同构调度和时序约束；GMATANN 更偏异构 agent-task graph、能力匹配和 RL allocation。两者可以互补：GMATANN 解决“谁能做什么”，RoboGNN 解决“在时序约束下怎么排”。

和 Heterogeneous MRTA RL 相比，RoboGNN 的专家数据来自传统优化器，训练更像 imitation learning；Heterogeneous MRTA RL 更强调端到端 RL 和异构机器人能力。

和 GRID 相比，GRID 负责从自然语言和 scene graph 得到 grounded subtask，RoboGNN 假设这些任务已经结构化好，再做多机器人调度。

## 对多智能体任务规划模型的启发

这篇提醒我们，General Multi-Agent Task Planning Model 里需要一个明确的 scheduling 层，而不只是 task allocator：

```text
Language / scene graph grounding
  -> task graph with temporal constraints
  -> capability-aware allocation
  -> GAT / solver-guided scheduler
  -> VLA / WAM / code policy executor
```

RoboGNN 的可复用点是：把任务 start time、任务依赖、deadline、地点互斥和 partial schedule 都编码进图，再让 GAT 提取时序邻域特征，最后用 Q-value 方式逐步构造 schedule。

对我们的系统来说，它更适合作为 scheduler baseline 或 solver heuristic，而不是完整 planner。

## 可复用模块

Simple Temporal Network task graph、robot-specific node features、directed weighted GAT、expert-schedule imitation learning、Q-value schedule decoder、opportunistic time rollout。

## 证据与风险

论文报告 RoboGNN 在 2-5 个机器人、最多 100 个任务的测试问题上，约 90% case 能找到高质量解，并且相比 exact solver 最多快 100 倍。这个证据支持它作为快速调度启发式。

风险是实验证据集中在同构机器人和制造调度式约束。若迁移到异构机器人、动态场景、多任务协作或真实执行失败反馈，需要重新定义 node feature、edge feature 和专家数据生成方式。

## 开放问题

如何把 RoboGNN 的 STN 调度图和 GRID/GMATANN 这类上游任务图连接起来：scene graph 产生 grounded task，task allocator 处理能力匹配，scheduler 再根据时间、地点和资源约束安排执行顺序。

另一个关键问题是：如果加入 VLA/WAM 执行成功率、机器人电量、通信延迟和动态失败恢复，这些信息应该进入 node feature、edge weight，还是进入 Q network 的 state embedding。
