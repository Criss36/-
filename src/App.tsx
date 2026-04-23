import { useState, useEffect } from 'react';
import { demos, blogPosts, skills, timeline } from './data/portfolio';

// ── Shared Sub-components ───────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-gray-500 border border-white/[0.06]">
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-indigo-400 font-mono text-[11px] tracking-[0.2em] uppercase mb-4">
      {children}
    </p>
  );
}

// ── Background ──────────────────────────────────────────────────────
function BG() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#050510]" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
        <defs>
          <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-600/[0.07] rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/[0.05] rounded-full blur-[100px]" />
    </div>
  );
}

// ── Nav ─────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#050510]/95 backdrop-blur-2xl border-b border-white/[0.04]' : ''}`}>
      <div className="max-w-5xl mx-auto px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-500/20">C</div>
          <span className="font-medium text-sm text-white tracking-tight">LLM<span className="text-indigo-400"> 工具箱</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['demos', 'writing', 'stack', 'journey'].map(id => (
            <a key={id} href={`#${id}`} className="text-[13px] text-gray-500 hover:text-white transition-colors tracking-tight">
              {id === 'demos' ? '项目' : id === 'writing' ? '写作' : id === 'stack' ? '技术栈' : '时间线'}
            </a>
          ))}
        </div>
        <a href="https://github.com/Criss36" className="text-[13px] text-gray-500 hover:text-white transition-colors">
          GitHub →
        </a>
      </div>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-14 px-8">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/[0.08] border border-indigo-500/[0.15] text-indigo-300/80 text-[11px] font-mono mb-10 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          open to interesting problems
        </div>

        <h1 className="text-6xl lg:text-8xl font-bold text-white tracking-tight leading-[1.05] mb-8">
          LLM<br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 text-transparent bg-clip-text">工具箱</span>
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed mb-3 max-w-xl mx-auto">
          做 LLM 应用开发的工程笔记。不追新，只追能跑在生产环境里的东西。
        </p>
        <p className="text-gray-600 text-sm font-mono mb-12">
          基于 liguodongiot/llm-action 知识库 · 持续更新
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#demos" className="px-7 py-3.5 bg-white text-[#050510] hover:bg-gray-100 rounded-xl font-medium text-sm transition-colors shadow-lg shadow-white/10">
            看项目 →
          </a>
          <a href="https://github.com/Criss36" className="px-7 py-3.5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl text-sm transition-colors">
            github.com/Criss36
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Problems I Solve ─────────────────────────────────────────────────
function Problems() {
  const problems = [
    { icon: '◈', title: 'LLM 不知道业务上下文', desc: '私有知识、文档、内部数据 LLM 看不到。RAG 是解法，但召回率从 60% 到 90% 中间有 20 个坑。' },
    { icon: '◈', title: 'Agent 跑起来就不受控', desc: 'ReAct 简单有效，但多步任务里错误会累积放大。Supervisor 模式 + 清晰边界是收敛关键。' },
    { icon: '◈', title: '模型跑通了但不知道质量', desc: '"看起来对"不等于"对"。G-Eval、RAGAS、LLM-as-Judge 才能把质量可量化、可复现。' },
    { icon: '◈', title: '推理成本失控', desc: '800ms 延迟、20 QPS 是常见开局。vLLM + Continuous Batching + PagedAttention 可以砍掉 5x 成本。' },
  ];
  return (
    <section className="relative z-10 py-24 px-8 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <SectionLabel>// 解决了什么问题</SectionLabel>
        <h2 className="text-3xl font-bold text-white mb-12 tracking-tight">真实生产环境里的四个坑</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {problems.map(p => (
            <div key={p.title} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/20 transition-colors group">
              <div className="text-indigo-400/50 text-lg mb-3 font-mono group-hover:text-indigo-400 transition-colors">{p.icon}</div>
              <h3 className="text-white font-medium text-sm mb-2">{p.title}</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Demos ────────────────────────────────────────────────────────────
function Demos() {
  const statusMap: Record<string, string> = {
    live: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    coming: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    concept: 'bg-white/5 text-gray-500 border border-white/10',
  };
  const icons: Record<string, string> = {
    'rag-chatbot': '◈', 'agent-workflow': '◈', 'structured-extraction': '◈',
    'eval-pipeline': '◈', 'vllm-optimization': '◈',
  };

  return (
    <section id="demos" className="relative z-10 py-24 px-8 bg-white/[0.01] border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <SectionLabel>// 01. 项目</SectionLabel>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">每个都跑在生产环境里</h2>
        <p className="text-gray-500 text-sm mb-12 max-w-lg">有代码、有指标、有踩坑记录。不是 Demo，是可以上线的系统。</p>

        <div className="space-y-4">
          {demos.map(demo => (
            <div key={demo.id} className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/25 transition-all duration-300">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400/60 font-mono text-lg">{icons[demo.id] ?? '◈'}</span>
                  <div>
                    <h3 className="text-white font-medium text-sm">{demo.title}</h3>
                    <p className="text-indigo-400/60 text-[11px] font-mono mt-0.5">{demo.titleEn}</p>
                  </div>
                </div>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full shrink-0 ${statusMap[demo.status]}`}>
                  {demo.status === 'live' ? '● Live' : demo.status === 'coming' ? '⚡ Soon' : '💡 Concept'}
                </span>
              </div>

              <p className="text-gray-400 text-[13px] leading-relaxed mb-4">{demo.description}</p>

              {demo.code && (
                <pre className="bg-black/50 rounded-xl p-4 text-[12px] text-emerald-400/70 font-mono overflow-x-auto mb-4 border border-white/[0.04] leading-relaxed">
                  <code>{demo.code}</code>
                </pre>
              )}

              <div className="flex flex-wrap gap-2">
                {demo.tags.map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Writing ──────────────────────────────────────────────────────────
function Writing() {
  return (
    <section id="writing" className="relative z-10 py-24 px-8 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <SectionLabel>// 02. 写作</SectionLabel>
        <h2 className="text-3xl font-bold text-white mb-12 tracking-tight">不写正确的废话，只写真实踩的坑</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {blogPosts.map((post, i) => (
            <article key={post.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/25 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4 text-[11px] text-gray-600">
                <span className="font-mono">{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
                <span className="ml-auto text-indigo-400/40 font-mono">0{i+1}</span>
              </div>
              <h3 className="text-white font-medium text-sm mb-3 leading-snug group-hover:text-indigo-300 transition-colors">{post.title}</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed mb-5 line-clamp-2">{post.excerpt}</p>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Stack ────────────────────────────────────────────────────────────
function Stack() {
  return (
    <section className="relative z-10 py-24 px-8 bg-white/[0.01] border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <SectionLabel>// 03. 技术栈</SectionLabel>
        <h2 className="text-3xl font-bold text-white mb-12 tracking-tight">用过、踩过、在生产环境里跑过</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(skill => (
            <div key={skill.category} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="text-[11px] font-semibold text-indigo-400/80 mb-4 tracking-wider uppercase">{skill.category}</h3>
              <ul className="space-y-2">
                {skill.items.map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px] text-gray-400">
                    <span className="w-1 h-1 rounded-full bg-indigo-500/60 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Timeline ───────────────────────────────────────────────────────
function Timeline() {
  return (
    <section id="journey" className="relative z-10 py-24 px-8 border-t border-white/[0.04]">
      <div className="max-w-2xl mx-auto">
        <SectionLabel>// 04. 时间线</SectionLabel>
        <h2 className="text-3xl font-bold text-white mb-12 tracking-tight">从 Demo 到生产系统</h2>
        <div className="relative">
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-transparent" />
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <div key={i} className="relative pl-12">
                <div className="absolute left-[10px] top-2 w-2.5 h-2.5 rounded-full border-2 border-indigo-500 bg-[#050510] shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/20 transition-colors">
                  <span className="text-[11px] font-mono text-indigo-400/70">{item.period}</span>
                  <p className="text-white text-[13px] mt-1 leading-snug">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.04] py-10 px-8">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-gray-700 text-[12px]">Built with OpenClaw · 基于 liguodongiot/llm-action · {new Date().getFullYear()}</p>
          <p className="text-gray-800 text-[12px] mt-1">
            站点源码：<a href="https://github.com/Criss36/llm-career-portfolio" className="text-indigo-500/60 hover:text-indigo-400 transition-colors">Criss36/llm-career-portfolio</a>
          </p>
        </div>
        <div className="flex items-center gap-6 text-[12px] text-gray-700">
          <a href="https://github.com/Criss36" className="hover:text-white transition-colors">GitHub</a>
          <a href="https://yqfoj2c4hbou.space.minimaxi.com" className="hover:text-white transition-colors">旧版</a>
        </div>
      </div>
    </footer>
  );
}

// ── App ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans antialiased">
      <BG />
      <Nav />
      <Hero />
      <Problems />
      <Demos />
      <Writing />
      <Stack />
      <Timeline />
      <Footer />
    </div>
  );
}
