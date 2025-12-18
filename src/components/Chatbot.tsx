import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { sendChatQuery, generateVoucher, type ChatResponse, type ChatSource } from '../services/api';
import { cartKeys } from '../hooks/useProducts';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  agentsUsed?: string[];
  routingMode?: string;
  timestamp: Date;
}

function SourceCard({ source }: { source: ChatSource }) {
  const { metadata } = source;
  
  return (
    <div className="chat-source-card">
      {metadata.primary_image && (
        <img
          src={metadata.primary_image}
          alt="Product"
          className="chat-source-image"
        />
      )}
      <div className="chat-source-info">
        <span className="chat-source-brand">{metadata.brand}</span>
        {metadata.price && (
          <span className="chat-source-price">${metadata.price.toFixed(2)}</span>
        )}
      </div>
    </div>
  );
}

export default function Chatbot() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isGeneratingVoucher, setIsGeneratingVoucher] = useState(false);
  const [voucher, setVoucher] = useState<{ code: string; amount: number } | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadingSteps = [
    '', // Step 0: Just dots, no text
    'Analyzing your request...',
    'Consulting with AI agents...',
    'Searching our data sources...',
    'Gathering recommendations...',
    'Finalizing response...',
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Progressive loading steps
  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }

    // Start at step 0
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        // Stop at step 5 (6th step, 0-indexed)
        if (prev >= 5) {
          return 5;
        }
        return prev + 1;
      });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isLoading]);

  const MAX_WORDS = 200;

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = countWords(input);
  const isOverLimit = wordCount > MAX_WORDS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isOverLimit) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response: ChatResponse = await sendChatQuery(input.trim(), sessionId);
      
      // Store session ID for conversation continuity
      if (response.session_id) {
        setSessionId(response.session_id);
      }

      // Revalidate cart if order agent was used (cart may have changed)
      if (response.agents_used?.includes('order')) {
        queryClient.invalidateQueries({ queryKey: cartKeys.all });
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        sources: response.sources,
        agentsUsed: response.agents_used,
        routingMode: response.routing_mode,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVoucher = async () => {
    setIsGeneratingVoucher(true);
    try {
      const voucherData = await generateVoucher();
      setVoucher({ code: voucherData.code, amount: voucherData.amount });
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error generating your voucher. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGeneratingVoucher(false);
    }
  };

  const handleCopyVoucher = () => {
    if (voucher) {
      navigator.clipboard.writeText(voucher.code);
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line) => {
        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Handle numbered lists
        if (/^\d+\.\s/.test(line)) {
          return `<div class="chat-list-item">${line}</div>`;
        }
        return line;
      })
      .join('<br />');
  };

  return (
    <>
      {/* Floating Chat Button - Hidden when open */}
      {!isOpen && (
        <button
          className="chatbot-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open chat"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                </svg>
              </div>
              <div>
                <h3>Shoplytic Assistant</h3>
                <span className="chatbot-status">Online</span>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button
                className="chatbot-voucher-btn"
                onClick={handleGenerateVoucher}
                disabled={isGeneratingVoucher}
                title="Generate voucher"
              >
                {isGeneratingVoucher ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeDasharray="31.416" strokeDashoffset="31.416">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite" />
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite" />
                    </circle>
                  </svg>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 7h16M4 7v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M4 7l2-4h12l2 4M8 11h8" />
                    </svg>
                    <span className="chatbot-voucher-label">Voucher</span>
                  </>
                )}
              </button>
              <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Voucher Banner */}
          {voucher && (
            <div className="chatbot-voucher-banner">
              <div className="chatbot-voucher-banner-content">
                <div className="chatbot-voucher-banner-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7h16M4 7v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M4 7l2-4h12l2 4M8 11h8" />
                  </svg>
                </div>
                <div className="chatbot-voucher-banner-info">
                  <div className="chatbot-voucher-banner-amount">${voucher.amount.toFixed(2)}</div>
                  <div className="chatbot-voucher-banner-code">{voucher.code}</div>
                </div>
                <button
                  className="chatbot-voucher-banner-copy"
                  onClick={handleCopyVoucher}
                  title="Copy voucher code"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
                <button
                  className="chatbot-voucher-banner-close"
                  onClick={() => setVoucher(null)}
                  title="Close"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-welcome">
                <div className="chatbot-welcome-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h4>Welcome to Shoplytic!</h4>
                <p>Ask me anything about our products, orders, or get personalized recommendations.</p>
                <div className="chatbot-suggestions">
                  <button onClick={() => setInput('Show me running shoes')}>
                    🏃 Running shoes
                  </button>
                  <button onClick={() => setInput('What gaming accessories do you have?')}>
                    🎮 Gaming gear
                  </button>
                  <button onClick={() => setInput('Recommend something under $100')}>
                    💰 Under $100
                  </button>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-message ${message.type}`}
              >
                <div
                  className="chatbot-message-content"
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(message.content),
                  }}
                />
                
                {/* Show product sources for assistant messages */}
                {message.type === 'assistant' && message.sources && (() => {
                  // Filter to only show product sources
                  const productSources = message.sources.filter(
                    (source) => source.metadata?.source === 'product' && source.metadata?.product_id
                  );
                  
                  if (productSources.length === 0) return null;
                  
                  return (
                    <div className="chatbot-sources">
                      <span className="chatbot-sources-label">Related Products:</span>
                      <div className="chatbot-sources-grid">
                        {productSources.slice(0, 3).map((source, idx) => (
                          <SourceCard key={`${source.metadata?.product_id || idx}`} source={source} />
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Show agent info */}
                {message.type === 'assistant' && message.agentsUsed && message.agentsUsed.length > 0 && (
                  <div className="chatbot-meta">
                    <span>
                      Agent: {message.agentsUsed.join(', ')} • {message.routingMode}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="chatbot-message assistant">
                <div className="chatbot-loading-progress">
                  <div className="chatbot-loading-content">
                    <div className="chatbot-loading-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeDasharray="31.416" strokeDashoffset="31.416">
                          <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite" />
                          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite" />
                        </circle>
                      </svg>
                    </div>
                    <div className="chatbot-loading-text-wrapper">
                      {loadingSteps[loadingStep] && (
                        <div className="chatbot-loading-text">
                          {loadingSteps[loadingStep]}
                        </div>
                      )}
                      <div className="chatbot-loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-form" onSubmit={handleSubmit}>
            <div className="chatbot-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about products, orders..."
                disabled={isLoading}
                className={`chatbot-input ${isOverLimit ? 'error' : ''}`}
              />
              {wordCount > 0 && (
                <span className={`chatbot-word-count ${isOverLimit ? 'error' : wordCount > MAX_WORDS * 0.8 ? 'warning' : ''}`}>
                  {wordCount}/{MAX_WORDS}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isOverLimit}
              className="chatbot-send"
              title={isOverLimit ? `Message exceeds ${MAX_WORDS} word limit` : 'Send message'}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

