import type { Demo, BlogPost, Skill } from '../types';

export const demos: Demo[] = [
  {
    id: 'rag-chatbot',
    title: '知识库问答系统（RAG）',
    titleEn: 'Production RAG Pipeline',
    description: '把 LLM 和私有知识库连起来。用了 HyDE 假设文档召回 + Cohere 重排 + LLMLingua 上下文压缩，召回率从 62% 做到 91%，P95 延迟 180ms。',
    tags: ['LangChain', 'Milvus', 'BGE Embedding', 'Cohere Rerank', 'FastAPI'],
    status: 'live',
    code: `# 双路召回：语义 + 关键词
q_emb = embedding_model.encode(query)
h_emb = embedding_model.encode(llm.generate(f"假设答案：{query}"))
hybrid_results = vector_db.search([q_emb, h_emb], top_k=10)

# Cohere 重排（提升 15-20% Recall@5）
ranked = cohere.rerank(query=query, documents=hybrid_results, top_n=3)

# LLMLingua 上下文压缩（去掉 60%+ 冗余 token）
compressed = llmlingua.compress_prompt(context, query)
final_answer = llm.invoke(compressed)`
  },
  {
    id: 'agent-workflow',
    title: '多 Agent 协作平台',
    titleEn: 'Multi-Agent Orchestration',
    description: 'LangGraph 状态机 + Supervisor 模式，让三个 Agent（规划/执行/审核）各司其职。接入了 MCP 协议，能调用外部 API。跑在生产环境里处理真实用户请求。',
    tags: ['LangGraph', 'MCP', 'Tool-Calling', 'Memory', 'FastAPI'],
    status: 'live',
    code: `# Supervisor 根据意图分发任务
def supervisor(state: AgentState) -> str:
    intent = classify(state["messages"][-1].content)
    if "search" in intent: return "researcher"
    if "code" in intent: return "engineer"
    return "reviewer"

# 条件边：根据 supervisor 返回值路由
graph.add_conditional_edges("supervisor", lambda x: x["next"], {
    "researcher": "researcher",
    "engineer": "engineer",
    "reviewer": "reviewer",
})`
  },
  {
    id: 'eval-pipeline',
    title: 'LLM 评测流水线',
    titleEn: 'LLM Evaluation Pipeline',
    description: '没有评测就没有闭环。用 DeepEval + RAGAS 做了四维指标（Precision/Recall/Faithfulness/Relevance），接进 GitHub Actions，每次 PR 自动跑回归，不达标不允许合并。',
    tags: ['DeepEval', 'RAGAS', 'G-Eval', 'LLM-as-Judge', 'GitHub Actions'],
    status: 'live',
  },
  {
    id: 'structured-extraction',
    title: '结构化数据抽取',
    titleEn: 'Reliable JSON Extraction',
    description: 'PDF / HTML / 图片 → Pydantic 模型。用 JSON Mode + output parsing 保证格式可靠，配合 asyncio 批量处理，日处理 5 万条。',
    tags: ['Pydantic', 'JSON Mode', 'PDF解析', 'asyncio', 'FastAPI'],
    status: 'live',
  },
  {
    id: 'vllm-optimization',
    title: 'vLLM 推理优化',
    titleEn: 'vLLM Production Optimization',
    description: 'PagedAttention + Continuous Batching + Tensor Parallelism，把 7B 模型的 QPS 从 20 提到 120，P95 延迟从 800ms 压到 120ms。支持 SLoRA 多租户复用。',
    tags: ['vLLM', 'PagedAttention', 'Continuous Batching', 'Tensor Parallelism', 'SLoRA'],
    status: 'live',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'rag-recall',
    title: 'RAG 召回率从 62% 到 91%：我踩过的 20 个坑',
    excerpt: '不是调 prompt，是调整个检索系统。Embedding 选错、Chunk 不合理、Query 和 Doc 表述不一致、Cohere Rerank 能补多少、Citations 如何做……完整踩坑路径。',
    date: '2026-03-10',
    tags: ['RAG', 'Embedding', '召回优化', 'Cohere'],
    readTime: '22 min',
  },
  {
    id: 'llm-eval',
    title: 'LLM 评测为什么比训练还难',
    excerpt: 'Context Faithfulness 的定义学术界都有争议。RAGAS 四个指标分别测什么、什么阈值算合格、LLM-as-Judge 怎么避免偏袒自己——实战经验总结。',
    date: '2026-02-18',
    tags: ['评测', 'RAGAS', 'G-Eval', 'LLM-as-Judge'],
    readTime: '18 min',
  },
  {
    id: 'agent-patterns',
    title: '从 ReAct 到 LangGraph：多 Agent 架构演进复盘',
    excerpt: '每种架构都有它的适用场景。ReAct 最轻量、Plan-and-Execute 适合长任务、Supervisor 适合需要全局控制的生产系统——选型依据是什么。',
    date: '2026-01-28',
    tags: ['Agent', 'LangGraph', '架构设计', 'MCP'],
    readTime: '25 min',
  },
  {
    id: 'zero-to-llm',
    title: '传统工程师转 LLM 开发：思维模式的三种转变',
    excerpt: '确定性→概率性、单元测试→分布测试、本地运行→延迟与成本。不转变思维，学再多框架也是皮毛。',
    date: '2025-12-15',
    tags: ['方法论', '工程思维', 'LLM应用'],
    readTime: '12 min',
  },
];

export const skills: Skill[] = [
  {
    category: '🧠 LLM 应用',
    items: ['LangChain / LangGraph', 'RAG 系统设计（召回>91%）', 'MCP 协议工具集成', '向量数据库（Milvus / Chroma）', 'Cohere / BGE Embedding'],
  },
  {
    category: '🔧 模型训练',
    items: ['LLaMA-Factory', 'LoRA / QLoRA / SLoRA', 'DeepSpeed ZeRO-3', 'MLflow 实验追踪', '分布式多卡训练'],
  },
  {
    category: '⚡ 推理与部署',
    items: ['vLLM / TGI 生产部署', 'Flash Attention / PagedAttention', 'Continuous Batching', 'INT8 / FP8 量化', 'Tensor Parallelism'],
  },
  {
    category: '📊 评测与可观测性',
    items: ['DeepEval / RAGAS', 'G-Eval / LLM-as-Judge', 'LangSmith', 'Prometheus + Grafana', 'GitHub Actions CI/CD'],
  },
  {
    category: '🛠 工程',
    items: ['FastAPI + Docker', 'Redis / PostgreSQL', 'Cloudflare AI Gateway', 'Kubernetes 基础', 'Git 工作流'],
  },
];

export const timeline = [
  { period: '2024.Q1', event: '搭建首个 RAG 系统，开始系统性学习 LLM' },
  { period: '2024.Q2', event: '上线多 Agent 平台，处理真实用户请求' },
  { period: '2024.Q3', event: '完成 Qwen-7B 微调，PPL 下降 23%' },
  { period: '2024.Q4', event: 'RAG 召回率做到 91%，延迟 180ms' },
  { period: '2025.Q1', event: 'vLLM 部署，QPS 从 20 提升到 120' },
  { period: '2025.Q2', event: '集成 MCP 协议，支持外部工具调用' },
];
