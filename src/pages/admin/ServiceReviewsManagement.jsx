import { useState, useEffect } from 'react';
import { Star, Search, Trash2, AlertCircle, Filter } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import NotificationDropdown from '../../components/NotificationDropdown';

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={14}
          fill={i <= rating ? '#f59e0b' : 'none'}
          color={i <= rating ? '#f59e0b' : '#d1d5db'}
        />
      ))}
    </div>
  );
}

const RATING_FILTERS = ['All', '5', '4', '3', '2', '1'];

export default function ServiceReviewsManagement({ onNavigate }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/reviews');
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    const t = toast.loading('Deleting review...');
    try {
      await api.delete(`/api/reviews/${id}`);
      toast.success('Review deleted.', { id: t });
      setDeleteConfirmId(null);
      fetchData();
    } catch {
      toast.error('Failed to delete.', { id: t });
    }
  };

  const displayed = reviews.filter(r => {
    const matchRating = ratingFilter === 'All' || r.rating === Number(ratingFilter);
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      r.customerName?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q);
    return matchRating && matchSearch;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <>
      <header className="top-header glass-card" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'var(--brand-light)', color: 'var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Star size={20} />
          </div>
          <div>
            <span className="page-title">Service Reviews</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
              Customer feedback — avg rating: {avgRating} / 5 ({reviews.length} total)
            </div>
          </div>
        </div>
        <div className="header-actions">
          <NotificationDropdown onNavigate={onNavigate} />
        </div>
      </header>

      <div className="page-content" style={{ animation: 'fadeUp 0.6s ease both' }}>
        <div className="table-card" style={{ boxShadow: 'var(--shadow-luxury)' }}>
          <div className="table-toolbar">
            <div className="search-box">
              <Search size={18} color="var(--ink-soft)" />
              <input
                type="text"
                placeholder="Search by customer or comment..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Filter size={16} color="var(--ink-soft)" />
              <select
                className="form-input"
                value={ratingFilter}
                onChange={e => setRatingFilter(e.target.value)}
                style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              >
                {RATING_FILTERS.map(r => (
                  <option key={r} value={r}>{r === 'All' ? 'All ratings' : `${r} star${r !== '1' ? 's' : ''}`}</option>
                ))}
              </select>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                {displayed.length} review{displayed.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /> Loading reviews...</div>
          ) : displayed.length === 0 ? (
            <div className="empty-state">
              <Star size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <h3>No reviews found</h3>
              <p>No reviews match your current filters.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Invoice</th>
                  <th>Visibility</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: '700' }}>{r.customerName || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <StarRating rating={r.rating} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: '600' }}>{r.rating}/5</span>
                      </div>
                    </td>
                    <td style={{
                      color: 'var(--ink-soft)', fontSize: '0.85rem',
                      maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {r.comment || <em style={{ opacity: 0.5 }}>No comment</em>}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                      {r.invoiceId ? `#${r.invoiceId}` : '—'}
                    </td>
                    <td>
                      <span style={{
                        padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700',
                        background: r.isPublic ? '#f0fdf4' : '#f9fafb',
                        color: r.isPublic ? '#16a34a' : '#6b7280',
                        border: `1px solid ${r.isPublic ? '#bbf7d0' : '#d1d5db'}`
                      }}>
                        {r.isPublic ? 'Public' : 'Hidden'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setDeleteConfirmId(r.id)}
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px', textAlign: 'center' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'var(--danger-light)', color: 'var(--danger)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
            }}>
              <AlertCircle size={24} />
            </div>
            <h3 className="modal-title" style={{ marginBottom: '0.5rem' }}>Delete Review?</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              This will permanently remove the customer review.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteConfirmId(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirmId)} style={{ flex: 1, justifyContent: 'center' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
