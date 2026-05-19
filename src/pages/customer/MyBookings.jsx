import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { CalendarDays, Plus, ArrowLeft, Search, ArrowRight } from 'lucide-react';

const STATUS_COLORS = {
  Pending:     { bg: '#fef9c3', color: '#854d0e', border: '#fde047' },
  Confirmed:   { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
  InProgress:  { bg: '#ede9fe', color: '#5b21b6', border: '#c4b5fd' },
  Completed:   { bg: '#dcfce7', color: '#166534', border: '#86efac' },
  Cancelled:   { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
};

const EMPTY_FORM = { serviceDate: '', vehicleId: '', description: '' };

export default function MyBookings({ onNavigate }) {
  const user = getUser();
  const customerId = user?.customerId || user?.id;

  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
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
        const [bookRes, vehRes] = await Promise.all([
          api.get(`/api/bookings/customer/${customerId}`),
          api.get(`/api/vehicles/customer/${customerId}`),
        ]);
        setBookings(bookRes.data);
        setVehicles(vehRes.data);
      } catch {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    if (customerId) load();
    else setLoading(false);
  }, [customerId]);

  const openModal = () => { setForm(EMPTY_FORM); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const filteredBookings = bookings.filter(b => {
    const q = searchQuery.toLowerCase();
    return !q ||
      b.vehiclePlate?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      new Date(b.serviceDate).toLocaleDateString('en-GB').toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.serviceDate || !form.vehicleId) {
      toast.error('Service date and vehicle are required');
      return;
    }
    setSaving(true);
    const t = toast.loading('Booking...');
    try {
      const res = await api.post('/api/bookings', {
        serviceDate: form.serviceDate,
        vehicleId: parseInt(form.vehicleId),
        customerId,
        description: form.description || null,
      });
      setBookings(prev => [res.data, ...prev]);
      toast.success('Booking submitted', { id: t });
      closeModal();
    } catch {
      toast.error('Failed to submit booking', { id: t });
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
            <CalendarDays size={22} color="var(--primary)" />
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>My Bookings</h1>
          </div>
          <button className="btn btn-primary" onClick={openModal} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> Book Appointment
          </button>
        </div>

        {bookings.length > 0 && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', color: 'var(--ink-soft)' }} />
              <input
                type="text"
                placeholder="Search by vehicle, date, or description..."
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
          <div className="loading"><div className="spinner" /> Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)' }}>
            <CalendarDays size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No bookings yet. Book your first appointment above.</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)' }}>
            <CalendarDays size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No bookings match your search.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Vehicle</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map(b => {
                  const sc = STATUS_COLORS[b.status] || STATUS_COLORS.Pending;
                  return (
                    <tr key={b.id}>
                      <td>{new Date(b.serviceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td>{b.vehiclePlate}</td>
                      <td style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>{b.description || '—'}</td>
                      <td>
                        <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredBookings.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                  Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredBookings.length)} of {filteredBookings.length}
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
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.15rem', fontWeight: 800 }}>Book an Appointment</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Service Date *</label>
                <input type="datetime-local" className="input" value={form.serviceDate} onChange={e => setForm(p => ({ ...p, serviceDate: e.target.value }))} required style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Vehicle *</label>
                <select className="input" value={form.vehicleId} onChange={e => setForm(p => ({ ...p, vehicleId: e.target.value }))} required style={{ width: '100%' }}>
                  <option value="">Select vehicle...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.licensePlate} — {v.make} {v.model}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Description</label>
                <textarea className="input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the issue or service needed..." style={{ width: '100%', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>Submit Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
