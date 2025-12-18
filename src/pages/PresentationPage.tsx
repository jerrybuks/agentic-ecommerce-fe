import './PresentationPage.css';
import architectureImage from '../assets/image.png';

export default function PresentationPage() {
  return (
    <div className="presentation-page">
      {/* Header */}
      <header className="presentation-header">
        <h1>Agentic Ecommerce Platform</h1>
        <p className="presentation-subtitle">Demo Day Presentation</p>
      </header>

      {/* Section 1: Elevator Pitch (1 minute) */}
      <section className="presentation-section elevator-pitch">
        <div className="section-header">
          <span className="section-timer">⏱1</span>
          <h2>Elevator Pitch</h2>
        </div>
        
        <div className="section-content">
          <div className="pitch-item">
            <h3>Which assignment did I choose?</h3>
            <p>I chose the <strong>Agentic Ecommerce Platform</strong> assignment, building a multi-agent AI system for intelligent shopping assistance.</p>
          </div>

          <div className="pitch-item">
            <h3>What problem does it solve?</h3>
            <p>Traditional ecommerce platforms require users to manually search, filter, and navigate products. This system provides a <strong>natural language interface</strong> where users can ask questions, get product recommendations, manage their cart, and complete purchases through conversational interactions.</p>
          </div>

          <div className="pitch-item">
            <h3>What does the solution do? (High Level)</h3>
            <p>The platform uses <strong>specialized AI agents</strong> that intelligently route user queries to the right domain expert. It combines semantic search, natural language understanding, and multi-agent orchestration to provide personalized shopping assistance with full observability and quality evaluation.</p>
          </div>

          <div className="pitch-item">
            <h3>What agents are involved and their roles?</h3>
            <div className="agents-grid">
              <div className="agent-card">
                <div className="agent-icon">🎯</div>
                <h4>Orchestrator Agent</h4>
                <p>LLM-based router (GPT-4o-mini) that intelligently routes queries to specialized agents based on user intent.</p>
              </div>
              <div className="agent-card">
                <div className="agent-icon">📚</div>
                <h4>General Info Agent</h4>
                <p>Handles company policies, FAQs, shipping information, and returns through semantic search in the handbook vector store.</p>
              </div>
              <div className="agent-card">
                <div className="agent-icon">🛒</div>
                <h4>Order Agent</h4>
                <p>Manages product search, cart operations, shipping information, and checkout. Has 10 specialized tools for complete ecommerce functionality.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Project Demo (3 minutes) */}
      <section className="presentation-section project-demo">
        <div className="section-header">
          <span className="section-timer">2</span>
          <h2>Project Demo</h2>
        </div>

        <div className="section-content">
          {/* System Architecture Flowchart */}
          <div className="demo-item">
            <h3>System Architecture Flow</h3>
            <div className="flowchart-container">
              <img 
                src={architectureImage} 
                alt="System Architecture Flowchart" 
                className="architecture-image"
              />
            </div>
          </div>

          {/* Input */}
          <div className="demo-item">
            <h3>What is the input?</h3>
            <div className="demo-box">
              <p>Users interact through <strong>natural language queries</strong> such as:</p>
              <ul>
                <li>"Show me running shoes under $100"</li>
                <li>"What's your return policy?"</li>
                <li>"Add 2 pairs of Nike Air Max to my cart"</li>
                <li>"What gaming accessories do you have?"</li>
              </ul>
              <p>The system accepts queries up to <strong>300 tokens</strong> and validates them before processing.</p>
            </div>
          </div>

          {/* High Level Flow */}
          <div className="demo-item">
            <h3>What happens at a high level?</h3>
            <div className="demo-box">
              <ol className="flow-steps">
                <li>
                  <strong>Query Reception:</strong> User query arrives at FastAPI endpoint
                </li>
                <li>
                  <strong>Validation:</strong> Token count and format validation (max 300 tokens)
                </li>
                <li>
                  <strong>Session Management:</strong> Query service manages conversation session and memory
                </li>
                <li>
                  <strong>Intelligent Routing:</strong> Orchestrator Agent (GPT-4o-mini) analyzes the query and routes to:
                  <ul>
                    <li><strong>General Info Agent</strong> - for policies, FAQs, shipping info</li>
                    <li><strong>Order Agent</strong> - for product search, cart operations, checkout</li>
                    <li><strong>Direct Response</strong> - for simple greetings</li>
                  </ul>
                </li>
                <li>
                  <strong>Agent Execution:</strong>
                  <ul>
                    <li>General Info Agent searches handbook vector store using semantic search</li>
                    <li>Order Agent can search products, manage cart, handle shipping, process orders</li>
                  </ul>
                </li>
                <li>
                  <strong>Response Synthesis:</strong> Final response is synthesized from agent outputs
                </li>
                <li>
                  <strong>Memory Storage:</strong> Conversation stored in memory for context
                </li>
                <li>
                  <strong>Async Evaluation:</strong> LLM-as-Judge evaluates response quality (non-blocking)
                </li>
                <li>
                  <strong>Observability:</strong> All traces sent to Langfuse for monitoring
                </li>
              </ol>
            </div>
          </div>

          {/* Cart Tools List */}
          <div className="demo-item">
            <h3>Order Agent Cart Tools</h3>
            <div className="tools-grid">
              <div className="tool-card">
                <div className="tool-icon">🔍</div>
                <div className="tool-name">search_products</div>
                <div className="tool-desc">Semantic product search with filters (price, category, brand)</div>
              </div>
              <div className="tool-card">
                <div className="tool-icon">➕</div>
                <div className="tool-name">add_to_cart</div>
                <div className="tool-desc">Add products to shopping cart</div>
              </div>
              <div className="tool-card">
                <div className="tool-icon">✏️</div>
                <div className="tool-name">edit_item_in_cart</div>
                <div className="tool-desc">Modify quantity or items in cart</div>
              </div>
              <div className="tool-card">
                <div className="tool-icon">🗑️</div>
                <div className="tool-name">remove_from_cart</div>
                <div className="tool-desc">Remove items from cart</div>
              </div>
              <div className="tool-card">
                <div className="tool-icon">👁️</div>
                <div className="tool-name">view_cart</div>
                <div className="tool-desc">View current cart contents and total</div>
              </div>
              <div className="tool-card">
                <div className="tool-icon">📦</div>
                <div className="tool-name">get_shipping_info</div>
                <div className="tool-desc">Retrieve saved shipping information</div>
              </div>
              <div className="tool-card">
                <div className="tool-icon">➕</div>
                <div className="tool-name">create_shipping_info</div>
                <div className="tool-desc">Create new shipping address</div>
              </div>
              <div className="tool-card">
                <div className="tool-icon">✏️</div>
                <div className="tool-name">edit_shipping_info</div>
                <div className="tool-desc">Update existing shipping address</div>
              </div>
              <div className="tool-card">
                <div className="tool-icon">📋</div>
                <div className="tool-name">get_orders</div>
                <div className="tool-desc">Retrieve user's order history</div>
              </div>
              <div className="tool-card">
                <div className="tool-icon">💳</div>
                <div className="tool-name">purchase</div>
                <div className="tool-desc">Complete checkout and create order</div>
              </div>
            </div>
          </div>

          {/* Final Output */}
          <div className="demo-item">
            <h3>What does the final output look like?</h3>
            <div className="demo-box">
              <p>The system returns a <strong>natural language response</strong> that includes:</p>
              <ul>
                <li><strong>Answer:</strong> Conversational response addressing the user's query</li>
                <li><strong>Related Products:</strong> Visual product cards with images, prices, and brands (when relevant)</li>
                <li><strong>Agent Information:</strong> Which agents were used and routing mode (single, sequential, parallel, direct)</li>
                <li><strong>Sources:</strong> References to products or handbook sections used</li>
              </ul>
              <div className="output-example">
                <div className="example-header">Example Response:</div>
                <div className="example-content">
                  <p><strong>Answer:</strong> "Here are some running shoes under $100..."</p>
                  <p><strong>Related Products:</strong> [Product cards displayed]</p>
                  <p><strong>Agent:</strong> order • Routing: parallel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Questions */}
      <section className="presentation-section questions">
        <div className="section-header">
          <span className="section-timer">⏱️ Q&A</span>
          <h2>Questions & Answers</h2>
        </div>
      </section>

      {/* Footer */}
      <footer className="presentation-footer">
        <p>Agentic Ecommerce Platform • Demo Day 2025</p>
      </footer>
    </div>
  );
}

