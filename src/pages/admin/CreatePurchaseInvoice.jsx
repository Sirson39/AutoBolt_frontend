import AdminLayout from '../../components/AdminLayout';
import { useState, useEffect } from 'react';
import { 
  ShoppingCart, Plus, Trash2, Truck, Package, 
  CheckCircle, ChevronLeft, Search, 
  Hash, Calendar, FileText, Printer, X
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CreatePurchaseInvoice({ onNavigate }) {
  
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [parts, setParts] = useState([]);
  
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  const [cart, setCart] = useState([]);
  
  const [searchPartQuery, setSearchPartQuery] = useState('');
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');
  const [createdPurchase, setCreatedPurchase] = useState(null);

  const total = cart.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendRes, partRes] = await Promise.all([
          axios.get('/api/vendors'),
          axios.get('/api/parts')
        ]);
        setVendors(vendRes.data);
        setParts(partRes.data);

        const restockData = localStorage.getItem('restockPart');
        if (restockData) {
          const part = JSON.parse(restockData);
          addToCart(part);
          localStorage.removeItem('restockPart');
        }
      } catch (error) {
        toast.error("Failed to load setup data.");
      }
    };
    fetchData();
  }, []);

  const addToCart = (part) => {
    const existing = cart.find(item => item.id === part.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...part, quantity: 1, unitCost: part.price * 0.7 }]);
    }
    toast.success(`${part.name} added to purchase list`);
  };

  const removeFromCart = (partId) => {
    setCart(cart.filter(item => item.id !== partId));
  };

  const updateQuantity = (partId, delta) => {
    setCart(cart.map(item => 
      item.id === partId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const updateCost = (partId, cost) => {
    setCart(cart.map(item => 
      item.id === partId ? { ...item, unitCost: parseFloat(cost) || 0 } : item
    ));
  };

  const handleSavePurchase = async () => {
    if (!selectedVendor) {
      toast.error("Please select a vendor.");
      return;
    }
    if (cart.length === 0) {
      toast.error("No parts added to purchase.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        vendorId: selectedVendor.id,
        invoiceNumber: "AUTO", // Backend handles this now
        purchaseDate: purchaseDate,
        remarks: remarks,
        items: cart.map(item => ({
          partId: item.id,
          quantity: item.quantity,
          unitCost: item.unitCost
        }))
      };
      
      const response = await axios.post('/api/purchase', payload);
      setCreatedPurchase(response.data);
      toast.success("Purchase record saved! Opening receipt...");
      
      // Open print view
      setTimeout(() => {
        window.print();
        onNavigate('admin-purchase');
      }, 1000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save purchase.");
    } finally {
      setLoading(false);
    }
  };

  const filteredParts = parts.filter(p => 
    p.name.toLowerCase().includes(searchPartQuery.toLowerCase())
  );

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
    v.contactPerson?.toLowerCase().includes(vendorSearchQuery.toLowerCase())
  );

  return (
    <>
      <header className="top-header glass-card no-print" style={{ position: 'sticky', top: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('admin-purchase')} style={{ padding: '0.4rem' }}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <ShoppingCart size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span className="page-title">Restock Inventory</span>
             <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: '600' }}>Select a supplier and inventory parts to securely restock your catalog</span>
          </div>
        </div>
      </header>

      <div className="pos-container" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 400px', 
        height: 'calc(100vh - 100px)', 
        gap: '2rem', 
        padding: '2rem',
        animation: 'fadeUp 0.6s ease both'
      }}>
        
        {/* Left Column */}
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
          
          {/* Step 1: Vendor & Invoice Info */}
          <div className="table-card" style={{ padding: '1.75rem', boxShadow: 'var(--shadow-luxury)', border: '1px solid rgba(255,255,255,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontWeight: '800', color: 'var(--ink)', fontSize: '1rem', letterSpacing: '0.5px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>1</div>
              VENDOR & TRANSACTION LOGISTICS
            </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Search Vendor</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Vendor Name..." 
                  style={{ paddingLeft: '2.5rem' }}
                  value={vendorSearchQuery}
                  onChange={(e) => setVendorSearchQuery(e.target.value)}
                />
                {vendorSearchQuery && (
                  <div className="dropdown-search" style={{ 
                    position: 'absolute', top: '100%', left: 0, width: '100%',
                    background: 'var(--surface)', border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius)', zIndex: 100, boxShadow: 'var(--shadow-xl)',
                    maxHeight: '200px', overflowY: 'auto'
                  }}>
                    {filteredVendors.map(v => (
                      <div 
                        key={v.id} 
                        className="dropdown-item" 
                        style={{ padding: '0.75rem 1rem', cursor: 'pointer' }}
                        onClick={() => { setSelectedVendor(v); setVendorSearchQuery(''); }}
                      >
                        <div style={{ fontWeight: '700' }}>{v.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>{v.phone}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedVendor && (
                <div style={{ 
                  marginTop: '0.75rem', 
                  padding: '1rem', 
                  background: 'var(--brand-light)', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  border: '1px solid var(--brand-soft)',
                  animation: 'scaleIn 0.3s ease'
                }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>
                       {selectedVendor.name.charAt(0).toUpperCase()}
                     </div>
                     <div>
                       <div style={{ fontWeight: '800', color: 'var(--brand)', fontSize: '0.9rem' }}>{selectedVendor.name}</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--brand)', opacity: 0.8 }}>{selectedVendor.phone}</div>
                     </div>
                   </div>
                   <button className="btn btn-ghost btn-sm" onClick={() => setSelectedVendor(null)} style={{ color: 'var(--brand)' }}>
                     <Trash2 size={14} />
                   </button>
                </div>
              )}
            </div>

            <div className="form-group">
                <label className="form-label">Purchase Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={purchaseDate}
                  onChange={e => setPurchaseDate(e.target.value)}
                />
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginTop: '1rem' }}>
             <div className="form-group">
                <label className="form-label">Remarks / Notes</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Optional notes about this stock batch..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                />
             </div>
          </div>
        </div>

        {/* Step 2: Parts Selection */}
        <div className="table-card" style={{ flex: 1, padding: '1.75rem', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-luxury)', border: '1px solid rgba(255,255,255,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800', color: 'var(--ink)', fontSize: '1rem', letterSpacing: '0.5px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>2</div>
              INVENTORY CATALOG
            </div>
            <div className="search-box" style={{ width: '350px' }}>
              <Search size={16} color="var(--ink-soft)" />
              <input 
                type="text" 
                placeholder="Search catalog by name or SKU..." 
                value={searchPartQuery}
                onChange={(e) => setSearchPartQuery(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', overflowY: 'auto' }}>
            {filteredParts.map(part => (
              <div 
                key={part.id} 
                className="grid-card" 
                style={{ cursor: 'pointer', border: '1px solid var(--border)' }}
                onClick={() => addToCart(part)}
              >
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--ink)' }}>{part.name}</div>
                  <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--ink-soft)' }}>
                        Stock: {part.stockQuantity}
                     </div>
                     <Plus size={16} color="var(--brand)" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Cart */}
      <div className="table-card no-print glass-card" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100vh - 140px)', 
        position: 'sticky', 
        top: '20px',
        boxShadow: 'var(--shadow-luxury)',
        border: '1px solid rgba(255,255,255,0.6)',
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: '#0f1923', color: '#fff', borderRadius: 'var(--radius) var(--radius) 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '900', fontSize: '1.1rem', letterSpacing: '1px' }}>
            <ShoppingCart size={22} /> PURCHASE LIST
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--ink-soft)' }}>
              <Package size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <p>No parts selected.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ padding: '1rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{item.name}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                       <label style={{ fontSize: '0.7rem' }}>Quantity</label>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => updateQuantity(item.id, -1)}>-</button>
                          <span style={{ fontWeight: '800' }}>{item.quantity}</span>
                          <button className="btn btn-ghost btn-sm" onClick={() => updateQuantity(item.id, 1)}>+</button>
                       </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                       <label style={{ fontSize: '0.7rem' }}>Unit Cost (Rs)</label>
                       <input 
                          type="number" 
                          className="form-input small" 
                          value={item.unitCost}
                          onChange={e => updateCost(item.id, e.target.value)}
                       />
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Sub: Rs {(item.unitCost * item.quantity).toLocaleString()}</span>
                     <button className="text-red" onClick={() => removeFromCart(item.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--surface-2)', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '900', color: 'var(--ink)' }}>
            <span>Total Cost</span>
            <span style={{ color: 'var(--brand)' }}>Rs {total.toLocaleString()}</span>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ 
              width: '100%', padding: '1.25rem', fontSize: '1.1rem', justifyContent: 'center',
              fontWeight: '800', letterSpacing: '1px',
              opacity: (loading || cart.length === 0 || !selectedVendor) ? 0.7 : 1,
              boxShadow: '0 8px 20px rgba(217, 93, 57, 0.3)'
            }}
            disabled={loading}
            onClick={handleSavePurchase}
          >
            {loading ? <div className="spinner" /> : <><CheckCircle size={20} style={{ marginRight: '8px' }} /> FINALIZE RESTOCK</>}
          </button>
        </div>
      </div>
    </div>

      {/* Printable Receipt View */}
      <div id="printable-purchase-receipt" className="print-only">
        {createdPurchase && (
          <div style={{ padding: '2rem', background: '#fff', color: '#000', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: '#d95d39' }}>AutoBolt</h1>
              <p style={{ color: '#666', margin: '2px 0', fontSize: '0.8rem' }}>Stock Purchase Receipt</p>
              <p style={{ color: '#666', margin: '2px 0', fontSize: '0.75rem' }}>Kathmandu, Nepal</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '0.5rem 0', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Vendor</div>
                <div style={{ fontWeight: '800' }}>{createdPurchase.vendorName}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Purchase Order</div>
                <div style={{ fontWeight: '800' }}>{createdPurchase.invoiceNumber}</div>
                <div style={{ fontSize: '0.8rem' }}>{new Date(createdPurchase.purchaseDate).toLocaleDateString()}</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #000' }}>
                  <th style={{ textAlign: 'left', paddingBottom: '0.5rem' }}>Item Description</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Unit Cost</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {createdPurchase.items?.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem 0' }}>
                      <div style={{ fontWeight: '700' }}>{item.partName}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>Rs {item.unitCost.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', fontWeight: '800' }}>Rs {item.subtotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginLeft: 'auto', width: '220px', fontSize: '1.1rem', fontWeight: '900', borderTop: '2px solid #000', paddingTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GRAND TOTAL</span>
                <span>Rs {createdPurchase.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.75rem', color: '#888' }}>
              <p>System Generated Purchase Record</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media screen {
          .print-only { display: none !important; }
        }
        @media print {
          body * { visibility: hidden !important; }
          #printable-purchase-receipt, #printable-purchase-receipt * { 
            visibility: visible !important; 
          }
          #printable-purchase-receipt { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important;
            display: block !important;
          }
          @page { margin: 1cm; }
        }
      `}</style>
    </>
  );
}

