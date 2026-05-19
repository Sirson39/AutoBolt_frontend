import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FileText, ChevronDown, ChevronUp, ArrowLeft, Star } from 'lucide-react';

const STATUS_COLORS = {
  Paid:    { bg: '#dcfce7', color: '#166534' },
  Pending: { bg: '#fef9c3', color: '#854d0e' },
  Overdue: { bg: '#fee2e2', color: '#991b1b' },
};

export default function MyServiceHistory({ onNavigate }) {
  const user = getUser();
  const customerId = user?.customerId || user?.id;

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/invoices');
        const mine = res.data.filter(i => String(i.customerId) === String(customerId));
        mine.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));
        setInvoices(mine);
      } catch {
        toast.error('Failed to load service history');
      } finally {
        setLoading(false);
      }
    };
    if (customerId) load();
    else setLoading(false);
  }, [customerId]);

  const toggle = id => setExpanded(prev => (prev === id ? null : id));

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingLeft: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Service History</h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: '600' }}>View past invoice records, billing breakdowns, and service details</span>
          </div>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
          {invoices.length} Invoice{invoices.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Loading history...</div>
      ) : invoices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)', background: '#fff', borderRadius: 14, border: '1px solid var(--border)' }}>
          <FileText size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No service history yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {invoices.map(inv => {
            const sc = STATUS_COLORS[inv.status] || STATUS_COLORS.Pending;
            const isOpen = expanded === inv.id;
            const itemCount = inv.items?.length || 0;
            return (
              <div key={inv.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                  <button
                    onClick={() => toggle(inv.id)}
                    style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}
                  >
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginRight: '3rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--ink)' }}>Invoice #{inv.invoiceNumber || inv.id}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                        {new Date(inv.invoiceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span style={{ 
                        padding: '3px 12px', borderRadius: 99, fontSize: '0.72rem', fontWeight: '800', 
                        background: sc.bg, color: sc.color, border: '1px solid currentColor',
                        textTransform: 'uppercase', letterSpacing: '0.5px' 
                      }}>
                        {inv.status}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>{itemCount} Item{itemCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem' }}>Rs. {(inv.totalAmount || 0).toLocaleString()}</span>
                      {isOpen ? <ChevronUp size={18} color="#6b7280" /> : <ChevronDown size={18} color="#6b7280" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ borderTop: '1px solid #f3f4f6', padding: '1rem 1.25rem' }}>
                      {!inv.items || inv.items.length === 0 ? (
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-soft)' }}>No item details available.</p>
                      ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem', color: 'var(--ink-soft)', fontWeight: 600 }}>Part</th>
                              <th style={{ textAlign: 'right', padding: '0.4rem 0.5rem', color: 'var(--ink-soft)', fontWeight: 600 }}>Qty</th>
                              <th style={{ textAlign: 'right', padding: '0.4rem 0.5rem', color: 'var(--ink-soft)', fontWeight: 600 }}>Unit Price</th>
                              <th style={{ textAlign: 'right', padding: '0.4rem 0.5rem', color: 'var(--ink-soft)', fontWeight: 600 }}>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inv.items.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #f9fafb' }}>
                                <td style={{ padding: '0.45rem 0.5rem' }}>{item.partName || item.part?.name || '—'}</td>
                                <td style={{ padding: '0.45rem 0.5rem', textAlign: 'right' }}>{item.quantity}</td>
                                <td style={{ padding: '0.45rem 0.5rem', textAlign: 'right' }}>Rs. {(item.unitPrice || 0).toLocaleString()}</td>
                                <td style={{ padding: '0.45rem 0.5rem', textAlign: 'right', fontWeight: 600 }}>Rs. {(item.subTotal || item.subtotal || 0).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border)' }}>
                        {inv.status === 'Paid' ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate(`customer-reviews?invoiceId=${inv.id}`);
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: '0.8rem', fontWeight: '800', borderRadius: 'var(--radius-sm)' }}
                          >
                            <Star size={14} fill="var(--brand)" color="var(--brand)" /> Review This Service
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                            * Pay this invoice to submit a service review
                          </span>
                        )}
                        
                        {inv.discountAmount > 0 && (
                          <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: '700' }}>
                            Loyalty Discount: −Rs. {inv.discountAmount?.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
