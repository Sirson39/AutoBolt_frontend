import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FileText, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

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
    <div style={{ minHeight: '100vh', background: 'var(--surface)', fontFamily: 'var(--font)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('customer')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={22} color="var(--primary)" />
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Service History</h1>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /> Loading history...</div>
        ) : invoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)' }}>
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
                <div key={inv.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <button
                    onClick={() => toggle(inv.id)}
                    style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}
                  >
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Invoice #{inv.invoiceNumber || inv.id}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                        {new Date(inv.invoiceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, background: sc.bg, color: sc.color }}>
                        {inv.status}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
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
                      {inv.discountAmount > 0 && (
                        <div style={{ marginTop: '0.75rem', textAlign: 'right', fontSize: '0.85rem', color: '#16a34a' }}>
                          Loyalty Discount: −Rs. {inv.discountAmount?.toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
