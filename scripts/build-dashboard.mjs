import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, watch } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const papersDir = join(rootDir, "papers");
const dataDir = join(rootDir, "data");
const viewsDir = join(rootDir, "views");
const docsDir = join(rootDir, "docs");
const watchMode = process.argv.includes("--watch");

const fieldLabels = {
  tech_paradigm: "技术范式",
  primary_technical_layer: "主技术层",
  primary_task_family: "任务族",
  platform: "平台",
};

const valueLabels = {
  vla: "VLA",
  vla_flow_policy: "VLA Flow Policy",
  vla_rl: "VLA + RL",
  world_action_model: "World Action Model",
  world_model_rl: "World Model RL",
  semantic_grounding: "语义落地",
  action_representation: "动作表示",
  open_world_generalization: "开放世界泛化",
  deployment_generalization: "部署泛化",
  policy_improvement: "策略改进",
  compositional_generalization: "组合泛化",
  dynamics_prediction: "动态预测",
  imagination_planning: "想象规划",
  embodied_learning: "真实机器人学习",
  language_conditioned_execution: "语言条件执行",
  generalist_robot_control: "通用机器人控制",
  long_horizon_execution: "长程执行",
  robust_execution: "鲁棒执行",
  experience_driven_recovery: "经验驱动恢复",
  steerable_long_horizon_execution: "可控长程执行",
  zero_shot_policy: "零样本策略",
  latent_world_model_control: "潜在世界模型控制",
  real_robot_learning: "真实机器人学习",
  single_robot_manipulation: "单机器人操作",
  multi_embodiment_manipulation: "多具身操作",
  mobile_manipulator: "移动操作机器人",
  cross_embodiment_manipulation: "跨具身操作",
  heterogeneous_robot_data: "异构机器人数据",
  simulated_control_domains: "仿真控制域",
  physical_robot_learning: "真实机器人学习",
  in_scope: "范围内",
  candidate: "候选",
  out_of_scope: "范围外",
  unread: "未读",
  skimmed: "略读",
  read: "已读",
  low: "低",
  medium: "中",
  high: "高",
  ignore: "忽略",
  buffer: "缓存",
  build_note: "建 note",
  deep_read: "精读",
};

const palette = [
  "#246bfe",
  "#00a7c7",
  "#6a7dff",
  "#3a92d8",
  "#7c67d8",
  "#188aa6",
  "#4b6f96",
  "#2f80ed",
  "#4a56b8",
  "#0f7894",
];

function parseValue(raw) {
  const value = raw.trim();
  if (!value) return "";
  if (value === "[]") return [];
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(",")
      .map((item) => stripQuotes(item.trim()))
      .filter(Boolean);
  }
  return stripQuotes(value);
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function parseFrontmatter(text, filePath) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error(`${relative(rootDir, filePath)} is missing frontmatter`);
  }

  const meta = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const index = line.indexOf(":");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1);
    meta[key] = parseValue(value);
  }

  return {
    meta,
    body: text.slice(match[0].length),
  };
}

function section(text, heading) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) return "";

  const collected = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("## ")) break;
    collected.push(line);
  }

  return collected.join("\n").trim();
}

function asList(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
}

function label(value) {
  return valueLabels[value] ?? value;
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function markdownToHtml(text) {
  if (!text) return "";
  return text
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

async function readPapers() {
  const entries = await readdir(papersDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => join(papersDir, entry.name))
    .sort();

  const papers = [];
  for (const filePath of files) {
    const raw = await readFile(filePath, "utf8");
    const { meta, body } = parseFrontmatter(raw, filePath);
    papers.push({
      ...meta,
      year: Number(meta.year),
      file: relative(rootDir, filePath),
      summary: section(body, "一句话结论"),
      research_question: section(body, "研究问题"),
      method: section(body, "方法"),
      contribution: section(body, "关键贡献"),
      limitation: section(body, "局限"),
      relation: section(body, "和其他论文的关系"),
      planning_insight: section(body, "对多智能体任务规划模型的启发"),
      open_question: section(body, "开放问题"),
    });
  }

  return papers.sort((a, b) => a.year - b.year || a.short_title.localeCompare(b.short_title));
}

function uniqueValues(papers, field) {
  return [
    ...new Set(
      papers
        .map((paper) => paper[field])
        .filter(Boolean)
        .map(String),
    ),
  ].sort((a, b) => label(a).localeCompare(label(b), "zh-CN"));
}

function countBy(papers, field) {
  const counts = new Map();
  for (const paper of papers) {
    const value = paper[field];
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

function yearRange(papers) {
  const years = papers.map((paper) => paper.year).filter(Number.isFinite);
  const min = Math.min(...years);
  const max = Math.max(...years);
  return Array.from({ length: max - min + 1 }, (_, index) => min + index);
}

function renderOptions(values) {
  return values
    .map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(label(value))}</option>`)
    .join("\n");
}

function renderStats(papers) {
  const years = yearRange(papers);
  const highReadiness = papers.filter((paper) => paper.readiness === "high").length;
  const inScope = papers.filter((paper) => paper.scope === "in_scope").length;
  return `
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${papers.length}</div>
        <div class="stat-label">论文总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${years[0]}-${years.at(-1)}</div>
        <div class="stat-label">年份范围</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${inScope}</div>
        <div class="stat-label">范围内论文</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${highReadiness}</div>
        <div class="stat-label">高优先级</div>
      </div>
    </div>
  `;
}

function renderTimeline(papers, field) {
  const years = yearRange(papers);
  const values = uniqueValues(papers, field);
  const totals = countBy(papers, field);
  const colorByValue = new Map(values.map((value, index) => [value, palette[index % palette.length]]));

  const rows = values
    .map((value) => {
      const cells = years
        .map((year) => {
          const count = papers.filter((paper) => paper.year === year && paper[field] === value).length;
          if (!count) return `<td></td>`;
          const size = 28 + Math.min(count, 5) * 7;
          return `<td><button class="bubble" style="--size:${size}px; --bubble:${colorByValue.get(value)}" data-field="${field}" data-value="${escapeHtml(value)}" data-year="${year}" aria-label="${escapeHtml(label(value))} ${year} ${count} 篇">${count}</button></td>`;
        })
        .join("");

      return `
        <tr>
          <th>
            <span class="swatch" style="--swatch:${colorByValue.get(value)}"></span>
            <span>${escapeHtml(label(value))}</span>
            <small>${totals.get(value)} 篇</small>
          </th>
          ${cells}
        </tr>
      `;
    })
    .join("\n");

  return `
    <section class="section" id="${field}">
      <div class="section-kicker">${escapeHtml(fieldLabels[field])}</div>
      <div class="section-head">
        <div>
          <h2>${escapeHtml(fieldLabels[field])}时间轴</h2>
          <p>点击气泡可以联动筛选下方论文列表。</p>
        </div>
        <button class="icon-button" data-reset>重置</button>
      </div>
      <div class="timeline-wrap">
        <table class="timeline">
          <thead>
            <tr>
              <th>标签</th>
              ${years.map((year) => `<th>${year}</th>`).join("")}
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderPapers(papers) {
  return papers
    .map((paper) => {
      const tags = asList(paper.tags)
        .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join("");
      const authors = asList(paper.authors).slice(0, 6).join(", ");
      const institutions = asList(paper.institutions).join(" · ");
      const links = [
        paper.url ? `<a href="${escapeHtml(paper.url)}" target="_blank" rel="noreferrer">论文</a>` : "",
        paper.project_url
          ? `<a href="${escapeHtml(paper.project_url)}" target="_blank" rel="noreferrer">项目页</a>`
          : "",
        paper.doi ? `<a href="https://doi.org/${escapeHtml(paper.doi)}" target="_blank" rel="noreferrer">DOI</a>` : "",
      ]
        .filter(Boolean)
        .join("");

      return `
        <article class="paper-card"
          data-paper-card
          data-year="${paper.year}"
          data-tech_paradigm="${escapeHtml(paper.tech_paradigm)}"
          data-primary_technical_layer="${escapeHtml(paper.primary_technical_layer)}"
          data-primary_task_family="${escapeHtml(paper.primary_task_family)}"
          data-search="${escapeHtml(
            [
              paper.title,
              paper.short_title,
              paper.venue,
              paper.summary,
              paper.method,
              paper.contribution,
              asList(paper.tags).join(" "),
              authors,
              institutions,
            ].join(" ").toLowerCase(),
          )}">
          <div class="paper-media">
            ${
              paper.image_url
                ? `<img src="${escapeHtml(paper.image_url)}" alt="${escapeHtml(paper.short_title)}" loading="lazy">`
                : `<div class="paper-placeholder">${escapeHtml(paper.short_title)}</div>`
            }
            <span>${paper.year}</span>
          </div>
          <div class="paper-main">
            <div class="paper-meta">
              <strong>${escapeHtml(paper.venue)}</strong>
              <span>${escapeHtml(label(paper.tech_paradigm))}</span>
              <span>${escapeHtml(label(paper.primary_technical_layer))}</span>
              <span>${escapeHtml(label(paper.readiness))}优先级</span>
            </div>
            <h3>${escapeHtml(paper.short_title)}</h3>
            <div class="paper-title">${escapeHtml(paper.title)}</div>
            <div class="paper-authors">${escapeHtml(authors)} · ${escapeHtml(institutions)}</div>
            <div class="paper-summary">${markdownToHtml(paper.summary)}</div>
            <details>
              <summary>研究理解</summary>
              <div class="detail-grid">
                <div><b>研究问题</b>${markdownToHtml(paper.research_question)}</div>
                <div><b>方法</b>${markdownToHtml(paper.method)}</div>
                <div><b>局限</b>${markdownToHtml(paper.limitation)}</div>
                <div><b>关系</b>${markdownToHtml(paper.relation)}</div>
                <div><b>对多智能体任务规划模型的启发</b>${markdownToHtml(paper.planning_insight)}</div>
              </div>
            </details>
            <div class="paper-tags">${tags}</div>
            <div class="paper-links">${links}</div>
          </div>
        </article>
      `;
    })
    .join("\n");
}

function renderOpenQuestions(papers) {
  return papers
    .filter((paper) => paper.open_question)
    .map(
      (paper) => `
      <div class="question-card">
        <div class="question-meta">${paper.year} · ${escapeHtml(paper.short_title)}</div>
        <h3>${escapeHtml(label(paper.primary_technical_layer))}</h3>
        ${markdownToHtml(paper.open_question)}
      </div>
    `,
    )
    .join("\n");
}

function renderIndex(papers) {
  const techValues = uniqueValues(papers, "tech_paradigm");
  const layerValues = uniqueValues(papers, "primary_technical_layer");
  const taskValues = uniqueValues(papers, "primary_task_family");
  const years = yearRange(papers);
  const generatedAt = new Date().toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour12: false,
  });

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>通用多智能体任务规划模型知识库</title>
  <style>
    :root {
      --bg: #eef4fb;
      --paper: rgba(255, 255, 255, 0.76);
      --paper-strong: rgba(255, 255, 255, 0.92);
      --ink: #111827;
      --muted: #64748b;
      --line: rgba(74, 112, 154, 0.38);
      --soft-line: rgba(133, 163, 196, 0.24);
      --green: #0f91b8;
      --gold: #286bfe;
      --red: #d14d72;
      --blue: #246bfe;
      --purple: #6a7dff;
      --glow: rgba(36, 107, 254, 0.18);
      --cyan-glow: rgba(0, 167, 199, 0.18);
      --shadow: 0 18px 45px rgba(22, 50, 83, 0.12);
      --serif: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background:
        radial-gradient(circle at 18% 12%, rgba(36, 107, 254, 0.14), transparent 28rem),
        radial-gradient(circle at 86% 18%, rgba(0, 167, 199, 0.16), transparent 26rem),
        linear-gradient(var(--soft-line) 1px, transparent 1px),
        linear-gradient(90deg, var(--soft-line) 1px, transparent 1px),
        var(--bg);
      background-size: auto, auto, 32px 32px, 32px 32px, auto;
      color: var(--ink);
      font-family: var(--sans);
      line-height: 1.65;
    }

    a { color: inherit; }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 14px 32px;
      background: rgba(248, 251, 255, 0.82);
      border-bottom: 1px solid var(--soft-line);
      backdrop-filter: blur(18px);
      box-shadow: 0 1px 0 rgba(255,255,255,0.75), 0 14px 35px rgba(31, 76, 128, 0.08);
    }

    .brand {
      font-family: var(--mono);
      font-size: 20px;
      font-weight: 700;
      text-decoration: none;
      color: var(--blue);
    }

    .nav {
      display: flex;
      gap: 18px;
      color: var(--muted);
      font-size: 14px;
    }

    .nav a {
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: color 0.16s ease, border-color 0.16s ease;
    }

    .nav a:hover {
      color: var(--blue);
      border-color: var(--blue);
    }

    .page {
      width: min(1200px, calc(100% - 48px));
      margin: 0 auto;
    }

    .hero {
      padding: 84px 0 56px;
      position: relative;
    }

    .eyebrow {
      color: var(--blue);
      font-family: var(--mono);
      font-size: 13px;
      margin-bottom: 14px;
    }

    h1, h2, h3 {
      margin: 0;
      line-height: 1.14;
    }

    h1 {
      max-width: 920px;
      font-family: var(--sans);
      font-size: 78px;
      font-weight: 800;
      color: #0f172a;
      text-shadow: 0 10px 35px rgba(36, 107, 254, 0.16);
    }

    .hero p {
      max-width: 760px;
      margin: 20px 0 0;
      color: var(--muted);
      font-size: 18px;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 36px;
    }

    .stat-card,
    .control-panel,
    .timeline-wrap,
    .paper-card,
    .question-card {
      background: var(--paper);
      border: 1px solid var(--line);
      box-shadow: var(--shadow);
      border-radius: 8px;
      backdrop-filter: blur(18px);
    }

    .stat-card {
      padding: 24px;
      min-height: 120px;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: "";
      position: absolute;
      inset: 0;
      border-top: 2px solid rgba(36, 107, 254, 0.42);
      background: linear-gradient(135deg, rgba(36, 107, 254, 0.08), transparent 42%);
      pointer-events: none;
    }

    .stat-value {
      font-family: var(--mono);
      font-size: 40px;
      font-weight: 700;
      color: var(--blue);
    }

    .stat-label {
      color: var(--muted);
      font-size: 14px;
    }

    .section {
      padding: 56px 0;
      border-top: 1px solid var(--line);
    }

    .section-kicker {
      color: var(--blue);
      font-family: var(--mono);
      font-size: 13px;
      margin-bottom: 10px;
    }

    .section-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 22px;
    }

    .section h2 {
      font-family: var(--sans);
      font-size: 44px;
      font-weight: 760;
    }

    .section p {
      max-width: 720px;
      margin: 10px 0 0;
      color: var(--muted);
    }

    .control-panel {
      display: grid;
      grid-template-columns: 1.5fr repeat(3, 1fr) auto;
      gap: 12px;
      padding: 16px;
      margin: 8px 0 28px;
      box-shadow: 0 12px 28px rgba(22, 50, 83, 0.08);
    }

    input,
    select,
    button {
      min-height: 42px;
      border: 1px solid var(--line);
      background: rgba(255, 255, 255, 0.78);
      color: var(--ink);
      border-radius: 4px;
      font: inherit;
      padding: 0 12px;
    }

    button {
      cursor: pointer;
      transition: transform 0.15s ease, background 0.15s ease;
    }

    button:hover {
      transform: translateY(-1px);
      background: rgba(236, 246, 255, 0.96);
      border-color: rgba(36, 107, 254, 0.58);
      box-shadow: 0 0 0 3px var(--glow);
    }

    .icon-button {
      width: auto;
      white-space: nowrap;
    }

    .timeline-wrap {
      overflow: auto;
      box-shadow: 0 14px 35px rgba(22, 50, 83, 0.08);
    }

    .timeline {
      width: 100%;
      border-collapse: collapse;
      min-width: 820px;
    }

    .timeline th,
    .timeline td {
      border-bottom: 1px solid var(--soft-line);
      border-right: 1px solid var(--soft-line);
      padding: 12px;
      text-align: center;
    }

    .timeline thead th {
      background: rgba(236, 246, 255, 0.72);
      color: #314863;
      font-family: var(--mono);
      font-size: 13px;
    }

    .timeline th:first-child {
      width: 260px;
      text-align: left;
      color: var(--ink);
      font-weight: 500;
    }

    .timeline tbody th {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .timeline small {
      margin-left: auto;
      color: var(--muted);
      font-weight: 400;
    }

    .swatch {
      display: inline-block;
      width: 12px;
      height: 28px;
      background: var(--swatch);
      border: 1px solid rgba(255,255,255,0.72);
      box-shadow: 0 0 14px color-mix(in srgb, var(--swatch), transparent 55%);
    }

    .bubble {
      width: var(--size);
      height: var(--size);
      min-height: 0;
      padding: 0;
      border-radius: 50%;
      background: var(--bubble);
      color: white;
      font-weight: 700;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.42), 0 0 20px color-mix(in srgb, var(--bubble), transparent 62%);
    }

    .paper-grid {
      display: grid;
      gap: 18px;
    }

    .paper-card {
      display: grid;
      grid-template-columns: 260px 1fr;
      min-height: 240px;
      overflow: hidden;
    }

    .paper-card.is-hidden {
      display: none;
    }

    .paper-media {
      position: relative;
      min-height: 220px;
      background:
        linear-gradient(135deg, rgba(36, 107, 254, 0.12), rgba(0, 167, 199, 0.08)),
        #eaf2fb;
      border-right: 1px solid var(--line);
    }

    .paper-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .paper-media span {
      position: absolute;
      left: 12px;
      top: 12px;
      background: rgba(15, 23, 42, 0.86);
      color: #fff;
      border-radius: 4px;
      padding: 4px 8px;
      font-family: var(--mono);
      font-size: 12px;
    }

    .paper-placeholder {
      height: 100%;
      display: grid;
      place-items: center;
      padding: 20px;
      color: #42617f;
      text-align: center;
      font-family: var(--mono);
      background:
        linear-gradient(var(--soft-line) 1px, transparent 1px),
        linear-gradient(90deg, var(--soft-line) 1px, transparent 1px);
      background-size: 22px 22px;
    }

    .paper-main {
      padding: 24px;
    }

    .paper-meta,
    .paper-tags,
    .paper-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    .paper-meta {
      color: var(--muted);
      font-size: 13px;
      margin-bottom: 10px;
    }

    .paper-meta span,
    .tag {
      border: 1px solid var(--soft-line);
      border-radius: 4px;
      padding: 2px 8px;
      background: rgba(246, 251, 255, 0.86);
    }

    .paper-card h3 {
      font-family: var(--sans);
      font-size: 28px;
      margin-bottom: 6px;
      color: #0f172a;
    }

    .paper-title,
    .paper-authors {
      color: var(--muted);
      font-size: 14px;
      margin-bottom: 10px;
    }

    .paper-summary p,
    details p {
      margin: 0 0 8px;
    }

    details {
      margin-top: 12px;
      border-top: 1px solid var(--soft-line);
      border-bottom: 1px solid var(--soft-line);
      padding: 10px 0;
    }

    summary {
      cursor: pointer;
      color: var(--blue);
      font-weight: 700;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding-top: 12px;
    }

    .detail-grid b {
      display: block;
      margin-bottom: 4px;
    }

    .paper-tags {
      margin-top: 14px;
    }

    .paper-links {
      margin-top: 14px;
    }

    .paper-links a {
      border: 1px solid var(--line);
      border-radius: 4px;
      padding: 6px 10px;
      text-decoration: none;
      background: linear-gradient(135deg, #1e63ff, #0aa3c2);
      color: #fff;
      font-size: 14px;
      box-shadow: 0 10px 22px rgba(36, 107, 254, 0.18);
    }

    .question-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .question-card {
      padding: 20px;
      box-shadow: 0 12px 28px rgba(22, 50, 83, 0.08);
    }

    .question-meta {
      color: var(--blue);
      font-family: var(--mono);
      font-size: 12px;
      margin-bottom: 10px;
    }

    .question-card h3 {
      font-family: var(--sans);
      font-size: 22px;
      margin-bottom: 10px;
    }

    .empty-state {
      display: none;
      padding: 32px;
      border: 1px dashed var(--line);
      color: var(--muted);
      background: rgba(255,255,255,0.72);
      text-align: center;
    }

    .empty-state.is-visible {
      display: block;
    }

    footer {
      padding: 48px 0;
      color: var(--muted);
      font-size: 14px;
    }

    @media (max-width: 900px) {
      .topbar {
        align-items: flex-start;
        flex-direction: column;
        padding: 14px 18px;
      }

      .nav {
        width: 100%;
        overflow-x: auto;
        padding-bottom: 4px;
      }

      .page {
        width: min(100% - 28px, 760px);
      }

      h1 {
        font-size: 48px;
      }

      .stats,
      .control-panel,
      .paper-card,
      .detail-grid,
      .question-grid {
        grid-template-columns: 1fr;
      }

      .paper-media {
        border-right: 0;
        border-bottom: 1px solid var(--line);
      }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <a class="brand" href="#">General Multi-Agent Model</a>
    <nav class="nav">
      <a href="#tech_paradigm">技术范式</a>
      <a href="#primary_technical_layer">主技术层</a>
      <a href="#primary_task_family">任务族</a>
      <a href="#papers">论文</a>
      <a href="#questions">开放问题</a>
    </nav>
  </header>

  <main class="page">
    <section class="hero">
      <div class="eyebrow">Obsidian-first paper repository · generated ${escapeHtml(generatedAt)}</div>
      <h1>通用多智能体任务规划模型时间轴</h1>
      <p>基于 Markdown note 的结构化 frontmatter 自动生成。当前版本聚焦 VLA、π 系列、World Action Model 和 Dreamer，把它们定位为端到端多智能体任务规划模型里的执行器、世界模拟器或 planner critic。</p>
      ${renderStats(papers)}
    </section>

    ${renderTimeline(papers, "tech_paradigm")}
    ${renderTimeline(papers, "primary_technical_layer")}
    ${renderTimeline(papers, "primary_task_family")}

    <section class="section" id="papers">
      <div class="section-kicker">Paper index</div>
      <div class="section-head">
        <div>
          <h2>论文列表</h2>
          <p>搜索会匹配标题、摘要、作者、机构、方法和标签。</p>
        </div>
        <div id="result-count">${papers.length} 篇</div>
      </div>
      <div class="control-panel">
        <input id="search" type="search" placeholder="搜索论文、作者、方法或标签">
        <select id="year-filter">
          <option value="">全部年份</option>
          ${years.map((year) => `<option value="${year}">${year}</option>`).join("")}
        </select>
        <select id="tech-filter">
          <option value="">全部技术范式</option>
          ${renderOptions(techValues)}
        </select>
        <select id="layer-filter">
          <option value="">全部主技术层</option>
          ${renderOptions(layerValues)}
        </select>
        <button data-reset>重置</button>
      </div>
      <div class="empty-state" id="empty-state">没有匹配的论文。</div>
      <div class="paper-grid">
        ${renderPapers(papers)}
      </div>
    </section>

    <section class="section" id="questions">
      <div class="section-kicker">Research gaps</div>
      <div class="section-head">
        <div>
          <h2>开放问题</h2>
          <p>从每篇论文 note 的“开放问题”小节自动汇总。</p>
        </div>
      </div>
      <div class="question-grid">
        ${renderOpenQuestions(papers)}
      </div>
    </section>

    <footer>
      生成源：papers/*.md。下一步可以接入 Zotero / Better BibTeX / MCP，把 citekey、PDF 标注和新论文推送纳入同一个流程。
    </footer>
  </main>

  <script>
    const cards = Array.from(document.querySelectorAll("[data-paper-card]"));
    const search = document.querySelector("#search");
    const yearFilter = document.querySelector("#year-filter");
    const techFilter = document.querySelector("#tech-filter");
    const layerFilter = document.querySelector("#layer-filter");
    const resultCount = document.querySelector("#result-count");
    const emptyState = document.querySelector("#empty-state");

    function applyFilters() {
      const query = search.value.trim().toLowerCase();
      const year = yearFilter.value;
      const tech = techFilter.value;
      const layer = layerFilter.value;
      let visible = 0;

      for (const card of cards) {
        const matchesQuery = !query || card.dataset.search.includes(query);
        const matchesYear = !year || card.dataset.year === year;
        const matchesTech = !tech || card.dataset.tech_paradigm === tech;
        const matchesLayer = !layer || card.dataset.primary_technical_layer === layer;
        const shown = matchesQuery && matchesYear && matchesTech && matchesLayer;
        card.classList.toggle("is-hidden", !shown);
        if (shown) visible += 1;
      }

      resultCount.textContent = visible + " 篇";
      emptyState.classList.toggle("is-visible", visible === 0);
    }

    function resetFilters() {
      search.value = "";
      yearFilter.value = "";
      techFilter.value = "";
      layerFilter.value = "";
      applyFilters();
    }

    search.addEventListener("input", applyFilters);
    yearFilter.addEventListener("change", applyFilters);
    techFilter.addEventListener("change", applyFilters);
    layerFilter.addEventListener("change", applyFilters);

    document.querySelectorAll("[data-reset]").forEach((button) => {
      button.addEventListener("click", resetFilters);
    });

    document.querySelectorAll(".bubble").forEach((button) => {
      button.addEventListener("click", () => {
        const field = button.dataset.field;
        const value = button.dataset.value;
        const year = button.dataset.year;
        yearFilter.value = year;
        if (field === "tech_paradigm") techFilter.value = value;
        if (field === "primary_technical_layer") layerFilter.value = value;
        search.value = "";
        applyFilters();
        document.querySelector("#papers").scrollIntoView({ behavior: "smooth" });
      });
    });

    document.querySelectorAll(".paper-media img").forEach((img) => {
      img.addEventListener("error", () => {
        const holder = document.createElement("div");
        holder.className = "paper-placeholder";
        holder.textContent = img.alt || "paper image";
        img.replaceWith(holder);
      });
    });
  </script>
</body>
</html>`;
}

async function build() {
  await mkdir(dataDir, { recursive: true });
  await mkdir(viewsDir, { recursive: true });
  await mkdir(docsDir, { recursive: true });

  const papers = await readPapers();
  const html = renderIndex(papers);
  await writeFile(join(dataDir, "papers.json"), `${JSON.stringify(papers, null, 2)}\n`, "utf8");
  await writeFile(join(viewsDir, "dashboard.html"), html, "utf8");
  await writeFile(join(docsDir, "index.html"), html, "utf8");
  await writeFile(join(docsDir, ".nojekyll"), "", "utf8");

  console.log(`Generated ${relative(rootDir, join(dataDir, "papers.json"))}`);
  console.log(`Generated ${relative(rootDir, join(viewsDir, "dashboard.html"))}`);
  console.log(`Generated ${relative(rootDir, join(docsDir, "index.html"))}`);
  console.log(`Indexed ${papers.length} papers`);
}

if (watchMode) {
  await build();
  console.log("Watching papers/*.md");
  if (!existsSync(papersDir)) {
    throw new Error("papers directory does not exist");
  }
  watch(papersDir, { recursive: false }, async (_event, filename) => {
    if (!filename || !filename.endsWith(".md")) return;
    try {
      await build();
    } catch (error) {
      console.error(error);
    }
  });
} else {
  await build();
}
