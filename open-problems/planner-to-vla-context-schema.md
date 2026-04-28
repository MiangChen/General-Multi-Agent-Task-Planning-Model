---
id: planner-to-vla-context-schema
type: open_problem
title: Planner-to-VLA 上下文协议
tags: [VLA, prompt schema, task planning]
---

# Planner-to-VLA 上下文协议

多机器人 planner 不能只给 VLA 一句自然语言指令。它需要稳定表达角色、约束、前置条件、目标状态和失败恢复策略。

## 研究问题

- VLA 上下文应该是纯文本、JSON、图结构，还是多模态上下文。
- 如何表达机器人之间的互斥关系和协作依赖。
- 如何让执行器返回可被 planner 消化的状态和失败原因。

## 相关论文

- [[2025-pi05-open-world-generalization]]
- [[2026-pi07-steerable-generalist-robotic-foundation-model]]
