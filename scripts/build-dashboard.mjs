import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, watch } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const papersDir = join(rootDir, "papers");
const dataDir = join(rootDir, "data");
const viewsDir = join(rootDir, "views");
const notesDir = join(rootDir, "notes");
const teamRoadmapPath = join(rootDir, "team", "roadmap.json");
const watchMode = process.argv.includes("--watch");

const valueLabels = {
  "Overview / Foundation": "Overview / Foundation",
  "Scene Graph": "Scene Graph",
  "Task Graph": "Task Graph",
  "Structure Generation": "Structure Generation",
  Diffusion: "Diffusion",
  vla: "VLA",
  llm_code_policy: "LLM Code Policy",
  llm_reward_design: "LLM Reward Design",
  vla_flow_policy: "VLA Flow Policy",
  robot_diffusion_policy: "Robot Diffusion Policy",
  foundation_swarm_overview: "Foundation Swarm Overview",
  vla_rl: "VLA + RL",
  world_action_model: "World Action Model",
  world_model_rl: "World Model RL",
  video_flow_model: "Video Flow Model",
  multi_robot_allocation_rl: "Multi-Robot Allocation RL",
  graph_assignment_network: "Graph Assignment Network",
  combinatorial_optimization_gnn: "Combinatorial Optimization GNN",
  robognn_scheduling_policy: "RoboGNN Scheduling Policy",
  magnnet_decentralized_allocation: "MAGNNET Decentralized Allocation",
  learned_subteam_performance: "Learned Subteam Performance",
  scene_graph_task_planning: "Scene Graph Task Planning",
  scene_graph_navigation_policy: "Scene Graph Navigation Policy",
  pythonic_llm_task_planning: "Pythonic LLM Task Planning",
  dag_based_llm_task_decomposition: "DAG-based LLM Task Decomposition",
  layerwise_diffusion_dag_generation: "Layerwise Diffusion DAG Generation",
  unsupervised_task_graph_generation: "Unsupervised Task Graph Generation",
  llm_dependency_graph_planning: "LLM Dependency Graph Planning",
  semantic_grounding: "语义落地",
  action_representation: "动作表示",
  action_diffusion_policy: "动作扩散策略",
  fm_swarm_architecture: "FM 集群架构",
  language_action_representation: "语言动作表示",
  code_policy_generation: "代码策略生成",
  reward_design: "奖励函数设计",
  efficient_action_tokenization: "高效动作 token 化",
  long_horizon_memory: "长程记忆",
  video_generation: "视频生成",
  graph_based_task_allocation: "图任务分配",
  gnn_marL_task_allocation: "GNN + MARL 任务分配",
  graph_reasoning_for_optimization: "图优化推理",
  graph_scheduling_policy: "图调度策略",
  graph_subteam_performance_estimation: "图子团队性能估计",
  scene_graph_grounding: "场景图 grounding",
  task_graph_generation: "任务图生成",
  hierarchical_scene_graph_memory: "分层场景图记忆",
  decentralized_task_allocation: "分布式任务分配",
  open_world_generalization: "开放世界泛化",
  deployment_generalization: "部署泛化",
  policy_improvement: "策略改进",
  compositional_generalization: "组合泛化",
  dynamics_prediction: "动态预测",
  human_to_robot_world_action_model: "人类到机器人 WAM",
  imagination_planning: "想象规划",
  embodied_learning: "真实机器人学习",
  language_conditioned_execution: "语言条件执行",
  swarm_policy_generation: "集群策略生成",
  fm_enabled_robot_swarms: "FM 赋能机器人集群",
  reward_shaping: "奖励塑形",
  high_frequency_control: "高频控制",
  visuomotor_diffusion_policy: "视觉动作扩散策略",
  memory_augmented_execution: "记忆增强执行",
  video_dynamics_generation: "视频动态生成",
  heterogeneous_task_allocation: "异构任务分配",
  decentralized_vehicle_task_allocation: "分布式车辆任务分配",
  combinatorial_optimization: "组合优化",
  st_sr_ta_xd_scheduling: "ST/SR/TA/XD 调度",
  st_mr_ta_id_routing: "ST/MR/TA/ID 路由",
  heterogeneous_multi_agent_systems: "异构多智能体系统",
  heterogeneous_autonomous_vehicle_swarm: "异构自动车辆集群",
  homogeneous_multi_robot_systems: "同构多机器人系统",
  heterogeneous_multi_robot_routing: "异构多机器人路由",
  optimization_solvers: "优化求解器",
  generalist_robot_control: "通用机器人控制",
  long_horizon_execution: "长程执行",
  robust_execution: "鲁棒执行",
  experience_driven_recovery: "经验驱动恢复",
  steerable_long_horizon_execution: "可控长程执行",
  zero_shot_policy: "零样本策略",
  test_time_imagination_ablation: "测试时未来想象消融",
  human_data_scaling: "人类数据规模化",
  latent_world_model_control: "潜在世界模型控制",
  real_robot_learning: "真实机器人学习",
  single_robot_manipulation: "单机器人操作",
  imitation_manipulation: "示教操作学习",
  multi_embodiment_manipulation: "多具身操作",
  mobile_manipulator: "移动操作机器人",
  cross_embodiment_manipulation: "跨具身操作",
  cross_embodiment_transfer: "跨具身迁移",
  heterogeneous_robot_data: "异构机器人数据",
  simulated_control_domains: "仿真控制域",
  physical_robot_learning: "真实机器人学习",
  multi_robot_swarm: "多机器人集群",
  dexterous_manipulation: "灵巧操作",
  long_horizon_manipulation: "长程操作",
  video_generation_models: "视频生成模型",
  heterogeneous_multi_robot_systems: "异构多机器人系统",
  instruction_driven_task_planning: "指令驱动任务规划",
  instruction_to_dependency_graph: "指令到依赖图",
  object_search_navigation: "目标搜索导航",
  large_scene_robot_planning: "大场景机器人规划",
  indoor_3d_navigation: "室内 3D 导航",
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
  executor: "执行器",
  executor_interface: "执行接口",
  foundation_policy: "基础策略",
  semantic_grounder: "语义落地器",
  semantic_planner: "语义规划器",
  world_simulator: "世界模拟器",
  planner_critic: "Planner critic",
  policy_trainer: "策略训练器",
  reward_designer: "奖励设计器",
  action_tokenizer: "动作 tokenizer",
  task_allocator: "任务分配器",
  graph_encoder: "图编码器",
  solver_heuristic: "求解器启发式",
  scheduler: "调度器",
  planner_baseline: "规划基线",
  code_policy_generator: "代码策略生成器",
  memory_module: "记忆模块",
  executor_context: "执行上下文",
  long_horizon_state: "长程状态",
  recovery_policy: "失败恢复策略",
  experience_learner: "经验学习器",
  steerable_policy: "可控策略",
  video_generator: "视频生成器",
  world_encoder: "世界编码器",
  data_curator: "数据治理器",
  swarm_designer: "集群设计器",
  swarm_operator: "集群操作器",
  security_monitor: "安全监控器",
  edge_model: "端侧模型",
  paper_read: "已读论文",
  viewpoint_review: "观点综述",
  technical_blog: "技术博客",
  skimmed: "略读",
  compare_with_dreamerv3: "对比 DreamerV3",
  map_to_planner_critic: "映射到 planner critic",
  link_to_genswarm: "连接 GenSwarm",
  keep_as_vla_root: "作为 VLA 根节点",
  define_executor_interface: "定义执行器接口",
  extract_robot_diffusion_design: "抽取机器人扩散策略设计",
  extract_swarm_fm_roadmap: "抽取集群 FM 路线图",
  connect_to_wam_only: "只连接 WAM",
  keep_as_action_interface: "保留为动作接口",
  turn_into_baseline: "转为 baseline",
  model_as_executor_plus_subtasker: "建模为执行器+子任务器",
  extract_capability_table: "提取能力表",
  map_recovery_loop: "映射恢复闭环",
  extract_system_architecture: "提取系统架构",
  design_team_memory: "设计团队记忆",
  use_as_executor_target: "作为执行器目标",
  extend_to_multi_agent_rollout: "扩展多智能体 rollout",
  relation_audit: "关系审计",
  compare_test_time_imagination: "比较测试时未来想象",
  compare_language_action_interface: "比较语言动作接口",
  extract_data_flywheel: "抽取数据飞轮",
  video_cotraining_world_encoder: "视频协同训练世界编码器",
  no_test_time_imagination: "无测试时未来想象",
  single_pass_action_generation: "单次前向动作生成",
  structured_attention_mask: "结构化注意力掩码",
  wam_ablation_protocol: "WAM 消融协议",
  language_action_pretraining: "语言动作预训练",
  natural_language_action_format: "自然语言动作格式",
  action_chunk_to_text_converter: "动作块转文本脚本",
  ce_language_action_supervision: "CE 语言动作监督",
  vqa_action_cotraining: "VQA 与动作共训练",
  zero_shot_cross_embodiment_transfer: "零样本跨具身迁移",
  raw_data_in_raw_data_out: "原始数据直入直出",
  action_conditioned_world_model: "动作条件世界模型",
  rl_in_world_model: "世界模型内强化学习",
  counterfactual_failure_modeling: "反事实失败建模",
  human_robot_kinematic_mapping: "人机运动学映射",
  tactile_world_model_training: "触觉世界模型训练",
  data_quality_autolabeling: "数据质检自动标注",
  high_precision_human_data: "高精度人类数据",
  dit_inference_cache: "DiT 推理缓存",
  conditional_action_diffusion: "条件动作扩散",
  action_chunk_diffusion: "动作块扩散",
  receding_horizon_control: "滚动时域控制",
  visual_conditioning: "视觉条件控制",
  time_series_diffusion_transformer: "时序扩散 Transformer",
  multimodal_action_distribution: "多峰动作分布",
  stochastic_langevin_action_sampling: "Langevin 动作采样",
  fm_swarm_designer: "FM 集群设计器",
  fm_swarm_operator: "FM 集群操作器",
  comprehensive_swarm_control_architecture: "综合集群控制架构",
  simulation_feedback_finetuning: "仿真反馈微调",
  robot_generated_data_finetuning: "机器人数据微调",
  code_security_finetuning: "代码安全微调",
  edge_model_finetuning: "端侧模型微调",
  micro_macro_validation: "微观-宏观验证",
  prompt_api_controller_bridge: "Prompt-API 控制桥",
  rag_swarm_memory: "RAG 集群记忆",
  task_agent_graph: "任务-agent 图",
  key_step_dependency_graph: "关键步骤依赖图",
  bipartite_variable_constraint_graph: "变量-约束二分图",
  time_series_conditional_vae: "时序条件 VAE",
  global_local_attention: "全局-局部注意力",
  graph_attention_assignment: "图注意力分配",
  rl_assignment_policy: "RL 分配策略",
  heterogeneous_capability_matching: "异构能力匹配",
  heterogeneous_agent_task_graph: "异构 agent-task 图",
  agent_agent_communication_edges: "agent-agent 通信边",
  fully_connected_agent_task_edges: "全连接 agent-task 边",
  gnn_relational_agent_embedding: "GNN 关系型 agent embedding",
  ctde_ppo_policy: "CTDE PPO 策略",
  request_reject_task_action: "request/reject 任务动作",
  reservation_based_path_cost: "预约式路径代价",
  key_step_extraction: "关键步骤抽取",
  transcript_to_task_graph: "转录文本到任务图",
  dependency_graph_generation: "依赖图生成",
  sequence_ranking: "步骤序列排序",
  ilp_precondition_inference: "ILP 前置条件推理",
  simple_temporal_network: "Simple Temporal Network",
  robot_specific_node_features: "机器人特定节点特征",
  directed_weighted_gat: "有向加权 GAT",
  imitation_scheduling_policy: "模仿学习调度策略",
  q_value_schedule_decoder: "Q 值调度解码器",
  opportunistic_time_rollout: "机会式时间 rollout",
  subteam_performance_estimator: "子团队性能估计器",
  area_inspection_graph: "区域检查图",
  team_size_encoding: "队伍规模编码",
  learned_makespan_estimator: "学习型 makespan 估计器",
  lazy_milp_refinement: "懒式 MILP 精化",
  hierarchical_task_routing_planner: "分层任务-路由规划器",
  solver_guidance_policy: "求解器引导策略",
  branch_and_bound_heuristic: "分支定界启发式",
  warm_start_assignment: "Warm-start 分配",
  constraint_aware_decoding: "约束感知解码",
  scene_graph_representation: "场景图表示",
  hierarchical_3d_scene_graph: "分层 3D 场景图",
  llm_node_tokenization: "LLM 节点 token 化",
  instruction_conditioned_gat: "指令条件 GAT",
  instruction_feature_enhancer: "指令特征增强器",
  robot_scene_graph_decoder: "机器人-场景图解码器",
  action_layer_discrete_navigation: "离散导航 action layer",
  collision_checked_action_nodes: "避碰检查动作节点",
  explicit_visit_memory: "显式访问记忆",
  agent_centric_scene_graph_embedding: "机器人中心场景图嵌入",
  platform_agnostic_navigation_policy: "平台无关导航策略",
  extract_graph_assignment_design: "抽取图分配设计",
  extract_magnnet_io_contract: "抽取 MAGNNET 输入输出契约",
  extract_task_graph_generation_pipeline: "抽取任务图生成流水线",
  extract_lip_llm_task_graph_interface: "抽取 LiP-LLM 任务图接口",
  extract_smart_llm_pythonic_planning_baseline: "抽取 SMART-LLM Pythonic 规划基线",
  extract_dart_llm_json_dag_schema: "抽取 DART-LLM JSON-DAG schema",
  adapt_layerdag_to_multi_robot_task_graph_schema: "适配 LayerDAG 到多机器人任务图 schema",
  extract_robognn_scheduler_baseline: "抽取 RoboGNN 调度基线",
  extract_subteam_performance_estimator: "抽取子团队性能估计器",
  extract_gnn_solver_design_rules: "抽取 GNN 求解器设计规则",
  extract_scene_graph_planner: "抽取场景图 planner",
  extract_scene_graph_navigation_policy: "抽取场景图导航策略",
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

const domainColumns = [
  "Overview / Foundation",
  "LLM",
  "Diffusion",
  "VLA",
  "World Model",
  "World Action Model",
  "RL",
  "GNN",
  "Scene Graph",
  "Task Graph",
  "Structure Generation",
];

const domainColors = {
  "Overview / Foundation": "#64748b",
  LLM: "#246bfe",
  VLA: "#00a7c7",
  Diffusion: "#16a085",
  "World Model": "#6a7dff",
  "World Action Model": "#7c67d8",
  RL: "#188aa6",
  GNN: "#4b6f96",
  "Scene Graph": "#2f80ed",
  "Task Graph": "#4a56b8",
  "Structure Generation": "#8b5cf6",
};

const domainColumnGroups = [
  {
    label: "LLM",
    domains: ["LLM"],
  },
  {
    label: "Vision",
    domains: ["VLA", "World Model", "World Action Model"],
  },
  {
    label: "RL",
    domains: ["RL"],
  },
  {
    label: "Graph Struct",
    domains: ["GNN", "Scene Graph", "Task Graph", "Structure Generation"],
  },
];

const relationTypes = {
  extends: {
    label: "继承/扩展",
    short: "extends",
    color: "#246bfe",
    description: "后续模型或系统直接建立在前序路线之上。",
  },
  uses: {
    label: "使用/依赖",
    short: "uses",
    color: "#00a7c7",
    description: "当前论文借用了前序工作的模块、表示、训练路线或系统组件。",
  },
  enables: {
    label: "提供模块",
    short: "enables",
    color: "#188aa6",
    description: "前序工作提供了可被当前系统复用的关键模块。",
  },
  contrasts: {
    label: "对比路线",
    short: "contrasts",
    color: "#d14d72",
    description: "两篇论文代表不同建模范式，适合用来比较取舍。",
  },
  cites: {
    label: "引用/背景",
    short: "cites",
    color: "#4b6f96",
    description: "保留 bibliographic citation 或宽泛背景关系。",
  },
};

const nextActionHints = {
  extract_system_architecture: "把论文中的系统结构拆成可复用模块、接口和实验变量。",
  extend_to_multi_agent_rollout: "把单机器人 world/action rollout 扩展成多机器人联合状态预测。",
  design_team_memory: "把单体长期记忆改造成团队共享记忆和本地记忆的同步机制。",
  use_as_executor_target: "抽象 planner-to-executor 接口，定义上下文、约束和失败反馈 schema。",
  turn_into_baseline: "把论文方法整理成可复现实验基线，服务后续模型对比。",
  map_to_planner_critic: "把 world model 或 reward 机制映射成 planner critic。",
  define_executor_interface: "明确高层 planner 如何调用底层 VLA 执行器。",
  extract_robot_diffusion_design: "把扩散策略拆成条件输入、动作块生成、去噪采样和滚动执行接口。",
  extract_swarm_fm_roadmap: "把 FM 集群综述拆成路线图：设计器、操作器、验证、安全、端侧部署和数据闭环。",
  model_as_executor_plus_subtasker: "把论文拆成执行器和语义子任务器两个角色。",
  extract_capability_table: "提取平台能力、成功率、失败类型和预计耗时。",
  map_recovery_loop: "把失败样本、纠错和继续学习整理成恢复闭环。",
  compare_with_dreamerv3: "与 DreamerV3 对比 world model 训练、rollout 和控制接口。",
  link_to_genswarm: "连接语言规划、多机器人代码策略和任务分配模块。",
  keep_as_vla_root: "保留为 VLA 路线的根节点和语义 grounding 起点。",
  connect_to_wam_only: "只保留与 WAM 生成式世界预测相关的强关系。",
  keep_as_action_interface: "保留为动作表示和高频控制接口方案。",
  relation_audit: "检查 typed relations 是否方向正确、是否足够强。",
  compare_test_time_imagination: "比较测试时显式想象、训练期视频建模和直接动作生成的实际价值。",
  compare_language_action_interface: "比较自然语言动作、频域动作 token 和连续 flow action expert 的接口取舍。",
  extract_data_flywheel: "把人类数据、世界模型评估、失败样本和策略改进整理成可复用数据飞轮。",
  extract_scene_graph_planner: "把 scene graph、instruction encoder、GAT 和 task decoder 拆成可接入多机器人 planner 的模块。",
  extract_scene_graph_navigation_policy: "把 3D scene graph pruning、action layer、碰撞风险和 GNN readout 拆成导航策略模块。",
};

const nextActionOrder = [
  "extract_system_architecture",
  "extend_to_multi_agent_rollout",
  "design_team_memory",
  "use_as_executor_target",
  "turn_into_baseline",
  "map_to_planner_critic",
  "define_executor_interface",
  "extract_robot_diffusion_design",
  "extract_swarm_fm_roadmap",
  "model_as_executor_plus_subtasker",
  "extract_capability_table",
  "map_recovery_loop",
  "compare_with_dreamerv3",
  "link_to_genswarm",
  "keep_as_vla_root",
  "connect_to_wam_only",
  "keep_as_action_interface",
  "relation_audit",
  "compare_test_time_imagination",
  "compare_language_action_interface",
  "extract_data_flywheel",
  "extract_scene_graph_planner",
  "extract_scene_graph_navigation_policy",
];

const agentWorkflows = [
  {
    name: "Paper Ingest Agent",
    label: "新增论文",
    purpose: "把一篇新论文变成结构化 note、typed relations 和可检索数据。",
    output: "paper note + data/papers.json + dashboard rebuild",
  },
  {
    name: "Relation Audit Agent",
    label: "关系审计",
    purpose: "检查每条边是不是方向正确、类型明确、值得保留。",
    output: "cleaner typed graph + changed edge list",
  },
  {
    name: "Deep Reading Agent",
    label: "精读升级",
    purpose: "把 skimmed/read note 升级成能支持系统设计的 deep reading note。",
    output: "stronger method / limitation / reusable module / evidence sections",
  },
  {
    name: "Gap Finder Agent",
    label: "问题发现",
    purpose: "从系统角色和可复用模块里找实验级 research gaps。",
    output: "5 actionable gaps + supporting papers + experiment idea",
  },
  {
    name: "System Design Mapper Agent",
    label: "系统映射",
    purpose: "把论文图谱转成 General Multi-Agent Task Planning Model 架构草图。",
    output: "modules + interfaces + risks + supporting papers",
  },
];

const benchmarkResources = [
  {
    name: "MolmoSpaces Leaderboard",
    label: "机器人竞技排名榜单",
    source: "Allen Institute for AI",
    url: "https://molmospaces.allen.ai/leaderboard",
    image: "assets/molmospaces-leaderboard.png",
    captured: "2026-04-29",
    description:
      "跟踪机器人策略在大规模仿真与真实迁移相关任务上的竞争表现，用来补充论文阅读之外的实证坐标。",
    takeaways: [
      "关注 VLA、WAM、VLM+BM 等路线在同一榜单里的相对位置。",
      "优先记录任务覆盖、是否使用 MolmoBot 数据、是否开源、参数量和动作空间。",
      "把榜单中的强模型加入后续 paper ingest 或 baseline 对比队列。",
    ],
  },
];

const relationFields = Object.keys(relationTypes).filter((type) => type !== "cites");

// Relation storage rule for the paper graph:
// Source notes keep a compact adjacency list in frontmatter. The dashboard
// normalizes those authored links into undirected paper-pair edges, then derives
// parent/child roles from publication time at render time.
// Soft "complementary" associations are intentionally not modeled as graph
// edges unless they become a strong typed relation.

const systemRoleOrder = [
  "semantic_planner",
  "task_allocator",
  "world_simulator",
  "planner_critic",
  "world_encoder",
  "executor",
  "executor_interface",
  "swarm_designer",
  "swarm_operator",
  "data_curator",
  "security_monitor",
  "edge_model",
  "memory_module",
  "reward_designer",
  "code_policy_generator",
  "action_tokenizer",
  "recovery_policy",
  "planner_baseline",
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
  const start = lines.findIndex((line) => {
    const match = line.trim().match(/^##\s+(.+)$/);
    if (!match) return false;
    const title = match[1].trim();
    return title === heading || title.startsWith(`${heading}：`) || title.startsWith(`${heading}:`);
  });
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

function tokenLabel(value) {
  return label(value).replaceAll("_", " ");
}

function buildRelations(meta) {
  const relations = [];
  const typedTargets = new Set();

  // Preserve the authoring direction above. Do not synthesize reverse links here.
  for (const type of relationFields) {
    for (const target of asList(meta[type])) {
      relations.push({ type, target });
      typedTargets.add(target);
    }
  }

  for (const target of asList(meta.cites)) {
    if (!typedTargets.has(target)) {
      relations.push({ type: "cites", target });
    }
  }

  return relations;
}

function comparePaperTime(a, b) {
  return (
    (Number(a?.published_value) || 0) - (Number(b?.published_value) || 0) ||
    String(a?.short_title || a?.id || "").localeCompare(String(b?.short_title || b?.id || ""), "zh-CN") ||
    String(a?.id || "").localeCompare(String(b?.id || ""), "zh-CN")
  );
}

function normalizeGraphEdges(papers) {
  const byId = new Map(papers.map((paper) => [paper.id, paper]));
  const edges = new Map();

  for (const paper of papers) {
    for (const relation of asList(paper.relations)) {
      const other = byId.get(relation.target);
      if (!other || paper.id === other.id) continue;
      const endpoints = [paper, other].sort(comparePaperTime);
      const key = `${endpoints[0].id}--${endpoints[1].id}--${relation.type}`;
      const existing = edges.get(key);
      const authors = existing?.authored_links ?? [];
      authors.push({ source: paper.id, target: other.id });
      edges.set(key, {
        id: key,
        type: relation.type,
        a: endpoints[0].id,
        b: endpoints[1].id,
        parent: endpoints[0].id,
        child: endpoints[1].id,
        authored_links: authors,
      });
    }
  }

  return [...edges.values()];
}

function buildPaperGraphData(papers) {
  const byId = new Map(papers.map((paper) => [paper.id, paper]));
  const nodes = papers.map((paper) => ({
    id: paper.id,
    title: paper.title,
    short_title: paper.short_title,
    published: paper.published,
    published_value: paper.published_value,
    primary_domain: paper.primary_domain,
    domains: asList(paper.domains),
    note_html: paper.note_html,
  }));
  const edges = normalizeGraphEdges(papers).map((edge) => {
    const parent = byId.get(edge.parent);
    const child = byId.get(edge.child);
    return {
      id: edge.id,
      type: edge.type,
      endpoints: [edge.a, edge.b],
      parent_id: edge.parent,
      child_id: edge.child,
      parent_title: parent?.short_title || edge.parent,
      child_title: child?.short_title || edge.child,
      authored_links: edge.authored_links,
    };
  });
  return {
    schema_version: "paper-graph.v1",
    edge_semantics: "undirected typed paper-pair edge; parent_id and child_id are derived from publication time",
    render_directions: ["parent-child", "child-parent", "both"],
    nodes,
    edges,
  };
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

function isExternalUrl(value) {
  return /^https?:\/\//.test(String(value || ""));
}

function assetHref(value, prefix = "") {
  if (!value) return "";
  return isExternalUrl(value) ? String(value) : `${prefix}${value}`;
}

function stripTrailingWhitespace(text) {
  return text.replace(/[ \t]+$/gm, "");
}

function inlineMarkdownToHtml(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function markdownToHtml(text) {
  if (!text) return "";
  return text
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      if (!lines.length) return "";

      if (lines.every((line) => /^[-*]\s+/.test(line))) {
        return `<ul>${lines
          .map((line) => `<li>${inlineMarkdownToHtml(line.replace(/^[-*]\s+/, ""))}</li>`)
          .join("")}</ul>`;
      }

      if (lines.every((line) => /^\d+\.\s+/.test(line))) {
        return `<ol>${lines
          .map((line) => `<li>${inlineMarkdownToHtml(line.replace(/^\d+\.\s+/, ""))}</li>`)
          .join("")}</ol>`;
      }

      return `<p>${lines.map(inlineMarkdownToHtml).join("<br>")}</p>`;
    })
    .join("\n");
}

function notePathFor(paper) {
  return `notes/${paper.id}.html`;
}

function normalizeMonth(value, fallbackYear) {
  const raw = String(value || fallbackYear || "").trim();
  const match = raw.match(/^(\d{4})(?:-(\d{1,2}))?/);
  if (!match) return `${fallbackYear || "1970"}-01`;
  const year = match[1];
  const month = String(Math.min(Math.max(Number(match[2] || 1), 1), 12)).padStart(2, "0");
  return `${year}-${month}`;
}

function monthValue(month) {
  const [year, value] = String(month).split("-").map(Number);
  return year * 12 + (value || 1) - 1;
}

function dateValue(date) {
  const [year, month, day] = String(date).split("-").map(Number);
  return Math.floor(Date.UTC(year, (month || 1) - 1, day || 1) / 86400000);
}

function dateFromValue(value) {
  return new Date(value * 86400000).toISOString().slice(0, 10);
}

function shortDate(date) {
  const [, month, day] = String(date).split("-");
  return `${month}/${day}`;
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
    const year = Number(meta.year);
    const published = normalizeMonth(meta.published, year);
    papers.push({
      ...meta,
      year,
      published,
      published_value: monthValue(published),
      domains: asList(meta.domains),
      cites: asList(meta.cites),
      system_roles: asList(meta.system_roles),
      reusable_modules: asList(meta.reusable_modules),
      evidence_level: meta.evidence_level || meta.status || "unknown",
      next_action: meta.next_action || meta.action || "",
      relations: buildRelations(meta),
      primary_domain: meta.primary_domain || asList(meta.domains)[0] || label(meta.tech_paradigm),
      file: relative(rootDir, filePath),
      note_html: notePathFor(meta),
      summary: section(body, "一句话结论"),
      research_question: section(body, "研究问题"),
      method: section(body, "方法"),
      contribution: section(body, "关键贡献"),
      reading_highlights: section(body, "阅读高光"),
      limitation: section(body, "局限"),
      relation: section(body, "和其他论文的关系"),
      planning_insight: section(body, "对多智能体任务规划模型的启发"),
      reusable_module_text: section(body, "可复用模块"),
      evidence_risk: section(body, "证据与风险"),
      open_question: section(body, "开放问题"),
    });
  }

  return papers.sort(
    (a, b) => a.published_value - b.published_value || a.short_title.localeCompare(b.short_title),
  );
}

async function readTeamRoadmap() {
  if (!existsSync(teamRoadmapPath)) {
    return { members: [], tasks: [] };
  }
  const raw = await readFile(teamRoadmapPath, "utf8");
  const roadmap = JSON.parse(raw);
  return {
    note: String(roadmap.note || ""),
    roster: asList(roadmap.roster),
    members: asList(roadmap.members),
    tasks: asList(roadmap.tasks),
  };
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

function uniqueList(values) {
  return [...new Set(values.filter(Boolean).map(String))];
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

function renderRoleOptions(values) {
  return values
    .map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(tokenLabel(value))}</option>`)
    .join("\n");
}

function renderStats(papers) {
  const years = yearRange(papers);
  const highReadiness = papers.filter((paper) => paper.readiness === "high").length;
  const relationCount = papers.reduce((sum, paper) => sum + asList(paper.relations).length, 0);
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
        <div class="stat-value">${relationCount}</div>
        <div class="stat-label">Typed relations</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${highReadiness}</div>
        <div class="stat-label">高优先级</div>
      </div>
    </div>
  `;
}

function paperQualityScore(paper) {
  const checks = [
    Boolean(paper.summary),
    Boolean(paper.planning_insight),
    Boolean(paper.reusable_module_text),
    Boolean(paper.evidence_risk),
    asList(paper.system_roles).length > 0,
    asList(paper.reusable_modules).length > 0,
    asList(paper.relations).length > 0,
    paper.status === "read" || paper.action === "deep_read",
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function renderQualityBoard(papers) {
  const total = papers.length || 1;
  const relationCoverage = papers.filter((paper) => asList(paper.relations).length > 0).length;
  const roleCoverage = papers.filter((paper) => asList(paper.system_roles).length > 0).length;
  const moduleCoverage = papers.filter((paper) => asList(paper.reusable_modules).length > 0).length;
  const evidenceCoverage = papers.filter((paper) => paper.evidence_risk).length;
  const avgQuality = Math.round(
    papers.reduce((sum, paper) => sum + paperQualityScore(paper), 0) / total,
  );

  const metrics = [
    ["平均 note 质量", `${avgQuality}%`, "summary / roles / modules / evidence / relations"],
    ["关系覆盖", `${relationCoverage}/${total}`, "至少一条 typed relation"],
    ["系统角色覆盖", `${roleCoverage}/${total}`, "能放入我们的模型架构"],
    ["复用模块覆盖", `${moduleCoverage}/${total}`, "可转成设计组件"],
    ["证据风险覆盖", `${evidenceCoverage}/${total}`, "明确知道证据和风险"],
  ];

  return `
    <section class="section compact-section" id="quality">
      <div class="section-kicker">Index quality</div>
      <div class="section-head">
        <div>
          <h2>索引质量面板</h2>
          <p>目标不是多收论文，而是让每篇论文都能回答：它在系统里是什么角色、能复用什么、证据强到什么程度、下一步该做什么。</p>
        </div>
      </div>
      <div class="quality-grid">
        ${metrics
          .map(
            ([name, value, hint]) => `
          <div class="quality-card">
            <div class="quality-value">${escapeHtml(value)}</div>
            <div class="quality-name">${escapeHtml(name)}</div>
            <p>${escapeHtml(hint)}</p>
          </div>
        `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderRoleBoard(papers) {
  const roles = uniqueList(papers.flatMap((paper) => asList(paper.system_roles))).sort(
    (a, b) => {
      const ai = systemRoleOrder.indexOf(a);
      const bi = systemRoleOrder.indexOf(b);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return tokenLabel(a).localeCompare(tokenLabel(b), "zh-CN");
    },
  );

  const cards = roles
    .map((role) => {
      const rolePapers = papers.filter((paper) => asList(paper.system_roles).includes(role));
      const examples = rolePapers
        .slice(0, 4)
        .map(
          (paper) => `
          <li>
            <strong>${escapeHtml(paper.short_title)}</strong>
            <span>${escapeHtml(paper.planning_insight || paper.planning_relevance || "")}</span>
          </li>
        `,
        )
        .join("");

      return `
        <article class="role-card">
          <div class="role-count">${rolePapers.length}</div>
          <h3>${escapeHtml(tokenLabel(role))}</h3>
          <ul>${examples}</ul>
        </article>
      `;
    })
    .join("");

  return `
    <section class="section compact-section" id="roles">
      <div class="section-kicker">System roles</div>
      <div class="section-head">
        <div>
          <h2>系统角色地图</h2>
          <p>把论文映射到我们的模型架构：哪些是 executor，哪些是 world simulator，哪些可以作为 planner critic、memory、task allocator 或 baseline。</p>
        </div>
      </div>
      <div class="role-grid">${cards}</div>
    </section>
  `;
}

function renderReadingQueue(papers) {
  const actionValues = uniqueList(papers.map((paper) => paper.next_action).filter(Boolean)).sort(
    (a, b) => {
      const ai = nextActionOrder.indexOf(a);
      const bi = nextActionOrder.indexOf(b);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return tokenLabel(a).localeCompare(tokenLabel(b), "zh-CN");
    },
  );

  const cards = actionValues
    .map((action) => {
      const actionPapers = papers
        .filter((paper) => paper.next_action === action)
        .sort((a, b) => b.year - a.year || a.short_title.localeCompare(b.short_title));
      const items = actionPapers
        .slice(0, 5)
        .map(
          (paper) => `
          <li>
            <span>${escapeHtml(paper.published)}</span>
            <strong>${escapeHtml(paper.short_title)}</strong>
            <em>${escapeHtml(tokenLabel(paper.evidence_level || paper.status))}</em>
          </li>
        `,
        )
        .join("");

      return `
        <article class="queue-card">
          <div class="queue-count">${actionPapers.length}</div>
          <h3>${escapeHtml(tokenLabel(action))}</h3>
          <p>${escapeHtml(nextActionHints[action] || "把这组论文转成更明确的系统设计动作。")}</p>
          <ul>${items}</ul>
        </article>
      `;
    })
    .join("");

  return `
    <section class="section compact-section" id="reading">
      <div class="section-kicker">Reading operations</div>
      <div class="section-head">
        <div>
          <h2>阅读行动队列</h2>
          <p>这里不是普通待办，而是把每篇论文下一步要产出的研究动作显式化：审关系、提能力表、做 baseline、抽系统架构或扩展多智能体 rollout。</p>
        </div>
      </div>
      <div class="queue-grid">${cards}</div>
    </section>
  `;
}

function renderAgentBoard() {
  const cards = agentWorkflows
    .map(
      (workflow) => `
        <article class="agent-card">
          <div class="agent-label">${escapeHtml(workflow.label)}</div>
          <h3>${escapeHtml(workflow.name)}</h3>
          <p>${escapeHtml(workflow.purpose)}</p>
          <div class="agent-output">${escapeHtml(workflow.output)}</div>
        </article>
      `,
    )
    .join("");

  return `
    <section class="section compact-section" id="agents">
      <div class="section-kicker">Agent workflows</div>
      <div class="section-head">
        <div>
          <h2>Agent 工作流</h2>
          <p>把仓库维护拆成可复制的 agent 任务：新增论文、审计关系、精读升级、发现 gap、映射系统设计。</p>
        </div>
      </div>
      <div class="agent-grid">${cards}</div>
    </section>
  `;
}

function renderBenchmarkBoard() {
  const cards = benchmarkResources
    .map(
      (resource) => `
        <article class="benchmark-card">
          <a class="benchmark-shot" href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer">
            <img src="${escapeHtml(resource.image)}" alt="${escapeHtml(resource.name)} screenshot" loading="lazy">
          </a>
          <div class="benchmark-body">
            <div class="benchmark-label">${escapeHtml(resource.label)}</div>
            <h3>${escapeHtml(resource.name)}</h3>
            <p>${escapeHtml(resource.description)}</p>
            <ul>
              ${resource.takeaways.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
            <div class="benchmark-meta">
              <span>${escapeHtml(resource.source)}</span>
              <span>截图 ${escapeHtml(resource.captured)}</span>
              <a href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer">打开榜单</a>
            </div>
          </div>
        </article>
      `,
    )
    .join("");

  return `
    <section class="section compact-section" id="benchmarks">
      <div class="section-kicker">Benchmark watch</div>
      <div class="section-head">
        <div>
          <h2>榜单与竞技场</h2>
          <p>No.1 研究不能只看论文，还要持续看真实榜单、开源基线和可复现实验入口。这里记录值得长期跟踪的机器人排名与评测资源。</p>
        </div>
      </div>
      <div class="benchmark-grid">${cards}</div>
    </section>
  `;
}

function renderTeamRoadmap(roadmap) {
  const members = asList(roadmap.members);
  const tasks = asList(roadmap.tasks);
  if (!members.length || !tasks.length) return "";
  const roster = asList(roadmap.roster);
  const teamNote = String(roadmap.note || "");

  const start = Math.min(...tasks.map((task) => dateValue(task.start)));
  const end = Math.max(...tasks.map((task) => dateValue(task.end)));
  const totalDays = Math.max(1, end - start + 1);
  const ticks = [];
  for (let day = start; day <= end; day += 7) {
    ticks.push({
      label: shortDate(dateFromValue(day)),
      left: ((day - start) / totalDays) * 100,
    });
  }
  if (ticks.at(-1)?.label !== shortDate(dateFromValue(end))) {
    ticks.push({ label: shortDate(dateFromValue(end)), left: 100 });
  }

  const tickHtml = ticks
    .map(
      (tick) => `
        <span class="gantt-tick" style="--x:${tick.left}%">
          <i></i><b>${escapeHtml(tick.label)}</b>
        </span>
      `,
    )
    .join("");

  const memberCards = members
    .map((member) => {
      const memberTasks = tasks
        .filter((task) => task.owner === member.name)
        .sort((a, b) => dateValue(a.start) - dateValue(b.start));
      const rows = memberTasks
        .map((task) => {
          const taskStart = dateValue(task.start);
          const taskEnd = dateValue(task.end);
          const left = ((taskStart - start) / totalDays) * 100;
          const width = ((taskEnd - taskStart + 1) / totalDays) * 100;
          return `
            <div class="gantt-row">
              <div class="gantt-task-label">
                <strong>${escapeHtml(task.title)}</strong>
                <span>${escapeHtml(task.deliverable || task.workstream || "")}</span>
              </div>
              <div class="gantt-track">
                <div class="gantt-bar status-${escapeHtml(task.status || "planned")}"
                  style="--left:${left}%; --width:${width}%"
                  title="${escapeHtml(`${task.title} · ${task.start} - ${task.end}`)}">
                  <span>${escapeHtml(task.title)}</span>
                  <em>${escapeHtml(`${shortDate(task.start)}-${shortDate(task.end)}`)}</em>
                </div>
              </div>
            </div>
          `;
        })
        .join("");

      return `
        <article class="member-gantt" style="--member:${escapeHtml(member.color || "#246bfe")}">
          <div class="member-gantt-head">
            <div>
              <h3>${escapeHtml(member.name)}</h3>
              <p>${escapeHtml(member.role || "")}</p>
            </div>
            <span>${memberTasks.length} 个任务</span>
          </div>
          <div class="gantt-grid">
            <div class="gantt-axis-label">任务</div>
            <div class="gantt-axis">${tickHtml}</div>
            ${rows}
          </div>
        </article>
      `;
    })
    .join("");
  const rosterHtml = roster.length
    ? `
      <div class="team-roster">
        ${roster.map((name) => `<span>${escapeHtml(name)}</span>`).join("")}
      </div>
    `
    : "";

  return `
    <section class="section compact-section" id="team">
      <div class="section-kicker">Team execution plan</div>
      <div class="section-head">
        <div>
          <h2>团队甘特图</h2>
          <p>${escapeHtml(teamNote || "把 No.1 论文仓库拆成具体负责人、日期和交付物。")} 数据源是 <code>team/roadmap.json</code>，后续改排期只需要更新结构化任务。</p>
        </div>
        <div class="team-range">${escapeHtml(`${dateFromValue(start)} -> ${dateFromValue(end)}`)}</div>
      </div>
      <div class="team-summary">
        <span>${roster.length || members.length} 人团队</span>
        <span>${members.length} 人当前排期</span>
        <span>${tasks.length} 个任务</span>
        <span>${totalDays} 天窗口</span>
      </div>
      ${rosterHtml}
      <div class="team-gantt-board">${memberCards}</div>
    </section>
  `;
}

function sameMonthNodeOffset(index, count, step) {
  return (index - (count - 1) / 2) * step;
}

function buildCompactTimeAxis(graphPapers, top) {
  const monthValues = [...new Set(graphPapers.map((paper) => paper.published_value))].sort(
    (a, b) => a - b,
  );
  const monthYByValue = new Map();
  let y = top;

  monthValues.forEach((value, index) => {
    if (index > 0) {
      const previous = monthValues[index - 1];
      const skippedMonths = Math.max(0, value - previous - 1);
      const yearChanged = Math.floor(value / 12) !== Math.floor(previous / 12);
      y += 58 + Math.min(skippedMonths * 2, 18) + (yearChanged ? 16 : 0);
    }
    monthYByValue.set(value, y);
  });

  return { monthValues, monthYByValue, lastY: y };
}

function buildDomainGraphLayout(graphPapers, options) {
  const { left, top, bottom, colWidth, nodeHeight, nodeGap, monthYByValue, timelineBottom } =
    options;
  const groups = new Map();
  for (const paper of graphPapers) {
    const key = `${paper.graph_domain}:${paper.published_value}`;
    const items = groups.get(key) ?? [];
    items.push(paper);
    groups.set(key, items);
  }

  for (const items of groups.values()) {
    items.sort((a, b) => a.short_title.localeCompare(b.short_title, "zh-CN"));
  }

  const positions = new Map();
  let maxY = timelineBottom;

  for (const domain of domainColumns) {
    const domainIndex = domainColumns.indexOf(domain);
    const x = left + domainIndex * colWidth + colWidth / 2;
    let lastY = Number.NEGATIVE_INFINITY;
    const papers = graphPapers
      .filter((paper) => paper.graph_domain === domain)
      .sort(
        (a, b) =>
          a.published_value - b.published_value || a.short_title.localeCompare(b.short_title, "zh-CN"),
      );

    for (const paper of papers) {
      const baseY = monthYByValue.get(paper.published_value) ?? top;
      const group = groups.get(`${paper.graph_domain}:${paper.published_value}`) ?? [paper];
      const groupIndex = group.findIndex((item) => item.id === paper.id);
      const desiredY =
        baseY + sameMonthNodeOffset(groupIndex, group.length, nodeHeight + nodeGap);
      const y = Math.max(desiredY, lastY + nodeHeight + nodeGap);
      positions.set(paper.id, { x, y, baseY, paper });
      lastY = y;
      maxY = Math.max(maxY, y);
    }
  }

  const width = left + domainColumns.length * colWidth + 40;
  const height = Math.max(timelineBottom + bottom, maxY + bottom);
  return { width, height, positions };
}

function renderDomainGraph(papers) {
  const graphPapers = papers
    .map((paper) => ({
      ...paper,
      graph_domain:
        domainColumns.includes(paper.primary_domain)
          ? paper.primary_domain
          : asList(paper.domains).find((domain) => domainColumns.includes(domain)) || "GNN",
    }))
    .sort((a, b) => a.published_value - b.published_value || a.graph_domain.localeCompare(b.graph_domain));

  const byId = new Map(graphPapers.map((paper) => [paper.id, paper]));
  const left = 56;
  const top = 124;
  const bottom = 78;
  const colWidth = 106;
  const nodeWidth = 86;
  const nodeHeight = 28;
  const nodeGap = 7;
  const timeAxis = buildCompactTimeAxis(graphPapers, top);
  const { width, height, positions } = buildDomainGraphLayout(graphPapers, {
    left,
    top,
    bottom,
    colWidth,
    nodeHeight,
    nodeGap,
    monthYByValue: timeAxis.monthYByValue,
    timelineBottom: timeAxis.lastY,
  });

  const tethers = [...positions.values()]
    .filter((position) => Math.abs(position.y - position.baseY) > 1)
    .map(
      ({ x, y, baseY }) =>
        `<line class="graph-time-tether" x1="${x}" y1="${baseY}" x2="${x}" y2="${y}"></line>`,
    )
    .join("\n");

  const nodes = graphPapers
    .map((paper) => {
      const { x, y } = positions.get(paper.id);
      const secondaryDomains = asList(paper.domains)
        .filter((domain) => domain !== paper.graph_domain)
        .slice(0, 2)
        .join(" · ");
      return `
        <button class="graph-node"
          style="--x:${x}px; --y:${y}px; --node:${domainColors[paper.graph_domain] ?? palette[0]}"
          data-node-id="${escapeHtml(paper.id)}"
          data-node-title="${escapeHtml(paper.short_title)}"
          data-note-path="${escapeHtml(paper.note_html)}"
          aria-label="${escapeHtml(`${paper.short_title} ${paper.published}`)}">
          <strong>${escapeHtml(paper.short_title)}</strong>
          <span>${escapeHtml(paper.graph_domain)}</span>
          ${secondaryDomains ? `<em>${escapeHtml(secondaryDomains)}</em>` : ""}
        </button>
      `;
    })
    .join("\n");

  const edges = normalizeGraphEdges(graphPapers)
    .filter((edge) => byId.has(edge.a) && byId.has(edge.b) && positions.has(edge.a) && positions.has(edge.b))
    .map((edge) => {
      const from = positions.get(edge.parent);
      const to = positions.get(edge.child);
      const sameColumn = Math.abs(from.x - to.x) < 4;
      const direction = to.x >= from.x ? 1 : -1;
      let d = "";
      if (sameColumn) {
        const side = nodeWidth / 2 + 8;
        const sx = from.x + side;
        const tx = to.x + side;
        const cx = sx + 34;
        d = `M ${sx} ${from.y} C ${cx} ${from.y}, ${cx} ${to.y}, ${tx} ${to.y}`;
      } else {
        const sx = from.x + direction * (nodeWidth / 2 + 2);
        const tx = to.x - direction * (nodeWidth / 2 + 2);
        const midX = (sx + tx) / 2;
        d = `M ${sx} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${tx} ${to.y}`;
      }
      const relation = relationTypes[edge.type] ?? relationTypes.cites;
      return `<path class="graph-edge"
        style="--edge-color:${relation.color}; --edge-marker:url(#arrowhead-${escapeHtml(edge.type)}); --edge-start-marker:url(#arrowhead-start-${escapeHtml(edge.type)})"
        data-edge-a="${escapeHtml(edge.a)}"
        data-edge-b="${escapeHtml(edge.b)}"
        data-edge-parent="${escapeHtml(edge.parent)}"
        data-edge-child="${escapeHtml(edge.child)}"
        data-edge-type="${escapeHtml(edge.type)}"
        data-edge-label="${escapeHtml(relation.label)}"
        data-edge-short="${escapeHtml(relation.short)}"
        data-edge-description="${escapeHtml(relation.description)}"
        data-edge-parent-title="${escapeHtml(from.paper.short_title)}"
        data-edge-parent-note="${escapeHtml(from.paper.note_html)}"
        data-edge-child-title="${escapeHtml(to.paper.short_title)}"
        data-edge-child-note="${escapeHtml(to.paper.note_html)}"
        d="${d}"
        marker-end="url(#arrowhead-${escapeHtml(edge.type)})"></path>`;
    })
    .join("\n");

  const paperMonths = [...new Set(graphPapers.map((paper) => paper.published))].sort(
    (a, b) => monthValue(a) - monthValue(b),
  );
  const monthLabels = paperMonths
    .map((month) => {
      const y = timeAxis.monthYByValue.get(monthValue(month)) ?? top;
      return `<div class="graph-month" style="--y:${y}px">${escapeHtml(month)}</div>`;
    })
    .join("\n");

  const gapMarkers = timeAxis.monthValues
    .slice(1)
    .map((value, index) => {
      const previous = timeAxis.monthValues[index];
      const skippedMonths = value - previous - 1;
      if (skippedMonths < 3) return "";
      const y = ((timeAxis.monthYByValue.get(previous) ?? top) + (timeAxis.monthYByValue.get(value) ?? top)) / 2;
      const label = skippedMonths >= 12 ? `跳过 ${Math.floor(skippedMonths / 12)}y${skippedMonths % 12 ? ` ${skippedMonths % 12}m` : ""}` : `跳过 ${skippedMonths}m`;
      return `<div class="graph-gap" style="--y:${y}px"><span>${escapeHtml(label)}</span></div>`;
    })
    .join("\n");

  const columns = domainColumns
    .map((domain, index) => {
      const x = left + index * colWidth;
      return `
        <div class="graph-column" style="--x:${x}px; --w:${colWidth}px; --domain:${domainColors[domain]}">
          <span>${escapeHtml(domain)}</span>
        </div>
      `;
    })
    .join("\n");
  const columnGroups = domainColumnGroups
    .map((group) => {
      const indices = group.domains
        .map((domain) => domainColumns.indexOf(domain))
        .filter((index) => index >= 0);
      if (!indices.length) return "";
      const start = Math.min(...indices);
      const end = Math.max(...indices);
      const x = left + start * colWidth;
      const width = (end - start + 1) * colWidth;
      const color = domainColors[group.domains[0]] ?? palette[0];
      return `
        <div class="graph-column-group" style="--x:${x}px; --w:${width}px; --group:${color}">
          <span>${escapeHtml(group.label)}</span>
        </div>
      `;
    })
    .join("\n");

  const relationMarkers = Object.entries(relationTypes)
    .map(
      ([type, relation]) => `
                <marker id="arrowhead-${escapeHtml(type)}" markerWidth="4.5" markerHeight="4.5" refX="3.5" refY="2.25" orient="auto">
                  <path d="M 0 0 L 4.5 2.25 L 0 4.5 z" fill="${relation.color}"></path>
                </marker>
                <marker id="arrowhead-start-${escapeHtml(type)}" markerWidth="4.5" markerHeight="4.5" refX="3.5" refY="2.25" orient="auto-start-reverse">
                  <path d="M 0 0 L 4.5 2.25 L 0 4.5 z" fill="${relation.color}"></path>
                </marker>`,
    )
    .join("\n");
  const relationFilters = [
    `<button class="relation-filter is-active" data-relation-filter="all">全部关系</button>`,
    ...Object.entries(relationTypes).map(
      ([type, relation]) =>
        `<button class="relation-filter" style="--rel:${relation.color}" data-relation-filter="${escapeHtml(type)}">${escapeHtml(relation.label)}</button>`,
    ),
  ].join("");
  const directionFilters = [
    `<button class="relation-filter" data-edge-direction="parent-child">父 → 子</button>`,
    `<button class="relation-filter" data-edge-direction="child-parent">子 → 父</button>`,
    `<button class="relation-filter is-active" data-edge-direction="both">双向</button>`,
  ].join("");

  return `
    <section class="section" id="domain-graph">
      <div class="section-kicker">Typed relation graph</div>
      <div class="section-head">
        <div>
          <h2>领域时间关系图</h2>
          <p>纵向按论文发表年月排序，但采用压缩时间轴：只给有论文的月份分配主刻度，长空档用 gap marker 标出；同月同领域论文会自动错层，并用细线回连真实月份。</p>
        </div>
      </div>
      <div class="relation-toolbar" aria-label="关系图渲染设置">
        <div class="relation-filterbar" aria-label="关系类型过滤">
          ${relationFilters}
        </div>
        <div class="relation-filterbar direction-filterbar" aria-label="关系方向渲染">
          ${directionFilters}
        </div>
      </div>
      <div class="graph-workspace">
        <div class="graph-frame">
            <div class="domain-graph" data-edge-direction="both" style="--graph-width:${width}px; --graph-height:${height}px; --node-width:${nodeWidth}px; --node-height:${nodeHeight}px">
            ${columnGroups}
            ${columns}
            ${monthLabels}
            ${gapMarkers}
            <svg class="graph-edges" viewBox="0 0 ${width} ${height}" aria-hidden="true">
              <defs>
                ${relationMarkers}
              </defs>
              ${tethers}
              ${edges}
            </svg>
            ${nodes}
          </div>
        </div>
        <aside class="relation-panel" data-relation-panel>
          <div class="relation-kicker">Relation lens</div>
          <h3 data-relation-title>选择一篇论文</h3>
          <div class="relation-actions">
            <a class="relation-note-link is-disabled" data-open-note target="_blank" rel="noreferrer" aria-disabled="true">
              <span>选择节点后打开当前 Note</span>
              <strong>Open</strong>
            </a>
          </div>
          <p data-relation-summary>点击左侧节点后，这里会按当前方向显示与它相连的 typed relations。</p>
          <div class="relation-list" data-relation-list></div>
        </aside>
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
      const roles = asList(paper.system_roles)
        .map((role) => `<span class="tag role-tag">${escapeHtml(tokenLabel(role))}</span>`)
        .join("");
      const modules = asList(paper.reusable_modules)
        .slice(0, 5)
        .map((module) => `<span class="tag module-tag">${escapeHtml(tokenLabel(module))}</span>`)
        .join("");
      const authors = asList(paper.authors).slice(0, 6).join(", ");
      const institutions = asList(paper.institutions).join(" · ");
      const pdfHref = assetHref(paper.pdf_path);
      const pdfDataLink =
        paper.pdf_path && !isExternalUrl(paper.pdf_path)
          ? ` data-pdf-link="${escapeHtml(paper.pdf_path)}"`
          : "";
      const links = [
        paper.pdf_path
          ? `<a href="${escapeHtml(pdfHref)}"${pdfDataLink} target="_blank" rel="noreferrer">PDF</a>`
          : "",
        `<a href="${escapeHtml(paper.note_html)}" data-note-link="${escapeHtml(paper.note_html)}" target="_blank" rel="noreferrer">Note</a>`,
        paper.url ? `<a href="${escapeHtml(paper.url)}" target="_blank" rel="noreferrer">论文</a>` : "",
        paper.project_url
          ? `<a href="${escapeHtml(paper.project_url)}" target="_blank" rel="noreferrer">项目页</a>`
          : "",
        paper.code_url ? `<a href="${escapeHtml(paper.code_url)}" target="_blank" rel="noreferrer">代码</a>` : "",
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
          data-system_roles="${escapeHtml(asList(paper.system_roles).join(" "))}"
          data-search="${escapeHtml(
            [
              paper.title,
              paper.short_title,
              paper.venue,
              paper.summary,
              paper.method,
              paper.contribution,
              paper.published,
              paper.primary_domain,
              paper.evidence_level,
              paper.next_action,
              asList(paper.domains).join(" "),
              asList(paper.tags).join(" "),
              asList(paper.system_roles).join(" "),
              asList(paper.reusable_modules).join(" "),
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
            <span>${escapeHtml(paper.published)}</span>
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
                <div><b>可复用模块</b>${markdownToHtml(paper.reusable_module_text)}</div>
                <div><b>证据与风险</b>${markdownToHtml(paper.evidence_risk)}</div>
              </div>
            </details>
            <div class="paper-roles">${roles}</div>
            <div class="paper-modules">${modules}</div>
            <div class="paper-next">Evidence: ${escapeHtml(tokenLabel(paper.evidence_level))} · Next: ${escapeHtml(tokenLabel(paper.next_action))}</div>
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

function renderNotePills(values, className = "note-pill") {
  return asList(values)
    .map((value) => `<span class="${className}">${escapeHtml(tokenLabel(value))}</span>`)
    .join("");
}

function renderNoteSection(title, body, tone = "") {
  if (!body) return "";
  return `
    <section class="note-section ${tone}">
      <div class="note-section-kicker">${escapeHtml(title)}</div>
      <div class="note-section-body">${markdownToHtml(body)}</div>
    </section>
  `;
}

function renderNoteLinks(paper) {
  const links = [
    paper.pdf_path
      ? `<a href="${escapeHtml(assetHref(paper.pdf_path, "../"))}" target="_blank" rel="noreferrer">PDF</a>`
      : "",
    paper.url ? `<a href="${escapeHtml(paper.url)}" target="_blank" rel="noreferrer">Paper</a>` : "",
    paper.project_url
      ? `<a href="${escapeHtml(paper.project_url)}" target="_blank" rel="noreferrer">Project</a>`
      : "",
    paper.code_url ? `<a href="${escapeHtml(paper.code_url)}" target="_blank" rel="noreferrer">Code</a>` : "",
    paper.doi ? `<a href="https://doi.org/${escapeHtml(paper.doi)}" target="_blank" rel="noreferrer">DOI</a>` : "",
    paper.arxiv ? `<a href="https://arxiv.org/abs/${escapeHtml(paper.arxiv)}" target="_blank" rel="noreferrer">arXiv</a>` : "",
  ].filter(Boolean);
  return links.join("");
}

function renderNoteRelations(paper, papers) {
  const byId = new Map(papers.map((item) => [item.id, item]));
  const outgoing = asList(paper.relations).filter((relation) => byId.has(relation.target));
  const incoming = papers
    .flatMap((source) =>
      asList(source.relations)
        .filter((relation) => relation.target === paper.id)
        .map((relation) => ({ ...relation, source: source.id })),
    )
    .filter((relation) => byId.has(relation.source));

  const outgoingHtml = outgoing.length
    ? outgoing
        .map((relation) => {
          const target = byId.get(relation.target);
          const type = relationTypes[relation.type] ?? relationTypes.cites;
          return `
            <a class="relation-chip" style="--rel:${type.color}" href="../${escapeHtml(target.note_html)}">
              <span>${escapeHtml(type.label)}</span>
              <strong>${escapeHtml(target.short_title)}</strong>
            </a>
          `;
        })
        .join("")
    : `<div class="relation-empty">还没有指向关联论文或前序工作的 typed relation。</div>`;

  const incomingHtml = incoming.length
    ? incoming
        .map((relation) => {
          const source = byId.get(relation.source);
          const type = relationTypes[relation.type] ?? relationTypes.cites;
          return `
            <a class="relation-chip incoming" style="--rel:${type.color}" href="../${escapeHtml(source.note_html)}">
              <span>${escapeHtml(type.label)}</span>
              <strong>${escapeHtml(source.short_title)}</strong>
            </a>
          `;
        })
        .join("")
    : `<div class="relation-empty">暂时没有下游论文连接到这篇。</div>`;

  return `
    <section class="note-section relation-section">
      <div class="note-section-kicker">Typed Relations</div>
      <div class="relation-columns">
        <div>
          <h3>当前论文 -> 关联论文 / 前序工作</h3>
          <div class="relation-chip-grid">${outgoingHtml}</div>
        </div>
        <div>
          <h3>下游论文 -> 当前论文</h3>
          <div class="relation-chip-grid">${incomingHtml}</div>
        </div>
      </div>
    </section>
  `;
}

function renderNotePage(paper, papers) {
  const authors = asList(paper.authors).join(", ");
  const institutions = asList(paper.institutions).join(" · ");
  const rolePills = renderNotePills(paper.system_roles, "note-pill role-pill");
  const modulePills = renderNotePills(paper.reusable_modules, "note-pill module-pill");
  const tagPills = renderNotePills(paper.tags, "note-pill");

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>${escapeHtml(paper.short_title)} · Paper Note</title>
  <style>
    :root {
      --bg: #eef4fb;
      --paper: rgba(255, 255, 255, 0.82);
      --paper-strong: rgba(255, 255, 255, 0.94);
      --ink: #111827;
      --muted: #61748d;
      --line: rgba(74, 112, 154, 0.34);
      --soft-line: rgba(133, 163, 196, 0.24);
      --blue: #246bfe;
      --cyan: #00a7c7;
      --purple: #6a7dff;
      --shadow: 0 18px 45px rgba(22, 50, 83, 0.12);
      --sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      color: var(--ink);
      font-family: var(--sans);
      line-height: 1.72;
      background:
        radial-gradient(circle at 16% 12%, rgba(36, 107, 254, 0.14), transparent 28rem),
        radial-gradient(circle at 88% 16%, rgba(0, 167, 199, 0.16), transparent 26rem),
        linear-gradient(var(--soft-line) 1px, transparent 1px),
        linear-gradient(90deg, var(--soft-line) 1px, transparent 1px),
        var(--bg);
      background-size: auto, auto, 32px 32px, 32px 32px, auto;
    }

    a { color: inherit; }

    .note-topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      padding: 13px 28px;
      border-bottom: 1px solid var(--soft-line);
      background: rgba(248, 251, 255, 0.86);
      backdrop-filter: blur(18px);
      box-shadow: 0 14px 35px rgba(31, 76, 128, 0.08);
    }

    .note-brand,
    .note-nav a,
    .note-kicker,
    .note-section-kicker,
    .metric-label,
    .note-pill,
    .relation-chip span {
      font-family: var(--mono);
    }

    .note-brand {
      color: var(--blue);
      font-weight: 800;
      text-decoration: none;
    }

    .note-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      color: var(--muted);
      font-size: 12px;
    }

    .note-nav a {
      text-decoration: none;
    }

    .note-nav a:hover {
      color: var(--blue);
    }

    .note-shell {
      width: min(1500px, calc(100% - 48px));
      margin: 0 auto;
      padding: 38px 0 70px;
    }

    .note-hero {
      display: grid;
      grid-template-columns: minmax(0, 1.6fr) 360px;
      gap: 24px;
      align-items: stretch;
      margin-bottom: 24px;
    }

    .hero-main,
    .hero-side,
    .note-section,
    .note-aside-panel {
      border: 1px solid var(--line);
      border-radius: 10px;
      background: var(--paper);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
    }

    .hero-main {
      padding: 34px;
      overflow: hidden;
      position: relative;
    }

    .hero-main::before {
      content: "";
      position: absolute;
      inset: 0;
      border-top: 2px solid rgba(36, 107, 254, 0.42);
      background: linear-gradient(135deg, rgba(36, 107, 254, 0.08), transparent 42%);
      pointer-events: none;
    }

    .note-kicker {
      position: relative;
      color: var(--blue);
      font-size: 12px;
      margin-bottom: 14px;
    }

    h1, h2, h3 {
      margin: 0;
      line-height: 1.14;
    }

    h1 {
      position: relative;
      max-width: 980px;
      color: #0f172a;
      font-size: 56px;
      font-weight: 820;
    }

    .full-title {
      position: relative;
      max-width: 940px;
      margin-top: 14px;
      color: var(--muted);
      font-size: 18px;
    }

    .note-summary {
      position: relative;
      max-width: 980px;
      margin-top: 28px;
      padding-left: 18px;
      border-left: 3px solid var(--blue);
      font-size: 22px;
      color: #16233a;
    }

    .note-summary p {
      margin: 0;
    }

    .hero-side {
      display: grid;
      gap: 14px;
      padding: 22px;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .metric {
      min-height: 84px;
      padding: 14px;
      border: 1px solid var(--soft-line);
      border-radius: 8px;
      background: rgba(247, 251, 255, 0.76);
    }

    .metric-value {
      color: var(--blue);
      font-size: 22px;
      font-weight: 800;
    }

    .metric-label {
      color: var(--muted);
      font-size: 11px;
    }

    .note-link-row,
    .pill-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .note-link-row a {
      min-height: 30px;
      display: inline-flex;
      align-items: center;
      padding: 0 10px;
      border: 1px solid rgba(36, 107, 254, 0.28);
      border-radius: 5px;
      background: linear-gradient(135deg, #1e63ff, #0aa3c2);
      color: #fff;
      text-decoration: none;
      font-size: 13px;
      box-shadow: 0 10px 22px rgba(36, 107, 254, 0.16);
    }

    .note-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 24px;
      align-items: start;
    }

    .note-main {
      display: grid;
      gap: 16px;
    }

    .note-section {
      padding: 24px;
      background: var(--paper-strong);
    }

    .note-section.impact {
      border-color: rgba(36, 107, 254, 0.44);
      background:
        linear-gradient(135deg, rgba(36, 107, 254, 0.08), rgba(0, 167, 199, 0.05)),
        var(--paper-strong);
    }

    .note-section.risk {
      border-color: rgba(209, 77, 114, 0.26);
    }

    .note-section-kicker {
      color: var(--blue);
      font-size: 12px;
      margin-bottom: 10px;
    }

    .note-section-body {
      color: #172033;
      font-size: 16px;
    }

    .note-section-body p,
    .note-section-body ul,
    .note-section-body ol {
      margin: 0 0 12px;
    }

    .note-section-body :last-child {
      margin-bottom: 0;
    }

    .note-section-body ul,
    .note-section-body ol {
      padding-left: 22px;
    }

    .note-section-body li {
      margin: 7px 0;
    }

    code {
      padding: 1px 5px;
      border: 1px solid var(--soft-line);
      border-radius: 4px;
      background: rgba(236, 246, 255, 0.82);
      font-family: var(--mono);
      font-size: 0.92em;
    }

    .note-aside {
      position: sticky;
      top: 82px;
      display: grid;
      gap: 14px;
    }

    .note-aside-panel {
      padding: 18px;
    }

    .note-aside-panel h2 {
      margin-bottom: 12px;
      font-size: 18px;
    }

    .note-pill {
      display: inline-flex;
      align-items: center;
      min-height: 25px;
      padding: 0 8px;
      border: 1px solid var(--soft-line);
      border-radius: 999px;
      background: rgba(247, 251, 255, 0.84);
      color: #415a77;
      font-size: 11px;
    }

    .role-pill {
      border-color: rgba(36, 107, 254, 0.32);
      color: #1f4fd6;
    }

    .module-pill {
      border-color: rgba(0, 167, 199, 0.32);
      color: #0f7894;
    }

    .relation-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
    }

    .relation-columns h3 {
      margin-bottom: 10px;
      font-size: 16px;
    }

    .relation-chip-grid {
      display: grid;
      gap: 8px;
    }

    .relation-chip {
      display: grid;
      gap: 3px;
      padding: 10px 12px;
      border: 1px solid var(--soft-line);
      border-left: 3px solid var(--rel);
      border-radius: 6px;
      background: rgba(247, 251, 255, 0.86);
      text-decoration: none;
    }

    .relation-chip span {
      color: color-mix(in srgb, var(--rel), #111827 30%);
      font-size: 11px;
      font-weight: 800;
    }

    .relation-chip strong {
      color: #142033;
      font-size: 14px;
    }

    .relation-empty {
      color: var(--muted);
      font-size: 13px;
    }

    .toc-list {
      display: grid;
      gap: 8px;
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 13px;
    }

    .toc-list a {
      color: var(--muted);
      text-decoration: none;
    }

    .toc-list a:hover {
      color: var(--blue);
    }

    .note-footer {
      padding: 34px 0 0;
      color: var(--muted);
      font-size: 13px;
    }

    @media (max-width: 980px) {
      .note-topbar {
        align-items: flex-start;
        flex-direction: column;
      }

      .note-shell {
        width: min(100% - 28px, 760px);
      }

      .note-hero,
      .note-layout,
      .relation-columns {
        grid-template-columns: 1fr;
      }

      h1 {
        font-size: 40px;
      }

      .note-aside {
        position: static;
      }
    }
  </style>
</head>
<body>
  <header class="note-topbar">
    <a class="note-brand" href="../index.html#domain-graph">General Multi-Agent Model</a>
    <nav class="note-nav">
      <a href="../index.html#domain-graph">关系图</a>
      <a href="../index.html#roles">系统角色</a>
      <a href="../index.html#papers">论文索引</a>
      <a href="#relations">关系</a>
      <a href="#open-question">开放问题</a>
    </nav>
  </header>

  <main class="note-shell" id="top">
    <section class="note-hero">
      <div class="hero-main">
        <div class="note-kicker">${escapeHtml(paper.published)} · ${escapeHtml(paper.venue)} · ${escapeHtml(label(paper.tech_paradigm))}</div>
        <h1>${escapeHtml(paper.short_title)}</h1>
        <div class="full-title">${escapeHtml(paper.title)}</div>
        <div class="note-summary">${markdownToHtml(paper.summary)}</div>
      </div>
      <aside class="hero-side">
        <div class="metric-grid">
          <div class="metric">
            <div class="metric-value">${escapeHtml(paper.year)}</div>
            <div class="metric-label">Year</div>
          </div>
          <div class="metric">
            <div class="metric-value">${escapeHtml(label(paper.readiness))}</div>
            <div class="metric-label">Readiness</div>
          </div>
          <div class="metric">
            <div class="metric-value">${escapeHtml(tokenLabel(paper.evidence_level))}</div>
            <div class="metric-label">Evidence</div>
          </div>
          <div class="metric">
            <div class="metric-value">${asList(paper.relations).length}</div>
            <div class="metric-label">Relations</div>
          </div>
        </div>
        <div>
          <div class="note-section-kicker">Authors</div>
          <div>${escapeHtml(authors)}</div>
        </div>
        <div>
          <div class="note-section-kicker">Institutions</div>
          <div>${escapeHtml(institutions)}</div>
        </div>
        <div class="note-link-row">${renderNoteLinks(paper)}</div>
      </aside>
    </section>

    <section class="note-layout">
      <article class="note-main">
        ${renderNoteSection("For Our Model", paper.planning_insight, "impact")}
        ${renderNoteSection("Research Question", paper.research_question)}
        ${renderNoteSection("Method", paper.method)}
        ${renderNoteSection("Key Contributions", paper.contribution)}
        ${renderNoteSection("Reading Highlights", paper.reading_highlights)}
        ${renderNoteSection("Limitations", paper.limitation, "risk")}
        ${renderNoteSection("Reusable Modules", paper.reusable_module_text)}
        ${renderNoteSection("Evidence & Risk", paper.evidence_risk, "risk")}
        <div id="relations">${renderNoteRelations(paper, papers)}</div>
        ${renderNoteSection("Relation Notes", paper.relation)}
        <div id="open-question">${renderNoteSection("Open Question", paper.open_question, "impact")}</div>
      </article>

      <aside class="note-aside">
        <section class="note-aside-panel">
          <h2>System Roles</h2>
          <div class="pill-row">${rolePills}</div>
        </section>
        <section class="note-aside-panel">
          <h2>Reusable Modules</h2>
          <div class="pill-row">${modulePills}</div>
        </section>
        <section class="note-aside-panel">
          <h2>Next Action</h2>
          <div class="note-pill role-pill">${escapeHtml(tokenLabel(paper.next_action))}</div>
        </section>
        <section class="note-aside-panel">
          <h2>Tags</h2>
          <div class="pill-row">${tagPills}</div>
        </section>
        <section class="note-aside-panel">
          <h2>Reading Map</h2>
          <ul class="toc-list">
            <li><a href="#top">Summary</a></li>
            <li><a href="#relations">Typed relations</a></li>
            <li><a href="#open-question">Open question</a></li>
            <li><a href="../index.html#domain-graph">Back to graph</a></li>
          </ul>
        </section>
      </aside>
    </section>

  </main>
</body>
</html>`;
}

function renderIndex(papers, teamRoadmap) {
  const techValues = uniqueValues(papers, "tech_paradigm");
  const layerValues = uniqueValues(papers, "primary_technical_layer");
  const roleValues = uniqueList(papers.flatMap((paper) => asList(paper.system_roles))).sort((a, b) =>
    tokenLabel(a).localeCompare(tokenLabel(b), "zh-CN"),
  );
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
  <meta name="robots" content="noindex,nofollow,noarchive">
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
      width: min(1740px, calc(100% - 48px));
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

    .compact-section {
      padding: 42px 0;
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
      grid-template-columns: 1.5fr repeat(4, 1fr) auto;
      gap: 12px;
      padding: 16px;
      margin: 8px 0 28px;
      box-shadow: 0 12px 28px rgba(22, 50, 83, 0.08);
    }

    .relation-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 18px;
      align-items: center;
      margin: -8px 0 18px;
    }

    .relation-filterbar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .direction-filterbar {
      padding-left: 14px;
      border-left: 1px solid var(--soft-line);
    }

    .relation-filter {
      width: auto;
      min-height: 30px;
      padding: 0 10px;
      border-color: color-mix(in srgb, var(--rel, var(--blue)), transparent 62%);
      border-radius: 999px;
      color: color-mix(in srgb, var(--rel, var(--blue)), #111827 24%);
      font-family: var(--mono);
      font-size: 12px;
    }

    .relation-filter.is-active {
      background: color-mix(in srgb, var(--rel, var(--blue)), transparent 86%);
      border-color: color-mix(in srgb, var(--rel, var(--blue)), transparent 28%);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--rel, var(--blue)), transparent 86%);
    }

    .graph-workspace {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
      align-items: start;
    }

    .graph-frame {
      width: max-content;
      max-width: 100%;
      overflow: visible;
      border: 1px solid var(--line);
      border-radius: 10px;
      background:
        linear-gradient(rgba(106, 125, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(36, 107, 254, 0.055) 1px, transparent 1px),
        rgba(247, 251, 255, 0.78);
      background-size: 17px 17px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
    }

    .domain-graph {
      position: relative;
      width: var(--graph-width);
      height: var(--graph-height);
    }

    .graph-column {
      position: absolute;
      left: var(--x);
      top: 46px;
      width: var(--w);
      height: calc(var(--graph-height) - 56px);
      border-left: 1px solid color-mix(in srgb, var(--domain), transparent 68%);
      background: linear-gradient(180deg, color-mix(in srgb, var(--domain), transparent 92%), transparent 9rem);
    }

    .graph-column span {
      position: absolute;
      top: 9px;
      z-index: 3;
      display: inline-flex;
      align-items: center;
      min-height: 15px;
      margin-left: 6px;
      padding: 0 5px;
      border: 1px solid color-mix(in srgb, var(--domain), transparent 52%);
      border-radius: 999px;
      background: rgba(255,255,255,0.88);
      color: color-mix(in srgb, var(--domain), #111827 34%);
      font-family: var(--mono);
      font-size: 6px;
      font-weight: 700;
      box-shadow: 0 5px 13px rgba(22, 50, 83, 0.09);
      pointer-events: none;
    }

    .graph-column-group {
      position: absolute;
      left: var(--x);
      top: 9px;
      z-index: 4;
      width: var(--w);
      height: 27px;
      border: 1px solid color-mix(in srgb, var(--group), transparent 48%);
      border-bottom-width: 2px;
      border-radius: 8px 8px 0 0;
      background: linear-gradient(180deg, color-mix(in srgb, var(--group), white 83%), rgba(255, 255, 255, 0.9));
      box-shadow: 0 7px 18px rgba(22, 50, 83, 0.08);
    }

    .graph-column-group span {
      display: grid;
      height: 100%;
      place-items: center;
      color: color-mix(in srgb, var(--group), #0f172a 34%);
      font-family: var(--mono);
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 0.02em;
    }

    .graph-month {
      position: absolute;
      left: 9px;
      top: var(--y);
      transform: translateY(-50%);
      width: 39px;
      color: #74849a;
      font-family: var(--mono);
      font-size: 6px;
      text-align: right;
    }

    .graph-month::after {
      content: "";
      position: absolute;
      left: 44px;
      right: -800px;
      top: 50%;
      border-top: 1px solid rgba(100, 116, 139, 0.16);
    }

    .graph-gap {
      position: absolute;
      left: 10px;
      right: 18px;
      top: var(--y);
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      color: rgba(100, 116, 139, 0.64);
      font-family: var(--mono);
      font-size: 6px;
      pointer-events: none;
    }

    .graph-gap::before,
    .graph-gap::after {
      content: "";
      height: 1px;
      flex: 1;
      background: repeating-linear-gradient(
        90deg,
        rgba(100, 116, 139, 0.2) 0 5px,
        transparent 5px 10px
      );
    }

    .graph-gap span {
      padding: 1px 5px;
      border: 1px solid rgba(100, 116, 139, 0.18);
      border-radius: 999px;
      background: rgba(247, 251, 255, 0.82);
    }

    .graph-edges {
      position: absolute;
      inset: 0;
      width: var(--graph-width);
      height: var(--graph-height);
      pointer-events: none;
      overflow: visible;
    }

    .graph-time-tether {
      stroke: rgba(75, 111, 150, 0.34);
      stroke-width: 0.65;
      stroke-dasharray: 2 3;
      opacity: 0.72;
    }

    .graph-edge {
      fill: none;
      stroke: var(--edge-color, rgba(105, 92, 255, 0.34));
      stroke-width: 0.75;
      opacity: 0;
      transition: opacity 0.16s ease, stroke 0.16s ease, stroke-width 0.16s ease;
    }

    .domain-graph[data-edge-direction="child-parent"] .graph-edge {
      marker-start: var(--edge-start-marker);
      marker-end: none;
    }

    .domain-graph[data-edge-direction="both"] .graph-edge {
      marker-start: var(--edge-start-marker);
      marker-end: var(--edge-marker);
    }

    .graph-node {
      position: absolute;
      left: var(--x);
      top: var(--y);
      transform: translate(-50%, -50%);
      z-index: 2;
      display: grid;
      align-content: start;
      gap: 0;
      width: var(--node-width);
      height: var(--node-height);
      padding: 4px 5px;
      border: 1px solid color-mix(in srgb, var(--node), transparent 38%);
      border-radius: 5px;
      background: rgba(255,255,255,0.98);
      color: #142033;
      text-align: left;
      overflow: hidden;
      box-shadow: 0 7px 15px rgba(22, 50, 83, 0.13), 0 0 0 2px color-mix(in srgb, var(--node), transparent 88%);
    }

    .graph-node::before {
      content: "";
      position: absolute;
      left: 4px;
      top: 6px;
      width: 4.5px;
      height: 4.5px;
      border-radius: 50%;
      background: var(--node);
      box-shadow: 0 0 8px color-mix(in srgb, var(--node), transparent 20%);
    }

    .graph-node:hover,
    .graph-node.is-active {
      z-index: 6;
      transform: translate(-50%, -52%);
      border-color: var(--node);
      box-shadow: 0 9px 19px rgba(22, 50, 83, 0.18), 0 0 0 2px color-mix(in srgb, var(--node), transparent 82%);
    }

    .graph-node.is-related {
      z-index: 5;
      opacity: 1;
    }

    .graph-node.is-dimmed {
      opacity: 0.28;
    }

    .graph-edge.is-active {
      stroke: var(--edge-color, rgba(36, 107, 254, 0.78));
      stroke-width: 1.3;
      opacity: 1;
    }

    .graph-edge.is-dimmed {
      opacity: 0;
    }

    .graph-node strong {
      margin-left: 7px;
      font-size: 7.5px;
      line-height: 1.08;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .graph-node span,
    .graph-node em {
      color: #627188;
      font-size: 6px;
      font-style: normal;
      line-height: 1.12;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .relation-panel {
      position: static;
      min-height: 0;
      padding: 18px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.82);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
    }

    .relation-kicker {
      color: var(--blue);
      font-family: var(--mono);
      font-size: 12px;
      margin-bottom: 8px;
    }

    .relation-panel h3 {
      font-size: 24px;
      margin-bottom: 8px;
    }

    .relation-panel p {
      margin: 0 0 14px;
      font-size: 13px;
    }

    .relation-actions {
      margin: 0 0 12px;
    }

    .relation-note-link {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      width: 100%;
      min-height: 50px;
      padding: 0 14px;
      border: 1px solid rgba(36, 107, 254, 0.48);
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(36, 107, 254, 0.96), rgba(0, 167, 199, 0.86));
      color: white;
      font-family: var(--mono);
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 12px 30px rgba(36, 107, 254, 0.22);
    }

    .relation-note-link span {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .relation-note-link strong {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      padding: 0 8px;
      border: 1px solid rgba(255, 255, 255, 0.36);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.16);
      font-size: 10px;
      letter-spacing: 0;
    }

    .relation-note-link.is-disabled {
      color: #64748b;
      border-color: var(--soft-line);
      background: rgba(247, 251, 255, 0.68);
      box-shadow: none;
      pointer-events: none;
    }

    .relation-note-link.is-disabled strong {
      color: #64748b;
      border-color: rgba(100, 116, 139, 0.2);
      background: rgba(100, 116, 139, 0.06);
    }

    .relation-note-link:not(.is-disabled):hover {
      transform: translateY(-1px);
      box-shadow: 0 0 0 3px var(--glow), 0 14px 34px rgba(36, 107, 254, 0.25);
    }

    .relation-target[href]:hover {
      border-color: rgba(36, 107, 254, 0.58);
      color: #1f4fd6;
      box-shadow: 0 0 0 3px var(--glow);
    }

    .relation-list {
      display: grid;
      gap: 10px;
    }

    .relation-item {
      padding: 10px 12px;
      border: 1px solid var(--soft-line);
      border-left: 3px solid var(--rel);
      border-radius: 6px;
      background: rgba(247, 251, 255, 0.86);
    }

    .relation-type {
      display: inline-flex;
      align-items: center;
      min-height: 18px;
      padding: 0 6px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--rel), transparent 88%);
      color: color-mix(in srgb, var(--rel), #111827 30%);
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 700;
    }

    .relation-target {
      display: inline-flex;
      align-items: center;
      width: fit-content;
      max-width: 100%;
      margin-top: 6px;
      padding: 2px 5px;
      border: 1px solid transparent;
      border-radius: 5px;
      color: #142033;
      font-weight: 700;
      text-decoration: none;
    }

    .relation-description {
      margin-top: 4px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.45;
    }

    .quality-grid,
    .role-grid,
    .queue-grid,
    .agent-grid,
    .benchmark-grid,
    .team-gantt-board {
      display: grid;
      gap: 14px;
    }

    .quality-grid,
    .role-grid,
    .queue-grid,
    .agent-grid {
      grid-template-columns: repeat(5, 1fr);
    }

    .quality-card,
    .role-card,
    .queue-card,
    .agent-card {
      padding: 18px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.76);
      box-shadow: 0 12px 28px rgba(22, 50, 83, 0.08);
    }

    .quality-value,
    .role-count,
    .queue-count {
      color: var(--blue);
      font-family: var(--mono);
      font-size: 28px;
      font-weight: 800;
    }

    .quality-name,
    .role-card h3,
    .queue-card h3,
    .agent-card h3 {
      color: #142033;
      font-size: 16px;
      font-weight: 760;
      margin: 4px 0 8px;
    }

    .quality-card p,
    .queue-card p,
    .agent-card p {
      margin: 0;
      font-size: 12px;
      line-height: 1.45;
    }

    .role-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .queue-grid {
      grid-template-columns: repeat(4, 1fr);
    }

    .agent-grid {
      grid-template-columns: repeat(5, 1fr);
    }

    .role-card ul,
    .queue-card ul {
      display: grid;
      gap: 10px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .queue-card ul {
      margin-top: 14px;
    }

    .role-card li,
    .queue-card li {
      border-top: 1px solid var(--soft-line);
      padding-top: 9px;
    }

    .role-card li strong,
    .queue-card li strong {
      display: block;
      font-size: 13px;
    }

    .role-card li span,
    .queue-card li span,
    .queue-card li em {
      display: block;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.45;
    }

    .queue-card li em {
      font-style: normal;
      font-family: var(--mono);
      font-size: 11px;
    }

    .agent-label,
    .agent-output,
    .agent-prompt-link {
      font-family: var(--mono);
      font-size: 12px;
    }

    .agent-label {
      color: var(--blue);
      margin-bottom: 10px;
    }

    .agent-output {
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid var(--soft-line);
      color: #415a77;
      line-height: 1.45;
    }

    .agent-prompt-link {
      flex: 0 0 auto;
      min-height: 32px;
      display: inline-flex;
      align-items: center;
      padding: 0 12px;
      border: 1px solid rgba(36, 107, 254, 0.26);
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.74);
      color: #1f4fd6;
      text-decoration: none;
      box-shadow: 0 8px 18px rgba(22, 50, 83, 0.08);
    }

    .benchmark-grid {
      grid-template-columns: 1fr;
    }

    .benchmark-card {
      display: grid;
      grid-template-columns: minmax(420px, 1.18fr) minmax(320px, 0.82fr);
      gap: 0;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.78);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
    }

    .benchmark-shot {
      min-height: 330px;
      border-right: 1px solid var(--line);
      background: #061f22;
    }

    .benchmark-shot img {
      width: 100%;
      height: 100%;
      min-height: 330px;
      object-fit: cover;
      object-position: top center;
      display: block;
    }

    .benchmark-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .benchmark-label {
      color: var(--blue);
      font-family: var(--mono);
      font-size: 12px;
      margin-bottom: 10px;
    }

    .benchmark-body h3 {
      color: #0f172a;
      font-size: 30px;
      margin-bottom: 10px;
    }

    .benchmark-body p {
      margin: 0 0 14px;
      max-width: none;
    }

    .benchmark-body ul {
      display: grid;
      gap: 8px;
      margin: 0;
      padding: 0;
      list-style: none;
      color: #263b52;
      font-size: 14px;
    }

    .benchmark-body li {
      position: relative;
      padding-left: 14px;
    }

    .benchmark-body li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.72em;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--cyan);
      box-shadow: 0 0 0 3px rgba(0, 167, 199, 0.12);
    }

    .benchmark-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      margin-top: 18px;
      color: var(--muted);
      font-family: var(--mono);
      font-size: 12px;
    }

    .benchmark-meta span,
    .benchmark-meta a {
      border: 1px solid var(--soft-line);
      border-radius: 4px;
      padding: 5px 8px;
      background: rgba(246, 251, 255, 0.88);
      text-decoration: none;
    }

    .benchmark-meta a {
      border-color: rgba(36, 107, 254, 0.34);
      color: #1f4fd6;
    }

    .team-range,
    .team-summary span {
      display: inline-flex;
      align-items: center;
      min-height: 30px;
      padding: 0 10px;
      border: 1px solid rgba(36, 107, 254, 0.22);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.76);
      color: #24466f;
      font-family: var(--mono);
      font-size: 12px;
      box-shadow: 0 8px 18px rgba(22, 50, 83, 0.07);
    }

    .team-summary {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: -6px 0 14px;
    }

    .team-roster {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 0 0 14px;
    }

    .team-roster span {
      display: inline-flex;
      align-items: center;
      min-height: 26px;
      padding: 0 9px;
      border: 1px solid rgba(74, 112, 154, 0.22);
      border-radius: 999px;
      background: rgba(247, 251, 255, 0.72);
      color: #24466f;
      font-size: 12px;
      font-weight: 700;
    }

    .member-gantt {
      border: 1px solid color-mix(in srgb, var(--member), transparent 62%);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.82);
      box-shadow: var(--shadow);
      overflow: hidden;
      backdrop-filter: blur(18px);
    }

    .member-gantt-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      padding: 14px 16px;
      border-bottom: 1px solid color-mix(in srgb, var(--member), transparent 76%);
      background: linear-gradient(90deg, color-mix(in srgb, var(--member), transparent 88%), rgba(255,255,255,0.66));
    }

    .member-gantt-head h3 {
      color: #142033;
      font-size: 20px;
    }

    .member-gantt-head p {
      margin: 3px 0 0;
      color: var(--muted);
      font-size: 12px;
    }

    .member-gantt-head span {
      color: color-mix(in srgb, var(--member), #0f172a 22%);
      font-family: var(--mono);
      font-size: 12px;
      font-weight: 700;
    }

    .gantt-grid {
      display: grid;
      grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
    }

    .gantt-axis-label,
    .gantt-axis,
    .gantt-task-label,
    .gantt-track {
      border-bottom: 1px solid rgba(133, 163, 196, 0.22);
    }

    .gantt-axis-label {
      min-height: 34px;
      padding: 8px 14px;
      color: var(--muted);
      font-family: var(--mono);
      font-size: 11px;
      background: rgba(247, 251, 255, 0.78);
    }

    .gantt-axis {
      position: relative;
      min-width: 0;
      min-height: 34px;
      background:
        linear-gradient(90deg, rgba(36, 107, 254, 0.06) 1px, transparent 1px),
        rgba(247, 251, 255, 0.56);
      background-size: 64px 100%;
    }

    .gantt-tick {
      position: absolute;
      left: var(--x);
      top: 0;
      bottom: 0;
      transform: translateX(-1px);
      color: #64748b;
      font-family: var(--mono);
      font-size: 10px;
    }

    .gantt-tick i {
      display: block;
      width: 1px;
      height: 100%;
      background: rgba(74, 112, 154, 0.26);
    }

    .gantt-tick b {
      position: absolute;
      top: 7px;
      left: 5px;
      font-weight: 600;
      white-space: nowrap;
    }

    .gantt-row {
      display: contents;
    }

    .gantt-task-label {
      min-height: 48px;
      padding: 9px 14px;
      background: rgba(255, 255, 255, 0.62);
    }

    .gantt-task-label strong {
      display: block;
      color: #142033;
      font-size: 13px;
      line-height: 1.22;
    }

    .gantt-task-label span {
      display: block;
      margin-top: 3px;
      color: var(--muted);
      font-size: 11px;
      line-height: 1.25;
    }

    .gantt-track {
      position: relative;
      min-width: 0;
      min-height: 48px;
      background:
        linear-gradient(90deg, rgba(36, 107, 254, 0.045) 1px, transparent 1px),
        rgba(255, 255, 255, 0.5);
      background-size: 64px 100%;
    }

    .gantt-bar {
      position: absolute;
      left: var(--left);
      top: 9px;
      width: max(42px, var(--width));
      max-width: calc(100% - var(--left));
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 0 9px;
      border: 1px solid color-mix(in srgb, var(--member), transparent 26%);
      border-radius: 5px;
      background: linear-gradient(90deg, color-mix(in srgb, var(--member), transparent 10%), color-mix(in srgb, var(--member), transparent 42%));
      color: white;
      box-shadow: 0 8px 18px color-mix(in srgb, var(--member), transparent 72%);
      overflow: hidden;
    }

    .gantt-bar span {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 11px;
      font-weight: 700;
    }

    .gantt-bar em {
      flex: 0 0 auto;
      font-family: var(--mono);
      font-size: 10px;
      font-style: normal;
      opacity: 0.9;
    }

    .gantt-bar.status-active {
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--member), transparent 78%), 0 10px 22px color-mix(in srgb, var(--member), transparent 68%);
    }

    .gantt-bar.status-review {
      background: linear-gradient(90deg, #4b6f96, #6a7dff);
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
    .paper-roles,
    .paper-modules,
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

    .role-tag {
      border-color: rgba(36, 107, 254, 0.34);
      color: #1f4fd6;
    }

    .module-tag {
      border-color: rgba(0, 167, 199, 0.34);
      color: #0f7894;
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

    .paper-roles,
    .paper-modules {
      margin-top: 10px;
    }

    .paper-next {
      margin-top: 10px;
      color: var(--muted);
      font-family: var(--mono);
      font-size: 12px;
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
      .graph-workspace,
      .paper-card,
      .detail-grid,
      .question-grid,
      .quality-grid,
      .role-grid,
      .queue-grid,
      .agent-grid,
      .benchmark-card {
        grid-template-columns: 1fr;
      }

      .benchmark-shot {
        border-right: 0;
        border-bottom: 1px solid var(--line);
      }

      .gantt-grid {
        grid-template-columns: minmax(128px, 34%) minmax(0, 1fr);
      }

      .gantt-axis-label,
      .gantt-task-label {
        padding-left: 10px;
        padding-right: 10px;
      }

      .gantt-bar {
        height: 28px;
        padding: 0 6px;
      }

      .gantt-bar em {
        display: none;
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
      <a href="#domain-graph">关系图</a>
      <a href="#benchmarks">榜单</a>
      <a href="#team">团队</a>
      <a href="#roles">系统角色</a>
      <a href="#reading">阅读队列</a>
      <a href="#agents">Agent</a>
      <a href="#papers">论文</a>
      <a href="#questions">开放问题</a>
    </nav>
  </header>

  <main class="page">
    <section class="hero">
      <div class="eyebrow">Obsidian-first paper repository · generated ${escapeHtml(generatedAt)}</div>
      <h1>通用多智能体任务规划模型研究图谱</h1>
      <p>基于 Markdown note 的 typed relations 自动生成。当前版本聚焦 VLA、π 系列、World Action Model 和 Dreamer，把论文定位为端到端多智能体任务规划模型里的执行器、世界模拟器、planner critic、记忆模块或任务分配器。</p>
      ${renderStats(papers)}
    </section>

    ${renderDomainGraph(papers)}
    ${renderBenchmarkBoard()}
    ${renderTeamRoadmap(teamRoadmap)}
    ${renderQualityBoard(papers)}
    ${renderRoleBoard(papers)}
    ${renderReadingQueue(papers)}
    ${renderAgentBoard()}

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
        <select id="role-filter">
          <option value="">全部系统角色</option>
          ${renderRoleOptions(roleValues)}
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
    const roleFilter = document.querySelector("#role-filter");
    const resultCount = document.querySelector("#result-count");
    const emptyState = document.querySelector("#empty-state");

    function applyFilters() {
      const query = search.value.trim().toLowerCase();
      const year = yearFilter.value;
      const tech = techFilter.value;
      const layer = layerFilter.value;
      const role = roleFilter.value;
      let visible = 0;

      for (const card of cards) {
        const matchesQuery = !query || card.dataset.search.includes(query);
        const matchesYear = !year || card.dataset.year === year;
        const matchesTech = !tech || card.dataset.tech_paradigm === tech;
        const matchesLayer = !layer || card.dataset.primary_technical_layer === layer;
        const matchesRole = !role || card.dataset.system_roles.split(" ").includes(role);
        const shown = matchesQuery && matchesYear && matchesTech && matchesLayer && matchesRole;
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
      roleFilter.value = "";
      applyFilters();
    }

    search.addEventListener("input", applyFilters);
    yearFilter.addEventListener("change", applyFilters);
    techFilter.addEventListener("change", applyFilters);
    layerFilter.addEventListener("change", applyFilters);
    roleFilter.addEventListener("change", applyFilters);

    document.querySelectorAll("[data-reset]").forEach((button) => {
      button.addEventListener("click", resetFilters);
    });

    const graphNodes = Array.from(document.querySelectorAll(".graph-node"));
    const graphEdges = Array.from(document.querySelectorAll(".graph-edge"));
    const relationFilterButtons = Array.from(document.querySelectorAll("[data-relation-filter]"));
    const directionFilterButtons = Array.from(document.querySelectorAll("[data-edge-direction]"));
    const domainGraph = document.querySelector(".domain-graph");
    const graphNoteButtons = Array.from(document.querySelectorAll("[data-open-note]"));
    const relationTitle = document.querySelector("[data-relation-title]");
    const relationSummary = document.querySelector("[data-relation-summary]");
    const relationList = document.querySelector("[data-relation-list]");
    let selectedGraphNode = null;
    let selectedGraphNodeId = null;
    let activeRelationFilter = "all";
    let activeEdgeDirection = "both";

    function noteUrlFor(path) {
      const prefix = window.location.pathname.endsWith("/views/dashboard.html") ? "../" : "";
      return new URL(prefix + path, window.location.href).href;
    }

    document.querySelectorAll("[data-note-link]").forEach((link) => {
      link.href = noteUrlFor(link.dataset.noteLink);
    });

    document.querySelectorAll("[data-pdf-link]").forEach((link) => {
      link.href = noteUrlFor(link.dataset.pdfLink);
    });

    function updateRelationPanel(node, activeEdges) {
      if (!relationTitle || !relationSummary || !relationList) return;
      relationTitle.textContent = node.dataset.nodeTitle;
      relationSummary.textContent = activeEdges.length
        ? "当前按所选方向显示与这篇论文相连的关系。可以用上方关系类型和方向过滤。"
        : "当前过滤条件下没有指向关系。切回“全部关系”可以检查是否还有其他关系。";
      relationList.replaceChildren();

      for (const edge of activeEdges) {
        const targetRole = edge.dataset.edgeTargetRole || "child";
        const targetTitle = edge.dataset.edgeTargetTitle || "";
        const targetNote = edge.dataset.edgeTargetNote || "";
        const item = document.createElement("div");
        item.className = "relation-item";
        item.style.setProperty("--rel", edge.style.getPropertyValue("--edge-color") || "#246bfe");

        const type = document.createElement("div");
        type.className = "relation-type";
        type.textContent = edge.dataset.edgeLabel + " · " + edge.dataset.edgeShort + " · " + (targetRole === "parent" ? "父节点" : "子节点");

        const target = document.createElement(targetNote ? "a" : "div");
        target.className = "relation-target";
        target.textContent = targetTitle;
        if (targetNote) {
          target.href = noteUrlFor(targetNote);
          target.target = "_blank";
          target.rel = "noreferrer";
          target.title = "打开关联论文 Note";
        }

        const description = document.createElement("div");
        description.className = "relation-description";
        description.textContent = edge.dataset.edgeDescription;

        item.append(type, target, description);
        relationList.append(item);
      }
    }

    function resetGraphSelection() {
      selectedGraphNode = null;
      selectedGraphNodeId = null;
      graphEdges.forEach((edge) => {
        edge.classList.remove("is-active", "is-dimmed");
        edge.removeAttribute("data-edge-target-role");
      });
      graphNodes.forEach((node) => {
        node.classList.remove("is-active", "is-related", "is-dimmed");
      });
      graphNoteButtons.forEach((noteButton) => {
        noteButton.removeAttribute("href");
        noteButton.classList.add("is-disabled");
        noteButton.setAttribute("aria-disabled", "true");
        const label = noteButton.querySelector("span");
        if (label) {
          label.textContent = "选择节点后打开当前 Note";
        } else {
          noteButton.textContent = "选择节点后打开当前 Note";
        }
      });
      if (relationTitle) relationTitle.textContent = "选择一篇论文";
      if (relationSummary) relationSummary.textContent = "点击左侧节点后，这里会按当前方向显示与它相连的 typed relations。";
      if (relationList) relationList.replaceChildren();
    }

    function edgeConnectsSelection(edge, id) {
      if (activeEdgeDirection === "parent-child") return edge.dataset.edgeParent === id;
      if (activeEdgeDirection === "child-parent") return edge.dataset.edgeChild === id;
      return edge.dataset.edgeParent === id || edge.dataset.edgeChild === id;
    }

    function decorateEdgeTarget(edge, id) {
      const targetRole = edge.dataset.edgeParent === id ? "child" : "parent";
      edge.dataset.edgeTargetRole = targetRole;
      edge.dataset.edgeTargetTitle =
        targetRole === "child" ? edge.dataset.edgeChildTitle : edge.dataset.edgeParentTitle;
      edge.dataset.edgeTargetNote =
        targetRole === "child" ? edge.dataset.edgeChildNote : edge.dataset.edgeParentNote;
      return targetRole === "child" ? edge.dataset.edgeChild : edge.dataset.edgeParent;
    }

    function selectGraphNode(id, options = {}) {
      if (selectedGraphNodeId === id && !options.force) {
        resetGraphSelection();
        return;
      }
      selectedGraphNodeId = id;
      const connected = new Set([id]);
      const activeEdges = [];
      for (const edge of graphEdges) {
        const passesFilter = activeRelationFilter === "all" || edge.dataset.edgeType === activeRelationFilter;
        if (edgeConnectsSelection(edge, id) && passesFilter) {
          connected.add(decorateEdgeTarget(edge, id));
          edge.classList.add("is-active");
          edge.classList.remove("is-dimmed");
          activeEdges.push(edge);
        } else {
          edge.classList.remove("is-active");
          edge.classList.add("is-dimmed");
        }
      }

      for (const node of graphNodes) {
        const isActive = node.dataset.nodeId === id;
        const isConnected = connected.has(node.dataset.nodeId);
        node.classList.toggle("is-active", isActive);
        node.classList.toggle("is-related", !isActive && isConnected);
        node.classList.toggle("is-dimmed", !isConnected);
        if (isActive) selectedGraphNode = node;
      }

      if (selectedGraphNode) {
        for (const noteButton of graphNoteButtons) {
          noteButton.href = noteUrlFor(selectedGraphNode.dataset.notePath);
          noteButton.classList.remove("is-disabled");
          noteButton.setAttribute("aria-disabled", "false");
          const label = noteButton.querySelector("span");
          if (label) {
            label.textContent = "打开 Note · " + selectedGraphNode.dataset.nodeTitle;
          } else {
            noteButton.textContent = "打开 Note · " + selectedGraphNode.dataset.nodeTitle;
          }
        }
      }
      updateRelationPanel(selectedGraphNode, activeEdges);
    }

    graphNodes.forEach((node) => {
      node.addEventListener("click", () => selectGraphNode(node.dataset.nodeId));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && selectedGraphNodeId) resetGraphSelection();
    });

    relationFilterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeRelationFilter = button.dataset.relationFilter;
        relationFilterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
        if (selectedGraphNodeId) selectGraphNode(selectedGraphNodeId, { force: true });
      });
    });

    directionFilterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeEdgeDirection = button.dataset.edgeDirection;
        directionFilterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
        if (domainGraph) domainGraph.dataset.edgeDirection = activeEdgeDirection;
        if (selectedGraphNodeId) selectGraphNode(selectedGraphNodeId, { force: true });
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
  await mkdir(notesDir, { recursive: true });

  const papers = await readPapers();
  const paperGraph = buildPaperGraphData(papers);
  const teamRoadmap = await readTeamRoadmap();
  const dashboardHtml = stripTrailingWhitespace(renderIndex(papers, teamRoadmap));
  await writeFile(join(dataDir, "papers.json"), `${JSON.stringify(papers, null, 2)}\n`, "utf8");
  await writeFile(join(dataDir, "paper-graph.json"), `${JSON.stringify(paperGraph, null, 2)}\n`, "utf8");
  await writeFile(join(rootDir, "index.html"), dashboardHtml, "utf8");
  await writeFile(join(viewsDir, "dashboard.html"), dashboardHtml, "utf8");
  for (const paper of papers) {
    await writeFile(join(rootDir, paper.note_html), stripTrailingWhitespace(renderNotePage(paper, papers)), "utf8");
  }

  console.log(`Generated ${relative(rootDir, join(dataDir, "papers.json"))}`);
  console.log(`Generated ${relative(rootDir, join(dataDir, "paper-graph.json"))}`);
  console.log(`Generated ${relative(rootDir, join(rootDir, "index.html"))}`);
  console.log(`Generated ${relative(rootDir, join(viewsDir, "dashboard.html"))}`);
  console.log(`Generated ${papers.length} rendered note pages`);
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
