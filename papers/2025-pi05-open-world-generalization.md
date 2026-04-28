---
id: 2025-pi05-open-world-generalization
title: "π0.5: a Vision-Language-Action Model with Open-World Generalization"
short_title: π0.5
year: 2025
venue: arXiv / Physical Intelligence
status: read
scope: in_scope
readiness: high
action: deep_read
tech_paradigm: vla
primary_technical_layer: open_world_generalization
primary_task_family: long_horizon_execution
platform: mobile_manipulator
planning_relevance: 通过高层语义预测和低层动作结合，接近“子任务规划 + 执行”的一体化形式。
multi_robot_relevance: 对多机器人有启发的是层级设计，但论文主要仍是单机器人家庭环境泛化。
tags: [π0.5, VLA, open-world generalization, long-horizon tasks, semantic subtask prediction]
authors: [Physical Intelligence, Black, Brown, Driess, Finn, Hausman, Ichter, Levine, Pertsch]
institutions: [Physical Intelligence]
doi: 10.48550/arXiv.2504.16054
arxiv: 2504.16054
url: https://arxiv.org/abs/2504.16054
project_url: https://www.physicalintelligence.company/download/pi05.pdf
image_url:
zotero_key:
citekey: physicalintelligence2025pi05
---

## 一句话结论

π0.5 关注开放世界泛化，把多机器人、多任务、网页数据、目标检测和语义子任务预测合并到 VLA 训练中。

## 研究问题

VLA 能否在训练环境之外的真实家庭中完成长程灵巧任务，而不是只在实验室桌面任务上泛化。

## 方法

模型使用异构任务 co-training，并混合图像观察、语言命令、对象检测、语义子任务预测和低层动作数据。

## 关键贡献

π0.5 明确把“高层语义子任务预测”和“低层动作生成”放在一个系统里，展示了 VLA 从短程操作向长程任务的推进。

## 局限

泛化主要是新环境、新物体和家庭任务层面的泛化，还不是多机器人协同层面的泛化。

## 和其他论文的关系

π0.5 是 π0 的开放世界扩展。π0.7 后续用更丰富的上下文条件让模型可被更精细地 steer，减少多策略数据混合造成的平均化问题。

## 对多智能体任务规划模型的启发

语义子任务预测可以借鉴到多机器人 planner 中：先预测任务分解，再依据机器人能力、位置和负载分派执行。

## 开放问题

如果一个任务需要多个机器人协同完成，语义子任务预测应由中央模型统一产生，还是由每个机器人局部产生再协商合并。
