---
id: 2025-dart-llm-dependency-aware-task-graph
title: "DART-LLM: Dependency-Aware Multi-Robot Task Decomposition and Execution using Large Language Models"
short_title: DART-LLM
year: 2025
published: 2025-03
venue: arXiv
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: dag_based_llm_task_decomposition
primary_domain: Task Graph
domains: [Task Graph, LLM, Planning]
primary_technical_layer: task_graph_generation
primary_task_family: dependency_aware_multi_robot_decomposition
platform: construction_robotics
planning_relevance: DART-LLM 用 LLM 把自然语言施工任务直接分解成结构化 JSON subtasks，每个 subtask 包含 atomic skill、dependencies、object keywords 和 robot assignment，再由规则模块把 dependencies 处理成 DAG 并按拓扑顺序执行，是 LLM 输出任务依赖后规则化成 task graph 的直接参考。
multi_robot_relevance: 论文面向挖掘机、运输车等移动施工机器人，强调多机器人协作中的任务依赖、机器人技能匹配、VLM object grounding 和 ROS2 执行闭环。
system_roles: [semantic_planner, task_graph_generator, task_allocator, execution_orchestrator, planner_baseline]
reusable_modules: [json_task_decomposition, dependency_list_to_dag, topological_execution, robot_skill_matching, object_keyword_grounding, construction_robot_skill_library]
evidence_level: paper_read
next_action: extract_dart_llm_json_dag_schema
tags: [DART-LLM, Task Graph, LLM, DAG, dependency-aware decomposition, construction robots, JSON planning, multi-robot execution]
authors: [Yongdong Wang, Runze Xiao, Jun Younes Louhi Kasahara, Ryosuke Yajima, Keiji Nagatani, Atsushi Yamashita, Hajime Asama]
institutions: [The University of Tokyo, University of Tsukuba]
doi:
arxiv: 2411.09022
url: https://arxiv.org/abs/2411.09022
project_url: https://wyd0817.github.io/project-dart-llm/
pdf_path: pdfs/2025-03-04-DART-LLM-dependency-aware-multi-robot-task-decomposition.pdf
image_url:
zotero_key:
citekey: wang2025dartllm
cites: [2024-smart-llm-pythonic-task-planning]
extends: [2024-smart-llm-pythonic-task-planning]
uses: []
enables: []
contrasts: [2025-lip-llm-dependency-graph-planning]
---

## 一句话结论

DART-LLM 是 Task Graph 方向非常直接的一篇：它让 LLM 从自然语言任务中输出结构化 subtasks 和 dependencies，然后用规则模块把 dependencies 转成 DAG，并按拓扑顺序调度多机器人执行。

## 研究问题

施工机器人任务往往有严格的前后依赖。例如运输车必须等挖掘机完成装载后才能离开，否则任务失败。SMART-LLM 这类方法用 Python code 隐式表达任务结构，但没有显式处理依赖关系，复杂任务下容易因为顺序错误而失败。

DART-LLM 要解决的是：如何把自然语言施工任务拆成可执行 atomic skills，同时显式表达 subtasks 之间的依赖，使多机器人系统可以并行执行无依赖任务，并等待有前置条件的任务。

## 输入是什么

DART-LLM 的 prompt 定义为：

```text
P = (I, E, R, S, F)
```

其中：

- `I` 是自然语言 instruction。
- `E` 是环境信息。
- `R` 是机器人集合。
- `S` 是每个机器人拥有的 skill set。
- `F` 是 few-shot examples。

prompt 里还明确告诉 LLM：机器人技能可以通过 teamwork 组合。

论文的施工机器人 skill library 包括两类：

- **Navigation skills**：例如让所有机器人或特定机器人避开区域、前往目标区域、允许进入区域、返回起点。
- **Robot-specific skills**：例如 excavator digging、excavator unloading、dump loading、dump unloading。

## 输出是什么

QA LLM 输出 structured JSON。每个 subtask 包含：

```json
{
  "instruction_function": {
    "name": "<breakdown function>",
    "dependencies": ["<dep 1>", "<dep 2>"]
  },
  "object_keywords": ["<key 1>", "<key 2>"]
}
```

这个输出里最重要的是三类字段：

- function name：对应 robot skill library 里的 atomic action。
- dependencies：表示当前 subtask 的前置任务。
- object keywords：用于 VLM/object detector 做环境 grounding。

论文也提到输出中可以包含 robot assignments。如果 LLM 已指定某个机器人，就直接分配；否则 Breakdown Function Parser 会根据 robot type 和 skill 匹配可用机器人。

## 从 LLM 输出到 DAG

DART-LLM 不是让 LLM 直接输出一张完整 graph object，而是：

1. LLM 输出 subtasks 和每个 subtask 的 dependency list。
2. 系统规则模块读取 dependency list。
3. 把每个 dependency 转成 directed edge。
4. 构建 DAG：

   ```text
   G = (T, D)
   D subset T x T
   ```

   其中 `T` 是 subtask nodes，`D` 是 dependency edges。

如果有一条 edge：

```text
T_i -> T_j
```

含义是 `T_j` 必须等待 `T_i` 成功完成后才能执行。

所以用户的理解是对的：**DART-LLM 先用 LLM 直接分解子任务，再用规则方法把 dependencies 处理成 DAG**。

## 执行方式

DART-LLM 按 DAG 的拓扑顺序执行：

- 没有 dependencies 的 subtasks 可以并行执行。
- 有 dependencies 的 subtasks 必须等待所有前置任务完成。
- 每个 parsed subtask 最后由 Actuation Module 调用对应 robot atomic skill。
- VLM-based object detector 负责持续更新 object map database，用 `object_keywords` 进行 grounding。

系统模块包括：

1. QA LLM module：解析 instruction，输出 dependency-aware subtasks。
2. Breakdown Function module：解析 subtasks，匹配机器人和 function。
3. Actuation module：通过 ROS2 / navigation stack / robot action set 执行技能。
4. VLM-based object detector：识别任务相关对象并更新 object map。

## 数据集

论文提供了 construction robot task dataset，包含 102 条自然语言指令：

- L1 Basic：47 条。
- L2 Medium：33 条。
- L3 Complex：22 条。

Hugging Face 数据集 `YongdongWang/dart_llm_tasks` 的字段包括：

- `task_id`
- `text`
- `output.tasks`
- `instruction_function.name`
- `robot_ids`
- `dependencies`
- `object_keywords`

这对我们很有价值，因为它已经接近我们想要的 robot-skill-aligned task graph 数据格式。

## 用户笔记

DART-LLM 用 LLM 来直接分解子任务，然后使用规则方法处理成 DAG。它可以记录到 Task Graph 中。它不是训练一个专门的 task graph generator，而是依赖 LLM 输出结构化 subtasks / dependencies，再由后处理模块把 dependency list 转成图。

## 关键贡献

第一，它比 SMART-LLM 更明确地把任务依赖显式化。SMART-LLM 用 Python code 存储任务结构；DART-LLM 用 JSON dependencies 和 DAG 存储任务结构。

第二，它把 dependency-aware decomposition 和 robot skill library 对齐。每个 subtask 对应 atomic skill，后续可以由 parser 根据机器人能力分配。

第三，它有一个小规模但有结构标注的数据集，适合作为我们设计 task graph schema 的参考。

第四，它强调小模型部署。论文显示显式 DAG dependency modeling 能明显提升小模型在复杂任务上的表现，让 Llama-3.1-8B 这类模型在 response time reliability 上更适合边缘部署。

## 局限

DART-LLM 仍然主要依赖通用 LLM 的 prompting / few-shot 生成，并没有真正训练一个持续学习的 task graph generator。虽然项目页提供 fine-tuned Llama-1B 相关资源，但论文核心机制仍是 LLM 结构化输出 + 规则后处理。

它的 DAG 校验也主要围绕 dependencies 和执行顺序，未充分展开更复杂的语义校验，例如某条 edge 是否必要、是否漏掉隐含前置条件、是否存在资源冲突或时间窗约束。

任务领域集中在 construction robotics，skill library 规模较小。迁移到通用集群机器人时，需要更大的 robot capability schema、scene grounding schema 和 failure recovery schema。

## 和其他论文的关系

和 SMART-LLM 相比，DART-LLM 的进步是把 Python code 隐式结构改成 JSON + DAG 显式结构，因此更适合可视化、人类审核、拓扑排序和依赖满足率评估。

和 LiP-LLM 相比，两者都用 LLM 处理 dependency。LiP-LLM 是先生成 skill list，再生成 dependency graph，并用线性规划分配任务；DART-LLM 是直接输出 subtasks、dependencies、object keywords 和 robot assignment，再由规则模块构图和执行。

和 Unsupervised Task Graph Generation 相比，DART-LLM 是在线任务 prompt 到 task graph；Unsupervised Task Graph 是从 instructional transcripts 中归纳抽象 task graph。

## 对多智能体任务规划模型的启发

DART-LLM 给我们的 schema 很有参考价值。一个面向通用集群机器人的数据格式可以从它扩展：

```json
{
  "instruction": "...",
  "robots": [{"id": "ugv1", "skills": ["navigate", "inspect"]}],
  "tasks": [
    {
      "id": "t1",
      "skill": "navigate",
      "args": {"target": "soil_pile"},
      "robot_ids": ["ugv1"],
      "dependencies": [],
      "object_keywords": ["soil_pile"]
    }
  ]
}
```

未来我们要做的关键不是只让 LLM 生成这个 JSON，而是用领域数据训练一个模型，让它更稳定地生成与 robot skill library 对齐的 task graph，并能随着新任务、新机器人技能和执行反馈持续更新。

## 可复用模块

JSON task decomposition format、dependency list to DAG、topological execution、dependency satisfaction metric、robot skill matching、object keyword grounding、construction robot skill library。

## 证据与风险

论文在 102 条 construction robot instructions 上评估，指标包括 SR、Instruction Parsing Accuracy、Dependency Satisfaction Rate、Semantic Grounding Success Rate 和 Response Time Reliability。ablation 显示去掉 DAG dependencies 会显著降低复杂任务成功率，尤其对小模型影响更大。

风险是 benchmark 规模较小，任务类型集中，且很多推理仍由 LLM 完成。对于通用集群机器人，仍需更丰富的数据集和更强的自动验证机制。

## 开放问题

如何把 DART-LLM 的 dependency list 扩展为更完整的 task graph edge type：precondition、resource conflict、same-agent continuity、synchronization、human approval、failure recovery。

另一个问题是如何让 task graph generator 具备持续学习能力：从执行失败中更新 skill precondition/effect，从人类修正中更新 dependency pattern，从新机器人上线中更新 capability matching。
