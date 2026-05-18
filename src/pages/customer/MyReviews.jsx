import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Star, Plus, ArrowLeft, X } from 'lucide-react';

const EMPTY_FORM = { rating: 5, comment: '', invoiceId: '' };

function StarPicker({ value, onChange }) {
  const getRatingLabel = (v) => {
    switch (v) {
      case 5: return 'Excellent 🌟';
      case 4: return 'Very Good 👍';
      case 3: return 'Good 🙂';
      case 2: return 'Fair 😐';
      case 1: return 'Poor 😞';
      default: return '';
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface-2)', padding: '0.6rem 1rem', borderRadius: '10px', width: 'fit-content', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button 
            key={n} 
            type="button" 
            onClick={() => onChange(n)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, transition: 'transform 0.15s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Star size={26} fill={n <= value ? '#f59e0b' : 'none'} color={n <= value ? '#f59e0b' : '#cbd5e1'} style={{ transition: 'all 0.2s' }} />
          </button>
        ))}
      </div>
      <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--ink-soft)', minWidth: '95px' }}>
        {getRatingLabel(value)}
      </span>
    </div>
  );
}

export default function MyReviews({ onNavigate }) {
  const user = getUser();
  const customerId = user?.customerId || user?.id;

  const [reviews, setReviews] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [revRes, invRes] = await Promise.all([
          api.get(`/api/reviews/customer/${customerId}`),
          api.get('/api/invoices'),
        ]);
        setReviews(revRes.data);
        const myInvoices = invRes.data.filter(i => String(i.customerId) === String(customerId));
        setInvoices(myInvoices);
      } catch {
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    if (customerId) load();
    else setLoading(false);
  }, [customerId]);

  useEffect(() => {
    if (invoices.length > 0) {
      const hash = window.location.hash;
      const match = hash.match(/invoiceId=(\d+)/);
      if (match && match[1]) {
        const invId = match[1];
        setForm({ rating: 5, comment: '', invoiceId: invId });
        setShowModal(true);
        window.location.hash = '#customer-reviews';
      }
    }
  }, [invoices]);

  const openModal = () => { setForm(EMPTY_FORM); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    const t = toast.loading('Submitting...');
    try {
      const res = await api.post('/api/reviews', {
        rating: form.rating,
        comment: form.comment || null,
        customerId,
        invoiceId: form.invoiceId ? parseInt(form.invoiceId) : null,
      });
      setReviews(prev => [res.data, ...prev]);
      toast.success('Review submitted', { id: t });
      closeModal();
    } catch {
      toast.error('Failed to submit review', { id: t });
    } finally {
      setSaving(false);
    }
  };

  const renderStars = rating => (
    <span style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={14} fill={n <= rating ? '#f59e0b' : 'none'} color={n <= rating ? '#f59e0b' : '#d1d5db'} />
      ))}
    </span>
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingLeft: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>My Reviews</h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: '600' }}>Share your feedback, rate past service invoices, and view ratings</span>
          </div>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={openModal} 
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: 'var(--radius-sm)' }}
        >
          <Plus size={16} /> Write a Review
        </button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)', background: '#fff', borderRadius: 14, border: '1px solid var(--border)' }}>
          <Star size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No reviews yet. Share your experience with our service.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: '#fff', borderRadius: 14, padding: '1.25rem 1.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {renderStars(r.rating)}
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.rating}/5</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: r.isPublic ? '#dcfce7' : '#f3f4f6', color: r.isPublic ? '#166534' : '#6b7280' }}>
                      {r.isPublic ? 'Public' : 'Hidden'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>{new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                {r.comment && <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '0.9rem' }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480, boxShadow: 'var(--shadow-luxury)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Star size={18} color="var(--brand)" fill="var(--brand)" />
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)' }}>Write a Review</h2>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={closeModal} style={{ padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ marginBottom: '0.5rem' }}>Service Rating *</label>
                <StarPicker value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
              </div>
              
              <div className="form-group">
                <label className="form-label">Review Comment</label>
                <textarea 
                  className="form-input" 
                  rows={4} 
                  value={form.comment} 
                  onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} 
                  placeholder="Tell us about your experience, the quality of repair, or our staff..." 
                  style={{ resize: 'vertical' }} 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Related Invoice (optional)</label>
                <select 
                  className="form-input" 
                  value={form.invoiceId} 
                  onChange={e => setForm(p => ({ ...p, invoiceId: e.target.value }))}
                >
                  <option value="">Select Invoice (None)</option>
                  {invoices.map(i => (
                    <option key={i.id} value={i.id}>Invoice #{i.invoiceNumber || i.id} — {new Date(i.invoiceDate).toLocaleDateString('en-GB')}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
