import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Wrench, Plus, ArrowLeft } from 'lucide-react';

const STATUS_COLORS = {
  Pending:      { bg: '#fef9c3', color: '#854d0e', border: '#fde047' },
  Acknowledged: { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
  Fulfilled:    { bg: '#dcfce7', color: '#166534', border: '#86efac' },
  Rejected:     { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
};

const EMPTY_FORM = { partName: '', description: '', quantity: 1 };

export default function MyPartRequests({ onNavigate }) {
  const user = getUser();
  const customerId = user?.customerId || user?.id;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/part-requests/customer/${customerId}`);
        setRequests(res.data);
      } catch {
        toast.error('Failed to load part requests');
      } finally {
        setLoading(false);
      }
    };
    if (customerId) load();
    else setLoading(false);
  }, [customerId]);

  const openModal = () => { setForm(EMPTY_FORM); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.partName.trim()) { toast.error('Part name is required'); return; }
    setSaving(true);
    const t = toast.loading('Submitting...');
    try {
      const res = await api.post('/api/part-requests', {
        partName: form.partName.trim(),
        description: form.description || null,
        quantity: parseInt(form.quantity) || 1,
        customerId,
      });
      setRequests(prev => [res.data, ...prev]);
      toast.success('Request submitted', { id: t });
      closeModal();
    } catch {
      toast.error('Failed to submit request', { id: t });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', fontFamily: 'var(--font)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('customer')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Wrench size={22} color="var(--primary)" />
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Part Requests</h1>
          </div>
          <button className="btn btn-primary" onClick={openModal} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> Request a Part
          </button>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /> Loading requests...</div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)' }}>
            <Wrench size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No part requests yet. Request a part that's unavailable in our inventory.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Part Name</th>
                  <th>Qty</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => {
                  const sc = STATUS_COLORS[r.status] || STATUS_COLORS.Pending;
                  return (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.partName}</td>
                      <td>{r.quantity}</td>
                      <td style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>{r.description || '—'}</td>
                      <td>
                        <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--ink-soft)', fontSize: '0.85rem' }}>{new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.15rem', fontWeight: 800 }}>Request a Part</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Part Name *</label>
                <input className="input" value={form.partName} onChange={e => setForm(p => ({ ...p, partName: e.target.value }))} placeholder="e.g. Front brake pads" required style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Quantity</label>
                <input type="number" className="input" min={1} max={100} value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Additional Details</label>
                <textarea className="input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Vehicle model, part number, urgency..." style={{ width: '100%', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
