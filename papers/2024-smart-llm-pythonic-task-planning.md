---
id: 2024-smart-llm-pythonic-task-planning
title: "SMART-LLM: Smart Multi-Agent Robot Task Planning using Large Language Models"
short_title: SMART-LLM
year: 2024
published: 2024-03
venue: IROS 2024
status: read
scope: in_scope
readiness: medium
action: build_note
tech_paradigm: pythonic_llm_task_planning
primary_domain: Task Graph
domains: [Task Graph, LLM, Planning]
primary_technical_layer: task_graph_generation
primary_task_family: python_code_implicit_task_structure
platform: heterogeneous_multi_robot_systems
planning_relevance: SMART-LLM 没有显式 task graph，但它用 Python code、threading 和 join 隐式保存任务分解、并行关系、执行顺序和机器人分配，是 LLM 生成任务结构的早期 idea 萌芽。
multi_robot_relevance: 论文用多个 LLM prompting stage 分别完成任务分解、coalition formation、task allocation 和执行代码生成，直接面向异构多机器人任务规划。
system_roles: [semantic_planner, task_decomposer, task_allocator, planner_baseline]
reusable_modules: [pythonic_prompting, task_decomposition_agent, coalition_formation_agent, task_allocation_agent, code_structured_execution_plan, threading_based_parallelism]
evidence_level: paper_read
next_action: extract_smart_llm_pythonic_planning_baseline
tags: [SMART-LLM, LLM, Task Graph, Python code, task decomposition, coalition formation, task allocation, multi-robot planning]
authors: [Shyam Sundar Kannan, Vishnunandan L. N. Venkatesh, Byung-Cheol Min]
institutions: [Purdue University]
doi:
arxiv: 2309.10062
url: https://arxiv.org/abs/2309.10062
project_url: https://sites.google.com/view/smart-llm/
pdf_path: pdfs/2024-03-23-SMART-LLM-multi-agent-robot-task-planning.pdf
image_url:
zotero_key:
citekey: kannan2024smartllm
cites: []
extends: []
uses: []
enables: [2025-lip-llm-dependency-graph-planning]
contrasts: [2025-lip-llm-dependency-graph-planning]
---

## 一句话结论

SMART-LLM 可以暂时归档到 Task Graph 方向，但它不是严格的 task graph 方法：它没有显式 node/edge graph，而是用 Python code 的函数、threading 和 join 隐式存储任务结构、并行关系和执行顺序。

## 研究问题

多机器人任务规划需要同时解决任务分解、机器人能力匹配、子任务分配和执行顺序。传统方法往往依赖固定规则或特定任务建模，难以处理自然语言里的模糊指令。

SMART-LLM 的想法是：利用 LLM 对自然语言和代码结构的理解能力，把高层任务指令转成 Python 风格的多机器人执行计划。这里的 Python code 不只是输出格式，也承担了任务结构表示的角色。

## 输入是什么

SMART-LLM 的 prompt 是 Pythonic prompt，包含：

- 用户给出的高层 task instruction。
- 环境信息，例如 objects 和 object properties。
- 机器人列表，以及每个 robot 的 skills / capabilities。
- 预定义 robot skill API，例如 `GoToObject`、`PickUpObject`、`PutObject`、`SwitchOn`、`SwitchOff` 等。
- few-shot examples，包括任务分解示例、coalition formation 示例和 task allocation 示例。
- line-by-line comments 和 task summary comments，用自然语言解释代码结构和规划意图。

论文强调 comments 很重要。去掉 comments 后，compound 和 complex tasks 的性能会明显下降，因为 LLM 更难理解任务推理和逻辑结构。

## 输出是什么

SMART-LLM 的最终输出是可执行的 Python 风格任务计划，而不是 graph。

它通过代码表达三类结构：

1. **子任务函数**

   ```python
   def turn_off_desk_lamp(robot):
       GoToObject(robot, "DeskLamp")
       SwitchOff(robot, "DeskLamp")
   ```

2. **并行执行**

   ```python
   t1 = threading.Thread(target=turn_off_desk_lamp, args=(robots[0],))
   t2 = threading.Thread(target=turn_off_floor_lamp, args=(robots[1],))
   t1.start()
   t2.start()
   ```

3. **顺序依赖**

   ```python
   t1.join()
   t2.join()
   watch_tv(robots[2])
   ```

所以它没有 `G = (V, E)`，没有 dependency edges，也没有 graph validation。任务依赖关系是通过 Python 函数调用顺序、thread start 和 join 隐式表达的。

## 三个 LLM stage

SMART-LLM 的前三个 stage 都由 LLM prompting 完成，但它们的职责不同。

### Stage 1: Task Decomposition

第一阶段回答的是：

```text
这个任务要拆成哪些子任务？
每个子任务包含哪些 robot skills？
哪些子任务可以并行，哪些需要顺序执行？
```

输入是 instruction、环境对象、primitive skills 和 decomposition examples。输出是 decomposed subtasks，以及每个 subtask 的 Python function / action sequence。

这一阶段主要关注任务结构，不真正决定具体哪台机器人执行。

### Stage 2: Coalition Formation

第二阶段回答的是：

```text
每个子任务需要什么能力？
单个机器人能否完成？
如果不能，是否需要多个机器人组成 team？
```

输入是 Stage 1 的 subtasks、机器人列表、每个机器人 skills/capabilities、环境/物体约束和 coalition examples。输出是 coalition formation policy，也就是关于“哪些子任务适合单机器人，哪些子任务需要机器人团队”的自然语言/代码注释式策略。

这一阶段仍然不是最终代码分配，而是给 Stage 3 提供能力匹配和团队组成的理由。

### Stage 3: Task Allocation

第三阶段回答的是：

```text
具体 robot1、robot2、robot3 分别执行哪些子任务？
如何把这些分配写成可执行 Python code？
```

它使用 Stage 2 的 coalition policy，把具体机器人填入每个 subtask function，并生成最终 task allocation code。

## 用户笔记

SMART-LLM 暂时归档到 Task Graph 中，作为 idea 萌芽。它使用 Python code 的方式存储任务结构，没有显式 graph。系统用 LLM agent / LLM prompting stage 分别完成任务分解、coalition formation、task allocation 和执行。

## 关键贡献

第一，它把多机器人任务规划拆成多个 LLM stage，而不是一次性让 LLM 直接输出完整计划。这样每个 stage 的 prompt 更清晰，分别处理 decomposition、coalition reasoning 和 allocation。

第二，它用 Python code 作为结构化中间表示。函数、线程和 join 比纯自然语言计划更可执行，也能隐式表达并行和顺序依赖。

第三，它证明 Pythonic prompt 可以从仿真任务迁移到真实机器人任务，只要底层 skill API 和环境/机器人能力描述保持一致。

## 局限

SMART-LLM 的最大局限是没有显式 task graph。由于没有 node/edge 表示，系统很难直接做 graph validation、cycle detection、dependency repair、MILP/GNN-based allocation 或对任务图进行局部重规划。

它的 coalition formation 和 task allocation 都依赖 LLM reasoning。论文的 ablation 显示移除 coalition formation 会显著降低成功率，说明 Stage 2 的中间推理对后续分配很重要，但这个推理本身没有被形式化成可验证的数据结构。

此外，Python code 表示虽然可执行，但不天然适合大规模任务图分析。如果任务数量、机器人数量和并行关系变复杂，单纯依靠代码生成会更难检查正确性。

## 和其他论文的关系

和 LiP-LLM 相比，SMART-LLM 更早也更松散：SMART-LLM 用 Python code 隐式表达任务结构；LiP-LLM 则进一步把 skill dependency 显式转成 graph edge，并用规则检查是否有 cycle，再交给线性规划做分配。

和 Unsupervised Task Graph Generation 相比，SMART-LLM 不从数据集中学习或归纳 task graph，而是在单次任务 prompt 中生成代码式计划。

和 GenSwarm 相比，两者都利用 LLM 生成可执行代码结构；SMART-LLM 更关注多机器人 household / embodied task planning 的 decomposition 和 allocation，GenSwarm 更强调多机器人代码策略生成、仿真反馈和真实部署闭环。

## 对多智能体任务规划模型的启发

SMART-LLM 提供了一个重要的早期信号：LLM 适合把自然语言任务转成结构化中间表示，但这个中间表示最好不要停留在代码层。

对我们的 General Multi-Agent Task Planning Model 来说，更稳的演化方向是：

```text
SMART-LLM-style Python plan
  -> explicit task graph nodes / edges
  -> graph validation and repair
  -> MILP / GNN / RL allocation
  -> executable skill calls
```

也就是说，SMART-LLM 可以作为 idea 萌芽和 baseline，但真正可扩展的系统应该把代码里的隐式依赖显式化为 task graph。

## 可复用模块

Pythonic prompting、task decomposition agent、coalition formation agent、task allocation agent、comments-as-reasoning-hints、threading-based parallel execution、skill API based code generation。

## 证据与风险

论文在 AI2-THOR benchmark 和真实机器人实验中测试了多类任务，并比较了 random allocation 和 rule-based allocation baseline。结果说明多 stage LLM prompting 在 heterogeneous robot team 中可以生成有效计划。

风险是它依赖 few-shot prompt 和 LLM 代码生成质量，缺少结构化验证。对于高风险或大规模多机器人场景，仅靠生成代码不够，需要额外的 graph checker、planner 或 optimizer。

## 开放问题

如何从 SMART-LLM 生成的 Python code 中自动反解析出显式 task graph：函数是 node，`join()` 和函数调用顺序是 edge，thread start 是并行结构。

另一个问题是 coalition formation policy 如何转成机器可验证的约束，例如 required capabilities、team size、resource constraints、payload constraints、visibility constraints 和 execution duration。
