import { useState, useEffect, useRef } from 'react';
import { 
  Receipt, Plus, Trash2, User, Car, Package, 
  Calculator, CheckCircle, ChevronLeft, Search, 
  AlertCircle, Tag, ShoppingCart, Printer, X, 
  CreditCard, Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [parts, setParts] = useState([]);
  
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [status, setStatus] = useState(2); // Default to Paid (2)
  const [cart, setCart] = useState([]);
  
  const [searchPartQuery, setSearchPartQuery] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [createdInvoice, setCreatedInvoice] = useState(null);

  // Calculations
  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const loyaltyDiscount = subTotal > 5000 ? subTotal * 0.10 : 0;
  const total = subTotal - loyaltyDiscount;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, partRes] = await Promise.all([
          axios.get('/api/customers'),
          axios.get('/api/parts')
        ]);
        setCustomers(custRes.data);
        setParts(partRes.data.filter(p => p.stockQuantity > 0));
      } catch (error) {
        toast.error("Failed to load POS data.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      axios.get('/api/vehicles').then(res => {
        const ownerVehicles = res.data.filter(v => v.ownerName === selectedCustomer.fullName);
        setVehicles(ownerVehicles);
        setSelectedVehicle(null);
      });
    } else {
      setVehicles([]);
      setSelectedVehicle(null);
    }
  }, [selectedCustomer]);

  const addToCart = (part) => {
    const existing = cart.find(item => item.id === part.id);
    if (existing) {
      if (existing.quantity >= part.stockQuantity) {
        toast.error("Not enough stock!");
        return;
      }
      setCart(cart.map(item => 
        item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...part, quantity: 1 }]);
    }
    toast.success(`${part.name} added to cart`);
  };

  const removeFromCart = (partId) => {
    setCart(cart.filter(item => item.id !== partId));
  };

  const updateQuantity = (partId, delta) => {
    setCart(cart.map(item => {
      if (item.id === partId) {
        const newQty = Math.max(1, item.quantity + delta);
        if (newQty > item.stockQuantity) {
          toast.error("Exceeds available stock!");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleSaveInvoice = async () => {
    if (!selectedCustomer) {
      toast.error("Please select a customer.");
      return;
    }
    if (!selectedVehicle) {
      toast.error("Please select a vehicle.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerId: selectedCustomer.id,
        vehicleId: selectedVehicle.id,
        status: status,
        items: cart.map(item => ({
          partId: item.id,
          quantity: item.quantity
        }))
      };
      
      const response = await axios.post('/api/invoices', payload);
      const invoiceData = response.data;
      setCreatedInvoice(invoiceData);
      
      toast.success("Invoice generated! Printing receipt...");

      // Wait for state update then print
      setTimeout(() => {
        window.print();
        navigate('/admin/sales');
      }, 1000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate invoice.");
    } finally {
      setLoading(false);
    }
  };

  const filteredParts = parts.filter(p => {
    const name = p.name ? p.name.toLowerCase() : '';
    const sku = p.sku ? p.sku.toLowerCase() : '';
    const query = searchPartQuery.toLowerCase();
    return name.includes(query) || sku.includes(query);
  });

  const filteredCustomers = customers.filter(c => {
    const name = c.fullName ? c.fullName.toLowerCase() : '';
    const phone = c.phone ? c.phone : '';
    const query = customerSearchQuery.toLowerCase();
    return name.includes(query) || phone.includes(query);
  });

  return (
    <div className="pos-container" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', height: 'calc(100vh - 100px)', gap: '1.5rem', padding: '1.5rem' }}>
      
      {/* Left Column: Selection Area */}
      <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
        
        {/* Step 1: Customer & Status */}
        <div className="table-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontWeight: '800', color: 'var(--ink)' }}>
            <User size={20} color="var(--brand)" /> 1. CUSTOMER & PAYMENT
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Search Customer</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Name or Phone..." 
                  style={{ paddingLeft: '2.5rem' }}
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                />
                {customerSearchQuery && (
                  <div className="dropdown-search" style={{ 
                    position: 'absolute', top: '100%', left: 0, width: '400px',
                    background: 'var(--surface)', border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius)', zIndex: 100, boxShadow: 'var(--shadow-xl)',
                    maxHeight: '350px', overflowY: 'auto'
                  }}>
                    {filteredCustomers.length === 0 ? (
                       <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--ink-soft)' }}>No customers found</div>
                    ) : filteredCustomers.map(c => (
                      <div 
                        key={c.id} 
                        className="dropdown-item" 
                        style={{ padding: '1rem', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                        onClick={() => { setSelectedCustomer(c); setCustomerSearchQuery(''); }}
                      >
                        <div style={{ fontWeight: '700', fontSize: '1rem' }}>{c.fullName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>{c.phone}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedCustomer && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--brand-light)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ fontWeight: '700', color: 'var(--brand)', fontSize: '0.9rem' }}>
                    {selectedCustomer.fullName}
                   </div>
                   <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCustomer(null)}><Trash2 size={14} /></button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Payment Status</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  type="button"
                  className={`btn btn-sm ${status === 2 ? 'btn-primary' : 'btn-ghost'}`} 
                  onClick={() => setStatus(2)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <CheckCircle size={14} /> Paid
                </button>
                <button 
                  type="button"
                  className={`btn btn-sm ${status === 1 ? 'btn-primary' : 'btn-ghost'}`} 
                  onClick={() => setStatus(1)}
                  style={{ flex: 1, justifyContent: 'center', background: status === 1 ? 'var(--warning)' : 'transparent', color: status === 1 ? '#fff' : 'inherit' }}
                >
                  <AlertCircle size={14} /> Pending
                </button>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Select Vehicle <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select 
              className="form-input" 
              disabled={!selectedCustomer}
              value={selectedVehicle?.id || ''}
              onChange={(e) => setSelectedVehicle(vehicles.find(v => v.id === parseInt(e.target.value)))}
              style={{ borderColor: !selectedVehicle && selectedCustomer ? 'var(--danger)' : 'var(--border)' }}
            >
              <option value="" disabled>Select vehicle...</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.licensePlate} ({v.make} {v.model})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 2: Parts Selection */}
        <div className="table-card" style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', color: 'var(--ink)' }}>
              <Package size={20} color="var(--brand)" /> 2. SELECT PARTS
            </div>
            <div className="search-box" style={{ width: '300px' }}>
              <Search size={16} color="var(--ink-soft)" />
              <input 
                type="text" 
                placeholder="Search by Part ID or Name..." 
                value={searchPartQuery}
                onChange={(e) => setSearchPartQuery(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', overflowY: 'auto' }}>
            {filteredParts.map(part => (
              <div 
                key={part.id} 
                className="grid-card" 
                style={{ cursor: 'pointer', border: '1px solid var(--border)' }}
                onClick={() => addToCart(part)}
              >
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.75rem', height: '2.4rem', overflow: 'hidden', color: 'var(--ink)' }}>{part.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--ink)' }}>Rs {part.price}</div>
                    <div style={{ fontSize: '0.75rem', color: part.stockQuantity < 10 ? 'var(--danger)' : 'var(--success)', fontWeight: '700' }}>
                      {part.stockQuantity} in stock
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Cart / Checkout */}
      <div className="table-card no-print" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'sticky', top: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--brand)', color: '#fff', borderRadius: 'var(--radius) var(--radius) 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800', fontSize: '1.2rem' }}>
            <ShoppingCart size={24} /> CART ITEMS
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--ink-soft)' }}>
              <ShoppingCart size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <p>Your cart is empty.<br/>Select parts on the left.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>Rs {item.price} x {item.quantity}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span style={{ fontWeight: '800', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--surface-2)', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span>Subtotal</span>
            <span style={{ fontWeight: '700' }}>Rs {subTotal.toFixed(2)}</span>
          </div>
          
          {loyaltyDiscount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--success)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Tag size={14} /> Loyalty Discount (10%)</span>
              <span style={{ fontWeight: '700' }}>- Rs {loyaltyDiscount.toFixed(2)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0', padding: '1rem 0', borderTop: '2px dashed var(--border)', fontSize: '1.3rem', fontWeight: '900', color: 'var(--ink)' }}>
            <span>Total</span>
            <span style={{ color: 'var(--brand)' }}>Rs {total.toFixed(2)}</span>
          </div>

          <button 
            className="btn btn-primary" 
            disabled={loading}
            style={{ 
              width: '100%', padding: '1rem', fontSize: '1.1rem', justifyContent: 'center',
              opacity: (cart.length === 0 || !selectedCustomer || !selectedVehicle) ? 0.7 : 1
            }}
            onClick={handleSaveInvoice}
          >
            {loading ? <div className="spinner" /> : <><CheckCircle size={20} style={{ marginRight: '8px' }} /> COMPLETE SALE</>}
          </button>
        </div>
      </div>

      {/* EXACT CLONE OF SALESMANAGEMENT VIEW UI - WITH FIXED CSS */}
      <div id="printable-invoice" className="print-only">
        {createdInvoice && (
          <div style={{ padding: '2rem', background: '#fff', color: '#000', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: '#d95d39' }}>AutoBolt</h1>
              <p style={{ color: '#666', margin: '2px 0', fontSize: '0.8rem' }}>Modern Vehicle Service Center</p>
              <p style={{ color: '#666', margin: '2px 0', fontSize: '0.75rem' }}>Kathmandu, Nepal</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '0.5rem 0', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Bill To</div>
                <div style={{ fontWeight: '800' }}>{createdInvoice.customerName}</div>
                <div style={{ fontSize: '0.8rem' }}>{createdInvoice.vehiclePlate}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Invoice</div>
                <div style={{ fontWeight: '800' }}>{createdInvoice.invoiceNumber}</div>
                <div style={{ fontSize: '0.8rem' }}>{new Date(createdInvoice.invoiceDate).toLocaleDateString()}</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #000' }}>
                  <th style={{ textAlign: 'left', paddingBottom: '0.5rem' }}>Item Description</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {createdInvoice.items?.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem 0' }}>
                      <div style={{ fontWeight: '700' }}>{item.partName}</div>
                      <div style={{ fontSize: '0.7rem', color: '#666' }}>@ Rs {item.unitPrice.toLocaleString()}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', fontWeight: '800' }}>Rs {item.subTotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginLeft: 'auto', width: '220px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: '700' }}>Rs {createdInvoice.subTotal.toLocaleString()}</span>
              </div>
              {createdInvoice.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', color: '#000' }}>
                  <span>Discount (10%)</span>
                  <span style={{ fontWeight: '700' }}>-Rs {createdInvoice.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid #000', marginTop: '0.5rem', fontWeight: '900', fontSize: '1.1rem' }}>
                <span>TOTAL</span>
                <span>Rs {createdInvoice.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '1.5rem', fontSize: '0.8rem' }}>
              <p style={{ margin: '1rem 0 0', fontWeight: '800' }}>Thank you for your business!</p>
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
          .print-only, .print-only div, .print-only table, .print-only tr, .print-only th, .print-only td, .print-only h1, .print-only p, .print-only span { 
            visibility: visible !important; 
          }
          .print-only { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important;
            display: block !important;
          }
          @page { margin: 1cm; }
        }
      `}</style>

    </div>
  );
}
