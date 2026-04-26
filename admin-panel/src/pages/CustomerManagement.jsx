import { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit2, Trash2, AlertCircle, X, Eye, Mail, Phone, MapPin, LayoutGrid, List, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

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

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals and Panels
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/customers');
      const sortedCustomers = response.data.sort((a, b) => a.id - b.id);
      setCustomers(sortedCustomers);
    } catch (error) {
      console.error("Failed to fetch customers", error);
      toast.error("Failed to load customers from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({ fullName: '', email: '', phone: '', address: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      fullName: customer.fullName,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone) {
      toast.error("Full Name and Phone Number are required.");
      return;
    }

    const loadToast = toast.loading(editingCustomer ? "Updating customer..." : "Adding customer...");

    try {
      const payload = { ...formData };

      if (editingCustomer) {
        await axios.put(`/api/customers/${editingCustomer.id}`, payload);
        toast.success("Customer updated successfully!", { id: loadToast });
      } else {
        await axios.post('/api/customers', payload);
        toast.success("New customer added!", { id: loadToast });
      }

      closeModal();
      fetchCustomers();
    } catch (error) {
      console.error("Failed to save customer", error);
      toast.error("Failed to save customer. Please check connection.", { id: loadToast });
    }
  };

  const handleDelete = async (id) => {
    const loadToast = toast.loading("Deleting customer...");
    try {
      await axios.delete(`/api/customers/${id}`);
      toast.success("Customer deleted permanently.", { id: loadToast });
      setDeleteConfirmId(null);
      fetchCustomers();
    } catch (error) {
      console.error("Failed to delete customer", error);
      toast.error("Failed to delete customer.", { id: loadToast });
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.phone && c.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <header className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users className="nav-icon" style={{ color: 'var(--brand)' }} />
          <span className="page-title">Customer Management</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Add New Customer
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
                placeholder="Search customers by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                Total: {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'}
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
              <div className="loading"><div className="spinner" /> Loading customers...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="empty-state">
                <Users size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <h3>No customers found</h3>
                <p>Try adjusting your search or add a new customer.</p>
              </div>
            ) : viewMode === 'list' ? (
              <table>
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Contact Info</th>
                    <th>Balance</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCustomers.map(customer => (
                    <tr key={customer.id} style={{ transition: 'all 0.2s ease' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: 'var(--brand-light)', color: 'var(--brand)', border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '800'
                          }}>
                            {customer.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', color: 'var(--ink)' }}>
                              <HighlightText text={customer.fullName} highlight={searchQuery} />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                            <Phone size={12} /> <HighlightText text={customer.phone} highlight={searchQuery} />
                          </div>
                          {customer.email && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                              <Mail size={12} /> <HighlightText text={customer.email} highlight={searchQuery} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '999px', background: customer.creditBalance > 0 ? 'var(--danger-light)' : 'var(--success-light)', color: customer.creditBalance > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: '700', fontSize: '0.8rem' }}>
                          <Wallet size={14} />
                          Rs {customer.creditBalance.toFixed(2)}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setViewingCustomer(customer)} style={{ marginRight: '0.25rem' }} title="View Details">
                          <Eye size={16} color="var(--brand)" />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(customer)} style={{ marginRight: '0.25rem' }} title="Edit Customer">
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirmId(customer.id)} style={{ color: 'var(--danger)' }} title="Delete Customer">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="grid-view">
                {currentCustomers.map(customer => (
                  <div key={customer.id} className="grid-card">
                    <div className="grid-card-body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '50%',
                          background: 'var(--brand-light)', color: 'var(--brand)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.2rem'
                        }}>
                          {customer.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--ink)' }}><HighlightText text={customer.fullName} highlight={searchQuery} /></h4>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--ink)' }}>
                          <Phone size={14} style={{ color: 'var(--ink-soft)' }} /> <HighlightText text={customer.phone} highlight={searchQuery} />
                        </div>
                        {customer.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--ink)' }}>
                            <Mail size={14} style={{ color: 'var(--ink-soft)' }} /> <HighlightText text={customer.email} highlight={searchQuery} />
                          </div>
                        )}
                        {customer.address && (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--ink)', marginTop: '4px' }}>
                            <MapPin size={14} style={{ color: 'var(--ink-soft)', marginTop: '2px', flexShrink: 0 }} />
                            <span style={{ lineHeight: '1.3' }}>{customer.address.length > 50 ? customer.address.substring(0, 50) + '...' : customer.address}</span>
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '999px', background: customer.creditBalance > 0 ? 'var(--danger-light)' : 'var(--success-light)', color: customer.creditBalance > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: '700', fontSize: '0.8rem' }}>
                          <Wallet size={14} />
                          Balance: Rs {customer.creditBalance.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="grid-card-footer">
                      <button className="btn btn-ghost btn-sm" onClick={() => setViewingCustomer(customer)} title="View Details">
                        <Eye size={16} color="var(--brand)" />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(customer)} title="Edit Customer">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirmId(customer.id)} style={{ color: 'var(--danger)' }} title="Delete Customer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {filteredCustomers.length > 0 && (
            <div className="pagination">
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} entries
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

      {/* Side Panel for Viewing Customer Details */}
      {viewingCustomer && (
        <div className="side-panel-overlay" onClick={() => setViewingCustomer(null)}>
          <div className="side-panel" onClick={e => e.stopPropagation()}>
            <div className="side-panel-header">
              <h3 className="modal-title">Customer Profile</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewingCustomer(null)} style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>
            <div className="side-panel-content">
              <div style={{ background: 'var(--surface-2)', padding: '2.5rem', borderRadius: 'var(--radius)', textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'var(--brand)', color: '#fff', fontSize: '2rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '800', marginBottom: '1rem',
                  boxShadow: '0 10px 30px rgba(217, 93, 57, 0.3)'
                }}>
                  {viewingCustomer.fullName.charAt(0).toUpperCase()}
                </div>
                <h2 style={{ fontSize: '1.6rem', fontFamily: 'Sora, sans-serif', color: 'var(--ink)' }}>
                  {viewingCustomer.fullName}
                </h2>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', borderRadius: '999px', background: viewingCustomer.creditBalance > 0 ? 'var(--danger-light)' : 'var(--success-light)', color: viewingCustomer.creditBalance > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: '800', fontSize: '0.9rem', marginTop: '1rem' }}>
                  <Wallet size={16} />
                  Credit Balance: Rs {viewingCustomer.creditBalance.toFixed(2)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Phone</label>
                    <div style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
                      <Phone size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom', color: 'var(--ink-soft)' }} />
                      {viewingCustomer.phone}
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <div style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
                      <Mail size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom', color: 'var(--ink-soft)' }} />
                      {viewingCustomer.email || 'N/A'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label">Address</label>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: '1.6', display: 'flex', alignItems: 'flex-start' }}>
                    <MapPin size={16} style={{ marginRight: '6px', marginTop: '2px', color: 'var(--ink-soft)', flexShrink: 0 }} />
                    {viewingCustomer.address || 'No address provided'}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={() => { setViewingCustomer(null); openEditModal(viewingCustomer); }} style={{ flex: 1, justifyContent: 'center' }}>
                  <Edit2 size={16} /> Edit Profile
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
            <h3 className="modal-title" style={{ marginBottom: '0.5rem' }}>Delete Customer?</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this customer? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteConfirmId(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirmId)} style={{ flex: 1, justifyContent: 'center' }}>Delete Customer</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal} style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Bishnu Parajuli"
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9800000000"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="bishnu@gmail.com"
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
                  placeholder="e.g. 123 Main St, Kathmandu"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingCustomer ? 'Save Changes' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
