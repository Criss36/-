import type { Demo, BlogPost, Skill } from '../types';

export const demos: Demo[] = [
  {
    id: 'rag-knowledge-graph',
    title: '知识图谱增强 RAG 系统',
    titleEn: 'Knowledge Graph RAG Pipeline',
    description: '不只做向量检索，还用知识图谱补全实体关系，解决"孤立答案缺少上下文"的问题。在法律/医疗场景下，KG-RAG 比纯向量 RAG 的完整率提升 35%。',
    tags: ['LangChain', 'Neo4j', 'BGE Embedding', 'HyDE', 'Cohere Rerank'],
    status: 'live',
    code: `# 从非结构化文本抽取知识图谱
extracter = spacy.blank("en")
doc = extracter(doc_text)
triples = [(e1.text, rel.text, e2.text) for e1, rel, e2 in doc.ents]

# 构建图谱索引
graph.add_triplets(triples)
graph_query = "MATCH (a)-[r]->(b) WHERE a.name = $entity RETURN r, b"

# 混合召回：向量 + 图谱路径
vector_results = vector_store.similarity_search(query, k=5)
graph_results = graph.query(graph_query, {"entity": main_entity})
combined = vector_results + enrich_with_graph_paths(graph_results, vector_results)`
  },
  {
    id: 'multi-agent-mcp',
    title: 'MCP 多 Agent 协作平台',
    titleEn: 'MCP Multi-Agent Orchestration',
    description: '集成 MCP（Model Context Protocol）协议，让 Agent 能调用外部工具（浏览器、GitHub API、数据库）。Supervisor 模式，角色分工：研究员 / 工程师 / 审核员。',
    tags: ['LangGraph', 'MCP', 'CrewAI', 'Tool-Calling', 'FastAPI'],
    status: 'live',
    code: `# MCP 工具注册
mcp_tools = await mcp_client.list_tools()
for tool in mcp_tools:
    agent.registry.register(tool.name, tool.handler)

# Supervisor 分发任务
class SupervisorAgent:
    def route(self, state: AgentState) -> str:
        intent = self.llm.classify(state.messages[-1].content)
        if "search" in intent: return "researcher"
        if "code" in intent: return "engineer"
        return "reviewer"

# 条件边路由
graph.add_conditional_edges(
    "supervisor", supervisor.route,
    {"researcher": "researcher", "engineer": "engineer", "reviewer": "reviewer"}
)`
  },
  {
    id: 'llm-eval-suite',
    title: 'LLM 评测系统',
    titleEn: 'LLM Evaluation Suite',
    description: '覆盖 RAGAS 四维指标 + G-Eval + LLM-as-Judge 主观评测。接 GitHub Actions，每次 PR 自动跑回归，不达标不能合并，评测结果进 Prometheus + Grafana。',
    tags: ['DeepEval', 'RAGAS', 'G-Eval', 'LLM-as-Judge', 'GitHub Actions'],
    status: 'live',
  },
  {
    id: 'structured-json',
    title: '结构化数据抽取',
    titleEn: 'Reliable Structured Extraction',
    description: '非结构化文本 → 带 Schema 校验的 JSON / Pydantic 模型。用了 Pydantic Validation + JSON Mode + Few-shot Example，Pydantic 校验失败自动重试，精度 99.3%。',
    tags: ['Pydantic', 'JSON Mode', 'asyncio', 'OpenAI', 'PDF解析'],
    status: 'live',
  },
  {
    id: 'vllm-production',
    title: 'vLLM 生产推理',
    titleEn: 'vLLM Production Optimization',
    description: 'PagedAttention + Continuous Batching + Tensor Parallelism，7B 模型 QPS 从 20 提到 120，P95 延迟从 800ms 压到 120ms。支持 SLoRA 多租户复用。',
    tags: ['vLLM', 'PagedAttention', 'Continuous Batching', 'TP', 'SLoRA'],
    status: 'live',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'kg-rag',
    title: '为什么纯向量 RAG 迟早会遇到天花板',
    excerpt: '向量检索解决"语义相似"的问题，但解决不了"实体关系缺失"的问题。知识图谱 RAG 是下一阶段的主流方案，从 RAGFlow 的架构设计里学到了这个思路。',
    date: '2026-03-20',
    tags: ['RAG', '知识图谱', 'Neo4j', 'RAGFlow'],
    readTime: '20 min',
  },
  {
    id: 'mcp-protocol',
    title: 'MCP 协议：让 Agent 真正连接外部世界',
    excerpt: 'MCP（Model Context Protocol）是 2025 年工具调用领域最重要的事件。不同于 Function Calling，MCP 是开放的设备协议。本文从工程角度解析 MCP 的设计哲学。',
    date: '2026-03-05',
    tags: ['MCP', 'Agent', '工具调用', 'LangGraph'],
    readTime: '16 min',
  },
  {
    id: 'llm-eval-practice',
    title: '跑了 500 组实验后，我总结的 LLM 评测方法论',
    excerpt: 'Context Faithfulness 的定义学术界都有争议。RAGAS 的每个指标在测什么、阈值怎么定、LLM-as-Judge 怎么避免偏袒——实战经验。',
    date: '2026-02-10',
    tags: ['评测', 'RAGAS', 'G-Eval', 'LLM-as-Judge'],
    readTime: '22 min',
  },
  {
    id: 'thinking-mode',
    title: '从"快思考"到"慢思考"：LLM 应用开发的思维转换',
    excerpt: 'LLM 应用的问题往往不是模型不够强，是设计模式没有充分利用模型的推理能力。本文探讨 CoT、ReAct、ToT 等推理模式的选择依据。',
    date: '2026-01-15',
    tags: ['CoT', 'ReAct', 'Agent', '架构设计'],
    readTime: '18 min',
  },
];

export const skills: Skill[] = [
  {
    category: '🧠 RAG 与检索',
    items: ['LangChain / LangGraph', '知识图谱 RAG', 'Hybrid Search (BM25+向量)', 'Cohere / BGE Rerank', 'HyDE 假设文档', '向量数据库（Milvus / Chroma / Neo4j）'],
  },
  {
    category: '🤖 Agent 与 MCP',
    items: ['MCP 协议集成', 'CrewAI 多 Agent', 'LangGraph 状态机', 'Tool Calling / Function Calling', 'Supervisor / Plan-and-Execute 模式'],
  },
  {
    category: '📊 评测与可观测性',
    items: ['DeepEval / RAGAS', 'G-Eval / LLM-as-Judge', 'LangSmith', 'Prometheus + Grafana', 'GitHub Actions CI/CD'],
  },
  {
    category: '🔧 模型训练与部署',
    items: ['LLaMA-Factory', 'LoRA / QLoRA / SLoRA', 'vLLM / TGI', 'PagedAttention', 'Continuous Batching', 'Tensor Parallelism'],
  },
  {
    category: '🛠 工程基础设施',
    items: ['FastAPI + Docker', 'Redis / PostgreSQL', '异步处理（asyncio）', 'Pydantic 数据校验', 'Git 工作流'],
  },
];

export const timeline = [
  { period: '2024.Q1', event: '从零搭 RAG 系统，发现纯向量检索的局限性' },
  { period: '2024.Q2', event: '引入知识图谱，KG-RAG 完整率提升 35%' },
  { period: '2024.Q3', event: 'CrewAI 多 Agent 上线，接入 MCP 协议' },
  { period: '2024.Q4', event: 'RAGAS 评测体系落地，召回率 91%，延迟 180ms' },
  { period: '2025.Q1', event: 'vLLM 部署，QPS 从 20 提升到 120' },
  { period: '2025.Q2', event: 'GitHub Actions 评测流水线，PR 自动回归' },
];
