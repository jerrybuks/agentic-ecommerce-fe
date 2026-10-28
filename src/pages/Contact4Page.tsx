import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import './Contact4Page.css';

type Source = {
  label: string;
  href: string;
};

type Slide = {
  kicker: string;
  title: string;
  subtitle?: string;
  content: ReactNode;
  sources?: Source[];
};

const backendRoot = 'https://github.com/jerrybuks/agentic-ecommerce/blob/codex/golden-cases-mcp';

const sources = {
  loader: `${backendRoot}/src/golden_loader.py`,
  server: `${backendRoot}/src/golden_cases_mcp.py`,
  tests: `${backendRoot}/tests/test_golden_cases_mcp.py`,
  fixture: `${backendRoot}/data/golden_data/test_cases.json`,
  inspector: 'https://github.com/modelcontextprotocol/docs/blob/main/docs/tools/inspector.mdx',
  inspectorConfig: 'https://github.com/modelcontextprotocol/inspector/blob/main/docs/mcp-server-configuration.md',
  chatgpt: 'https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt',
  openaiMcp: 'https://developers.openai.com/api/docs/guides/tools-connectors-mcp',
  desktop: 'https://developers.openai.com/plugins/deploy/desktop-only',
  slack: 'https://slack.com/help/articles/48855576908307-Guide-to-Model-Context-Protocol-in-Slack',
  slackConnector: 'https://slack.com/marketplace/A0BSMEG31ML-chatgpt-connector-local-mcp',
  caching: 'https://developers.openai.com/api/docs/guides/prompt-caching',
  deployment: 'https://developers.openai.com/api/docs/guides/deployment-checklist',
  codex: 'https://developers.openai.com/learn/codex',
  codexCaching: 'https://developers.openai.com/cookbook/examples/prompt_caching_201',
};

function CodeBlock({ children }: { children: string }) {
  return <pre className="contact4-code"><code>{children}</code></pre>;
}

function SourceRow({ items }: { items: Source[] }) {
  return (
    <div className="contact4-sources">
      <span>Sources</span>
      {items.map((source) => (
        <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
          {source.label}
        </a>
      ))}
    </div>
  );
}

function Flow({ steps }: { steps: string[] }) {
  return (
    <div className="contact4-flow" aria-label="Request flow">
      {steps.map((step, index) => (
        <div className="contact4-flow-item" key={step}>
          <span>{step}</span>
          {index < steps.length - 1 && <b aria-hidden="true">→</b>}
        </div>
      ))}
    </div>
  );
}

const slides: Slide[] = [
  {
    kicker: 'CONTACT 04 · MCP + OPENAI',
    title: 'From a local tool to a usable client connection',
    subtitle: 'A practical walkthrough of Shoplytic’s read-only MCP server, Inspector, stdio boundaries, Slack, and prompt caching.',
    content: (
      <div className="contact4-title-grid">
        <div className="contact4-title-mark">MCP</div>
        <div>
          <p className="contact4-lead">One small tool. Four important deployment lessons.</p>
          <div className="contact4-chip-row">
            <span className="contact4-chip">read-only</span>
            <span className="contact4-chip">stdio</span>
            <span className="contact4-chip">Inspector</span>
            <span className="contact4-chip">prompt cache</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    kicker: '01 · WHAT WE BUILT',
    title: 'A deliberately narrow MCP server',
    subtitle: 'The implementation stays beside the backend but does not import the ecommerce application.',
    content: (
      <>
        <Flow steps={['MCP client', 'golden_cases_mcp.py', 'golden_loader.py', 'test_cases.json']} />
        <div className="contact4-card-grid contact4-card-grid-3">
          <article className="contact4-card accent-cyan">
            <span className="contact4-card-label">Tool</span>
            <h3>list_golden_cases</h3>
            <p>Optional exact category filter. No path argument.</p>
          </article>
          <article className="contact4-card accent-lime">
            <span className="contact4-card-label">Data</span>
            <h3>Fixed fixture</h3>
            <p>Reads the six-field JSON fixture in source order.</p>
          </article>
          <article className="contact4-card accent-amber">
            <span className="contact4-card-label">Boundary</span>
            <h3>No side effects</h3>
            <p>No Shoplytic imports, database calls, model calls, or writes.</p>
          </article>
        </div>
        <p className="contact4-evidence">
          Evidence: <a href={sources.loader}>golden_loader.py</a> · <a href={sources.server}>golden_cases_mcp.py</a>
        </p>
      </>
    ),
    sources: [
      { label: 'loader', href: sources.loader },
      { label: 'server', href: sources.server },
    ],
  },
  {
    kicker: '02 · THE CONTRACT',
    title: 'Predictable input, predictable output',
    subtitle: 'The tool is easy to test because its contract is intentionally boring.',
    content: (
      <div className="contact4-contract-layout">
        <div>
          <p className="contact4-card-label">Signature</p>
          <CodeBlock>{'list_golden_cases(category: string | null = null)\n→ array of six-field objects'}</CodeBlock>
          <div className="contact4-callout">
            <strong>Unknown categories return []</strong>
            <span>Filtering is exact and case-sensitive.</span>
          </div>
        </div>
        <div className="contact4-table-wrap">
          <table className="contact4-table">
            <thead><tr><th>Input</th><th>Result</th></tr></thead>
            <tbody>
              <tr><td>omitted / null</td><td>15 cases, source order</td></tr>
              <tr><td>product_search</td><td>matching cases only</td></tr>
              <tr><td>PRODUCT_SEARCH</td><td>empty list</td></tr>
              <tr><td>does_not_exist</td><td>empty list</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    sources: [
      { label: 'fixture', href: sources.fixture },
      { label: 'tests', href: sources.tests },
    ],
  },
  {
    kicker: '03 · INSPECTOR DEMO',
    title: 'See the protocol before trusting the tool',
    subtitle: 'Inspector makes the server’s capabilities and calls visible without starting Shoplytic itself.',
    content: (
      <div className="contact4-inspector-layout">
        <CodeBlock>{'cd agentic-ecommerce\nPYTHONPATH="$PWD/src" uv run mcp dev src/golden_cases_mcp.py'}</CodeBlock>
        <div className="contact4-checklist">
          <div><span>01</span><p>Open the URL printed by Inspector.</p></div>
          <div><span>02</span><p>Confirm the transport is <b>stdio</b>.</p></div>
          <div><span>03</span><p>List tools and inspect the schema.</p></div>
          <div><span>04</span><p>Call with no category, then with <code>product_search</code>.</p></div>
          <div><span>05</span><p>Use <code>PRODUCT_SEARCH</code> to prove exact filtering.</p></div>
        </div>
      </div>
    ),
    sources: [
      { label: 'Inspector guide', href: sources.inspector },
      { label: 'configuration', href: sources.inspectorConfig },
    ],
  },
  {
    kicker: '04 · TRANSPORT',
    title: 'stdio is a local process pipe',
    subtitle: 'That is a strength for development—and the reason ChatGPT web cannot call this server directly.',
    content: (
      <>
        <Flow steps={['host launches process', 'stdin / stdout', 'MCP server', 'fixture read']} />
        <div className="contact4-card-grid contact4-card-grid-2">
          <article className="contact4-card accent-lime">
            <span className="contact4-card-label">Good fit</span>
            <ul className="contact4-list">
              <li>Codex CLI/IDE and other local stdio clients</li>
              <li>Inspector, tests, and local demos</li>
              <li>No public endpoint or shared service to operate</li>
            </ul>
          </article>
          <article className="contact4-card accent-red">
            <span className="contact4-card-label">Not provided</span>
            <ul className="contact4-list">
              <li>No public HTTPS MCP URL</li>
              <li>No direct ChatGPT web connection</li>
              <li>No multi-user network process</li>
            </ul>
          </article>
        </div>
      </>
    ),
    sources: [
      { label: 'Inspector config', href: sources.inspectorConfig },
      { label: 'OpenAI MCP guide', href: sources.openaiMcp },
    ],
  },
  {
    kicker: '05 · CHATGPT OPTIONS',
    title: 'Four paths from local to client-ready',
    subtitle: 'Choose the boundary that matches the trust, hosting, and audience requirements.',
    content: (
      <div className="contact4-option-grid">
        <article className="contact4-option current"><b>01</b><h3>Keep stdio</h3><p>Best for Codex, local clients, tests, and Inspector.</p><span>current</span></article>
        <article className="contact4-option"><b>02</b><h3>Secure MCP Tunnel</h3><p>Keep the local process; make it reachable to supported OpenAI products.</p><span>private</span></article>
        <article className="contact4-option"><b>03</b><h3>Streamable HTTP</h3><p>Deploy an HTTPS MCP endpoint for ChatGPT web and API clients.</p><span>network</span></article>
        <article className="contact4-option"><b>04</b><h3>Desktop-only plugin</h3><p>Package local stdio for the approved desktop-plugin path.</p><span>approval</span></article>
      </div>
    ),
    sources: [
      { label: 'ChatGPT custom MCP', href: sources.chatgpt },
      { label: 'Secure MCP Tunnel', href: sources.openaiMcp },
      { label: 'desktop-only plugins', href: sources.desktop },
    ],
  },
  {
    kicker: '06 · PARTNER SERVER',
    title: 'Slack is the easiest prominent demo',
    subtitle: 'Use the first-party ChatGPT Connector to contrast a hosted, permissioned MCP integration with our local fixture server.',
    content: (
      <div className="contact4-slack-layout">
        <div className="contact4-slack-badge"><span>slack</span><b>+ ChatGPT</b></div>
        <ol className="contact4-steps">
          <li><span>01</span><p>Open ChatGPT Apps/Plugins.</p></li>
          <li><span>02</span><p>Add <b>ChatGPT Connector (Local MCP)</b>.</p></li>
          <li><span>03</span><p>Connect the workspace and review scopes.</p></li>
          <li><span>04</span><p>Start read-only: search a channel or summarize a thread.</p></li>
          <li><span>05</span><p>Call out that Slack tools can also send or modify—review before acting.</p></li>
        </ol>
      </div>
    ),
    sources: [
      { label: 'Slack MCP guide', href: sources.slack },
      { label: 'Slack ChatGPT Connector', href: sources.slackConnector },
    ],
  },
  {
    kicker: '07 · PROMPT CACHING',
    title: 'Cache the stable prefix, not the changing question',
    subtitle: 'Caching reuses model work when the rendered prompt prefix matches.',
    content: (
      <div className="contact4-cache-layout">
        <div className="contact4-cache-strip">
          <span className="stable">instructions + tools + examples</span>
          <i>▼</i>
          <span className="dynamic">new user/task data</span>
        </div>
        <div className="contact4-card-grid contact4-card-grid-3">
          <article className="contact4-card accent-cyan"><span className="contact4-card-label">Keep stable</span><p>System/developer instructions, tool definitions, shared reference material.</p></article>
          <article className="contact4-card accent-lime"><span className="contact4-card-label">Append</span><p>New turns and tool results should extend history instead of rewriting it.</p></article>
          <article className="contact4-card accent-amber"><span className="contact4-card-label">Measure</span><p>Inspect cached tokens, cache-write tokens, latency, and total cost.</p></article>
        </div>
        <p className="contact4-note">A cache hit is not guaranteed. Model, tools, settings, prefix equality, and lifetime all matter.</p>
      </div>
    ),
    sources: [{ label: 'OpenAI Prompt Caching', href: sources.caching }],
  },
  {
    kicker: '08 · BREAKPOINTS',
    title: 'A breakpoint is a cache boundary',
    subtitle: 'It is not a debugger pause. It marks the exact end of content worth writing to the prompt cache.',
    content: (
      <div className="contact4-breakpoint-layout">
        <CodeBlock>{'{\n  "prompt_cache_options": { "mode": "explicit", "ttl": "30m" },\n  "content": [\n    { "type": "input_text", "text": "Stable instructions…",\n      "prompt_cache_breakpoint": { "mode": "explicit" } },\n    { "type": "input_text", "text": "Changing user request…" }\n  ]\n}'}</CodeBlock>
        <div className="contact4-breakpoint-notes">
          <div><b>Implicit</b><span>OpenAI chooses an eligible boundary.</span></div>
          <div><b>Explicit</b><span>You mark the reusable boundary.</span></div>
          <div><b>Suffix</b><span>Changing content can stay uncached.</span></div>
          <div><b>Check</b><span>Rules vary by model/API version.</span></div>
        </div>
      </div>
    ),
    sources: [{ label: 'Prompt caching guide', href: sources.caching }],
  },
  {
    kicker: '09 · CODEX',
    title: 'Codex benefits from the same discipline',
    subtitle: 'Codex is an application/workflow; the model’s prompt-cache rules still apply.',
    content: (
      <>
        <div className="contact4-codex-flow">
          <div className="contact4-codex-node">system + tools<br /><small>stable, ordered</small></div>
          <b>→</b>
          <div className="contact4-codex-node highlight">reusable prefix<br /><small>cache candidate</small></div>
          <b>→</b>
          <div className="contact4-codex-node">new task turn<br /><small>append, don’t rewrite</small></div>
        </div>
        <div className="contact4-card-grid contact4-card-grid-2">
          <article className="contact4-card accent-cyan"><span className="contact4-card-label">Codex practice</span><p>Keep instructions, tool definitions, sandbox configuration, and environment context identical and ordered.</p></article>
          <article className="contact4-card accent-lime"><span className="contact4-card-label">Proof</span><p>Use cached-token usage, latency, and cost to verify that the structure helped.</p></article>
        </div>
      </>
    ),
    sources: [
      { label: 'Codex training', href: sources.codex },
      { label: 'Codex caching lessons', href: sources.codexCaching },
    ],
  },
  {
    kicker: '10 · EXAM PREP',
    title: 'Deployment-practitioner study checklist',
    subtitle: 'These are practical study themes—not an official exam blueprint.',
    content: (
      <div className="contact4-exam-grid">
        <article className="contact4-exam-card"><span>Codex deployment</span><ul className="contact4-list"><li>Scope the task and define “done”.</li><li>Plan before editing; review the diff.</li><li>Know sandbox, approvals, credentials, and network boundaries.</li><li>Run proportionate tests and report evidence.</li><li>Keep tool connections least-privilege.</li></ul></article>
        <article className="contact4-exam-card"><span>API deployment</span><ul className="contact4-list"><li>Start with Responses API and representative evals.</li><li>Choose model/reasoning effort for the workload.</li><li>Instrument latency, tokens, cache, errors, and cost.</li><li>Handle overload, retries, safety identifiers, and approvals.</li><li>Use HTTP/tunnel MCP for remote clients.</li></ul></article>
      </div>
    ),
    sources: [
      { label: 'API deployment checklist', href: sources.deployment },
      { label: 'Codex training', href: sources.codex },
    ],
  },
  {
    kicker: '11 · CLOSE',
    title: 'The invariant: make the boundary explicit',
    subtitle: 'A good MCP demo ends with a safe next step, not just a successful tool call.',
    content: (
      <div className="contact4-close-grid">
        <div className="contact4-close-number">01</div><p>Know what the server can read and what it cannot change.</p>
        <div className="contact4-close-number">02</div><p>Choose stdio, tunnel, or HTTPS based on the client.</p>
        <div className="contact4-close-number">03</div><p>Inspect tools and permissions before using real data.</p>
        <div className="contact4-close-number">04</div><p>Keep stable context cacheable; measure the result.</p>
      </div>
    ),
    sources: [
      { label: 'ChatGPT MCP connections', href: sources.chatgpt },
      { label: 'Prompt caching', href: sources.caching },
    ],
  },
];

export default function Contact4Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSources, setShowSources] = useState(false);
  const slide = slides[currentSlide];

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, slides.length - 1)));
    setShowSources(false);
  }, []);

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const previousSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') {
        event.preventDefault();
        nextSlide();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        previousSlide();
      } else if (event.key === 'Home') {
        goToSlide(0);
      } else if (event.key === 'End') {
        goToSlide(slides.length - 1);
      } else if (event.key.toLowerCase() === 's') {
        setShowSources((visible) => !visible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToSlide, nextSlide, previousSlide]);

  return (
    <main className="contact4-page">
      <div className="contact4-grid-lines" aria-hidden="true" />
      <header className="contact4-topbar">
        <div className="contact4-brand"><span className="contact4-brand-dot" />SHOPLYTIC <em>/</em> CONTACT 04</div>
        <div className="contact4-topbar-actions">
          <span className="contact4-live"><i />LIVE DECK</span>
          <span className="contact4-slide-index">{String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
        </div>
      </header>

      <section className="contact4-stage" aria-live="polite">
        <div className="contact4-slide-key">{slide.kicker}</div>
        <h1>{slide.title}</h1>
        {slide.subtitle && <p className="contact4-subtitle">{slide.subtitle}</p>}
        <div className="contact4-content">{slide.content}</div>
        {showSources && slide.sources && <SourceRow items={slide.sources} />}
      </section>

      <footer className="contact4-controls">
        <button type="button" className="contact4-control-button" onClick={previousSlide} disabled={currentSlide === 0} aria-label="Previous slide">←</button>
        <div className="contact4-progress" aria-label={`Slide ${currentSlide + 1} of ${slides.length}`}>
          {slides.map((item, index) => (
            <button
              type="button"
              key={item.title}
              className={`contact4-progress-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}: ${item.title}`}
            />
          ))}
        </div>
        <button type="button" className="contact4-control-button" onClick={nextSlide} disabled={currentSlide === slides.length - 1} aria-label="Next slide">→</button>
        <button type="button" className="contact4-source-toggle" onClick={() => setShowSources((visible) => !visible)} aria-pressed={showSources}>
          {showSources ? 'Hide sources' : 'Sources'} <span>⌘ S</span>
        </button>
      </footer>

      <div className="contact4-key-hint">Arrow keys / space to move · Home / End to jump · S for sources</div>
    </main>
  );
}
