---
id: 2025-pi06-model-card
title: "π0.6 Model Card"
short_title: π0.6
year: 2025
venue: Model Card / Physical Intelligence
status: skimmed
scope: in_scope
readiness: medium
action: buffer
tech_paradigm: vla
primary_technical_layer: deployment_generalization
primary_task_family: robust_execution
platform: multi_embodiment_manipulation
planning_relevance: 作为部署型通用策略模型，用于评估任务执行成功率和机器人能力边界。
multi_robot_relevance: 可用于为不同硬件实例提供能力模型，但公开信息不足以支撑严肃多机器人 planner 设计。
tags: [π0.6, VLA, deployment, robot foundation model, model card]
authors: [Physical Intelligence]
institutions: [Physical Intelligence]
doi:
arxiv:
url: https://website.pi-asset.com/pi06star/PI06_model_card.pdf
project_url: https://physicalintelligence.company/
image_url:
zotero_key:
citekey: physicalintelligence2025pi06
---

## 一句话结论

π0.6 是 π0.5 后续的部署型模型迭代，保留高层子任务预测和低层动作生成的层级设计，并改进骨干、提示和训练数据。

## 研究问题

在真实长程任务中，VLA 如何进一步提升鲁棒性、减少失败并适配更多部署场景。

## 方法

公开材料显示 π0.6 继续采用层级 VLA 架构，生成 action chunks，并结合改进后的 VLM backbone、prompt 设计和训练数据。

## 关键贡献

π0.6 对你的知识库的价值在于承接 π0.5 与 π*0.6：它是后续真实世界经验学习和部署报告的基础模型。

## 局限

它更像模型卡和技术更新，不是完整论文。需要谨慎标注证据等级，避免把营销材料当成 peer-reviewed 结论。

## 和其他论文的关系

π*0.6 在 π0.6 基础上通过 RECAP 加入经验、纠错和强化学习式改进；π0.7 进一步强调上下文条件和组合泛化。

## 对多智能体任务规划模型的启发

可以把 π0.6 作为“机器人能力模型”的来源：不同平台在不同任务上的成功率、失败类型和恢复能力可以反馈给任务分配器。

## 开放问题

如何从 VLA 部署日志中自动估计每个机器人在不同子任务上的 success probability 和 expected duration。
