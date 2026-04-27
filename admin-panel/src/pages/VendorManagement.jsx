import { useState, useEffect, useRef } from 'react';
import { Briefcase, Plus, Search, Edit2, Trash2, AlertCircle, X, Eye, Mail, Phone, MapPin, Image as ImageIcon, LayoutGrid, List, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { exportToCSV } from '../utils/exportUtils';

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

export default function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals and Panels
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [viewingVendor, setViewingVendor] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // File upload reference
  const fileInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/vendors');
      const sortedVendors = response.data.sort((a, b) => a.id - b.id);
      setVendors(sortedVendors);
    } catch (error) {
      console.error("Failed to fetch vendors", error);
      toast.error("Failed to load vendors from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  const openAddModal = () => {
    setEditingVendor(null);
    setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' });
    setLogoPreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      contactPerson: vendor.contactPerson || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      address: vendor.address || ''
    });
    setLogoPreview(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVendor(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Vendor Name is required.");
      return;
    }

    const loadToast = toast.loading(editingVendor ? "Updating vendor..." : "Adding vendor...");

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      if (formData.contactPerson?.trim()) payload.append('contactPerson', formData.contactPerson.trim());
      if (formData.email?.trim()) payload.append('email', formData.email.trim());
      if (formData.phone?.trim()) payload.append('phone', formData.phone.trim());
      if (formData.address?.trim()) payload.append('address', formData.address.trim());

      if (fileInputRef.current?.files[0]) {
        payload.append('logo', fileInputRef.current.files[0]);
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editingVendor) {
        await axios.put(`/api/vendors/${editingVendor.id}`, payload, config);
        toast.success("Vendor updated successfully!", { id: loadToast });
      } else {
        await axios.post('/api/vendors', payload, config);
        toast.success("New vendor added!", { id: loadToast });
      }

      closeModal();
      fetchVendors();
    } catch (error) {
      console.error("Failed to save vendor", error);
      const errorMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.message || "Please check connection.";
      toast.error(`Failed to save vendor: ${errorMessage}`, { id: loadToast });
    }
  };

  const handleDelete = async (id) => {
    const loadToast = toast.loading("Deleting vendor...");
    try {
      await axios.delete(`/api/vendors/${id}`);
      toast.success("Vendor deleted permanently.", { id: loadToast });
      setDeleteConfirmId(null);
      fetchVendors();
    } catch (error) {
      console.error("Failed to delete vendor", error);
      toast.error("Failed to delete vendor.", { id: loadToast });
    }
  };

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.contactPerson && v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (v.email && v.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <header className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Briefcase className="nav-icon" style={{ color: 'var(--brand)' }} />
          <span className="page-title">Vendor Management</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => exportToCSV(vendors, 'Vendors_List')}>
            <FileSpreadsheet size={18} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Add New Vendor
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
                placeholder="Search vendors by name, contact, or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                Total: {filteredVendors.length} {filteredVendors.length === 1 ? 'vendor' : 'vendors'}
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
              <div className="loading"><div className="spinner" /> Loading vendors...</div>
            ) : filteredVendors.length === 0 ? (
              <div className="empty-state">
                <Briefcase size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <h3>No vendors found</h3>
                <p>Try adjusting your search or add a new vendor.</p>
              </div>
            ) : viewMode === 'list' ? (
              <table>
                <thead>
                  <tr>
                    <th>Vendor Details</th>
                    <th>Contact Info</th>
                    <th>Address</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVendors.map(vendor => (
                    <tr key={vendor.id} style={{ transition: 'all 0.2s ease' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--surface-2)', border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0
                          }}>
                            {vendor.logoUrl ? (
                              <img src={`http://localhost:5098${vendor.logoUrl}`} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <Briefcase size={20} style={{ color: 'var(--ink-soft)', opacity: 0.6 }} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', color: 'var(--ink)' }}>
                              <HighlightText text={vendor.name} highlight={searchQuery} />
                            </div>
                            {vendor.contactPerson && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '2px', fontWeight: '600' }}>
                                Contact: <HighlightText text={vendor.contactPerson} highlight={searchQuery} />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                            <Mail size={12} /> <HighlightText text={vendor.email} highlight={searchQuery} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                            <Phone size={12} /> <HighlightText text={vendor.phone} highlight={searchQuery} />
                          </div>
                        </div>
                      </td>
                      <td style={{ maxWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                          <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {vendor.address || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setViewingVendor(vendor)} style={{ marginRight: '0.25rem' }} title="View Details">
                          <Eye size={16} color="var(--brand)" />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(vendor)} style={{ marginRight: '0.25rem' }} title="Edit Vendor">
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirmId(vendor.id)} style={{ color: 'var(--danger)' }} title="Delete Vendor">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="grid-view">
                {currentVendors.map(vendor => (
                  <div key={vendor.id} className="grid-card">
                    <div className="grid-card-image" style={{ background: 'var(--surface-2)' }}>
                      {vendor.logoUrl ? (
                        <img src={`http://localhost:5098${vendor.logoUrl}`} alt={vendor.name} />
                      ) : (
                        <Briefcase size={48} style={{ color: 'var(--brand)', opacity: 0.2 }} />
                      )}
                    </div>
                    <div className="grid-card-body">
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--ink)' }}><HighlightText text={vendor.name} highlight={searchQuery} /></h4>
                        {vendor.contactPerson && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '4px', fontWeight: '600' }}>
                            Contact: <HighlightText text={vendor.contactPerson} highlight={searchQuery} />
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'auto', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--ink)' }}>
                          <Mail size={14} style={{ color: 'var(--ink-soft)' }} /> <HighlightText text={vendor.email} highlight={searchQuery} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--ink)' }}>
                          <Phone size={14} style={{ color: 'var(--ink-soft)' }} /> <HighlightText text={vendor.phone} highlight={searchQuery} />
                        </div>
                      </div>
                    </div>
                    <div className="grid-card-footer">
                      <button className="btn btn-ghost btn-sm" onClick={() => setViewingVendor(vendor)} title="View Details">
                        <Eye size={16} color="var(--brand)" />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(vendor)} title="Edit Vendor">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirmId(vendor.id)} style={{ color: 'var(--danger)' }} title="Delete Vendor">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {filteredVendors.length > 0 && (
            <div className="pagination">
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredVendors.length)} of {filteredVendors.length} entries
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
      </div>

      {/* Side Panel for Viewing Vendor Details */}
      {viewingVendor && (
        <div className="side-panel-overlay" onClick={() => setViewingVendor(null)}>
          <div className="side-panel" onClick={e => e.stopPropagation()}>
            <div className="side-panel-header">
              <h3 className="modal-title">Vendor Profile</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewingVendor(null)} style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>
            <div className="side-panel-content">
              <div style={{ background: 'var(--surface-2)', padding: viewingVendor.logoUrl ? '0' : '2.5rem', borderRadius: 'var(--radius)', textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
                {viewingVendor.logoUrl ? (
                  <img src={`http://localhost:5098${viewingVendor.logoUrl}`} alt={viewingVendor.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                ) : (
                  <>
                    <div style={{
                      width: '80px', height: '80px', borderRadius: '50%',
                      background: 'var(--brand)', color: '#fff', fontSize: '2rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '800', marginBottom: '1rem',
                      boxShadow: '0 10px 30px rgba(217, 93, 57, 0.3)'
                    }}>
                      {viewingVendor.name.charAt(0).toUpperCase()}
                    </div>
                  </>
                )}
              </div>
              <h2 style={{ fontSize: '1.6rem', fontFamily: 'Sora, sans-serif', color: 'var(--ink)', textAlign: 'center', marginBottom: '1.5rem' }}>
                {viewingVendor.name}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="form-label">Contact Person</label>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--ink)' }}>{viewingVendor.contactPerson || 'N/A'}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Email</label>
                    <div style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
                      <Mail size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom', color: 'var(--ink-soft)' }} />
                      {viewingVendor.email || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <div style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
                      <Phone size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom', color: 'var(--ink-soft)' }} />
                      {viewingVendor.phone || 'N/A'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label">Address</label>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: '1.6', display: 'flex', alignItems: 'flex-start' }}>
                    <MapPin size={16} style={{ marginRight: '6px', marginTop: '2px', color: 'var(--ink-soft)', flexShrink: 0 }} />
                    {viewingVendor.address || 'No address provided'}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={() => { setViewingVendor(null); openEditModal(viewingVendor); }} style={{ flex: 1, justifyContent: 'center' }}>
                  <Edit2 size={16} /> Edit Vendor
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
            <h3 className="modal-title" style={{ marginBottom: '0.5rem' }}>Delete Vendor?</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this vendor? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteConfirmId(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirmId)} style={{ flex: 1, justifyContent: 'center' }}>Delete Vendor</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal} style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1.5rem', marginBottom: '1rem' }}>
                <div>
                  <div className="form-group">
                    <label className="form-label">Vendor Company Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Bosch Auto Parts"
                      autoFocus
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Person</label>
                    <input
                      type="text"
                      name="contactPerson"
                      className="form-input"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="e.g. Bishnu Parajuli"
                    />
                  </div>
                </div>

                {/* Logo Upload Area */}
                <div className="form-group">
                  <label className="form-label">Company Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <div
                    className="image-upload-box"
                    onClick={() => fileInputRef.current.click()}
                    style={{ padding: logoPreview || editingVendor?.logoUrl ? '0' : '1.5rem', overflow: 'hidden' }}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview" className="image-preview" />
                    ) : editingVendor?.logoUrl ? (
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img src={`http://localhost:5098${editingVendor.logoUrl}`} alt="Current Logo" className="image-preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', opacity: 0, transition: 'opacity 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                          <ImageIcon size={24} style={{ marginBottom: '0.25rem' }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Replace Logo</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <ImageIcon size={32} color="var(--ink-soft)" style={{ opacity: 0.5 }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: '600' }}>Click to Upload</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@vendor.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Physical Address</label>
                <textarea
                  name="address"
                  className="form-input"
                  rows="2"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full business address..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingVendor ? 'Save Changes' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
