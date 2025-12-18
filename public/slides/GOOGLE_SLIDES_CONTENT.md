# Google Slides Content - Agentic Ecommerce Platform

## Instructions:
Copy each slide section below into a new slide in Google Slides. Use the suggested layouts and formatting.

---

## SLIDE 1: Title Slide

### Layout: Title Only

**Title (48pt, Bold):**
```
Agentic Ecommerce Platform
```

**Subtitle (32pt, Regular):**
```
Multi-Agent AI System for Intelligent Shopping
```

**Visual Element (Center, Large):**
```
🤖 🛒 🎯 📊
```

**Bottom Text (18pt):**
```
AI-Powered Shopping Assistant | Intelligent Routing | Semantic Search | Full Observability
```

---

## SLIDE 2: System Architecture

### Layout: Title and Content (with diagram)

**Title (36pt, Bold):**
```
System Architecture
```

**Left Side - Flow Diagram (Visual):**
```
👤 User Query
    ↓
🌐 FastAPI API
    ↓
🛡️ Token Validation (300 tokens)
    ↓
📦 Query Service
    ↓
🎯 Orchestrator Agent (LLM Router)
    ↓
    ├─→ 📚 General Info Agent → 📖 Handbook Vector Store
    ├─→ 🛒 Order Agent → 🛍️ Products Vector Store
    └─→ 💬 Direct Response (Greetings)
    ↓
✨ Synthesize Response
    ↓
👤 Return to User
```

**Right Side - Key Components (Bullet Points, 20pt):**
```
🎯 Orchestrator Agent
   • LLM-based router (GPT-4o-mini)
   • Intelligent query routing

📚 General Info Agent
   • Company policies & FAQs
   • Handbook semantic search

🛒 Order Agent
   • Product search & filtering
   • Cart & checkout operations
   • 10 specialized tools

📊 Vector Stores
   • ChromaDB for semantic search
   • Products & Handbook collections
```

**Bottom - Routing Modes (Small Text, 14pt):**
```
Routing Modes: Single | Sequential | Parallel | Direct
```

---

## SLIDE 3: Key Technical Decisions

### Layout: Two Content

**Title (36pt, Bold):**
```
Key Technical Decisions
```

**Left Column - Embeddings & Search (24pt Headers, 18pt Body):**
```
🔍 Semantic Search Strategy

✅ OpenAI Embeddings
   • text-embedding-ada-002
   • Cost: ~$0.0001/1K tokens
   • Fast API, no GPU needed
   • Outperforms local models

✅ Selective Indexing
   • Only searchable properties
   • Excludes stock_quantity
   • Fetched from DB after search
```

**Right Column - Architecture (24pt Headers, 18pt Body):**
```
🏗️ System Architecture

✅ Multi-Agent Design
   • Specialized agents per domain
   • LLM-based intelligent routing
   • Parallel execution support

✅ Non-Blocking I/O
   • All DB ops in thread pool
   • Vector search async
   • Event loop never blocked
```

**Bottom Section (Full Width, 18pt):**
```
🎯 Natural Language Understanding
   • Extracts filters from queries
   • "below $100" → max_price filter
   • Smart category mapping (watches → Electronics)
```

---

## SLIDE 4: Agent Capabilities

### Layout: Two Content

**Title (36pt, Bold):**
```
Agent Capabilities & Tools
```

**Left Side - General Info Agent (Card Style, 20pt):**
```
┌─────────────────────────────┐
│ 📚 General Info Agent       │
├─────────────────────────────┤
│ Purpose:                     │
│ Company policies, FAQs,     │
│ shipping information         │
│                              │
│ Tools:                       │
│ • retrieve_handbook_info     │
│   └─ Semantic search         │
│                              │
│ Vector Store:                │
│ • general_handbook           │
│   (ChromaDB)                 │
│                              │
│ Flow:                        │
│ Query → Search → Context →  │
│ LLM → Response               │
└─────────────────────────────┘
```

**Right Side - Order Agent (Card Style, 20pt):**
```
┌─────────────────────────────┐
│ 🛒 Order Agent              │
├─────────────────────────────┤
│ Purpose:                     │
│ Product search, cart,        │
│ checkout operations          │
│                              │
│ Tools (10):                  │
│ • search_products            │
│ • add_to_cart                │
│ • edit_item_in_cart          │
│ • remove_from_cart           │
│ • view_cart                  │
│ • shipping_info (3 tools)    │
│ • get_orders                 │
│ • purchase                   │
│                              │
│ Vector Store:                │
│ • products (ChromaDB)        │
│                              │
│ Execution:                   │
│ Loop-based (max 6 steps)    │
│ One tool per step            │
└─────────────────────────────┘
```

---

## SLIDE 5: Observability & Quality

### Layout: Title and Content

**Title (36pt, Bold):**
```
Observability & Quality Assurance
```

**Three Columns (Equal Width):**

**Column 1 - Langfuse (20pt Header, 16pt Body):**
```
📊 Full Observability
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Complete trace lifecycle
✅ Agent spans & tool execution
✅ Performance metrics
✅ Error tracking
✅ Real-time monitoring
```

**Column 2 - LLM-as-Judge (20pt Header, 16pt Body):**
```
⚖️ Quality Evaluation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5 Quality Dimensions:
  • Relevance (1-10)
  • Accuracy (1-10)
  • Completeness (1-10)
  • Clarity (1-10)
  • Helpfulness (1-10)

✅ Async evaluation
✅ Non-blocking
✅ Auto-scoring
```

**Column 3 - Testing (20pt Header, 16pt Body):**
```
🧪 Testing Infrastructure
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 17 test cases
✅ 9 categories
✅ Automated runner
✅ Quality validation
✅ Category reports
```

**Bottom - Visual Flow (14pt):**
```
Query → Response → Async Evaluation → Langfuse Dashboard
```

---

## SLIDE 6: Production Features

### Layout: Title and Content

**Title (36pt, Bold):**
```
Production-Ready Features
```

**Feature Grid (Center, 18pt):**
```
┌─────────────────────────────────────────────────────────┐
│ Production Features                                      │
├─────────────────────────────────────────────────────────┤
│ 🛡️  Rate Limiting      │ 60 requests/min per IP       │
│ 🔒  Token Validation   │ Max 300 tokens (tiktoken)     │
│ 🔄  Connection Retry   │ 3 retries on DB failures     │
│ ⚡  Performance        │ Async I/O, thread pools      │
│ 🎯  Idempotency        │ Duplicate prevention          │
│ 📊  Monitoring         │ Langfuse observability       │
│ 🧪  Testing            │ Golden dataset validation    │
│ 🔐  Security           │ Input validation, CORS        │
└─────────────────────────────────────────────────────────┘
```

**Key Metrics (Below Grid, 20pt Bold):**
```
✅ Non-Blocking  ✅ Scalable  ✅ Reliable  ✅ Observable
```

**Deployment Info (Bottom, 16pt):**
```
🌐 Live on Render.com  |  📊 Status: UptimeRobot  |  🔗 API Docs: /docs
```

---

## SLIDE 7: Summary (Optional - if time allows)

### Layout: Title and Content

**Title (36pt, Bold):**
```
Key Takeaways
```

**Three Key Points (Large, 28pt):**
```
1. 🤖 Multi-Agent Architecture
   Intelligent routing with specialized agents

2. 🔍 Semantic Search
   OpenAI embeddings + selective indexing

3. 📊 Full Observability
   Langfuse tracing + LLM-as-Judge evaluation
```

**Bottom (20pt):**
```
Production-Ready | Scalable | Observable | Tested
```

---

## Design Guidelines for Google Slides:

### Color Palette:
- **Primary Blue**: #4A90E2 (Headers, important elements)
- **Green**: #90EE90 (Success/positive indicators)
- **Orange**: #FFA500 (Agents, tools)
- **Purple**: #9370DB (Data stores)
- **Yellow**: #FFD700 (Evaluation, highlights)
- **Red**: #FF6B6B (Observability)

### Typography:
- **Titles**: 36-48pt, Bold
- **Headers**: 24pt, Bold
- **Body Text**: 18-20pt, Regular
- **Small Text**: 14-16pt, Regular
- **Font**: Use Google Fonts - "Roboto" or "Open Sans"

### Visual Elements:
- Use emojis/icons for quick recognition
- Keep diagrams simple and clear
- Use boxes/cards for component separation
- Highlight key numbers/metrics in larger font
- Use consistent color coding throughout

### Animation (Optional):
- Fade in for bullet points
- Slide in for diagrams
- Keep transitions minimal (0.3-0.5s)

---

## 2-Minute Presentation Script:

**Slide 1 (15s):**
"Agentic Ecommerce Platform - a multi-agent AI system that provides intelligent shopping assistance through specialized agents."

**Slide 2 (30s):**
"User queries flow through our API to an orchestrator agent that intelligently routes to specialized agents - General Info for policies, Order Agent for shopping. Both use semantic search via ChromaDB vector stores."

**Slide 3 (25s):**
"Key decisions: OpenAI embeddings for cost-effective semantic search, selective indexing excluding volatile data, and non-blocking architecture for performance. Natural language understanding extracts filters from queries."

**Slide 4 (30s):**
"General Info Agent handles policies via handbook search. Order Agent has 10 tools for product search, cart operations, shipping, and checkout. Loop-based execution with one tool per step."

**Slide 5 (20s):**
"Full observability with Langfuse, LLM-as-Judge evaluation across 5 quality dimensions, and 17 test cases for validation."

**Slide 6 (20s):**
"Production-ready with rate limiting, token validation, retry logic, async I/O, and comprehensive monitoring. Live on Render.com."

**Total: ~2 minutes**
