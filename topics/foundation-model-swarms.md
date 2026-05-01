---
id: foundation-model-swarms
type: topic
title: Foundation Model Swarms
tags: [foundation models, robot swarms, overview, LLM, edge computing]
---

# Foundation Model Swarms

这一主题不是单个低层控制算法，而是 foundation models 如何进入 robot swarms 的系统层路线。核心问题是：FM 应该作为 swarm designer、swarm operator、planner critic、安全审计器，还是端侧执行模型。

## 关键论文

- [[2026-foundation-models-robot-swarms]]
- [[2026-genswarm-multi-robot-code-policy]]

## 关键路线

- FM as swarm designer：从自然语言、草图、示范或任务约束生成控制器和任务计划。
- FM as swarm operator：把传感器、通信、人类指令和历史上下文转成可执行机器人 API 调用。
- Simulation-feedback fine-tuning：用物理仿真或 VLM 评估学习 micro-macro link。
- Robot-generated-data fine-tuning：用真实机器人传感器和通信数据补足 human-data FMs 的机器视角缺口。
- Code-security fine-tuning：专门检测控制器漏洞、恶意逻辑和 prompt injection 风险。
- Edge-model fine-tuning：结合量化、剪枝、蒸馏和注意力加速，让模型能跑在单个集群机器人上。

## 对 No.1 论文索引的价值

这类 overview/foundation 节点用来定义研究版图和未来路线，不和具体算法论文混在一起。它告诉我们哪些具体论文只是局部模块，哪些问题是整个领域还没解决的系统级瓶颈。
