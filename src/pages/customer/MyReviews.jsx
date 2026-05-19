import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Star, Plus, ArrowLeft, Search, ArrowRight } from 'lucide-react';

const EMPTY_FORM = { rating: 5, comment: '', invoiceId: '' };

function StarPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
          <Star size={26} fill={n <= value ? '#f59e0b' : 'none'} color={n <= value ? '#f59e0b' : '#d1d5db'} />
        </button>
      ))}
    </div>
  );
}

export default function MyReviews({ onNavigate }) {
  const user = getUser();
  const customerId = user?.customerId || user?.id;

  const [reviews, setReviews] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
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

  const openModal = () => { setForm(EMPTY_FORM); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const filteredReviews = reviews.filter(r => {
    const q = searchQuery.toLowerCase();
    return !q ||
      r.comment?.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);

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
    <div style={{ minHeight: '100vh', background: 'var(--surface)', fontFamily: 'var(--font)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('customer')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Star size={22} color="var(--primary)" />
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>My Reviews</h1>
          </div>
          <button className="btn btn-primary" onClick={openModal} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> Write a Review
          </button>
        </div>

        {reviews.length > 0 && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', color: 'var(--ink-soft)' }} />
              <input
                type="text"
                placeholder="Search by comment..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ flex: 1, border: 'none', outline: 'none', padding: '0.7rem 0.75rem 0.7rem 2.4rem', borderRadius: 8, fontSize: '0.9rem' }}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading"><div className="spinner" /> Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)' }}>
            <Star size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No reviews yet. Share your experience with our service.</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)' }}>
            <Star size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No reviews match your search.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentReviews.map(r => (
              <div key={r.id} style={{ background: '#fff', borderRadius: 12, padding: '1.25rem 1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
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
          {filteredReviews.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', marginTop: '1rem', background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredReviews.length)} of {filteredReviews.length}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{ padding: '0.4rem 0.6rem' }}
                >
                  <ArrowLeft size={16} />
                </button>
                <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{ padding: '0.4rem 0.6rem' }}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.15rem', fontWeight: 800 }}>Write a Review</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.6rem' }}>Rating *</label>
                <StarPicker value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Comment</label>
                <textarea className="input" rows={4} value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} placeholder="Tell us about your experience..." style={{ width: '100%', resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Related Invoice (optional)</label>
                <select className="input" value={form.invoiceId} onChange={e => setForm(p => ({ ...p, invoiceId: e.target.value }))} style={{ width: '100%' }}>
                  <option value="">None</option>
                  {invoices.map(i => (
                    <option key={i.id} value={i.id}>Invoice #{i.invoiceNumber || i.id} — {new Date(i.invoiceDate).toLocaleDateString('en-GB')}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
