---
id: 2025-magnnet-decentralized-task-allocation
title: "MAGNNET: Multi-Agent Graph Neural Network-based Efficient Task Allocation for Autonomous Vehicles with Deep Reinforcement Learning"
short_title: MAGNNET
year: 2025
published: 2025-06
venue: IEEE Intelligent Vehicles Symposium 2025
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: magnnet_decentralized_allocation
primary_domain: GNN
domains: [GNN, RL, Planning]
primary_technical_layer: gnn_marL_task_allocation
primary_task_family: decentralized_vehicle_task_allocation
platform: heterogeneous_autonomous_vehicle_swarm
planning_relevance: MAGNNET 把 UAV/UGV 任务分配建成 agent-task 异构图，用 GNN 生成每个 agent 的关系型 embedding，再用 CTDE + PPO 学 request/reject 任务策略，是分布式任务分配层的直接参考。
multi_robot_relevance: 核心问题就是异构自动车辆在通信受限和动态任务下如何去中心化地避免冲突并完成一对一任务分配。
system_roles: [task_allocator, graph_encoder, scheduler, planner_baseline]
reusable_modules: [heterogeneous_agent_task_graph, agent_agent_communication_edges, fully_connected_agent_task_edges, gnn_relational_agent_embedding, ctde_ppo_policy, request_reject_task_action, reservation_based_path_cost]
evidence_level: paper_read
next_action: extract_magnnet_io_contract
tags: [MAGNNET, GNN, MARL, PPO, CTDE, decentralized task allocation, autonomous vehicles, UAV, UGV]
authors: [Lavanya Ratnabala, Aleksey Fedoseev, Robinroy Peter, Dzmitry Tsetserukou]
institutions: [Skolkovo Institute of Science and Technology]
doi: 10.1109/IV64158.2025.11097641
arxiv:
url: https://ieeexplore.ieee.org/document/11097641
project_url:
pdf_path: pdfs/2025-06-01-MAGNNET-decentralized-task-allocation-gnn-ppo.pdf
image_url:
zotero_key:
citekey: ratnabala2025magnnet
cites: []
extends: []
uses: [2025-heterogeneous-mrta-rl, 2023-combinatorial-optimization-gnn-reasoning]
enables: []
contrasts: []
---

## 一句话结论

MAGNNET 是一个“GNN 做关系编码 + PPO 做分布式决策”的异构 UAV/UGV 任务分配框架：每个 agent 根据本地状态、到任务的代价和 GNN 聚合到的邻域/任务关系，决定是否请求某个任务。

## 研究问题

论文解决的是通信受限、动态任务场景里的去中心化任务分配。集中式 Hungarian 方法可以给较优分配，但需要所有 agent 状态持续上传到中心节点；去中心化 greedy 方法更快但容易冲突，多个 agent 可能同时抢同一个任务，或者一些任务没人接。

MAGNNET 想在两者之间取平衡：训练时使用全局 critic 做 centralized training，执行时每个 agent 只用本地 observation 和 GNN message passing 做 decentralized execution。

## 输入是什么

环境里有 N 个 agents 和 M 个 tasks。agent 包括 UAV 和 UGV，任务是 3D grid 环境中动态出现的目标点。

论文把环境建成一个 heterogeneous graph，包含两类 node：

- **Agent node**：包含 agent 的 3D position、agent status，以及该 agent 到所有可用任务的 cost estimates。
- **Task node**：包含 task 的 3D position 和 task status，例如 waiting 或 assigned。

边也有两类：

- **Agent-agent edge**：如果两个 agent 的欧氏距离低于通信阈值，就连一条边。它表示局部通信/邻域信息，让 agent 能看到附近 agent 的关系。
- **Agent-task edge**：每个 agent 和每个 task 都连接，形成 fully connected agent-task subgraph。它让每个 agent 都能评估自己对每个任务的适合程度。

进入 policy 的单个 agent observation 可以写成：

```text
o_i = [agent_status_i, cost_i1, cost_i2, ..., cost_iM, z_i]
```

其中 `cost_ij` 是 agent `i` 完成 task `j` 的归一化代价，论文用 A* / reservation-based planner 计算路径距离，再除以 agent velocity 得到 travel time cost。`z_i` 是 GNN 输出的 agent embedding。

## 输出是什么

GNN 的输出不是任务分配本身，而是每个 agent 的关系型 embedding：

```text
z_i in R^6
```

这个 embedding 编码了 agent 周围通信邻居、agent-task 关系、task 位置和 cost 信息。

policy network 的输出才是动作分布。每个 agent 的离散动作空间是：

```text
a_i in {0, 1, ..., M}
```

- `a_i = 0` 表示拒绝所有任务 / 不请求任务。
- `a_i = j` 表示请求分配 task `T_j`。

如果多个 agents 在同一决策步请求同一个 task，环境会把任务分给 cost 最小的 agent，其他 agent 受到 conflict penalty。

## GNN 的作用

GNN 的作用是把“只看自己”的本地 observation，变成“知道邻居和任务关系”的 relational context。

具体来说，GNN 做了三件事：

1. **聚合附近 agent 信息**：agent-agent edge 让一个 agent 能感知通信范围内其他 agent 的状态，避免完全独立决策导致冲突。
2. **编码 agent-task 适配关系**：fully connected agent-task edge 让每个 agent embedding 带上所有任务的位置信息和代价结构。
3. **给 PPO policy 提供关系特征**：最终的 `z_i` 和本地 observation 拼接后输入 MLP policy，输出 request/reject 的动作概率。

所以 MAGNNET 里的 GNN 更像 decentralized task allocation 的关系编码器，而不是最终 allocator。最终决策由每个 agent 的 PPO policy 独立执行。

## 方法

训练使用 CTDE：

- 训练时 centralized critic 看全局状态，包括所有 agent positions、task states 和 assignments。
- 每个 agent 的 decentralized policy 只看自己的 local observation 和 GNN-derived context。
- policy 用 PPO 更新，reward 包含成功抢到任务的正奖励、竞争失败的 conflict penalty、idle penalty，以及所有任务成功分配后的 global reward。
- 部署时 centralized critic 被丢弃，每个 agent 独立执行自己的 policy。

路径代价由 A* / reservation-based planner 计算，冲突时优先保留 task completion cost 更低的 agent 路径，其他 agent 重新规划或等待。

## 关键贡献

MAGNNET 的价值是把 GNN 和 CTDE 结合进动态异构车辆任务分配：训练阶段可以利用全局信息学习协作策略，执行阶段仍然保持去中心化。

它不是追求像 Hungarian 一样严格全局最优，而是降低集中通信依赖，同时让分布式策略比 greedy 更少冲突、更接近全局分配效果。

## 局限

论文的设置中 task 数量等于 agent 数量，主要验证一对一 conflict-free allocation。它没有处理一个任务需要多个机器人协作的 ST-MR 任务，也没有处理复杂任务依赖或长时序调度。

GNN 目前是两层 graph convolution，每层 6 hidden units，表达能力较轻。论文结论也提到未来要加入 attention-based GNN layers 来增强动态冲突解决。

另外，执行层的真实路径质量和碰撞处理依赖 A* / reservation-based planner，MAGNNET 本身主要负责分配，不直接学习连续导航控制。

## 和其他论文的关系

和 Heterogeneous MRTA RL 相比，MAGNNET 更强调 decentralized execution 和 agent-task 异构图；Heterogeneous MRTA RL 更偏异构机器人任务分配与调度的 RL baseline。

和 GMATANN 相比，MAGNNET 的 GNN 用来给每个 agent 生成 relational embedding，再由 decentralized policy 输出 request/reject；GMATANN 更像集中式 graph state encoder + RL allocation head。

和 RoboGNN Scheduler 相比，MAGNNET 没有显式 STN 时序图，主要解决动态任务到 agent 的一对一分配；RoboGNN 更偏带时序约束的调度。

和 CO + GNN Survey 相比，MAGNNET 是 GNN 用作学习型分布式启发式策略的例子，而不是辅助 MILP 或 search。

## 对多智能体任务规划模型的启发

MAGNNET 给我们的系统提供了一个分布式 allocator 接口：

```text
task graph / task list
  -> agent-task heterogeneous graph
  -> GNN relational embeddings per agent
  -> decentralized request/reject policy
  -> environment resolves conflicts by cost
```

如果未来做 General Multi-Agent Task Planning Model，MAGNNET 这种结构适合放在“任务已经 grounded、需要快速去中心化认领”的层。它可以和上游 GRID-style scene grounding、下游 VLA/WAM executor 连接。

## 可复用模块

heterogeneous agent-task graph、agent-agent communication edges、fully connected agent-task edges、GNN relational agent embedding、CTDE PPO policy、request/reject task action、reservation-based path cost。

## 证据与风险

论文报告 MAGNNET 达到 92.5% conflict-free success rate，与 centralized Hungarian 相比 performance gap 为 7.49%，在 20 个 agents/tasks 下 allocation processing 为 2.8s，优于 greedy 和 random baseline。

风险是实验是 PyBullet 3D grid 仿真，且 agent/task 数量平衡。真实系统中的通信延迟、传感噪声、不平衡任务数、多机器人协作任务、任务优先级和时序约束都需要额外验证。

## 开放问题

如何把 MAGNNET 的 request/reject 分布式分配动作，扩展到 ST-MR 任务和多阶段任务：一个任务可能需要多个不同能力机器人，同时还要满足时间窗、空间冲突和执行失败恢复。

另一个问题是 GNN embedding 是否应该加入更丰富的 edge feature，例如通信质量、任务 deadline、VLA/WAM 成功率、能耗和动态风险，而不仅是空间邻域与 path cost。
