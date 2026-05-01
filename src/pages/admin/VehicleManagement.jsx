import AdminLayout from '../../../components/AdminLayout';
import { useState, useEffect } from 'react';
import { Car, Plus, Search, Edit2, Trash2, AlertCircle, X, Eye, User, LayoutGrid, List, Calendar, Settings, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { exportToCSV } from '../../utils/exportUtils';
import NotificationDropdown from '../../components/NotificationDropdown';

const HighlightText = ({ text, highlight }) => {
  if (!highlight?.trim() || !text) return <span>{text || 'N/A'}</span>;
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.toString().split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i} className="highlight">{part}</mark> : <span key={i}>{part}</span>
      )}
    </span>
  );
};

export default function VehicleManagement({ onNavigate }) {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals and Panels
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    licensePlate: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    plateType: 0,
    customerId: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vehiclesRes, customersRes] = await Promise.all([
        axios.get('/api/vehicles'),
        axios.get('/api/customers')
      ]);
      setVehicles(vehiclesRes.data.sort((a, b) => a.id - b.id));
      setCustomers(customersRes.data.sort((a, b) => a.fullName.localeCompare(b.fullName)));
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to load data from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'mileage' || name === 'customerId' ? Number(value) : value
    }));
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      licensePlate: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: 0,
      plateType: '', // Placeholder
      customerId: '' // Placeholder
    });
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    const customerId = customers.find(c => c.fullName === vehicle.ownerName)?.id || '';

    setFormData({
      licensePlate: vehicle.licensePlate,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      mileage: vehicle.mileage,
      plateType: vehicle.plateType,
      customerId: customerId
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.licensePlate || !formData.make || !formData.model || formData.customerId === '' || formData.plateType === '') {
      toast.error("Please fill in all required fields including Owner and Plate Type.");
      return;
    }

    const loadToast = toast.loading(editingVehicle ? "Updating vehicle..." : "Adding vehicle...");

    try {
      const payload = { ...formData };

      if (editingVehicle) {
        await axios.put(`/api/vehicles/${editingVehicle.id}`, payload);
        toast.success("Vehicle updated successfully!", { id: loadToast });
      } else {
        await axios.post('/api/vehicles', payload);
        toast.success("New vehicle added!", { id: loadToast });
      }

      closeModal();
      fetchData(); // Refetch to get updated list
    } catch (error) {
      console.error("Failed to save vehicle", error);
      const errorMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.message || "Please check connection.";
      toast.error(`Failed to save vehicle: ${errorMessage}`, { id: loadToast });
    }
  };

  const handleDelete = async (id) => {
    const loadToast = toast.loading("Deleting vehicle...");
    try {
      await axios.delete(`/api/vehicles/${id}`);
      toast.success("Vehicle deleted permanently.", { id: loadToast });
      setDeleteConfirmId(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete vehicle", error);
      toast.error("Failed to delete vehicle.", { id: loadToast });
    }
  };

  const filteredVehicles = vehicles.filter(v =>
    v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPlateStyle = (type) => {
    switch (type) {
      case 0: // Private - Red
        return { background: '#cc0000', color: '#fff', border: '2px solid #990000' };
      case 1: // Public - Black
        return { background: '#1a1a1a', color: '#fff', border: '2px solid #000' };
      case 2: // Government - White/Red
        return { background: '#fff', color: '#cc0000', border: '2px solid #cc0000' };
      case 3: // Diplomatic - Blue
        return { background: '#003399', color: '#fff', border: '2px solid #001a4d' };
      default:
        return { background: '#ffcc00', color: '#000', border: '2px solid #000' };
    }
  };

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <header className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Car className="nav-icon" style={{ color: 'var(--brand)' }} />
          <span className="page-title">Vehicle Management</span>
        </div>
        <div className="header-actions">
          <NotificationDropdown />
          <button className="btn btn-ghost" onClick={() => exportToCSV(vehicles, 'Vehicles_List')}>
            <FileSpreadsheet size={18} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Register Vehicle
          </button>
        </div>
      </header>

      <div className="page-content">
        <div className="table-card">
          <div className="table-toolbar">
            <div className="search-box">
              <Search size={18} color="var(--ink-soft)" />
              <input
                type="text"
                placeholder="Search vehicles by plate, make, model, or owner..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                Total: {filteredVehicles.length} {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'}
              </div>
              <div style={{ display: 'flex', background: 'var(--surface-2)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setViewMode('list')}
                  style={{ padding: '0.4rem', background: viewMode === 'list' ? 'var(--surface)' : 'transparent', boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                  <List size={16} />
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setViewMode('grid')}
                  style={{ padding: '0.4rem', background: viewMode === 'grid' ? 'var(--surface)' : 'transparent', boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto', minHeight: '300px' }}>
            {loading ? (
              <div className="loading"><div className="spinner" /> Loading vehicles...</div>
            ) : filteredVehicles.length === 0 ? (
              <div className="empty-state">
                <Car size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <h3>No vehicles found</h3>
                <p>Try adjusting your search or register a new vehicle.</p>
              </div>
            ) : viewMode === 'list' ? (
              <table>
                <thead>
                  <tr>
                    <th>License Plate</th>
                    <th>Vehicle Details</th>
                    <th>Owner</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVehicles.map(vehicle => (
                    <tr key={vehicle.id} style={{ transition: 'all 0.2s ease' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            padding: '0.5rem 1rem', borderRadius: '4px',
                            fontWeight: '900', fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '1px',
                            ...getPlateStyle(vehicle.plateType)
                          }}>
                            <HighlightText text={vehicle.licensePlate} highlight={searchQuery} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontWeight: '800', color: 'var(--ink)', fontSize: '1.05rem' }}>
                            <HighlightText text={`${vehicle.make} ${vehicle.model}`} highlight={searchQuery} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                            <Calendar size={14} /> {vehicle.year}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.75rem', borderRadius: '999px', background: 'var(--brand-light)', color: 'var(--brand)', fontWeight: '700', fontSize: '0.85rem' }}>
                          <User size={14} />
                          <HighlightText text={vehicle.ownerName} highlight={searchQuery} />
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setViewingVehicle(vehicle)} style={{ marginRight: '0.25rem' }} title="View Details">
                          <Eye size={16} color="var(--brand)" />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(vehicle)} style={{ marginRight: '0.25rem' }} title="Edit Vehicle">
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirmId(vehicle.id)} style={{ color: 'var(--danger)' }} title="Delete Vehicle">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="grid-view">
                {currentVehicles.map(vehicle => (
                  <div key={vehicle.id} className="grid-card">
                    <div className="grid-card-body">
                      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                          padding: '0.5rem 1rem', borderRadius: '4px',
                          fontWeight: '900', fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '1px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          ...getPlateStyle(vehicle.plateType)
                        }}>
                          <HighlightText text={vehicle.licensePlate} highlight={searchQuery} />
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--ink)' }}>
                          <HighlightText text={`${vehicle.make} ${vehicle.model}`} highlight={searchQuery} />
                        </h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                          {vehicle.year}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--ink)', padding: '0.5rem 0', borderTop: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Settings size={14} /> Mileage
                        </span>
                        <span style={{ fontWeight: '700' }}>{vehicle.mileage.toLocaleString()} km</span>
                      </div>

                      <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--brand-light)', color: 'var(--brand)', fontWeight: '700', fontSize: '0.85rem' }}>
                          <User size={14} />
                          <HighlightText text={vehicle.ownerName} highlight={searchQuery} />
                        </div>
                      </div>
                    </div>
                    <div className="grid-card-footer">
                      <button className="btn btn-ghost btn-sm" onClick={() => setViewingVehicle(vehicle)} title="View Details">
                        <Eye size={16} color="var(--brand)" />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(vehicle)} title="Edit Vehicle">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirmId(vehicle.id)} style={{ color: 'var(--danger)' }} title="Delete Vehicle">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {filteredVehicles.length > 0 && (
            <div className="pagination">
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredVehicles.length)} of {filteredVehicles.length} entries
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Plate Color Legend */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '4px', height: '16px', background: 'var(--brand)', borderRadius: '2px' }} />
            LICENSE PLATE CATEGORIES
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '24px', borderRadius: '4px', background: '#cc0000', border: '2px solid #990000' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink-soft)' }}>Private</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '24px', borderRadius: '4px', background: '#1a1a1a', border: '2px solid #000' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink-soft)' }}>Public</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '24px', borderRadius: '4px', background: '#fff', border: '2px solid #cc0000' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink-soft)' }}>Government</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '24px', borderRadius: '4px', background: '#003399', border: '2px solid #001a4d' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink-soft)' }}>Diplomatic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel for Viewing Vehicle Details */}
      {viewingVehicle && (
        <div className="side-panel-overlay" onClick={() => setViewingVehicle(null)}>
          <div className="side-panel" onClick={e => e.stopPropagation()}>
            <div className="side-panel-header">
              <h3 className="modal-title">Vehicle Details</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewingVehicle(null)} style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>
            <div className="side-panel-content">
              <div style={{ background: 'var(--surface-2)', padding: '2.5rem', borderRadius: 'var(--radius)', textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  padding: '0.75rem 1.5rem', borderRadius: '4px',
                  fontWeight: '900', fontFamily: 'monospace', fontSize: '1.8rem', letterSpacing: '2px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '1rem',
                  ...getPlateStyle(viewingVehicle.plateType)
                }}>
                  {viewingVehicle.licensePlate}
                </div>
                <h2 style={{ fontSize: '1.4rem', fontFamily: 'Sora, sans-serif', color: 'var(--ink)' }}>
                  {viewingVehicle.year} {viewingVehicle.make} {viewingVehicle.model}
                </h2>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '999px', background: 'var(--brand-light)', color: 'var(--brand)', fontWeight: '800', fontSize: '0.9rem', marginTop: '1rem' }}>
                  <User size={16} />
                  Owner: {viewingVehicle.ownerName}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Manufacturer</label>
                    <div style={{ fontSize: '1rem', color: 'var(--ink)', fontWeight: '600' }}>
                      {viewingVehicle.make}
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Model</label>
                    <div style={{ fontSize: '1rem', color: 'var(--ink)', fontWeight: '600' }}>
                      {viewingVehicle.model}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Year</label>
                    <div style={{ fontSize: '1rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} style={{ color: 'var(--ink-soft)' }} />
                      {viewingVehicle.year}
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Current Mileage</label>
                    <div style={{ fontSize: '1rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Settings size={14} style={{ color: 'var(--ink-soft)' }} />
                      {viewingVehicle.mileage.toLocaleString()} km
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={() => { setViewingVehicle(null); openEditModal(viewingVehicle); }} style={{ flex: 1, justifyContent: 'center' }}>
                  <Edit2 size={16} /> Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', background: 'var(--danger-light)',
              color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <AlertCircle size={24} />
            </div>
            <h3 className="modal-title" style={{ marginBottom: '0.5rem' }}>Remove Vehicle?</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to remove this vehicle from the system?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteConfirmId(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirmId)} style={{ flex: 1, justifyContent: 'center' }}>Remove Vehicle</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingVehicle ? 'Edit Vehicle' : 'Register New Vehicle'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal} style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label className="form-label">Owner (Customer) *</label>
                <select
                  name="customerId"
                  className="form-input"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select the owner...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.phone})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">License Plate *</label>
                  <input
                    type="text"
                    name="licensePlate"
                    className="form-input"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    placeholder="e.g. BA-1-PA 1234"
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Plate Type *</label>
                  <select
                    name="plateType"
                    className="form-input"
                    value={formData.plateType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select category...</option>
                    <option value={0}>Private (Red)</option>
                    <option value={1}>Public (Black)</option>
                    <option value={2}>Government (White/Red)</option>
                    <option value={3}>Diplomatic (Blue)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Manufacturer*</label>
                  <input
                    type="text"
                    name="make"
                    className="form-input"
                    value={formData.make}
                    onChange={handleInputChange}
                    placeholder="e.g. Toyota"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Model *</label>
                  <input
                    type="text"
                    name="model"
                    className="form-input"
                    value={formData.model}
                    onChange={handleInputChange}
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
                    name="year"
                    className="form-input"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1900"
                    max="2100"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Current Mileage (km)</label>
                  <input
                    type="number"
                    name="mileage"
                    className="form-input"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingVehicle ? 'Save Changes' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

