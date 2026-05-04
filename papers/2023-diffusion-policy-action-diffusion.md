---
id: 2023-diffusion-policy-action-diffusion
title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion"
short_title: Diffusion Policy
year: 2023
published: 2023-03
venue: RSS 2023 / IJRR 2024
status: read
scope: in_scope
readiness: high
action: deep_read
tech_paradigm: robot_diffusion_policy
primary_domain: Diffusion
domains: [Diffusion, VLA, World Action Model, RL]
primary_technical_layer: action_diffusion_policy
primary_task_family: visuomotor_diffusion_policy
platform: imitation_manipulation
planning_relevance: 为高层 planner 提供了一个稳定的连续动作执行器接口：给定视觉观测和目标上下文，生成一段可执行 action chunk，并用滚动时域控制持续重规划。
multi_robot_relevance: 多机器人系统可以把每个机器人局部执行器建模成 diffusion action chunk policy，再由上层 planner 分配子任务、约束和失败恢复逻辑。
system_roles: [executor, foundation_policy, executor_interface]
reusable_modules: [conditional_action_diffusion, action_chunk_diffusion, receding_horizon_control, visual_conditioning, time_series_diffusion_transformer, multimodal_action_distribution, stochastic_langevin_action_sampling]
evidence_level: paper_read
next_action: extract_robot_diffusion_design
tags: [Diffusion Policy, action diffusion, visuomotor policy, imitation learning, robot manipulation, receding horizon control]
authors: [Cheng Chi, Zhenjia Xu, Siyuan Feng, Eric Cousineau, Yilun Du, Benjamin Burchfiel, Russ Tedrake, Shuran Song]
institutions: [Columbia University, Toyota Research Institute, MIT, Stanford University]
doi: 10.48550/arXiv.2303.04137
arxiv: 2303.04137
url: https://arxiv.org/abs/2303.04137
project_url: https://diffusion-policy.cs.columbia.edu/
pdf_path: pdfs/2023-03-01-Diffusion-Policy-robot-diffusion.pdf
image_url:
zotero_key:
citekey: chi2023diffusionpolicy
cites: []
extends: []
uses: []
enables: [2024-pi0-vla-flow-model, 2026-world-action-models-zero-shot-policies, 2026-fast-wam-test-time-future-imagination]
contrasts: [2023-rt-2-vla]
---

## 一句话结论

Diffusion Policy 把机器人策略从“直接回归下一步动作”改成“条件扩散生成一段连续动作轨迹”，是独立于 VLA 语义路线之外的机器人动作生成根路线，也是后续 flow/diffusion action policy 和 WAM 低层动作生成的重要源头。

## 研究问题

传统 visuomotor imitation learning 常把策略写成确定性回归或简单混合分布：输入图像和机器人状态，直接输出下一步动作。这在机器人操作里会遇到三个问题。第一，同一个视觉状态下可能有多种合理动作，比如从左边绕或从右边绕，均值回归会把多峰动作压成一个不可执行的平均动作。第二，复杂操作需要连续、平滑、高维的动作序列，而不是孤立的一步动作。第三，真实机器人控制需要稳定训练和闭环重规划，不能只生成离线轨迹。

这篇论文的核心问题是：能否把扩散模型的强分布建模能力搬到机器人动作空间，让策略学习的是 action distribution，而不是单点动作回归。

## 方法

Diffusion Policy 的基本设计可以拆成四步。

第一，把动作当成生成对象。模型不是生成图片，而是生成未来一小段动作序列，也就是 action chunk。训练数据来自专家示教轨迹，标签是一段连续的末端位姿、关节或夹爪动作。

第二，对专家动作加噪声。训练时从真实 action chunk 采样一个扩散时间步，把高斯噪声加到动作序列上，让网络在视觉观测、机器人状态和扩散时间步条件下预测噪声或干净动作。这样学到的是条件动作分布 `p(action_chunk | observation)`。

第三，推理时从噪声里“去噪出动作”。部署时先采样一段随机噪声动作，再经过多步 denoising / Langevin-style refinement，把噪声逐渐变成一段平滑、可执行、符合当前观测的动作 chunk。这个过程可以理解成：策略不是一次性吐出答案，而是在动作空间里迭代优化一个候选轨迹。

第四，只执行前几步，然后重新规划。论文把 diffusion action chunk 和 receding horizon control 结合起来：每次生成一段未来动作，但机器人只执行最靠前的一小段，随后读取新观测再次生成下一段动作。这样既保留了动作序列的时间一致性，又能在执行中对扰动、遮挡和偏差做闭环修正。

架构上，论文强调 visual conditioning 和 time-series diffusion transformer：视觉编码器负责把图像变成条件特征，时序扩散模型负责在动作序列维度上建模多步动作之间的依赖。

## 关键贡献

- 把 diffusion model 明确引入真实机器人 visuomotor policy learning，而不是只用于图像、视频或离线轨迹生成。
- 用 action chunk diffusion 替代单步动作回归，使策略天然适合连续、高维、平滑的机器人控制。
- 用 receding horizon control 解决闭环部署问题：生成长一点，只执行短一点，再根据新观测重规划。
- 展示 diffusion policy 对多峰动作分布更友好：同一状态下有多个可行动作模式时，模型可以在一次 rollout 中选择并坚持其中一个模式，而不是输出模式平均值。
- 证明 diffusion 形式在机器人策略训练中具备较好的稳定性，并在多类仿真和真实操作任务上优于当时的模仿学习基线。

## 机器人 Diffusion 的基本设计思路

如果要向别人解释机器人 diffusion policy，可以抓住这条主线：

机器人控制里的 diffusion 不是“让机器人想象图片”，而是“让机器人在动作空间里生成一段未来控制序列”。输入是当前视觉和状态，输出是一段 action chunk。训练时把专家动作加噪声，让模型学会把脏动作还原成干净动作；推理时从纯噪声开始，多次去噪得到动作序列；执行时只执行前几步，再用新观测重新生成。

这个范式有三个直觉优势。第一，它把策略学习变成条件生成，所以可以表达多峰动作。第二，它一次生成动作序列，所以比单步回归更容易保持动作平滑和时间一致。第三，它和 MPC / receding horizon 很自然地兼容，所以可以边执行边修正。

## 局限

Diffusion Policy 主要解决低层连续控制和 imitation learning，不解决高层任务规划、语言分解、多机器人任务分配或世界状态预测。它也不像 DreamZero / WAM 那样显式预测未来视频或世界状态，因此严格说它不是 WAM；它也不是 VLA，因为没有把语言语义作为核心建模目标。更准确的定位是：机器人 Diffusion/生成式动作策略，是 VLA 和 WAM 都可以调用或继承的低层动作生成路线。

扩散采样需要多步去噪，实时性会成为工程瓶颈。后来的 flow matching、consistency、action tokenization、单步生成和缓存优化，本质上都在回答同一个问题：如何保留生成式动作分布的表达能力，同时把推理速度压到机器人闭环控制可接受的范围。

## 和其他论文的关系

Diffusion Policy 和 RT-2 代表 2023 年机器人策略的两条根路线：RT-2 属于 VLA，核心是把互联网 VLM 知识迁移到离散动作 token；Diffusion Policy 属于 Diffusion 动作生成路线，核心是把连续机器人动作建模成条件生成分布。前者强调语义泛化，后者强调连续控制和多峰动作分布。

π0 把这个思想进一步推广到 robot foundation model：不用扩散而用 flow matching 生成连续 action chunk，但核心问题仍然是如何从视觉语言上下文生成稳定的连续动作段。DreamZero / WAM 则在 Diffusion Policy 的动作生成思想上再往前走一步：不只生成动作，还联合建模未来视频世界状态。Fast-WAM 继续追问测试时是否真的需要显式未来视觉想象，但它仍然继承了“生成式动作模型可以作为机器人策略”的大方向。

## 对多智能体任务规划模型的启发

对我们的 General Multi-Agent Task Planning Model 来说，Diffusion Policy 更适合放在低层 executor，而不是高层 planner。高层 planner 负责子任务分解、机器人分配、约束和协作时序；每个机器人本地可以用 diffusion policy 接收结构化子目标和局部观测，输出可执行 action chunk。

真正值得借鉴的是接口形式：planner 不应该只调用“下一步动作”，而应该调用“带前置条件、目标、禁区、期望后置状态和失败反馈的 action chunk executor”。如果未来要做 multi-agent diffusion policy，可以把联合动作表示成多个机器人 action chunk 的组合，再加入 collision、resource occupancy 和 communication action 约束。

## 可复用模块

conditional action diffusion、action chunk diffusion、visual conditioning、time-series diffusion transformer、receding horizon control、multimodal action distribution modeling、Langevin-style action sampling。适合作为多机器人系统里每个机器人本地执行器的动作生成核心，也适合作为后续 WAM action head 的历史源头。

## 证据与风险

证据强在多个机器人操作 benchmark 和真实任务，且项目页公开代码、数据和训练细节。风险是它没有解决世界模型、任务规划和多智能体协同；如果直接把它当成多机器人 planner，会缺少任务级记忆、角色分配、长期后果评估和失败恢复机制。

## 开放问题

多机器人场景中，diffusion policy 应该给每个机器人单独生成 action chunk，还是一次生成联合 action chunk？如果采用联合扩散，如何避免联合动作空间随机器人数量指数增长，并让模型显式满足碰撞、遮挡、共享资源和通信时序约束。
