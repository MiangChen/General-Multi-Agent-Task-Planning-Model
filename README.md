# General Multi-Agent Task Planning Model

一个面向通用多智能体任务规划模型、VLA、World Action Model 和 World Model RL 的 Obsidian-first 论文知识库原型。

这个仓库的第一版目标很克制：

- 每篇论文一个 Markdown note
- 用 frontmatter 保存可计算的结构化元数据
- 用正文保存人工或 agent 生成的研究理解
- 从 `papers/*.md` 自动生成 `views/dashboard.html`
- 后续再接 Zotero / Better BibTeX / MCP

## 使用

```bash
npm run build
```

生成后直接打开：

```text
views/dashboard.html
```

## 目录

```text
papers/         论文 note，每篇论文一个文件
topics/         主题页，例如 general-multi-agent-task-planning-model
findings/       跨论文发现
open-problems/  开放问题
scripts/        生成脚本
views/          生成的 HTML dashboard
data/           生成的中间数据
assets/         后续放本地图片和附件索引
templates/      note 模板
```

## 当前主题

- VLA：RT-2、π0、π0.5、π0.6 / π*0.6、π0.7
- World Action Model：DreamZero / World Action Models are Zero-shot Policies
- World Model RL：DreamerV3、DayDreamer
- 通用多智能体任务规划模型：把上述模型定位为任务分解、动作可行性评估、执行器或世界模拟器

## 推荐工作流

1. 在 Zotero 中保存论文和 PDF。
2. 用 Better BibTeX 固定 citekey。
3. 在 `papers/` 中创建同名 Markdown note。
4. 让 agent 补全摘要、技术路线、局限、和多智能体任务规划模型的关系。
5. 运行 `npm run build` 生成 dashboard。

Zotero 不是第一版的硬依赖。这里先把 `zotero_key`、`citekey`、`doi`、`arxiv` 等字段预留出来。
