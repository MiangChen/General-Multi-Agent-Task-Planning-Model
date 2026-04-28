# General Multi-Agent Task Planning Model

An Obsidian-first research knowledge base for end-to-end multi-agent task planning models, VLA, World Action Models, and World Model RL.

Copy the prompt below and give it to another AI assistant. It only needs to configure the local HTML dashboard and tell you which file to open.

```text
You are helping me configure the local HTML dashboard for this repository.

Goal:
Build the static dashboard HTML from the existing repository files. Do not add papers, do not change the research content, and do not configure hosting.

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
5. Tell me to open this local HTML file in my browser:
   views/dashboard.html

Do not set up GitHub Pages unless I explicitly ask for it.
Do not push, publish, upload, or expose any files unless I explicitly ask for it.
```

Open this file after building:

```text
views/dashboard.html
```
