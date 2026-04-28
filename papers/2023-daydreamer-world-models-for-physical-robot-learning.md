---
id: 2023-daydreamer-world-models-for-physical-robot-learning
title: "DayDreamer: World Models for Physical Robot Learning"
short_title: DayDreamer
year: 2023
venue: CoRL
status: skimmed
scope: in_scope
readiness: medium
action: buffer
tech_paradigm: world_model_rl
primary_technical_layer: embodied_learning
primary_task_family: real_robot_learning
platform: physical_robot_learning
planning_relevance: 说明 world model 可以在真实机器人交互中学习，不必只依赖离线数据或纯仿真。
multi_robot_relevance: 多机器人系统可用类似机制让机器人从实际执行中更新局部模型。
tags: [DayDreamer, Dreamer, world model, physical robot learning, sample efficiency]
authors: [Wu, Escontrela, Hafner, Abbeel, Goldberg]
institutions: [UC Berkeley]
doi:
arxiv:
url: https://proceedings.mlr.press/v205/wu23c.html
project_url: https://sites.google.com/view/daydreamer-robot-learning/
image_url:
zotero_key:
citekey: wu2023daydreamer
---

## 一句话结论

DayDreamer 把 Dreamer 式 world model 学习带到真实机器人，强调从少量真实交互中学习行为。

## 研究问题

机器人能否通过在线真实经验和 world model，在样本效率更高的情况下学习多个物理任务。

## 方法

论文基于 Dreamer，在真实机器人上学习潜在世界模型，并通过模型预测训练策略。

## 关键贡献

它连接了 DreamerV3 的通用 world model 思路和真实机器人学习，为后续部署型 world model 提供早期证据。

## 局限

任务规模和复杂度仍远小于真实多机器人任务规划。论文不处理语言指令、任务分配或多主体通信。

## 和其他论文的关系

DayDreamer 是 Dreamer 到机器人现实交互的桥。π*0.6 也强调从真实经验中改进，但采用的是 VLA + correction/RL 的路线。

## 对多智能体任务规划模型的启发

多机器人系统可以让每个机器人维护自己的局部 world model，同时把执行经验汇总到共享能力库，服务于后续任务分配。

## 开放问题

多个机器人并行收集经验时，如何避免不同机器人策略变化导致的非平稳数据污染 world model。
