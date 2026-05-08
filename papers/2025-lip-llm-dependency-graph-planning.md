---
id: 2025-lip-llm-dependency-graph-planning
title: "LiP-LLM: Integrating Linear Programming and Dependency Graph with Large Language Models for Multi-Robot Task Planning"
short_title: LiP-LLM
year: 2025
published: 2025-02
venue: IEEE Robotics and Automation Letters
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: llm_dependency_graph_planning
primary_domain: Task Graph
domains: [Task Graph, LLM, Planning]
primary_technical_layer: task_graph_generation
primary_task_family: llm_to_dependency_graph_task_allocation
platform: multi_robot_manipulation
planning_relevance: LiP-LLM 用 LLM 先从任务指令和机器人技能状态中生成 skill list，再生成 skill dependency graph，最后把无依赖的 root skills 交给线性规划做多机器人任务分配，是 LLM 生成任务图后接优化器的直接参考。
multi_robot_relevance: 论文把多机器人任务规划拆成任务分解、依赖图生成和任务分配三步，避免完全依赖 LLM 做 allocation，同时保留 LLM 对自然语言任务和技能依赖的语义推理能力。
system_roles: [semantic_planner, task_graph_generator, task_allocator, planner_baseline]
reusable_modules: [skill_list_generation, llm_dependency_graph_generation, cycle_detection_validation, root_node_task_selection, linear_programming_assignment, skill_weight_calculation]
evidence_level: paper_read
next_action: extract_lip_llm_task_graph_interface
tags: [LiP-LLM, Task Graph, LLM, dependency graph, skill list, linear programming, multi-robot task planning]
authors: [Koki Obata, Takeru Aoki, Takato Horii, Tadahiro Taniguchi, Takayuki Nagai]
institutions: []
doi: 10.1109/LRA.2024.3518105
arxiv: 2410.21040
url: https://arxiv.org/abs/2410.21040
project_url:
pdf_path: pdfs/2025-02-01-LiP-LLM-linear-programming-dependency-graph.pdf
image_url:
zotero_key:
citekey: obata2025lipllm
cites: []
extends: []
uses: [2023-unsupervised-task-graph-generation]
enables: []
contrasts: [2023-grid-scene-graph-task-planning, 2025-magnnet-decentralized-task-allocation]
---

## 一句话结论

LiP-LLM 是一篇很适合放在 Task Graph 方向的论文：它让 LLM 生成多机器人任务中的 skill list 和 skill dependency graph，再用线性规划/MILP 风格的优化器完成机器人-任务分配。

## 研究问题

LLM 可以理解自然语言任务并拆解步骤，但如果让 LLM 同时负责任务分解、依赖判断和机器人分配，会有两个问题：一是 hallucination，二是 allocation 这类组合优化问题并不适合完全交给 LLM。

LiP-LLM 的思路是把这两部分拆开：LLM 负责更语义化的部分，也就是从指令中选出需要的 skills，并判断 skills 之间的前后依赖；优化器负责更结构化的分配问题，也就是当前哪些任务可执行、每个机器人更适合执行哪个任务。

## 输入是什么

论文里的输入可以概括成一个 prompt，包含：

- **任务 instruction**：用户给出的自然语言任务。
- **机器人的 skill set**：预定义的可执行技能集合，例如移动、抓取、放置等。
- **机器人和环境状态**：包括机器人数量、能力、初始配置、周围环境和物体信息。
- **规则和约束说明**：解释每个 skill 的含义、什么时候可以执行、推理时要考虑什么。
- **few-shot examples**：用少量例子告诉 LLM 如何从任务指令选出技能序列和依赖关系。

所以它不是让 LLM 自由生成任意动作，而是从预定义 skill set 里选择与当前任务相关的技能。

## 输出是什么

LiP-LLM 有两个关键中间输出：

1. **Skill list**

   第一阶段输出一个技能序列：

   ```text
   S = [s_0, s_1, ..., s_n]
   ```

   论文采用类似 SayCan 的方式，对每个候选 skill 计算在当前 instruction 和已选 skill 序列下成为下一步的概率，然后选概率最高的 skill。这个过程一直重复到选择 `done`。

2. **Dependency graph / task graph**

   第二阶段把 skill list 转成有向依赖图：

   ```text
   G_S = (V_S, E_S)
   ```

   其中 node 是 skill，edge 表示依赖关系。如果有一条边：

   ```text
   s_i -> s_j
   ```

   含义是 `s_j` 必须等待 `s_i` 完成后才能执行。

## 方法

整体流程是三步：

1. **Skill List Generation**

   输入任务指令和预定义技能集合。LLM 对候选技能打分，逐步选择下一步 skill，直到输出 `done`。这样能减少 LLM 输出不存在技能的风险，因为系统只在已有 skill set 里选择。

2. **Dependency Graph Generation**

   LLM 根据任务指令和 skill list 推断技能之间的依赖。论文描述的是先让 LLM 用文本说明依赖关系，再输出类似 Mermaid/edge-list 的边格式，然后系统把文本解析成 graph edge。

   这里的 LLM 调用不是每条 edge 问一次。理想情况下，一次 LLM 调用会生成整张依赖图中的所有 edges。如果最终有 10 条依赖边，通常不是问 10 次 AI，而是一次生成 10 条边。只有当图结构不合法，例如存在 cycle 时，才重新调用 LLM 生成。

3. **Task Allocation by Linear Programming**

   系统从 dependency graph 中找 root nodes，也就是当前没有前置依赖、可以执行的 skills。然后根据 observation 计算每个机器人执行每个 skill 的权重 `w_jk`，再用线性规划求解分配：

   ```text
   maximize sum_j sum_k w_jk x_jk
   ```

   其中 `x_jk = 1` 表示机器人 `j` 执行 skill `k`。约束是每个机器人一次最多执行一个 skill，每个 skill 最多分配给一个机器人。执行完成后，从图里删除对应 node 和 edge，再继续处理新的 root nodes。

## 用户笔记

本文用 LLM 来生成 task graph。输入的数据格式是 prompt，包括任务、机器人的技能状态；第一步输出是一个 skill list；第二步输出是一个 task graph。最终 task graph 会用 MILP/linear programming 方式来做分配。

## 关键贡献

第一，LiP-LLM 把 LLM 的作用限制在任务分解和依赖关系生成上，而不是让 LLM 独立完成整个多机器人分配问题。

第二，它显式把 skill 之间的依赖关系变成 edge，使得后续可以找 root nodes 并行执行。这比单纯输出一个线性 action sequence 更适合多机器人任务规划，因为没有依赖的任务可以同时分配给不同机器人。

第三，它用规则方法检查 dependency graph 的结构，例如 cycle detection。这个检查不能保证每条边在语义上都完全正确，但能过滤掉循环依赖这种明显不可执行的图。

## 局限

LiP-LLM 依赖预定义 skill set。机器人类型、物体、地点越多，候选 skill 的规模越容易变大，prompt 和逐步打分成本都会上升。对于 UGV、UAV、机械臂混合系统，不能简单把所有机器人-动作-对象组合全部展开塞进 prompt，最好先用 capability 和场景状态过滤候选 skills。

它的依赖图验证也比较基础。Cycle detection 能检查图是不是 DAG，但无法判断某条 edge 是否真的必要，或者是否漏掉了一个隐含前置条件。

此外，论文中的任务分配约束比较接近“一台机器人一次执行一个 skill、一个 skill 最多给一个机器人”。如果任务需要多个机器人同时协作，或者有时间窗、通信约束、资源冲突，就需要扩展 optimization model。

## 和其他论文的关系

和 Unsupervised Task Graph Generation 相比，LiP-LLM 的输入不是大量 instructional transcripts，而是在线任务 prompt 和机器人 skill set。前者偏从人类教程中抽象任务知识，后者偏把当前机器人任务转成可执行依赖图。

和 GRID 相比，LiP-LLM 的 task graph 主要表达 skill dependencies；GRID 更强调 scene graph grounding 和 instruction-conditioned GNN。两者可以串成：

```text
instruction + scene/robot state
  -> skill list
  -> dependency graph
  -> scene grounding / allocation
  -> robot execution
```

和 MAGNNET 相比，LiP-LLM 用 LLM 生成上游任务图，再用优化器分配；MAGNNET 则把 agent-task 关系图交给 GNN + PPO 做分布式任务认领。

## 对多智能体任务规划模型的启发

LiP-LLM 给我们的启发是：通用多机器人 planner 可以把 LLM 放在“结构生成器”位置，而不是“万能决策器”位置。

一个更稳的系统接口可以是：

```text
instruction + robot capabilities + scene state
  -> LLM selects skill list
  -> LLM generates dependency edges
  -> rule-based graph validation
  -> MILP / GNN / RL allocator
  -> executor
```

这样既保留 LLM 对自然语言和常识依赖的理解，又把分配、调度和约束满足交给更可靠的结构化方法。

## 可复用模块

skill list generation、LLM dependency graph generation、edge-list parsing、cycle detection validation、root-node executable task selection、linear programming assignment、skill-weight calculation。

## 证据与风险

论文报告 LiP-LLM 在多机器人任务规划实验中相比完全基于 LLM 的 centralized/decentralized baseline 有更好的成功率和效率。证据支持“LLM 生成依赖图 + 优化器分配”这条路线。

风险是实验场景和 skill set 规模有限。真实通用集群机器人里，skill prompt 的设计、候选 skill 过滤、图语义校验和多机器人协作约束会成为主要工程难点。

## 开放问题

如何设计统一的 skill schema，让 UGV、UAV、机械臂、人形机器人等不同平台共享同一个 task graph 接口，同时又不让 prompt 因为所有技能组合展开而爆炸。

另一个问题是如何从简单的 DAG edge 扩展到更丰富的任务图：AND/OR 依赖、多机器人同时执行、时间窗、资源占用、失败恢复和人类确认节点。
