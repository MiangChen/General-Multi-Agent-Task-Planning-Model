---
id: 2025-fast-action-tokenization-vla
title: "FAST: Efficient Action Tokenization for Vision-Language-Action Models"
short_title: FAST
year: 2025
published: 2025-01
venue: arXiv / Physical Intelligence
status: read
scope: in_scope
readiness: high
action: build_note
tech_paradigm: vla
primary_domain: VLA
domains: [VLA]
primary_technical_layer: efficient_action_tokenization
primary_task_family: high_frequency_control
platform: dexterous_manipulation
planning_relevance: 改进 VLA 的动作表示，使高频连续动作可以被自回归模型更高效地学习。
multi_robot_relevance: 多机器人系统若把 VLA 当执行器，FAST 有助于降低高频动作 token 对训练和推理的负担。
system_roles: [action_tokenizer, executor_interface]
reusable_modules: [dct_action_tokenizer, fast_plus_tokenizer, high_frequency_action_compression]
evidence_level: paper_read
next_action: keep_as_action_interface
tags: [FAST, FAST+, VLA, action tokenization, discrete cosine transform, high-frequency control]
authors: [Pertsch, Stachowicz, Ichter, Driess, Nair, Vuong, Mees, Finn, Levine]
institutions: [Physical Intelligence, UC Berkeley, Stanford]
doi: 10.48550/arXiv.2501.09747
arxiv: 2501.09747
url: https://arxiv.org/abs/2501.09747
project_url: https://pi.website/research/fast
image_url:
zotero_key:
citekey: pertsch2025fast
cites: [2024-pi0-vla-flow-model]
extends: []
uses: []
enables: []
complements: [2024-pi0-vla-flow-model]
contrasts: []
---

## 一句话结论

FAST 用频域压缩方式对机器人动作序列做 tokenization，让自回归 VLA 能更好处理高频、灵巧、连续控制数据。

## 研究问题

朴素逐维、逐时间步动作离散化会让高频动作 token 信息量低、序列长、训练困难。论文想解决 VLA 动作 token 表示效率问题。

## 方法

FAST 使用离散余弦变换压缩动作时间序列，把连续高频动作转换为更紧凑的频域 token，并发布 FAST+ 通用动作 tokenizer。

## 关键贡献

它补上了 π0.5 中 Pre-Train 阶段的重要动作表示基础：先让 VLM 通过离散动作 token 学习大规模机器人数据，再在后训练阶段接入连续动作专家。

## 局限

FAST 主要优化动作编码和训练效率，不负责高层任务分解、长期记忆或多机器人协作。

## 和其他论文的关系

相对 RT-2 的直接动作 token 化，FAST 更关注高频连续动作的压缩。π0.5 可被理解为 FAST 式离散动作预训练和 π0 式 flow action expert 的组合。

## 对多智能体任务规划模型的启发

如果多机器人 planner 需要训练统一执行器，动作 tokenizer 的效率会影响数据规模、推理速度和跨平台泛化。FAST 提醒我们动作接口设计本身就是模型能力的一部分。

## 可复用模块

DCT action tokenizer、FAST+ tokenizer、high-frequency action compression。适合定义 planner 到 executor 之间的动作表示边界。

## 证据与风险

证据集中在动作表示效率；风险是它不解决任务分解、记忆、协作或世界预测。

## 开放问题

多机器人动作是否也需要类似 FAST 的“联合动作 tokenization”，把多个 agent 的动作序列压缩成可学习的协同动作表示。
