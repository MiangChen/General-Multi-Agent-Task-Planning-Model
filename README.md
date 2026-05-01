# General Multi-Agent Task Planning Model

An Obsidian-first research graph for end-to-end multi-agent task planning models, VLA, World Action Models, and World Model RL. The dashboard is organized around typed paper relations such as `extends`, `uses`, `complements`, `contrasts`, and `cites`, so the repository can represent idea lineage instead of only listing papers.

Copy the prompt below and give it to another AI assistant. It only needs to configure the local HTML dashboard, generate rendered paper note pages, and tell you which file to open.

```text
You are helping me configure the local HTML dashboard for this repository.

Goal:
Build the static dashboard HTML from the existing repository files. Do not add papers, do not change the research content, and do not configure hosting.

Repository structure:
- papers/ contains one Markdown note per paper
- paper notes use typed relation fields: extends, uses, enables, complements, contrasts, cites
- the dashboard includes a typed relation graph, benchmark watch panel, index quality panel, system role map, reading action queue, agent workflow cards, searchable paper list, and open-problem summary
- topics/ contains topic pages
- findings/ contains cross-paper findings
- open-problems/ contains research gaps
- templates/paper.md is the paper-note template
- AGENT_PROMPTS.md contains maintenance prompts for paper ingest, relation audit, deep reading, gap finding, and system design mapping
- scripts/build-dashboard.mjs generates the static dashboard
- data/papers.json is generated structured paper data
- notes/*.html are generated rendered note pages; open these instead of raw papers/*.md when reading in a browser
- index.html is the local research graph dashboard to open in a browser

What I need you to do:
1. Open the repository locally.
2. Check whether Node.js is available.
3. Run:
   npm run build
4. Confirm that data/papers.json and index.html were generated.
5. Confirm that notes/*.html rendered paper note pages were generated.
6. Tell me to open this local HTML file in my browser:
   index.html

Do not set up GitHub Pages unless I explicitly ask for it.
Do not push, publish, upload, or expose any files unless I explicitly ask for it.
```

Open this file after building:

```text
index.html
```
