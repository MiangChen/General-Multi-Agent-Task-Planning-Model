# Agent Prompts

This repository should be maintained as a research operating system, not as a passive paper list. Copy one prompt into an AI assistant when you want a specific maintenance workflow.

## Paper Ingest Agent

```text
You are maintaining this local research graph repository.

Goal:
Add one new paper note without changing unrelated content.

Inputs I will provide:
- paper title or PDF/arXiv URL
- optional notes from my reading

Tasks:
1. Create one Markdown note in papers/ using templates/paper.md.
2. Fill core metadata: title, short_title, year, published, venue, DOI/arXiv/URL/project, authors, institutions.
3. Classify the paper into domains, primary technical layer, task family, platform, system_roles, reusable_modules, evidence_level, next_action.
4. Write the reading sections:
   - 一句话结论
   - 研究问题
   - 方法
   - 关键贡献
   - 局限
   - 和其他论文的关系
   - 对多智能体任务规划模型的启发
   - 可复用模块
   - 证据与风险
   - 开放问题
5. Propose typed relations to existing papers using only these fields: extends, uses, enables, complements, contrasts, cites.
6. Run npm run build and report the generated dashboard status.

Rules:
- Do not invent papers.
- Distinguish strict citation from idea lineage.
- Prefer typed relations over dumping everything into cites.
- If evidence is weak, mark evidence_level as skimmed and next_action as relation_audit or deep_read.
```

## Relation Audit Agent

```text
You are auditing the typed relation graph in this repository.

Goal:
Improve the idea graph quality without adding new papers.

Tasks:
1. Read all papers/*.md frontmatter.
2. Check whether each typed relation is directionally correct:
   - child -> parent / prior work
   - clicking a parent should not imply child edges
3. For each relation, decide whether it should be extends, uses, enables, complements, contrasts, or cites.
4. Remove weak edges that are not useful for research decisions.
5. Keep a short audit note in your final response listing changed edges and why.
6. Run npm run build.

Rules:
- Do not use cites for vague “related” edges if a typed relation is clearer.
- Do not add reverse edges unless the reverse has a distinct meaning.
- Prefer fewer, stronger edges.
```

## Deep Reading Agent

```text
You are upgrading one paper note from skimmed/read to deep_read.

Goal:
Make the note useful for designing a General Multi-Agent Task Planning Model.

Tasks:
1. Read the current paper note.
2. Strengthen these sections:
   - 方法
   - 关键贡献
   - 局限
   - 和其他论文的关系
   - 对多智能体任务规划模型的启发
   - 可复用模块
   - 证据与风险
3. Update system_roles, reusable_modules, evidence_level, next_action.
4. Add or prune typed relations if needed.
5. Run npm run build.

Rules:
- Focus on reusable mechanisms, not generic summaries.
- Explicitly separate “what the paper proves” from “what we infer for our model”.
- Surface risks and missing evidence.
```

## Gap Finder Agent

```text
You are finding research gaps from this repository.

Goal:
Generate actionable open problems for our model design.

Tasks:
1. Read data/papers.json or papers/*.md.
2. Group papers by system_roles and reusable_modules.
3. Identify missing links between:
   - semantic planner
   - task allocator
   - world simulator / planner critic
   - executor
   - memory module
   - recovery policy
4. Produce 5 high-value gaps with:
   - why it matters
   - which papers support it
   - what experiment would test it
   - what repository note should be updated

Rules:
- Favor gaps that could become experiments or model components.
- Avoid generic “need more data” conclusions unless tied to a concrete module.
```

## System Design Mapper Agent

```text
You are turning this paper graph into a system architecture.

Goal:
Draft a model design from the current research graph.

Tasks:
1. Use system_roles and reusable_modules to propose modules for a General Multi-Agent Task Planning Model.
2. For each module, list supporting papers and unresolved risks.
3. Propose interfaces between modules:
   - planner -> task allocator
   - task allocator -> executor
   - executor -> memory
   - world simulator -> planner critic
   - recovery policy -> planner
4. Identify which modules are already well supported and which need more reading.

Rules:
- Keep claims tied to paper notes.
- Do not overfit to one paper family.
- Treat VLA and WAM as components, not the entire system.
```
