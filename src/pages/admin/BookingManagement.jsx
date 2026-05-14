import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, Search, Trash2, AlertCircle, X, CheckCircle, Clock, XCircle, PlayCircle, Filter } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import NotificationDropdown from '../../components/NotificationDropdown';

const STATUS_COLORS = {
  Pending:    { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  Confirmed:  { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  InProgress: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  Completed:  { bg: '#f9fafb', color: '#374151', border: '#d1d5db' },
  Cancelled:  { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

const STATUS_ICONS = {
  Pending:    <Clock size={12} />,
  Confirmed:  <CheckCircle size={12} />,
  InProgress: <PlayCircle size={12} />,
  Completed:  <CheckCircle size={12} />,
  Cancelled:  <XCircle size={12} />,
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`
    }}>
      {STATUS_ICONS[status]} {status}
    </span>
  );
}

const STATUSES = ['All', 'Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled'];

const STATUS_VALUES = { Pending: 0, Confirmed: 1, InProgress: 2, Completed: 3, Cancelled: 4 };

export default function BookingManagement({ onNavigate }) {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formData, setFormData] = useState({
    customerId: '',
    vehicleId: '',
    serviceDate: '',
    description: ''
  });
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, customersRes, vehiclesRes] = await Promise.all([
        api.get('/api/bookings'),
        api.get('/api/customers'),
        api.get('/api/vehicles'),
      ]);
      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      setCustomers(Array.isArray(customersRes.data) ? customersRes.data : []);
      setVehicles(Array.isArray(vehiclesRes.data) ? vehiclesRes.data : []);
    } catch {
      toast.error('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!formData.customerId) {
      setFilteredVehicles([]);
      return;
    }
    setFilteredVehicles(vehicles.filter(v => v.customerId === Number(formData.customerId)));
  }, [formData.customerId, vehicles]);

  const openModal = () => {
    setFormData({ customerId: '', vehicleId: '', serviceDate: '', description: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const t = toast.loading('Creating booking...');
    try {
      await api.post('/api/bookings', {
        customerId: Number(formData.customerId),
        vehicleId: Number(formData.vehicleId),
        serviceDate: formData.serviceDate,
        description: formData.description || null
      });
      toast.success('Booking created.', { id: t });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking.', { id: t });
    }
  };

  const handleStatusUpdate = async (id, statusName) => {
    const t = toast.loading('Updating status...');
    try {
      await api.patch(`/api/bookings/${id}/status`, { status: STATUS_VALUES[statusName] });
      toast.success(`Status set to ${statusName}.`, { id: t });
      fetchData();
    } catch {
      toast.error('Failed to update status.', { id: t });
    }
  };

  const handleDelete = async (id) => {
    const t = toast.loading('Deleting booking...');
    try {
      await api.delete(`/api/bookings/${id}`);
      toast.success('Booking deleted.', { id: t });
      setDeleteConfirmId(null);
      fetchData();
    } catch {
      toast.error('Failed to delete booking.', { id: t });
    }
  };

  const displayed = bookings.filter(b => {
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      b.customerName?.toLowerCase().includes(q) ||
      b.vehiclePlate?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const nextStatuses = {
    Pending: ['Confirmed', 'Cancelled'],
    Confirmed: ['InProgress', 'Cancelled'],
    InProgress: ['Completed', 'Cancelled'],
    Completed: [],
    Cancelled: [],
  };

  return (
    <>
      <header className="top-header glass-card" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'var(--brand-light)', color: 'var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <CalendarDays size={20} />
          </div>
          <div>
            <span className="page-title">Booking Management</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
              Schedule and track service appointments
            </div>
          </div>
        </div>
        <div className="header-actions">
          <NotificationDropdown onNavigate={onNavigate} />
          <button className="btn btn-primary" onClick={openModal}>
            <Plus size={18} /> New Booking
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
                placeholder="Search by customer, plate, or description..."
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
                {displayed.length} booking{displayed.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /> Loading bookings...</div>
          ) : displayed.length === 0 ? (
            <div className="empty-state">
              <CalendarDays size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <h3>No bookings found</h3>
              <p>Try adjusting your filters or create a new booking.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Service Date</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: '700' }}>{b.customerName || '—'}</td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '0.9rem' }}>
                        {b.vehiclePlate || '—'}
                      </span>
                    </td>
                    <td>{new Date(b.serviceDate).toLocaleDateString()}</td>
                    <td style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {b.description || '—'}
                    </td>
                    <td><StatusBadge status={b.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
                        {(nextStatuses[b.status] || []).map(next => (
                          <button
                            key={next}
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleStatusUpdate(b.id, next)}
                            style={{
                              fontSize: '0.75rem',
                              color: STATUS_COLORS[next]?.color,
                              border: `1px solid ${STATUS_COLORS[next]?.border}`
                            }}
                          >
                            {next}
                          </button>
                        ))}
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setDeleteConfirmId(b.id)}
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
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="modal-title">New Booking</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Customer *</label>
                <select
                  className="form-input"
                  value={formData.customerId}
                  onChange={e => setFormData(p => ({ ...p, customerId: e.target.value, vehicleId: '' }))}
                  required
                >
                  <option value="">Select customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName} — {c.phone}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle *</label>
                <select
                  className="form-input"
                  value={formData.vehicleId}
                  onChange={e => setFormData(p => ({ ...p, vehicleId: e.target.value }))}
                  required
                  disabled={!formData.customerId}
                >
                  <option value="">{formData.customerId ? 'Select vehicle...' : 'Select customer first'}</option>
                  {filteredVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.licensePlate} — {v.make} {v.model}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Service Date *</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formData.serviceDate}
                  onChange={e => setFormData(p => ({ ...p, serviceDate: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Service details, notes..."
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Booking</button>
              </div>
            </form>
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
            <h3 className="modal-title" style={{ marginBottom: '0.5rem' }}>Delete Booking?</h3>
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
