---
id: 2026-lap-language-action-pretraining
title: "LAP: Language-Action Pre-Training Enables Zero-shot Cross-Embodiment Transfer"
short_title: LAP-3B
year: 2026
published: 2026-02
venue: arXiv
status: read
scope: in_scope
readiness: high
action: deep_read
tech_paradigm: vla
primary_domain: VLA
domains: [LLM, VLA]
primary_technical_layer: language_action_representation
primary_task_family: cross_embodiment_transfer
platform: cross_embodiment_manipulation
planning_relevance: 把连续机器人动作块转成自然语言动作，让 VLM 直接输出较长时间尺度的可读动作命令，为 planner-to-executor 接口提供一种离散语言动作中间层。
multi_robot_relevance: 多机器人系统可以把语言动作作为跨具身、可检查、可通信的执行接口，但仍需要底层控制器把语言动作落到具体机器人动力学。
system_roles: [executor, executor_interface, foundation_policy, semantic_grounder]
reusable_modules: [language_action_pretraining, natural_language_action_format, action_chunk_to_text_converter, ce_language_action_supervision, vqa_action_cotraining, zero_shot_cross_embodiment_transfer]
evidence_level: paper_read
next_action: compare_language_action_interface
tags: [LAP, LAP-3B, VLA, language action, cross-embodiment transfer, discrete action representation]
authors: [Lihan Zha, Asher J. Hancock, Mingtong Zhang, Tenny Yin, Yixuan Huang, Dhruv Shah, Allen Z. Ren, Anirudha Majumdar]
institutions: [Princeton University, Physical Intelligence]
doi: 10.48550/arXiv.2602.10556
arxiv: 2602.10556
url: https://arxiv.org/abs/2602.10556
project_url: https://lap-vla.github.io/
code_url: https://github.com/lihzha/lap
image_url:
zotero_key:
citekey: zha2026lap
cites: [2024-pi0-vla-flow-model, 2025-pi05-open-world-generalization, 2025-fast-action-tokenization-vla]
extends: []
uses: []
enables: []
complements: []
contrasts: [2025-fast-action-tokenization-vla, 2024-pi0-vla-flow-model, 2025-pi05-open-world-generalization]
---

## 一句话结论

LAP 的核心是把机器人低层连续动作块转换成自然语言动作，让 VLM 像生成文本一样生成动作命令；它不是新增一个复杂 action head，而是把 action supervision 对齐到 VLM 原本擅长的离散语言输出空间，从而提升零样本跨具身迁移。

## 研究问题

现有 VLA 即使做了多具身预训练，动作表示仍然容易和训练时的机器人身体强耦合。π0 / π0.5 通过 flow action expert 或异构数据提升泛化，但在新机器人身体上仍可能需要适配。LAP 追问：如果把连续控制动作先翻译成自然语言动作，VLM 是否能学到更 embodiment-agnostic 的控制表示？

## 方法

LAP 设计了一个格式化的自然语言动作表示。给定从时间 t 到 t+H 的 action chunk，脚本会统计这段时间内末端执行器的累计平移、累计旋转和夹爪变化，然后生成类似 `move forward 5 cm; close gripper` 的离散文本动作。

训练时，模型输入视觉观察和任务语言，输出语言动作。公式 1 的目标可以理解为标准语言建模交叉熵：让 VLM 生成的语言动作 token 对齐到脚本从真实连续动作块自动写出的语言动作。公式 2 则定义了语言动作的格式，把一个动作块的空间位移、旋转和夹爪状态写成可读、可学习、可跨具身共享的文本。

这个设计和 FAST 的宏观思路相似：二者都不希望 VLM 直接处理极短时间尺度的连续控制细节，而是把一段时间内的动作块压缩成更适合 VLM 学习的离散表示。差异在于 FAST 用频域 token 压缩连续动作，LAP 用自然语言句子表达动作意图和粗粒度运动。

## 关键贡献

- 提出 Language-Action Pre-training：把低层机器人动作直接表示成自然语言，避免学习专门 tokenizer 或新增复杂 action head。
- 用脚本自动把连续 action chunk 转换成语言动作，降低人工标注成本。
- 通过 CE 训练让 VLM 直接输出语言动作，使动作预测和 VQA 共享同一种文本输出空间。
- 展示 LAP-3B 在未见过机器人具身上的零样本迁移能力，项目页报告平均成功率超过 50%，约为最强 prior VLA baseline 的 2 倍。
- 主要对比对象包括 π0、π0.5-DROID、π0.5-replicated 和 X-VLA，重点证明语言动作监督能改善跨具身表示。

## 阅读高光

1. LAP 的关键不是“动作变成文本”这个表面形式，而是把动作学习放回 VLM 原本的语言建模分布中。
2. 语言动作是一种可读的 action abstraction：上层 planner 可以检查、修改或组合它，比连续 action chunk 更适合作为系统接口。
3. 它和 FAST 是动作表示问题的两种答案：FAST 更偏高频压缩效率，LAP 更偏跨具身语义对齐和可解释接口。
4. 对多机器人来说，语言动作可能成为不同机器人之间共享的中间动作协议，但还需要验证它能否表达协同、避让、等待和同步动作。

## 局限

语言动作牺牲了一部分连续控制精度，最后仍需要底层控制器把文本动作落成机器人可执行轨迹。它适合表达一段时间内的粗粒度末端运动，但未必足够表达高频灵巧操作、接触动力学、双臂同步或多机器人联合动作约束。

## 和其他论文的关系

LAP 的主要对比对象是 π0、π0.5 和 FAST。π0 / π0.5 代表 VLM 加连续动作专家或异构开放世界训练的路线，FAST 和 LAP 则都在回答“如何把一段 action chunk 变成更适合 VLM 学习的离散表示”。区别在于 FAST 用频域信号压缩 action chunk，LAP 用格式化语言动作压缩 action chunk；二者的共同目标都是把 VLM 的决策时间尺度从低层瞬时动作提升到更长一段动作块，因此这里应以对比关系为主。

## 对多智能体任务规划模型的启发

LAP 对我们的仓库很重要，因为多机器人任务规划需要一个比连续控制更高层、比自然语言子任务更低层的接口。语言动作可以成为中间层：高层 planner 输出子任务和约束，执行器输出或校验 `move forward 5 cm; close gripper` 这类短程动作命令，再由各机器人本地控制器执行。

更进一步，多机器人系统可以把语言动作扩展成带主体和约束的协议，例如 `robot_1 move left 10 cm while robot_2 hold object; wait until gripper closed`。这条路线比纯连续动作更容易审计和通信，但要达到 No.1 水准，需要建立语言动作到真实物理效果的误差模型。

## 可复用模块

language-action pretraining、action chunk to text converter、natural language action schema、CE language-action supervision、VQA/action co-training、zero-shot cross-embodiment evaluation。适合加入 planner-to-executor interface 和 cross-embodiment executor abstraction。

## 证据与风险

证据来自 LAP 官方项目页和 arXiv：LAP-3B 在 YAM、Kinova、Custom Franka、DROID 等平台上展示零样本跨具身迁移，并对比 π0、π0.5-DROID、π0.5-replicated、X-VLA。风险是语言动作格式可能过于粗粒度；在精细接触、动态避障、多机器人同步和长期任务中，需要额外的低层控制与失败恢复机制。

## 开放问题

语言动作能否成为多机器人通用动作协议？如果可以，协议里应该包含哪些字段：机器人 id、参考坐标系、位移/旋转、持续时间、同步条件、资源占用、失败检测和安全约束？
