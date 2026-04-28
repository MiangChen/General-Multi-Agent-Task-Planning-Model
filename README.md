# General Multi-Agent Task Planning Model

An Obsidian-first research knowledge base for end-to-end multi-agent task planning models, VLA, World Action Models, and World Model RL.

Copy the prompt below and give it to another AI assistant. It should be able to set up the repository and tell you which HTML file to open.

```text
You are helping me configure a local research knowledge base repository named General-Multi-Agent-Task-Planning-Model.

Goal:
Set up the repository as an Obsidian-first paper knowledge base for end-to-end multi-agent task planning models. The current research scope includes:
- VLA models: RT-2, π0, π0.5, π0.6 / π*0.6, π0.7
- World Action Models: DreamZero / World Action Models are Zero-shot Policies
- World Model RL: DreamerV3 and DayDreamer
- How these models can serve as executors, world simulators, planner critics, or components of a general multi-agent task planning model

Repository structure:
- papers/ contains one Markdown note per paper
- topics/ contains topic pages
- findings/ contains cross-paper findings
- open-problems/ contains research gaps
- templates/paper.md is the paper-note template
- scripts/build-dashboard.mjs generates the static dashboard
- data/papers.json is generated structured paper data
- views/dashboard.html is the local dashboard to open in a browser

What I need you to do:
1. Open the repository locally.
2. Check whether Node.js is available.
3. Run:
   npm run build
4. Confirm that data/papers.json and views/dashboard.html were generated.
5. Tell me to open this file in my browser:
   views/dashboard.html

When adding a new paper:
1. Create a new Markdown file in papers/.
2. Use templates/paper.md as the schema.
3. Fill in frontmatter fields such as title, year, venue, arxiv, url, tech_paradigm, primary_technical_layer, primary_task_family, planning_relevance, and multi_robot_relevance.
4. Add short sections for:
   - 一句话结论
   - 研究问题
   - 方法
   - 关键贡献
   - 局限
   - 和其他论文的关系
   - 对多智能体任务规划模型的启发
   - 开放问题
5. Run npm run build again.
6. Reopen views/dashboard.html.

Do not set up GitHub Pages unless I explicitly ask for it.
Do not add PDFs or private Zotero data to the public repository.
```

Open this file after building:

```text
views/dashboard.html
```
