import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Car, Plus, ArrowLeft, Search, ArrowRight } from 'lucide-react';

const PLATE_TYPES = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Commercial' },
  { value: 2, label: 'Government' },
];

const EMPTY_FORM = { licensePlate: '', make: '', model: '', year: new Date().getFullYear(), mileage: 0, plateType: 0 };

export default function MyVehicles({ onNavigate }) {
  const user = getUser();
  const customerId = user?.customerId || user?.id;

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
        const res = await api.get(`/api/vehicles/customer/${customerId}`);
        setVehicles(res.data);
      } catch {
        toast.error('Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };
    if (customerId) load();
    else setLoading(false);
  }, [customerId]);

  const openModal = () => { setForm(EMPTY_FORM); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const filteredVehicles = vehicles.filter(v => {
    const q = searchQuery.toLowerCase();
    return !q ||
      v.licensePlate?.toLowerCase().includes(q) ||
      v.make?.toLowerCase().includes(q) ||
      v.model?.toLowerCase().includes(q) ||
      String(v.year).includes(q);
  });

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.licensePlate.trim() || !form.make.trim() || !form.model.trim()) {
      toast.error('License plate, make, and model are required');
      return;
    }
    setSaving(true);
    const t = toast.loading('Adding vehicle...');
    try {
      const res = await api.post('/api/vehicles', {
        licensePlate: form.licensePlate.trim().toUpperCase(),
        make: form.make.trim(),
        model: form.model.trim(),
        year: parseInt(form.year),
        mileage: parseFloat(form.mileage) || 0,
        plateType: parseInt(form.plateType),
        customerId,
      });
      setVehicles(prev => [res.data, ...prev]);
      toast.success('Vehicle added', { id: t });
      closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add vehicle', { id: t });
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
            <Car size={22} color="var(--primary)" />
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>My Vehicles</h1>
          </div>
          <button className="btn btn-primary" onClick={openModal} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> Add Vehicle
          </button>
        </div>

        {vehicles.length > 0 && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', color: 'var(--ink-soft)' }} />
              <input
                type="text"
                placeholder="Search by plate, make, model, or year..."
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
          <div className="loading"><div className="spinner" /> Loading vehicles...</div>
        ) : vehicles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)' }}>
            <Car size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No vehicles registered. Add your vehicle to book services and track history.</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)' }}>
            <Car size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No vehicles match your search.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {currentVehicles.map(v => (
              <div key={v.id} style={{ background: '#fff', borderRadius: 14, padding: '1.25rem 1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{v.make} {v.model}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: '0.15rem' }}>{v.year}</div>
                  </div>
                  <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, background: '#f3f4f6', color: '#374151', letterSpacing: '0.05em' }}>
                    {v.licensePlate}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', display: 'flex', gap: '1rem' }}>
                  <span>Mileage: <strong style={{ color: 'var(--ink)' }}>{v.mileage?.toLocaleString()} km</strong></span>
                  <span>{PLATE_TYPES.find(p => p.value === v.plateType)?.label || 'Private'}</span>
                </div>
              </div>
            ))}
          </div>
          {filteredVehicles.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', marginTop: '1rem', background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredVehicles.length)} of {filteredVehicles.length}
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
        )}}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 500, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.15rem', fontWeight: 800 }}>Add Vehicle</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>License Plate *</label>
                  <input className="input" value={form.licensePlate} onChange={e => setForm(p => ({ ...p, licensePlate: e.target.value }))} placeholder="e.g. BA 1 PA 1234" required style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Plate Type *</label>
                  <select className="input" value={form.plateType} onChange={e => setForm(p => ({ ...p, plateType: e.target.value }))} style={{ width: '100%' }}>
                    {PLATE_TYPES.map(pt => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Make *</label>
                  <input className="input" value={form.make} onChange={e => setForm(p => ({ ...p, make: e.target.value }))} placeholder="e.g. Toyota" required style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Model *</label>
                  <input className="input" value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))} placeholder="e.g. Corolla" required style={{ width: '100%' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Year *</label>
                  <input type="number" className="input" min={1900} max={2100} value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} required style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Mileage (km)</label>
                  <input type="number" className="input" min={0} value={form.mileage} onChange={e => setForm(p => ({ ...p, mileage: e.target.value }))} style={{ width: '100%' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>Add Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
