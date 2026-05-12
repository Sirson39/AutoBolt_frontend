import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Bot, Sparkles, User, History, Trash2, Zap, Clock, ChevronLeft } from 'lucide-react';
import axios from 'axios';

export default function AIAssistant({ stats, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Initial welcome message
  const welcomeMessage = { 
    id: 'welcome', 
    role: 'assistant', 
    text: "AutoBolt Assistant ready. How can I help with your inventory or sales today?", 
    time: new Date() 
  };

  // Load permanent history from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('autobolt_chat_history') || '[]');
    setChatHistory(saved);
    setMessages([welcomeMessage]);
  }, []);

  // Reset current chat when closed (as requested)
  useEffect(() => {
    if (!isOpen) {
      // If there were messages (more than just welcome), save to permanent history
      if (messages.length > 1) {
        const newSession = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          preview: messages[1].text.substring(0, 40) + '...',
          fullChat: messages
        };
        const updatedHistory = [newSession, ...chatHistory].slice(0, 10); // Keep last 10
        setChatHistory(updatedHistory);
        localStorage.setItem('autobolt_chat_history', JSON.stringify(updatedHistory));
      }
      setMessages([welcomeMessage]);
      setShowHistory(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getAIResponse = async (userQuery) => {
    const systemPrompt = `You are the AutoBolt Automotive Intelligence Assistant. 
    YOUR EXPERTISE: AutoBolt shop management, automotive parts, vehicles, car brands, and business strategy.
    
    GUIDELINES:
    1. You are an expert in the automotive world. Feel free to discuss car brands, vehicle types (luxury, performance, etc.), and automotive technology.
    2. ALWAYS try to connect car discussions back to the AutoBolt shop. (e.g., "Since you mentioned luxury vehicles, stocking premium brake pads would be a great strategy").
    3. REJECT topics that have ZERO to do with cars or business (e.g., sports stars, movies, politics).
    4. Use live data: Rev: ${stats.todayRevenue}, Parts: ${stats.totalParts}, Low Stock: ${stats.lowStockParts}, Customers: ${stats.totalCustomers}.`;

    try {
      const groqResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-4).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text })),
          { role: "user", content: userQuery }
        ],
        temperature: 0.6
      }, {
        headers: { 'Authorization': `Bearer ${import.meta.env.VITE_GROQ_KEY}`, 'Content-Type': 'application/json' }
      });
      return groqResponse.data.choices[0].message.content;
    } catch (err) {
      return "I encountered a synchronization error. Please try your request again.";
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: input, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const aiResponseText = await getAIResponse(input);
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: aiResponseText, time: new Date() }]);
    setIsTyping(false);
  };

  const loadPastChat = (session) => {
    setMessages(session.fullChat);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('autobolt_chat_history');
  };

  return (
    <>
      {/* Floating Bubble Trigger */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '110px', right: '30px', zIndex: 9998,
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'var(--brand)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(217, 93, 57, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0)'}
        >
          <MessageCircle size={28} color="white" />
          <div style={{ position: 'absolute', top: '2px', right: '2px', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', border: '2px solid #fff' }} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '30px', right: '30px', width: '380px', height: '580px',
          background: '#fff', borderRadius: '28px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', zIndex: 10000,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'bubbleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          {/* Header */}
          <div style={{ padding: '1.25rem', background: 'var(--ink)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {showHistory ? (
                <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}>
                  <ChevronLeft size={20} />
                </button>
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={18} color="white" />
                </div>
              )}
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800' }}>{showHistory ? 'Past Conversations' : 'AutoBolt AI'}</h3>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowHistory(!showHistory)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8 }}>
                <History size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8 }}>
                <X size={20} />
              </button>
            </div>
          </div>

          {showHistory ? (
            /* History View */
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--ink-soft)' }}>
                  <Clock size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p style={{ fontSize: '0.85rem' }}>No past conversations yet.</p>
                </div>
              ) : (
                <>
                  {chatHistory.map(session => (
                    <div 
                      key={session.id} 
                      onClick={() => loadPastChat(session)}
                      style={{ padding: '1rem', background: '#fff', borderRadius: '12px', border: '1px solid #edf2f7', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#edf2f7'}
                    >
                      <div style={{ fontSize: '0.65rem', color: 'var(--ink-soft)', marginBottom: '4px', fontWeight: '700' }}>{session.date}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--ink)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.preview}</div>
                    </div>
                  ))}
                  <button onClick={clearHistory} style={{ marginTop: 'auto', padding: '10px', background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Trash2 size={14} /> Clear All History
                  </button>
                </>
              )}
            </div>
          ) : (
            /* Chat View */
            <>
              <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#f8fafc' }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'assistant' ? 'flex-start' : 'flex-end', gap: '6px', maxWidth: '85%', alignSelf: msg.role === 'assistant' ? 'flex-start' : 'flex-end' }}>
                    <div style={{ padding: '0.85rem 1rem', borderRadius: msg.role === 'assistant' ? '4px 16px 16px 16px' : '16px 16px 4px 16px', background: msg.role === 'assistant' ? '#fff' : 'var(--brand)', color: msg.role === 'assistant' ? 'var(--ink)' : '#fff', fontSize: '0.88rem', lineHeight: '1.5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: msg.role === 'assistant' ? '1px solid #eef2f7' : 'none' }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '4px', padding: '12px 16px', background: '#fff', borderRadius: '4px 16px 16px 16px', border: '1px solid #eef2f7' }}>
                    <div className="dot" style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--brand)', animation: 'bounce 1.2s infinite 0.1s' }} />
                    <div className="dot" style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--brand)', animation: 'bounce 1.2s infinite 0.2s' }} />
                    <div className="dot" style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--brand)', animation: 'bounce 1.2s infinite 0.3s' }} />
                  </div>
                )}
              </div>

              <div style={{ padding: '1.25rem', borderTop: '1px solid #edf2f7', background: '#fff' }}>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="Ask about AutoBolt..." value={input} onChange={(e) => setInput(e.target.value)} style={{ flex: 1, padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.9rem', outline: 'none' }} />
                  <button type="submit" disabled={!input.trim() || isTyping} style={{ width: '44px', height: '44px', borderRadius: '14px', background: !input.trim() || isTyping ? '#cbd5e1' : 'var(--brand)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Send size={18} /></button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes bubbleUp { from { transform: scale(0.5) translateY(100px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>
    </>
  );
}
