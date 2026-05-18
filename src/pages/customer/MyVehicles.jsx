import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Car, Plus, Trash2, Activity, Settings, Calendar, Eye, X, AlertCircle, Edit2 } from 'lucide-react';

const PLATE_TYPES = [
  { value: 0, label: 'Private (Red)' },
  { value: 1, label: 'Commercial (Black)' },
  { value: 2, label: 'Government (White)' },
  { value: 3, label: 'Diplomatic (Blue)' },
];

const RISK_COLORS = { Low: '#16a34a', Moderate: '#d97706', High: '#ea580c', Critical: '#dc2626' };
const RISK_BG = { Low: '#f0fdf4', Moderate: '#fffbeb', High: '#fff7ed', Critical: '#fef2f2' };

const EMPTY_FORM = { licensePlate: '', make: '', model: '', year: new Date().getFullYear(), mileage: 0, plateType: 0 };

export default function MyVehicles({ onNavigate }) {
  const user = getUser();
  const customerId = user?.customerId || user?.id;

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Modals & Sub-states
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  const loadVehicles = async () => {
    try {
      const res = await api.get(`/api/vehicles/customer/${customerId}`);
      setVehicles(res.data);
    } catch {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) loadVehicles();
    else setLoading(false);
  }, [customerId]);

  const openModal = () => { setEditingVehicle(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEditModal = (v) => {
    setEditingVehicle(v);
    setForm({
      licensePlate: v.licensePlate,
      make: v.make,
      model: v.model,
      year: v.year,
      mileage: v.mileage,
      plateType: v.plateType,
    });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingVehicle(null); };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.licensePlate.trim() || !form.make.trim() || !form.model.trim()) {
      toast.error('License plate, make, and model are required');
      return;
    }
    setSaving(true);
    const isEdit = !!editingVehicle;
    const t = toast.loading(isEdit ? 'Updating vehicle...' : 'Adding vehicle...');
    try {
      const payload = {
        licensePlate: form.licensePlate.trim().toUpperCase(),
        make: form.make.trim(),
        model: form.model.trim(),
        year: parseInt(form.year),
        mileage: parseFloat(form.mileage) || 0,
        plateType: parseInt(form.plateType),
        customerId,
      };
      if (isEdit) {
        await api.put(`/api/vehicles/${editingVehicle.id}`, payload);
        toast.success('Vehicle updated successfully!', { id: t });
      } else {
        await api.post('/api/vehicles', payload);
        toast.success('Vehicle registered successfully!', { id: t });
      }
      closeModal();
      loadVehicles();
    } catch (err) {
      toast.error(err?.response?.data?.message || (isEdit ? 'Failed to update vehicle' : 'Failed to add vehicle'), { id: t });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const t = toast.loading("Removing vehicle...");
    try {
      await api.delete(`/api/vehicles/${id}`);
      toast.success("Vehicle removed successfully.", { id: t });
      setDeleteConfirmId(null);
      loadVehicles();
    } catch (err) {
      toast.error("Failed to remove vehicle.", { id: t });
    }
  };

  const handlePredict = async (vehicleId) => {
    setLoadingPrediction(true);
    setPrediction(null);
    try {
      const res = await api.get(`/api/vehicles/${vehicleId}/prediction`);
      setPrediction(res.data);
    } catch {
      toast.error('Failed to analyze vehicle condition.');
    } finally {
      setLoadingPrediction(false);
    }
  };

  const getPlateStyle = (type) => {
    switch (type) {
      case 0: // Private - Red
        return { background: '#cc0000', color: '#fff', border: '2px solid #990000' };
      case 1: // Commercial/Public - Black
        return { background: '#1a1a1a', color: '#fff', border: '2px solid #000' };
      case 2: // Government - White/Red
        return { background: '#fff', color: '#cc0000', border: '2px solid #cc0000' };
      case 3: // Diplomatic - Blue
        return { background: '#003399', color: '#fff', border: '2px solid #001a4d' };
      default:
        return { background: '#ffcc00', color: '#000', border: '2px solid #000' };
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingLeft: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={20} />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>My Vehicles</h1>
        </div>
        <button className="btn btn-primary" onClick={openModal} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={16} /> Register Vehicle
        </button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Loading vehicles...</div>
      ) : vehicles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)', background: '#fff', borderRadius: 14, border: '1px solid var(--border)' }}>
          <Car size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No vehicles registered. Add your vehicle to book services and track history.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {vehicles.map(v => (
            <div key={v.id} style={{ background: '#fff', borderRadius: 14, padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', transition: 'all 0.2s ease', position: 'relative' }}>
              
              {/* Realistic Plate Badge */}
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  padding: '0.4rem 0.8rem', borderRadius: '4px',
                  fontWeight: '900', fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '1px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  ...getPlateStyle(v.plateType)
                }}>
                  {v.licensePlate}
                </div>
              </div>

              {/* Title & Year */}
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--ink)', fontWeight: 800 }}>
                  {v.make} {v.model}
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: '0.15rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Calendar size={13} /> {v.year}
                </div>
              </div>

              {/* Mileage Section */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--ink)', padding: '0.5rem 0', borderTop: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Settings size={14} /> Mileage
                </span>
                <span style={{ fontWeight: '700' }}>{v.mileage?.toLocaleString()} km</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => setViewingVehicle(v)} 
                  style={{ flex: 1, padding: '0.4rem', justifyContent: 'center', gap: '4px', fontSize: '0.8rem' }}
                  title="View Details"
                >
                  <Eye size={15} color="var(--brand)" /> View
                </button>
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => openEditModal(v)} 
                  style={{ flex: 1, padding: '0.4rem', justifyContent: 'center', gap: '4px', fontSize: '0.8rem' }}
                  title="Edit Vehicle"
                >
                  <Edit2 size={15} /> Edit
                </button>
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => handlePredict(v.id)} 
                  style={{ flex: 1, padding: '0.4rem', justifyContent: 'center', gap: '4px', fontSize: '0.8rem' }}
                  title="Condition Analysis"
                >
                  <Activity size={15} color="var(--brand)" /> Scan
                </button>
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => setDeleteConfirmId(v.id)} 
                  style={{ color: 'var(--danger)', padding: '0.4rem', justifyContent: 'center' }}
                  title="Remove Vehicle"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Side Panel for Viewing Vehicle Details */}
      {viewingVehicle && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '400px', height: '100%', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Vehicle Profile</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewingVehicle(null)} style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
              <div style={{ background: 'var(--surface-2)', padding: '2rem', borderRadius: 14, textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  padding: '0.5rem 1rem', borderRadius: '4px',
                  fontWeight: '900', fontFamily: 'monospace', fontSize: '1.4rem', letterSpacing: '1.5px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)', marginBottom: '1rem',
                  ...getPlateStyle(viewingVehicle.plateType)
                }}>
                  {viewingVehicle.licensePlate}
                </div>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--ink)', margin: 0, fontWeight: 800 }}>
                  {viewingVehicle.year} {viewingVehicle.make} {viewingVehicle.model}
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: 600, marginBottom: '0.25rem' }}>Manufacturer</label>
                    <div style={{ fontSize: '0.95rem', color: 'var(--ink)', fontWeight: '600' }}>{viewingVehicle.make}</div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: 600, marginBottom: '0.25rem' }}>Model</label>
                    <div style={{ fontSize: '0.95rem', color: 'var(--ink)', fontWeight: '600' }}>{viewingVehicle.model}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: 600, marginBottom: '0.25rem' }}>Year</label>
                    <div style={{ fontSize: '0.95rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                      <Calendar size={14} style={{ color: 'var(--ink-soft)' }} />
                      {viewingVehicle.year}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: 600, marginBottom: '0.25rem' }}>Current Mileage</label>
                    <div style={{ fontSize: '0.95rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                      <Settings size={14} style={{ color: 'var(--ink-soft)' }} />
                      {viewingVehicle.mileage?.toLocaleString()} km
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: 600, marginBottom: '0.25rem' }}>Plate Category</label>
                  <div style={{ fontSize: '0.95rem', color: 'var(--ink)', fontWeight: '600' }}>
                    {PLATE_TYPES.find(p => p.value === viewingVehicle.plateType)?.label || 'Private'}
                  </div>
                </div>
              </div>

              {/* Edit button at bottom of view panel */}
              <div style={{ marginTop: '2rem' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => { setViewingVehicle(null); openEditModal(viewingVehicle); }}
                  style={{ width: '100%', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Edit2 size={16} /> Edit Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2',
              color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <AlertCircle size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', fontWeight: 800 }}>Remove Vehicle?</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Are you sure you want to remove this vehicle? This will delete all record associations permanently.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirmId)} style={{ flex: 1, justifyContent: 'center' }}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Condition Analysis Diagnostics Modal */}
      {(prediction || loadingPrediction) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: '480px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Health Diagnostics</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setPrediction(null)} style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>
            {loadingPrediction ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
                <div className="spinner" style={{ margin: '0 auto 1rem' }} />
                <span>Running diagnostic analysis...</span>
              </div>
            ) : prediction && (
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '1rem' }}>{prediction.licensePlate}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>{prediction.make} {prediction.model}</div>
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem', borderRadius: '12px', fontWeight: '900', fontSize: '0.85rem',
                    background: RISK_BG[prediction.riskLevel] || '#f3f4f6',
                    color: RISK_COLORS[prediction.riskLevel] || '#374151',
                    border: `1px solid ${(RISK_COLORS[prediction.riskLevel] || '#374151')}30`
                  }}>
                    {prediction.riskLevel} Risk — {prediction.riskScore} pts
                  </div>
                </div>
                {prediction.predictions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-soft)', background: 'var(--surface-2)', borderRadius: 12 }}>
                    No critical issues detected. Your vehicle appears to be in great condition. Keep it up!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.05em' }}>PREDICTIVE SYSTEM ALERTS</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {prediction.predictions.map((msg, i) => (
                        <li key={i} style={{
                          padding: '0.75rem 1rem', borderRadius: '10px',
                          background: RISK_BG[prediction.riskLevel] || '#f9fafb',
                          borderLeft: `4px solid ${RISK_COLORS[prediction.riskLevel] || '#6b7280'}`,
                          fontSize: '0.85rem', color: 'var(--ink)', fontWeight: '600', lineHeight: '1.4'
                        }}>
                          {msg}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '1.25rem', textAlign: 'right' }}>
                  Diagnostics Run: {new Date(prediction.analysedAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Register Vehicle Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 500, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{editingVehicle ? 'Edit Vehicle' : 'Register Vehicle'}</h2>
              <button className="btn btn-ghost btn-sm" onClick={closeModal} style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">License Plate *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.licensePlate}
                    onChange={e => setForm(p => ({ ...p, licensePlate: e.target.value }))}
                    placeholder="e.g. BA-1-PA 1234"
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Plate Type *</label>
                  <select
                    className="form-input"
                    value={form.plateType}
                    onChange={e => setForm(p => ({ ...p, plateType: e.target.value }))}
                    required
                  >
                    {PLATE_TYPES.map(pt => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Manufacturer *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.make}
                    onChange={e => setForm(p => ({ ...p, make: e.target.value }))}
                    placeholder="e.g. Toyota"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Model *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.model}
                    onChange={e => setForm(p => ({ ...p, model: e.target.value }))}
                    placeholder="e.g. Corolla"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Manufacture Year</label>
                  <input
                    type="number"
                    className="form-input"
                    value={form.year}
                    onChange={e => setForm(p => ({ ...p, year: e.target.value }))}
                    min="1900"
                    max="2100"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Current Mileage (km)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={form.mileage}
                    onChange={e => setForm(p => ({ ...p, mileage: e.target.value }))}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {editingVehicle ? 'Save Changes' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
