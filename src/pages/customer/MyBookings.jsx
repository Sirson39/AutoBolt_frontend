import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { CalendarDays, Plus, X, AlertCircle, Clock, CheckCircle, PlayCircle, XCircle, Car } from 'lucide-react';

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

const EMPTY_FORM = { serviceDate: '', vehicleId: '', description: '' };

export default function MyBookings({ onNavigate }) {
  const user = getUser();
  const customerId = user?.customerId;

  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadData = async () => {
    try {
      const [bookRes, vehRes] = await Promise.all([
        api.get(`/api/bookings/customer/${customerId}`),
        api.get(`/api/vehicles/customer/${customerId}`),
      ]);
      setBookings(Array.isArray(bookRes.data) ? bookRes.data : []);
      setVehicles(Array.isArray(vehRes.data) ? vehRes.data : []);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) loadData();
    else setLoading(false);
  }, [customerId]);

  const openModal = () => { setForm(EMPTY_FORM); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.serviceDate || !form.vehicleId) {
      toast.error('Service date and vehicle are required');
      return;
    }
    setSaving(true);
    const t = toast.loading('Creating booking...');
    try {
      await api.post('/api/bookings', {
        serviceDate: form.serviceDate,
        vehicleId: parseInt(form.vehicleId),
        customerId,
        description: form.description || null,
      });
      toast.success('Appointment booked successfully!', { id: t });
      closeModal();
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit booking', { id: t });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const t = toast.loading('Cancelling booking...');
    try {
      await api.delete(`/api/bookings/${id}`);
      toast.success('Booking cancelled.', { id: t });
      setDeleteConfirmId(null);
      loadData();
    } catch {
      toast.error('Failed to cancel booking.', { id: t });
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      {/* Page Header — aligned like vehicles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingLeft: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarDays size={20} />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>My Bookings</h1>
        </div>
        <button className="btn btn-primary" onClick={openModal} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={16} /> Book Appointment
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading"><div className="spinner" /> Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)', background: '#fff', borderRadius: 14, border: '1px solid var(--border)' }}>
          <CalendarDays size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No bookings yet. Book your first appointment above.</p>
        </div>
      ) : (
        <div className="table-card" style={{ boxShadow: 'var(--shadow-luxury)', border: '1px solid rgba(255,255,255,0.4)' }}>
          <table>
            <thead>
              <tr>
                <th>Service Date</th>
                <th>Vehicle</th>
                <th>Description</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{ transition: 'all 0.2s ease' }}>
                  <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {new Date(b.serviceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '0.9rem' }}>
                      {b.vehiclePlate}
                    </span>
                  </td>
                  <td style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {b.description || '—'}
                  </td>
                  <td><StatusBadge status={b.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    {b.status !== 'Completed' && b.status !== 'Cancelled' && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setDeleteConfirmId(b.id)}
                        style={{ color: 'var(--danger)' }}
                        title="Cancel Booking"
                      >
                        <XCircle size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Book Appointment Modal — admin-style */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Book an Appointment</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal} style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Vehicle selector */}
              <div className="form-group">
                <label className="form-label">Vehicle *</label>
                <select
                  className="form-input"
                  value={form.vehicleId}
                  onChange={e => setForm(p => ({ ...p, vehicleId: e.target.value }))}
                  required
                >
                  <option value="">
                    {vehicles.length === 0 ? 'No vehicles registered — add one first' : 'Select your vehicle...'}
                  </option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.licensePlate} — {v.make} {v.model} ({v.year})
                    </option>
                  ))}
                </select>
                {vehicles.length === 0 && (
                  <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Car size={13} />
                    <span>Please <button type="button" onClick={() => { closeModal(); onNavigate('customer-vehicles'); }} style={{ background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer', fontWeight: 700, padding: 0 }}>register a vehicle</button> first.</span>
                  </div>
                )}
              </div>

              {/* Service Date */}
              <div className="form-group">
                <label className="form-label">Service Date & Time *</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={form.serviceDate}
                  onChange={e => setForm(p => ({ ...p, serviceDate: e.target.value }))}
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Describe the issue or service needed..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving || vehicles.length === 0}>
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px', textAlign: 'center' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: '#fee2e2', color: '#dc2626',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
            }}>
              <AlertCircle size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', fontWeight: 800 }}>Cancel Booking?</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Are you sure you want to cancel this booking? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteConfirmId(null)} style={{ flex: 1, justifyContent: 'center' }}>Keep it</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirmId)} style={{ flex: 1, justifyContent: 'center' }}>Cancel Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
