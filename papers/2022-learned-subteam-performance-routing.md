---
id: 2022-learned-subteam-performance-routing
title: "Hierarchical Planning for Heterogeneous Multi-Robot Routing Problems via Learned Subteam Performance"
short_title: Learned Subteam Performance
year: 2022
published: 2022-04
venue: IEEE Robotics and Automation Letters 2022
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: learned_subteam_performance
primary_domain: GNN
domains: [GNN, Planning]
primary_technical_layer: graph_subteam_performance_estimation
primary_task_family: st_mr_ta_id_routing
platform: heterogeneous_multi_robot_routing
planning_relevance: 论文用 GNN 估计特定子团队在特定区域路由任务上的 makespan，把昂贵的低层 MILP 路径求解推迟到最有希望的分配方案之后，是任务分配与路由规划之间的关键桥梁。
multi_robot_relevance: 核心问题就是从 UAV/UGV 总队伍中为多个区域任务划分子团队，并在高层分配与低层路由 MILP 之间迭代精化。
system_roles: [task_allocator, scheduler, graph_encoder, solver_heuristic, planner_baseline]
reusable_modules: [subteam_performance_estimator, area_inspection_graph, team_size_encoding, learned_makespan_estimator, lazy_milp_refinement, hierarchical_task_routing_planner]
evidence_level: paper_read
next_action: extract_subteam_performance_estimator
tags: [GNN, heterogeneous robots, multi-robot routing, subteam allocation, MILP, makespan estimation, UAV, UGV]
authors: [Jacopo Banfi, Andrew Messing, Christopher Kroninger, Ethan Stump, Seth Hutchinson, Nicholas Roy]
institutions: [MIT CSAIL, Georgia Institute of Technology, DEVCOM Army Research Laboratory]
doi: 10.1109/LRA.2022.3148489
arxiv:
url: https://ieeexplore.ieee.org/document/9705143
project_url:
pdf_path: pdfs/2022-04-01-Hierarchical-Planning-learned-subteam-performance.pdf
image_url:
zotero_key:
citekey: banfi2022learnedsubteam
cites: []
extends: []
uses: [2023-combinatorial-optimization-gnn-reasoning]
enables: []
contrasts: []
---

## 一句话结论

这篇论文把 GNN 放在高层任务规划和低层 MILP 路由之间：GNN 先估计某个 UAV/UGV 子团队完成某个区域检查任务的耗时，再只把最有希望的分配方案送进低层 MILP 精算，从而避免在推测阶段反复触发昂贵的 MILP。

## 研究问题

场景中有多个子任务区域，每个区域内部又是一个异构多机器人路由问题。系统需要从总体机器人队伍中，为每个区域划分一个小团队，例如分配几个 UAV 和几个 UGV 去检查某片区域。

难点在于：要判断某个子团队是否适合某个区域，通常需要求解该区域内部的 routing MILP，才能得到精确耗时。如果高层分配阶段枚举很多子团队-区域组合，每个组合都调用 MILP，规划时间会爆炸。

论文把这个问题整体归为 ST-MR-TA-ID：机器人是 single-task，任务需要 multi-robot，分配是 time-extended，并且区域内部路由存在 in-schedule dependencies。它的高层 GNN 估计部分可以看成 ST-MR-IA 式 coalition formation：先估计“哪个子团队适合哪个任务”。

## 方法

论文提出一个分层 planner：

1. **高层任务分配 MILP**：决定每个区域任务分配多少 UAV、多少 UGV，目标是最小化整体 makespan。
2. **GNN 子团队性能估计器**：在高层还没有真实路径时，快速估计某个子团队在某个区域的完成时间。
3. **低层 routing MILP**：只对当前高层选出的候选分配，求解每个区域内部的精确路径和真实耗时。
4. **迭代精化**：低层 MILP 算出的真实耗时会回写到高层估计表，更新 GNN / estimator 给出的值，再重新求解高层分配，直到收敛或时间预算结束。

这相当于把昂贵的低层 MILP 从“每个候选都算”改成“先用 GNN 估，再只算最有希望的一小部分”。

## 关键贡献

论文最关键的贡献不是用 GNN 直接输出最终分配，而是让 GNN 作为 subteam performance estimator，服务于传统分层优化器。

GNN 负责预测某个区域图 + 某个子团队配置的 makespan。高层 MILP 使用这个估计值做快速分配，低层 MILP 负责真实路径质量和可行性。这个结构保留了优化器的严谨性，同时用学习模型减少无谓 MILP 调用。

在最多 45 个机器人、20 个区域的实验中，论文报告该分层 planner 能在平均约 16 倍更快的速度下得到最优或 7% 以内近似最优解。

## GNN 输入输出格式

论文图 3 里的 GNN 输入可以拆成两部分。

第一部分是特定区域对应的图结构数据：

- node feature 是 3 维向量。
- 第 1 维表示 UGV 检查这个点的耗时。
- 第 2 维表示 UAV 检查这个点的耗时。
- 第 3 维表示这个点是不是场景入口附近的点。
- edge feature 是 2 维向量。
- 第 1 维表示 UGV 在两个 node 之间移动的时间。
- 第 2 维表示 UAV 在两个 node 之间移动的时间。

第二部分是队伍信息，也就是 team encoding：

- 一个 2 维向量。
- 第 1 维表示分配给该任务的 UAV 数量。
- 第 2 维表示分配给该任务的 UGV 数量。

GNN block 对区域图做 message passing 和 mean readout，team encoding block 对 UAV/UGV 数量做线性编码。两者拼接后进入 MLP，最后输出一个 1 维值，也就是该子团队完成该区域 routing task 的 makespan 估计。

## 局限

这篇论文不负责从自然语言中生成任务，也不解决场景语义 grounding。它假设多个区域任务已经给定，并且每个区域能被表示成 routing graph。

它也不直接输出机器人具体路径。GNN 只估计耗时，实际路径仍由低层 MILP 计算。因此它更像 planner 的 cost model / heuristic，而不是完整执行策略。

另外，论文的任务结构是静态 allocation，结论部分也明确说当前 planner 不能处理 routing tasks 之间可能存在的 temporal constraints。要接入更复杂任务图，还需要结合 RoboGNN 这类 STN scheduling 模块。

## 和其他论文的关系

和 CO + GNN Survey 相比，这篇是一个非常典型的“GNN 作为优化器启发式”的例子：GNN 不取代 MILP，而是估计 MILP 参数，减少高层搜索时的昂贵精算。

和 RoboGNN Scheduler 相比，RoboGNN 学的是给定 STN 后的调度策略；本文学的是给定区域 routing graph 和子团队配置后的耗时估计。前者更像 scheduler，后者更像 cost estimator。

和 GMATANN / Heterogeneous MRTA RL 相比，本文的异构性更明确地体现在 UAV/UGV 子团队数量和区域路由耗时上；它不做端到端 RL 分配，而是用 GNN 辅助 MILP。

和 GRID 相比，GRID 可以把自然语言和场景图转成 grounded subtask；本文接在更后面，回答“哪些机器人子团队去哪个区域，以及这个选择大概要花多久”。

## 对多智能体任务规划模型的启发

这篇论文对 General Multi-Agent Task Planning Model 的启发很直接：复杂系统里很多候选计划的真实代价都要通过昂贵模拟器、MILP、物理 rollout 或 WAM 预测才能得到，不可能在高层搜索中全部精算。

更合理的结构是：

```text
Language / scene graph grounding
  -> area tasks / routing task graph
  -> learned subteam performance estimator
  -> high-level allocation MILP / scheduler
  -> low-level routing MILP / executor
  -> true cost feedback to estimator
```

GNN 在这里是“快速代价模型”：先给高层 planner 一个足够好的耗时估计，让 planner 优先探索有希望的子团队划分，再用精确求解器修正估计。

## 可复用模块

subteam performance estimator、area inspection graph、UAV/UGV team encoding、learned makespan estimator、lazy MILP refinement、hierarchical task-routing planner。

## 证据与风险

证据强在任务形式和我们关心的多机器人子团队划分高度贴近：多区域、多机器人、异构 UAV/UGV、makespan 目标、MILP 低层求解。实验表明 GNN 估计器相比 greedy 和 MILP relaxation 在多类环境中有较好的质量-速度折中。

风险是它依赖区域图和固定机器人类型，且训练目标是估计特定 routing MILP 的耗时。换成真实动态场景、更多机器人类型、通信限制、任务时间窗或执行失败反馈后，需要重新设计 graph feature 和反馈机制。

## 开放问题

如何把这个 GNN cost estimator 扩展成多模块 planner 的统一代价预测层：不仅估计区域检查耗时，还估计 VLA/WAM 执行成功率、通信风险、能源消耗和任务失败后的恢复成本。

另一个问题是如何把本文的 ST-MR-IA 高层子团队划分，与整体 ST-MR-TA-ID 的时间扩展任务调度结合起来，避免只得到“谁去哪片区域”，却没有得到跨区域、跨团队的时间顺序和依赖约束。
