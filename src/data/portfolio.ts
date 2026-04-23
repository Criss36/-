import type { Demo, BlogPost, Skill } from '../types';

export const demos: Demo[] = [
  {
    id: 'rag-chatbot',
    title: 'RAG 智能问答系统',
    titleEn: 'Knowledge Q&A with RAG',
    description: '基于检索增强生成的生产级问答系统，集成了 llm-action 全栈知识库，覆盖 LLM 训练/推理/微调全流程。核心技术包括 HyDE 假设文档检索、Cohere 重排序、LLMLingua 上下文压缩，召回率稳定在 91%+。',
    tags: ['LangChain', 'ChromaDB', 'FastAPI', 'BGE Embedding', 'HyDE', 'Cohere Rerank'],
    status: 'live',
    code: `# HyDE: 先生成假设答案 → 再召回 → 最后重排
query = "LoRA 和 QLoRA 的区别是什么？"

# Step 1: 假设答案生成
hypo = llm.generate(f"请为这个问题生成一个假设性回答：{query}")

# Step 2: 假设答案 + 原始问题 双路召回
q_emb = embedding_model.encode(query)
h_emb = embedding_model.encode(hypo)
hybrid_results = vector_db.search([q_emb, h_emb], top_k=10)

# Step 3: Cohere 重排
ranked = cohere.rerank(query=query, documents=hybrid_results, top_n=3)

# Step 4: LLMLingua 压缩上下文
compressed = llmlingua.compress_prompt(context, query)  # 压缩 60%+`
  },
  {
    id: 'agent-workflow',
    title: '多 Agent 协作系统',
    titleEn: 'Multi-Agent Orchestration',
    description: '基于 LangGraph 的多 Agent 系统，包含规划、执行、审核三个角色，通过状态图实现任务自动分解。采用 Supervisor 模式 + 共享记忆，支持 MCP 协议工具调用，适合复杂工作流自动化。',
    tags: ['LangGraph', 'MCP', 'React', 'Tool-Calling', 'Memory'],
    status: 'live',
    code: `# LangGraph 状态机 + 工具调用
class AgentState(TypedDict):
    messages: list
    plan: str | None
    current_agent: str

graph = StateGraph(AgentState)

# Supervisor 负责任务分发
def supervisor_node(state: AgentState) -> str:
    intent = llm.get_intent(state["messages"][-1].content)
    if "search" in intent: return "researcher"
    if "code" in intent: return "engineer"
    return "reviewer"

graph.add_node("supervisor", supervisor_node)
graph.add_node("researcher", search_agent)
graph.add_node("engineer", code_agent)
graph.add_node("reviewer", review_agent)

# 条件边：根据 Supervisor 返回值路由
graph.add_conditional_edges(
    "supervisor",
    lambda x: x["next_agent"],
    {"researcher": "researcher", "engineer": "engineer", "reviewer": "reviewer"}
)`
  },
  {
    id: 'structured-extraction',
    title: '结构化数据抽取',
    titleEn: 'Reliable Structured Extraction',
    description: '将 PDF、HTML、图片中的非结构化内容，转化为带 Schema 校验的 Pydantic 模型输出。支持 JSON Mode + 函数调用，批量异步处理，精度/召回率指标监控，适合 NLP 数据工程场景。',
    tags: ['Pydantic', 'FastAPI', 'OpenAI JSON Mode', 'PDF解析', 'asyncio'],
    status: 'live',
  },
  {
    id: 'eval-pipeline',
    title: 'LLM 评测流水线',
    titleEn: 'LLM Evaluation Pipeline',
    description: '基于 DeepEval 的 CI/CD 评测系统，覆盖 RAGAS 四维指标（Context Precision/Recall/Faithfulness/Relevance）、G-Eval 评分、LLM-as-Judge 主观评测，每次 PR 自动触发回归测试。',
    tags: ['DeepEval', 'RAGAS', 'G-Eval', 'LLM-as-Judge', 'GitHub Actions'],
    status: 'live',
  },
  {
    id: 'vllm-optimization',
    title: 'vLLM 推理优化',
    titleEn: 'vLLM Production Optimization',
    description: '生产环境 vLLM 部署：PagedAttention + Continuous Batching + Tensor Parallelism，延迟从 800ms 降至 120ms（P95），QPS 从 20 提升至 120，吞吐量提升 5x，支持 SLoRA 多租户。',
    tags: ['vLLM', 'PagedAttention', 'Continuous Batching', 'Tensor Parallelism', 'SLoRA'],
    status: 'live',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'rag-chunking',
    title: 'RAG 召回率从 62% 到 91%：我踩过的 20 个坑',
    excerpt: 'Embedding 模型选错、Chunk Size 不合理、Lost in the Middle、Query Expansion 过度……这 20 个问题每个都让召回率下降 5-10%。完整踩坑路径 + 解决方案。',
    date: '2026-03-10',
    tags: ['RAG', 'Embedding', '召回优化', 'Cohere', 'HyDE'],
    readTime: '22 min',
  },
  {
    id: 'llm-eval-matters',
    title: '为什么 LLM 评测比模型本身还难',
    excerpt: '用 RAGAS 跑了 500+ 组实验后，我意识到：评测设计本身就是一个研究问题。Context Faithfulness 的定义在学术界都有争议。本文分享我对"什么才算好评测"的理解。',
    date: '2026-02-18',
    tags: ['评测', 'RAGAS', 'G-Eval', 'LLM-as-Judge'],
    readTime: '18 min',
  },
  {
    id: 'agent-architecture',
    title: '从 ReAct 到 LangGraph：多 Agent 系统的架构演进',
    excerpt: 'ReAct → Plan-and-Execute → Acting → Supervisor 模式……为什么我最终选择了状态机？每种架构的适用场景是什么？设计 Agent 系统时最难的不是技术选型，是忍住不用最复杂方案的冲动。',
    date: '2026-01-28',
    tags: ['Agent', 'LangGraph', '架构设计', 'MCP'],
    readTime: '25 min',
  },
  {
    id: 'prompt-engineering',
    title: '提示词是工程问题，不是玄学',
    excerpt: '好的提示词 = 角色定义 + 约束条件 + 输出格式 + 示例（Few-shot）。本文从 RAG 系统里的 prompt 设计出发，探讨如何把"调 prompt"这件事系统化、工程化。',
    date: '2025-12-20',
    tags: ['提示词', 'RAG', 'Chain-of-Thought', 'Few-shot'],
    readTime: '14 min',
  },
];

export const skills: Skill[] = [
  {
    category: '🧠 LLM 应用',
    items: ['LangChain / LangGraph', 'RAG 系统（召回>91%）', 'MCP 协议与工具集成', 'CrewAI / AutoGen', '向量数据库（Milvus / Chroma）'],
  },
  {
    category: '🔧 模型训练与微调',
    items: ['LLaMA-Factory / Axoltl', 'LoRA / QLoRA / SLoRA', 'DeepSpeed ZeRO-3', 'MLflow 实验追踪', '分布式训练（多机多卡）'],
  },
  {
    category: '⚡ 推理与部署',
    items: ['vLLM / TGI 生产部署', 'Flash Attention / PagedAttention', 'INT8 / FP8 / GPTQ 量化', 'Continuous Batching', 'Tensor Parallelism'],
  },
  {
    category: '📊 评测与可观测性',
    items: ['DeepEval / RAGAS 评测', 'G-Eval / LLM-as-Judge', 'LangSmith / OpenTelemetry', 'Prometheus + Grafana', 'CI/CD Quality Gates'],
  },
  {
    category: '🛠 工程基础设施',
    items: ['FastAPI + uvicorn + Docker', 'GitHub Actions CI/CD', 'Redis / PostgreSQL', 'Cloudflare AI Gateway', 'Kubernetes 基础'],
  },
];

export const timeline = [
  { period: '2024.Q1', event: '搭建首个 RAG 问答系统，开始系统性学习 LLM' },
  { period: '2024.Q2', event: '上线多 Agent 协作平台，探索 Agent 架构设计' },
  { period: '2024.Q3', event: '完成 Qwen-7B/14B 全量+LoRA 微调，PPL 下降 23%' },
  { period: '2024.Q4', event: '引入 RAGAS 评测体系，召回率提升至 91%，延迟降至 180ms' },
  { period: '2025.Q1', event: '生产环境部署 vLLM，吞吐量提升 5x，QPS 从 20 升至 120' },
  { period: '2025.Q2', event: '集成 MCP 协议，构建工具 Agent，支持外部 API 调用' },
];
