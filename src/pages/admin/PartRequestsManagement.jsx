import React, { useState, useEffect } from 'react';
import { Wrench, Search, Trash2, AlertCircle, X, Filter, ChevronDown, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import NotificationDropdown from '../../components/NotificationDropdown';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [viewRequest, setViewRequest] = useState(null);

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

  const displayed = requests.filter(r => {
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      r.partName?.toLowerCase().includes(q) ||
      r.customerName?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
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
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Filter size={16} color="var(--ink-soft)" />
              <select
                className="form-input"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
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
                  <tr key={r.id}>
                    <td style={{ fontWeight: '800' }}>{r.partName}</td>
                    <td style={{ fontWeight: '600' }}>{r.customerName || '—'}</td>
                    <td>{r.quantity}</td>
                    <td style={{
                      color: 'var(--ink-soft)', fontSize: '0.85rem',
                      maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {r.description || '—'}
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
                          onClick={() => setViewRequest(r)}
                          style={{ color: 'var(--brand)' }}
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, displayed.length)} of {displayed.length}
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
        </div>
      </div>

      {viewRequest && (
        <div className="modal-overlay" onClick={() => setViewRequest(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wrench size={20} color="var(--brand)" /> Request Details
              </h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewRequest(null)}><X size={18} /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ color: 'var(--ink-soft)', fontWeight: '600' }}>Part Name:</div>
              <div style={{ fontWeight: '700' }}>{viewRequest.partName}</div>
              
              <div style={{ color: 'var(--ink-soft)', fontWeight: '600' }}>Customer:</div>
              <div>{viewRequest.customerName || '—'}</div>
              
              <div style={{ color: 'var(--ink-soft)', fontWeight: '600' }}>Quantity:</div>
              <div>{viewRequest.quantity}</div>
              
              <div style={{ color: 'var(--ink-soft)', fontWeight: '600' }}>Date:</div>
              <div>{new Date(viewRequest.createdAt).toLocaleString()}</div>
              
              <div style={{ color: 'var(--ink-soft)', fontWeight: '600' }}>Status:</div>
              <div><StatusBadge status={viewRequest.status} /></div>
              
              <div style={{ color: 'var(--ink-soft)', fontWeight: '600' }}>Description:</div>
              <div style={{ background: 'var(--surface-2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', lineHeight: '1.5' }}>
                {viewRequest.description || 'No description provided.'}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setViewRequest(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

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
