import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { 
  Wrench, Plus, ArrowLeft, ShoppingCart, Search, Trash2, 
  ShoppingBag, Clock, Sparkles, X, AlertCircle, HelpCircle, Eye
} from 'lucide-react';

const STATUS_COLORS = {
  Pending:      { bg: '#fef9c3', color: '#854d0e', border: '#fde047' },
  Acknowledged: { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
  Fulfilled:    { bg: '#dcfce7', color: '#166534', border: '#86efac' },
  Rejected:     { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
};

const EMPTY_FORM = { partName: '', description: '', quantity: 1 };

const HighlightText = ({ text, highlight }) => {
  if (!highlight?.trim() || !text) return <span>{text || ''}</span>;
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.toString().split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i} className="highlight" style={{ background: 'var(--brand-light)', color: 'var(--brand)', padding: '0 2px', borderRadius: '2px' }}>{part}</mark> : <span key={i}>{part}</span>
      )}
    </span>
  );
};

export default function MyPartRequests({ onNavigate }) {
  const user = getUser();
  const customerId = user?.customerId || user?.id;

  // Viewing Part Details Modal/Drawer State
  const [viewingPart, setViewingPart] = useState(null);

  // Active Tab: 'catalog' or 'history'
  const [activeTab, setActiveTab] = useState('catalog');

  // Requests History State
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Shop Parts Catalog State
  const [parts, setParts] = useState([]);
  const [loadingParts, setLoadingParts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State (loaded from localStorage for a persistent, premium feel)
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`autobolt_cart_${customerId}`) || '[]');
    } catch {
      return [];
    }
  });

  // Modal & Sidebar Controls
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState(EMPTY_FORM);
  const [savingCustom, setSavingCustom] = useState(false);
  const [submittingCart, setSubmittingCart] = useState(false);

  // Save Cart to LocalStorage
  useEffect(() => {
    if (customerId) {
      localStorage.setItem(`autobolt_cart_${customerId}`, JSON.stringify(cart));
    }
  }, [cart, customerId]);

  // Fetch Requests History
  const fetchRequests = async () => {
    if (!customerId) return;
    try {
      setLoadingRequests(true);
      const res = await api.get(`/api/part-requests/customer/${customerId}`);
      const sorted = (Array.isArray(res.data) ? res.data : []).sort((a, b) => b.id - a.id);
      setRequests(sorted);
    } catch (err) {
      console.error("Failed to load requests history", err);
      toast.error('Failed to load part requests history.');
    } finally {
      setLoadingRequests(false);
    }
  };

  // Fetch Parts Catalog
  const fetchParts = async () => {
    try {
      setLoadingParts(true);
      const res = await api.get('/api/parts');
      setParts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load parts", err);
      toast.error('Failed to load available parts catalog.');
    } finally {
      setLoadingParts(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchRequests();
      fetchParts();
    }
  }, [customerId]);

  // Add Part to Cart
  const addToCart = (part) => {
    const existing = cart.find(item => item.id === part.id);
    if (existing) {
      toast.success(`Incremented quantity of ${part.name} in your request cart!`, { icon: '🛒' });
      setCart(prev => prev.map(item =>
        item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      toast.success(`${part.name} added to your request cart!`, { icon: '🛒' });
      setCart(prev => [...prev, {
        id: part.id,
        name: part.name,
        price: part.price,
        imageUrl: part.imageUrl,
        quantity: 1
      }]);
    }
  };

  // Update Cart Quantity
  const updateCartQuantity = (id, delta) => {
    setCart(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // Remove from Cart
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.success('Item removed from cart.');
  };

  // Submit Cart Requests
  const submitCartRequests = async () => {
    if (cart.length === 0) return;
    setSubmittingCart(true);
    const loadToast = toast.loading('Submitting your part requests...');
    try {
      // Post all items sequentially to the backend
      await Promise.all(
        cart.map(item => 
          api.post('/api/part-requests', {
            partName: item.name,
            description: `Requested from shop catalog. Unit price: Rs ${item.price.toFixed(2)}`,
            quantity: item.quantity,
            customerId
          })
        )
      );

      toast.success(`Successfully submitted ${cart.length} part request(s)!`, { id: loadToast });
      setCart([]);
      setIsCartOpen(false);
      fetchRequests(); // Refresh requests tab
      setActiveTab('history'); // Switch to history tab to view requests
    } catch (err) {
      console.error("Cart submission failed", err);
      toast.error('Failed to submit some part requests. Please try again.', { id: loadToast });
    } finally {
      setSubmittingCart(false);
    }
  };

  // Submit Custom Request Modal
  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customForm.partName.trim()) {
      toast.error('Part Name is required.');
      return;
    }
    setSavingCustom(true);
    const loadToast = toast.loading('Submitting custom request...');
    try {
      const res = await api.post('/api/part-requests', {
        partName: customForm.partName.trim(),
        description: customForm.description || 'Custom requested part.',
        quantity: parseInt(customForm.quantity) || 1,
        customerId
      });

      setRequests(prev => [res.data, ...prev]);
      toast.success('Custom part request submitted successfully!', { id: loadToast });
      setShowCustomModal(false);
      setCustomForm(EMPTY_FORM);
      setActiveTab('history'); // Navigate to history to see it
    } catch (err) {
      console.error("Custom request failed", err);
      toast.error('Failed to submit custom part request.', { id: loadToast });
    } finally {
      setSavingCustom(false);
    }
  };

  // Filter Catalog Parts based on search query
  const filteredParts = parts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s ease', position: 'relative' }}>
      
      {/* 1. Header (Fixed alignment & unified design matching other components) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingLeft: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wrench size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Part Requests</h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: '600' }}>Browse our shop parts or request custom parts seamlessly</span>
          </div>
        </div>
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={() => { setCustomForm(EMPTY_FORM); setShowCustomModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: 'var(--radius-sm)' }}>
            <Plus size={16} /> Request Custom Part
          </button>
          
          <button className="btn btn-primary" onClick={() => setIsCartOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative', borderRadius: 'var(--radius-sm)' }}>
            <ShoppingCart size={16} /> Request List
            {cart.length > 0 && (
              <span className="cart-badge" style={{
                position: 'absolute', top: '-8px', right: '-8px',
                background: 'var(--brand)', color: '#fff', fontSize: '0.65rem',
                fontWeight: '900', padding: '2px 6px', borderRadius: '50%',
                border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Sleek Tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', gap: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('catalog')} 
          style={{ 
            padding: '0.75rem 0.25rem', border: 'none', background: 'none', 
            borderBottom: activeTab === 'catalog' ? '2.5px solid var(--brand)' : '2.5px solid transparent', 
            color: activeTab === 'catalog' ? 'var(--ink)' : 'var(--ink-soft)', 
            fontWeight: activeTab === 'catalog' ? '800' : '600', 
            fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, 
            transition: 'all 0.2s ease' 
          }}
        >
          <ShoppingBag size={16} /> Browse Parts Catalog
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          style={{ 
            padding: '0.75rem 0.25rem', border: 'none', background: 'none', 
            borderBottom: activeTab === 'history' ? '2.5px solid var(--brand)' : '2.5px solid transparent', 
            color: activeTab === 'history' ? 'var(--ink)' : 'var(--ink-soft)', 
            fontWeight: activeTab === 'history' ? '800' : '600', 
            fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, 
            transition: 'all 0.2s ease' 
          }}
        >
          <Clock size={16} /> My Request History ({requests.length})
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'catalog' ? (
        <div>
          {/* Catalog Toolbar */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-box" style={{ background: '#fff', border: '1px solid var(--border)', flex: 1, minWidth: '260px', maxWidth: '400px' }}>
              <Search size={18} color="var(--ink-soft)" />
              <input 
                type="text" 
                placeholder="Search shop parts catalog..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600', marginLeft: 'auto' }}>
              Showing {filteredParts.length} available {filteredParts.length === 1 ? 'part' : 'parts'}
            </div>
          </div>

          {/* Parts Loading State / Empty / Grid */}
          {loadingParts ? (
            <div className="loading"><div className="spinner" /> Loading shop inventory...</div>
          ) : filteredParts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--ink-soft)', background: '#fff', borderRadius: 14, border: '1px solid var(--border)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <h3>No parts match your query</h3>
              <p style={{ maxWidth: '380px', margin: '0 auto 1rem', fontSize: '0.88rem' }}>
                Can't find the specific part you're looking for in our active list? Request a custom order below.
              </p>
              <button className="btn btn-primary btn-sm" onClick={() => { setCustomForm(EMPTY_FORM); setShowCustomModal(true); }}>
                Submit Custom Part Request
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {filteredParts.map(part => (
                <div 
                  key={part.id} 
                  className="grid-card" 
                  style={{ 
                    display: 'flex', flexDirection: 'column', height: '100%', 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                    boxShadow: 'var(--shadow-sm)', background: '#fff', borderRadius: '12px', overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-luxury)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div style={{ position: 'relative', height: 160, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {part.imageUrl ? (
                      <img src={`${import.meta.env.VITE_API_BASE_URL}${part.imageUrl}`} alt={part.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Wrench size={36} style={{ color: 'var(--brand)', opacity: 0.25 }} />
                    )}
                    <div style={{ 
                      position: 'absolute', top: 10, right: 10, 
                      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', 
                      padding: '3px 8px', borderRadius: 99, fontSize: '0.75rem', fontWeight: '800', 
                      border: '1px solid var(--border)', color: 'var(--ink)' 
                    }}>
                      Rs {part.price.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={part.name}>
                      <HighlightText text={part.name} highlight={searchQuery} />
                    </h3>
                    <p style={{ 
                      margin: 0, fontSize: '0.78rem', color: 'var(--ink-soft)', lineHeight: '1.4', 
                      flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                    }}>
                      <HighlightText text={part.description || 'Premium high-quality automotive part tested for excellent compatibility and longevity.'} highlight={searchQuery} />
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 8, borderTop: '1px solid var(--surface-2)' }}>
                      {part.stockQuantity > 5 ? (
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }}></span> In Stock
                        </span>
                      ) : part.stockQuantity > 0 ? (
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--warning)' }}></span> Low Stock ({part.stockQuantity})
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)' }}></span> Out of Stock
                        </span>
                      )}
                      
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={() => setViewingPart(part)}
                          style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}
                          title="View Part Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => addToCart(part)}
                          style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: '800', borderRadius: 'var(--radius-sm)' }}
                        >
                          <Plus size={12} style={{ marginRight: 4 }} /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Custom Fallback Box */}
          {!loadingParts && parts.length > 0 && (
            <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--brand-light)', border: '1px solid rgba(217, 93, 57, 0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <HelpCircle size={22} color="var(--brand)" />
              </div>
              <div style={{ flex: 1, minWidth: 260 }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 800, color: 'var(--ink)' }}>Need a specific part not listed here?</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                  Submit a custom request with your vehicle specifics and required items, and our procurement team will source it for you.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => { setCustomForm(EMPTY_FORM); setShowCustomModal(true); }} style={{ borderRadius: 'var(--radius-sm)' }}>
                Request Custom Part
              </button>
            </div>
          )}
        </div>
      ) : (
        /* History Tab Contents */
        <div>
          {loadingRequests ? (
            <div className="loading"><div className="spinner" /> Loading request history...</div>
          ) : requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--ink-soft)', background: '#fff', borderRadius: 14, border: '1px solid var(--border)' }}>
              <Clock size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.9rem' }}>No part requests recorded yet.</p>
            </div>
          ) : (
            <div className="table-card" style={{ border: '1px solid rgba(255,255,255,0.4)', boxShadow: 'var(--shadow-sm)' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Part Name</th>
                    <th>Quantity</th>
                    <th>Special Details</th>
                    <th>Status</th>
                    <th>Request Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(r => {
                    const sc = STATUS_COLORS[r.status] || STATUS_COLORS.Pending;
                    return (
                      <tr key={r.id} style={{ transition: 'background 0.2s' }}>
                        <td style={{ fontWeight: 800, color: 'var(--ink)' }}>{r.partName}</td>
                        <td style={{ fontWeight: 700 }}>{r.quantity} pcs</td>
                        <td style={{ color: 'var(--ink-soft)', fontSize: '0.82rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={r.description}>
                          {r.description || '—'}
                        </td>
                        <td>
                          <span style={{ 
                            padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: '800', 
                            background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                            textTransform: 'uppercase', letterSpacing: '0.5px'
                          }}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--ink-soft)', fontSize: '0.8rem' }}>
                          {new Date(r.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. Sliding Cart Sidebar Panel */}
      {isCartOpen && (
        <div className="side-panel-overlay" onClick={() => setIsCartOpen(false)} style={{ zIndex: 1500 }}>
          <div className="side-panel" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', background: '#fff', boxShadow: 'var(--shadow-luxury)' }}>
            <div className="side-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShoppingCart size={18} color="var(--brand)" />
                <h3 className="modal-title" style={{ fontSize: '1.05rem', fontWeight: 800 }}>Request Cart</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsCartOpen(false)} style={{ padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            
            <div className="side-panel-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 70px)', padding: '1.25rem' }}>
              {cart.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)', gap: '1rem', textAlign: 'center' }}>
                  <ShoppingCart size={40} style={{ opacity: 0.15 }} />
                  <p style={{ fontWeight: '700', margin: 0, fontSize: '0.9rem' }}>Your cart is empty</p>
                  <span style={{ fontSize: '0.78rem', opacity: 0.7, padding: '0 1rem' }}>
                    Select high-quality parts from our active catalog to draft a replacement request.
                  </span>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem' }}>
                    {cart.map(item => (
                      <div 
                        key={item.id} 
                        style={{ 
                          display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'var(--surface-2)', 
                          borderRadius: '8px', border: '1px solid var(--border)', alignItems: 'center' 
                        }}
                      >
                        <div style={{ width: '40px', height: '40px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                          {item.imageUrl ? (
                            <img src={`${import.meta.env.VITE_API_BASE_URL}${item.imageUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Wrench size={16} style={{ color: 'var(--brand)', opacity: 0.4 }} />
                          )}
                        </div>
                        
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </h4>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand)', marginTop: 2, display: 'block' }}>
                            Rs {item.price.toFixed(2)}
                          </span>
                        </div>
                        
                        {/* Qty modifiers */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '2px 4px' }}>
                          <button 
                            className="btn btn-ghost btn-sm" 
                            style={{ padding: '0 4px', fontSize: '0.85rem', height: 'auto', border: 'none', background: 'none' }} 
                            onClick={() => updateCartQuantity(item.id, -1)}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '0.78rem', fontWeight: '800', width: 14, textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button 
                            className="btn btn-ghost btn-sm" 
                            style={{ padding: '0 4px', fontSize: '0.85rem', height: 'auto', border: 'none', background: 'none' }} 
                            onClick={() => updateCartQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          className="btn btn-ghost btn-sm" 
                          style={{ color: 'var(--danger)', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Cart Summary */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontWeight: '800', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--ink-soft)' }}>Estimated Total:</span>
                      <span style={{ color: 'var(--brand)', fontSize: '1rem' }}>
                        Rs {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                      </span>
                    </div>
                    
                    <button 
                      className="btn btn-primary" 
                      onClick={submitCartRequests}
                      disabled={submittingCart}
                      style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', borderRadius: 'var(--radius-sm)' }}
                    >
                      {submittingCart ? 'Submitting Requests...' : 'Submit Part Requests'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4.5 Viewing Part Details Modal/Drawer */}
      {viewingPart && (
        <div className="side-panel-overlay" onClick={() => setViewingPart(null)} style={{ zIndex: 1600 }}>
          <div className="side-panel" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '420px', background: '#fff', boxShadow: 'var(--shadow-luxury)' }}>
            <div className="side-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShoppingBag size={18} color="var(--brand)" />
                <h3 className="modal-title" style={{ fontSize: '1.05rem', fontWeight: 800 }}>Part Specifications</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewingPart(null)} style={{ padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            
            <div className="side-panel-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 70px)', padding: '1.5rem' }}>
              <div style={{ background: 'var(--surface-2)', padding: viewingPart.imageUrl ? '0' : '2.5rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', height: '200px', border: '1px solid var(--border)', flexShrink: 0 }}>
                {viewingPart.imageUrl ? (
                  <img src={`${import.meta.env.VITE_API_BASE_URL}${viewingPart.imageUrl}`} alt={viewingPart.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Wrench size={48} style={{ color: 'var(--brand)', opacity: 0.2 }} />
                )}
              </div>
              
              <h2 style={{ fontSize: '1.2rem', fontFamily: 'Sora, sans-serif', color: 'var(--ink)', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.3' }}>
                {viewingPart.name}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unit Price</label>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--brand)' }}>
                    Rs {viewingPart.price.toFixed(2)}
                  </div>
                </div>
                
                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Availability Status</label>
                  <div>
                    {viewingPart.stockQuantity > 5 ? (
                      <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: '700', background: '#dcfce7', color: '#166534', border: '1px solid #86efac', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#166534' }}></span> In Stock
                      </span>
                    ) : viewingPart.stockQuantity > 0 ? (
                      <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: '700', background: '#fffbeb', color: '#b45309', border: '1px solid #fde047', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b45309' }}></span> Low Stock ({viewingPart.stockQuantity})
                      </span>
                    ) : (
                      <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: '700', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#991b1b' }}></span> Out of Stock
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description & Specifications</label>
                  <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: '1.6', margin: 0 }}>
                    {viewingPart.description || 'Premium replacement part designed and tested under strict engineering standards. Guaranteed fitment, high structural integrity, and durability.'}
                  </p>
                </div>
              </div>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                <button 
                  type="button"
                  className="btn btn-secondary" 
                  onClick={() => setViewingPart(null)} 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Close
                </button>
                <button 
                  type="button"
                  className="btn btn-primary" 
                  onClick={() => { addToCart(viewingPart); setViewingPart(null); }} 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Plus size={16} /> Add to Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Custom Request Form Modal */}
      {showCustomModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480, boxShadow: 'var(--shadow-luxury)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={18} color="var(--brand)" />
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)' }}>Request Custom Part</h2>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCustomModal(false)} style={{ padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Part Name *</label>
                <input 
                  className="form-input" 
                  value={customForm.partName} 
                  onChange={e => setCustomForm(p => ({ ...p, partName: e.target.value }))} 
                  placeholder="e.g. Front left wheel bearing" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Quantity Required</label>
                <input 
                  type="number" 
                  className="form-input" 
                  min={1} 
                  max={100} 
                  value={customForm.quantity} 
                  onChange={e => setCustomForm(p => ({ ...p, quantity: e.target.value }))} 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Specification Details (optional)</label>
                <textarea 
                  className="form-input" 
                  rows={3} 
                  value={customForm.description} 
                  onChange={e => setCustomForm(p => ({ ...p, description: e.target.value }))} 
                  placeholder="Mention vehicle year, model/make, vin, or specific part numbers if known..." 
                  style={{ resize: 'vertical' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowCustomModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={savingCustom}>
                  {savingCustom ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
