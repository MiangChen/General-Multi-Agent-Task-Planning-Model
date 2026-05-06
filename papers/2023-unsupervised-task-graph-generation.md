---
id: 2023-unsupervised-task-graph-generation
title: "Unsupervised Task Graph Generation from Instructional Video Transcripts"
short_title: Unsupervised Task Graphs
year: 2023
published: 2023-07
venue: Findings of ACL 2023
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: unsupervised_task_graph_generation
primary_domain: Task Graph
domains: [Task Graph, Planning]
primary_technical_layer: task_graph_generation
primary_task_family: instruction_to_dependency_graph
platform: instructional_transcripts
planning_relevance: 这篇直接研究从 instructional video transcripts 中抽取 key steps 和 precondition dependency graph，是自然语言/视频说明到机器人任务图之间的重要中间层。
multi_robot_relevance: 它不处理机器人分配本身，但能为多机器人 planner 提供上游任务依赖图，后续可接 task allocation、scheduling 和 executor。
system_roles: [semantic_planner, graph_encoder, planner_baseline]
reusable_modules: [key_step_extraction, transcript_to_task_graph, dependency_graph_generation, sequence_ranking, ilp_precondition_inference]
evidence_level: paper_read
next_action: extract_task_graph_generation_pipeline
tags: [Task Graph, instructional videos, dependency graph, preconditions, script understanding, unsupervised learning]
authors: [Lajanugen Logeswaran, Sungryull Sohn, Yunseok Jang, Moontae Lee, Honglak Lee]
institutions: [LG AI Research, University of Michigan]
doi:
arxiv:
url: https://aclanthology.org/2023.findings-acl.210/
project_url:
pdf_path: pdfs/2023-07-01-unsupervised-task-graph-generation-transcripts.pdf
image_url:
zotero_key:
citekey: logeswaran2023unsupervisedtaskgraph
cites: []
extends: []
uses: []
enables: []
contrasts: []
---

## 一句话结论

这篇论文是 task graph generation 的直接参考：它从多个 instructional video transcripts 中无监督抽取关键步骤，并推断步骤之间的 precondition dependency graph。

## 研究问题

现实任务通常不是一个单步指令，而是由多个 key steps 和依赖关系组成。例如做 CPR 时，检查安全、确认意识、打开气道、检查呼吸、开始胸外按压之间有明确的先后依赖。

问题是这些知识通常只存在于非结构化文本中，比如 how-to 视频的 ASR 转录、教程说明、操作流程描述。论文要解决的是：如何从这些 noisy transcripts 中生成结构化 task graph。

## 输入是什么

输入是一组描述同一个真实任务的 instructional video transcripts：

```text
task tau
transcripts t1, t2, ..., tn
```

每个 transcript 是一个视频的 ASR 文本文档，内容可能冗长、口语化、有噪声，也不一定按标准流程表达。

## 输出是什么

输出是一个 directed task graph：

- node 是完成任务需要的 key steps。
- edge 表示 precondition relationship，也就是某一步必须在另一部之前完成。
- 对复杂依赖，graph 可以包含 AND / OR 结构，表示一个步骤需要多个前置步骤，或者满足多个候选前置条件之一。

所以它输出的不是单纯 step sequence，而是能表达局部并行、前置条件和步骤依赖的图结构。

## 方法

论文的 pipeline 分成五步：

1. **Generate summary steps**：用 instruction-tuned language model 从每个 transcript 生成 free-form step summary。
2. **Identify key steps**：把不同 transcript 中相似的 summary steps 用 sentence embeddings 聚类，找出频繁出现的 key steps。
3. **Re-label summary steps**：把每条 transcript 的 summary step sequence 对齐到统一 key step 集合。
4. **Ranking**：用 language model 给 key step sequences 打分，筛掉低质量序列，保留 top-k。
5. **Generate graph**：用基于 Inductive Logic Programming 的 graph inference 算法，从 key step sequences 推断 precondition graph。

这套方法的关键是：LLM 主要负责从 noisy transcript 中抽 step summary，后面的聚类、排序和 ILP 负责把多个样本合并成更稳定的任务依赖图。

## 关键贡献

第一，它明确把 task graph 定义为 key steps 之间的 dependency / precondition graph，而不是普通流程列表。

第二，它是 unsupervised pipeline，不需要人工标注 task graph。它利用多个 instructional transcripts 的重复性来估计哪些步骤是核心步骤，哪些顺序关系更可能是真实依赖。

第三，它把 LLM 用作信息抽取和 ranking 组件，而不是直接让 LLM 一次性生成最终图。这比“直接问 LLM 计划步骤”更稳，也更可解释。

## 局限

这篇论文不处理 grounding 到真实机器人场景的问题。它能生成 abstract task graph，但不知道哪个杯子、哪张桌子、哪个机器人能执行，也不知道空间约束和执行失败。

输入依赖 instructional transcripts。如果任务没有足够多的说明文本，或者 ASR 噪声很强，key step 聚类和依赖推断会受影响。

此外，生成的 graph 主要表达步骤前置关系，不直接表达资源冲突、时间窗、机器人能力、通信约束或多机器人协作需求。

## 和其他论文的关系

和 GRID 相比，这篇更靠近上游：它从文本说明生成 abstract task graph；GRID 从 instruction + scene graph 生成 grounded robot subtask。两者可以串起来：

```text
instructional text / demonstrations
  -> abstract task graph
  -> scene graph grounding
  -> robot subtasks
```

和 RoboGNN / MAGNNET / GMATANN 相比，这篇不做 allocation 或 scheduling，而是为它们提供任务依赖图输入。

和 GenSwarm 相比，GenSwarm 更像 language-to-code policy generator；这篇更像 language-to-task-structure extractor。

## 对多智能体任务规划模型的启发

对 General Multi-Agent Task Planning Model 来说，这篇补上的是最上游的一层：

```text
unstructured instruction / transcript
  -> key step extraction
  -> task dependency graph
  -> scene grounding
  -> task allocation
  -> scheduling
  -> executor
```

如果我们只让 LLM 直接输出机器人动作，很容易丢掉隐含前置条件。Task graph generation 的价值是先把任务结构抽出来，再让后面的 planner 处理机器人、资源和执行约束。

## 可复用模块

key step extraction、transcript-to-task-graph pipeline、sequence clustering、language-model sequence ranking、ILP precondition inference。

## 证据与风险

论文在 ProceL 和 CrossTask 上评估，结果显示这种 unsupervised pipeline 可以超过 supervised baseline 和其他 unsupervised baseline。证据说明多个 noisy transcripts 里确实能抽出稳定的任务结构。

风险是这些 benchmark 主要是人类活动/教程任务，不是机器人执行数据。要用于多机器人系统，还需要加入 scene graph grounding、agent capability matching、时间/资源约束和执行反馈。

## 开放问题

如何把抽象 task graph 自动转成机器人可执行的 task graph：每个 key step 需要绑定 object、location、required capability、expected duration、precondition、postcondition 和 failure recovery rule。

另一个问题是：多机器人任务中某些步骤可以并行执行，task graph 需要区分“真实因果前置条件”和“视频中常见但非必要的顺序偏好”。
