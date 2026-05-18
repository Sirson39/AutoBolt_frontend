import React, { useState, useEffect } from 'react';
import { Wrench, Search, Trash2, AlertCircle, X, Filter, ChevronDown } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import NotificationDropdown from '../../components/NotificationDropdown';
import { exportToCSV } from '../../utils/exportUtils';
import { ArrowLeft, ArrowRight, FileSpreadsheet } from 'lucide-react';

const HighlightText = ({ text, highlight }) => {
  if (!highlight?.trim() || !text) return <span>{text || '—'}</span>;
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

const STATUS_STYLES = {
  Pending:      { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  Acknowledged: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  Fulfilled:    { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  Rejected:     { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`
    }}>
      {status}
    </span>
  );
}

const STATUSES = ['All', 'Pending', 'Acknowledged', 'Fulfilled', 'Rejected'];
const STATUS_VALUES = { Pending: 0, Acknowledged: 1, Fulfilled: 2, Rejected: 3 };
const NEXT_STATUSES = {
  Pending: ['Acknowledged', 'Rejected'],
  Acknowledged: ['Fulfilled', 'Rejected'],
  Fulfilled: [],
  Rejected: [],
};

export default function PartRequestsManagement({ onNavigate }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/part-requests');
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load part requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusUpdate = async (id, statusName) => {
    const t = toast.loading('Updating...');
    try {
      await api.patch(`/api/part-requests/${id}/status`, { status: STATUS_VALUES[statusName] });
      toast.success(`Marked as ${statusName}.`, { id: t });
      fetchData();
    } catch {
      toast.error('Failed to update status.', { id: t });
    }
  };

  const handleDelete = async (id) => {
    const t = toast.loading('Deleting...');
    try {
      await api.delete(`/api/part-requests/${id}`);
      toast.success('Request deleted.', { id: t });
      setDeleteConfirmId(null);
      fetchData();
    } catch {
      toast.error('Failed to delete.', { id: t });
    }
  };

  let displayed = requests.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      (r.partName || '').toLowerCase().includes(q) ||
      (r.customerName || '').toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(displayed.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = displayed.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <header className="top-header glass-card" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'var(--brand-light)', color: 'var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Wrench size={20} />
          </div>
          <div>
            <span className="page-title">Part Requests</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
              Customer requests for parts — acknowledge, fulfil, or reject
            </div>
          </div>
        </div>
        <div className="header-actions">
          <NotificationDropdown onNavigate={onNavigate} />
          <button className="btn btn-ghost" onClick={() => exportToCSV(requests, 'Part_Requests')} style={{ borderRadius: 'var(--radius-sm)' }}>
            <FileSpreadsheet size={18} /> Export CSV
          </button>
        </div>
      </header>

      <div className="page-content" style={{ animation: 'fadeUp 0.6s ease both' }}>
        <div className="table-card" style={{ boxShadow: 'var(--shadow-luxury)' }}>
          <div className="table-toolbar">
            <div className="search-box">
              <Search size={18} color="var(--ink-soft)" />
              <input
                type="text"
                placeholder="Search by part name, customer, description..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Filter size={16} color="var(--ink-soft)" />
              <select
                className="form-input"
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                {displayed.length} request{displayed.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /> Loading part requests...</div>
          ) : displayed.length === 0 ? (
            <div className="empty-state">
              <Wrench size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <h3>No requests found</h3>
              <p>No part requests match your current filters.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Part</th>
                  <th>Customer</th>
                  <th>Qty</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.map(r => (
                  <tr key={r.id} style={{ transition: 'all 0.2s ease' }}>
                    <td style={{ fontWeight: '800' }}><HighlightText text={r.partName} highlight={searchQuery} /></td>
                    <td style={{ fontWeight: '600' }}><HighlightText text={r.customerName} highlight={searchQuery} /></td>
                    <td>{r.quantity}</td>
                    <td style={{
                      color: 'var(--ink-soft)', fontSize: '0.85rem',
                      maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      <HighlightText text={r.description} highlight={searchQuery} />
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {(NEXT_STATUSES[r.status] || []).map(next => (
                          <button
                            key={next}
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleStatusUpdate(r.id, next)}
                            style={{
                              fontSize: '0.75rem',
                              color: STATUS_STYLES[next]?.color,
                              border: `1px solid ${STATUS_STYLES[next]?.border}`
                            }}
                          >
                            {next}
                          </button>
                        ))}
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setDeleteConfirmId(r.id)}
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {displayed.length > 0 && (
            <div className="pagination" style={{ borderTop: '1px solid var(--border)', padding: '1.25rem 1.5rem', background: 'var(--surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                Showing <span style={{ color: 'var(--ink)' }}>{indexOfFirstItem + 1}</span> to <span style={{ color: 'var(--ink)' }}>{Math.min(indexOfLastItem, displayed.length)}</span> of {displayed.length}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{ borderRadius: '8px', padding: '0.5rem 1rem' }}
                >
                  <ArrowLeft size={14} style={{ marginRight: '6px' }} /> Prev
                </button>
                
                {totalPages > 1 && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: 'none',
                          background: currentPage === page ? 'var(--brand)' : 'transparent',
                          color: currentPage === page ? '#fff' : 'var(--ink-soft)',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {page}
                      </button>
                    )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                  </div>
                )}

                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  style={{ borderRadius: '8px', padding: '0.5rem 1rem' }}
                >
                  Next <ArrowRight size={14} style={{ marginLeft: '6px' }} />
                </button>
              </div>
            </div>
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
            <h3 className="modal-title" style={{ marginBottom: '0.5rem' }}>Delete Request?</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              This action cannot be undone.
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
