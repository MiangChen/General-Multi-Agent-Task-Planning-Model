---
id: 2026-mem-multi-scale-embodied-memory
title: "MEM: Multi-Scale Embodied Memory for Vision Language Action Models"
short_title: MEM
year: 2026
published: 2026-03
venue: arXiv / Physical Intelligence
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: vla
primary_domain: VLA
domains: [VLA, Planning]
primary_technical_layer: long_horizon_memory
primary_task_family: memory_augmented_execution
platform: long_horizon_manipulation
planning_relevance: 给 VLA 加入短期视频记忆和长期文本记忆，使执行器能够承接更长时程的任务上下文。
multi_robot_relevance: 多机器人任务规划需要每个机器人记住局部执行历史，也需要共享团队级任务进度；MEM 提供单机器人长程记忆原型。
system_roles: [memory_module, executor_context, long_horizon_state]
reusable_modules: [short_term_video_memory, long_term_language_memory, memory_augmented_policy]
evidence_level: paper_read
next_action: design_team_memory
tags: [MEM, VLA, embodied memory, long-horizon tasks, video memory, language memory]
authors: [Torne, Pertsch, Walke, Vedder, Nair, Ichter, Ren, Wang, Tang, Stachowicz, Dhabalia, Equi, Vuong, Springenberg, Levine, Finn, Driess]
institutions: [Physical Intelligence, Stanford, UC Berkeley, MIT]
doi: 10.48550/arXiv.2603.03596
arxiv: 2603.03596
url: https://arxiv.org/abs/2603.03596
project_url: https://pi.website/research/memory
pdf_path: pdfs/2026-03-01-MEM-vla-memory.pdf
image_url:
zotero_key:
citekey: torne2026mem
cites: [2025-pi06-model-card, 2025-pi05-open-world-generalization, 2024-pi0-vla-flow-model]
extends: [2025-pi06-model-card]
uses: [2025-pi05-open-world-generalization, 2024-pi0-vla-flow-model]
enables: []
contrasts: []
---

## 一句话结论

MEM 给 VLA 加入多尺度记忆：短期用视频编码处理遮挡和近期动作，长期用文本摘要记住任务进展，从而支持十几分钟级长程操作。

## 研究问题

长程真实任务要求机器人记住已经完成的步骤、对象状态和近期遮挡信息。简单堆叠历史图像会让上下文过长、推理成本过高。

## 方法

MEM 结合短期视频记忆和长期语言记忆。短期视频 encoder 保留近期视觉动态，长期文本 memory 压缩高层语义事件，并把这些记忆接入 π0.6 类 VLA 策略。

## 关键贡献

它把 VLA 从“当前观察 + 指令 -> 动作”推进到“历史事件 + 当前观察 + 指令 -> 动作”，是 π0.7 长程能力的重要基础。

## 局限

MEM 主要是单机器人长程操作记忆，不直接处理团队级共享记忆、多机器人通信、任务分配或协作状态一致性。

## 和其他论文的关系

π0.7 可以理解为在 π0、π0.6/MEM 和 world model 等模块基础上的进一步整合。MEM 补的是 VLA 的长程上下文能力。

## 对多智能体任务规划模型的启发

多机器人系统应有多层记忆：机器人本地短期记忆、机器人本地任务摘要、团队共享任务进度和全局场景状态。MEM 的视频/文本双记忆结构可以迁移到这个设计。

## 可复用模块

short-term video memory、long-term language memory、memory-augmented policy。可迁移为机器人本地记忆和团队级任务进度摘要。

## 证据与风险

证据强在长程单机器人任务；风险是共享记忆一致性、跨机器人隐私和通信成本未解决。

## 开放问题

多机器人记忆如何同步：哪些事件留在本地，哪些事件写入团队共享 memory，哪些事件用于更新 planner 的全局状态。
