import { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit2, Trash2, AlertCircle, X, Eye, Mail, Phone, MapPin, LayoutGrid, List, Wallet, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { exportToCSV } from '../../utils/exportUtils';
import NotificationDropdown from '../../components/NotificationDropdown';
import AdminLayout from '../../components/AdminLayout';

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

export default function CustomerManagement({ onNavigate }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
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
      const sortedCustomers = (Array.isArray(response.data) ? response.data : []).sort((a, b) => a.id - b.id);
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
      const payload = { 
        ...formData,
        email: formData.email.trim() === '' ? null : formData.email.trim(),
        address: formData.address.trim() === '' ? null : formData.address.trim()
      };
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
      const errorMessage = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.message || "Please check connection.";
      toast.error(`Failed to save customer: ${errorMessage}`, { id: loadToast });
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
          <NotificationDropdown onNavigate={onNavigate} />
          <button className="btn btn-ghost" onClick={() => exportToCSV(customers, 'Customers_List')}>
            <FileSpreadsheet size={18} /> Export CSV
          </button>
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
                <button className="btn btn-ghost btn-sm" onClick={() => setViewMode('list')} style={{ background: viewMode === 'list' ? 'var(--surface)' : 'transparent' }}>
                  <List size={16} />
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setViewMode('grid')} style={{ background: viewMode === 'grid' ? 'var(--surface)' : 'transparent' }}>
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
                    <tr key={customer.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                            {customer.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div><HighlightText text={customer.fullName} highlight={searchQuery} /></div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}><Phone size={12} /> {customer.phone}</div>
                        {customer.email && <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}><Mail size={12} /> {customer.email}</div>}
                      </td>
                      <td><span style={{ fontWeight: '700' }}>Rs {customer.creditBalance.toFixed(2)}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setViewingCustomer(customer)}><Eye size={16} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(customer)}><Edit2 size={16} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirmId(customer.id)} style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
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
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                          {customer.fullName.charAt(0).toUpperCase()}
                        </div>
                        <h4 style={{ margin: 0 }}><HighlightText text={customer.fullName} highlight={searchQuery} /></h4>
                      </div>
                      <div style={{ fontSize: '0.85rem' }}><Phone size={14} /> {customer.phone}</div>
                    </div>
                    <div className="grid-card-footer">
                      <button className="btn btn-ghost btn-sm" onClick={() => setViewingCustomer(customer)}><Eye size={16} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(customer)}><Edit2 size={16} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirmId(customer.id)} style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {filteredCustomers.length > 0 && (
            <div className="pagination">
              <span>Page {currentPage} of {totalPages}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {viewingCustomer && (
        <div className="side-panel-overlay" onClick={() => setViewingCustomer(null)}>
          <div className="side-panel" onClick={e => e.stopPropagation()}>
            <div className="side-panel-header">
              <h3>Customer Profile</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewingCustomer(null)}><X size={18} /></button>
            </div>
            <div className="side-panel-content">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--brand)', color: '#fff', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  {viewingCustomer.fullName.charAt(0).toUpperCase()}
                </div>
                <h2>{viewingCustomer.fullName}</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div><label className="form-label">Phone</label><div>{viewingCustomer.phone}</div></div>
                <div><label className="form-label">Email</label><div>{viewingCustomer.email || 'N/A'}</div></div>
                <div><label className="form-label">Address</label><div>{viewingCustomer.address || 'N/A'}</div></div>
                <div><label className="form-label">Balance</label><div>Rs {viewingCustomer.creditBalance.toFixed(2)}</div></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
            <h3>Delete Customer?</h3>
            <p>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteConfirmId(null)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirmId)} style={{ flex: 1 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Full Name *</label><input type="text" name="fullName" className="form-input" value={formData.fullName} onChange={handleInputChange} required /></div>
              <div className="form-group"><label className="form-label">Phone Number *</label><input type="text" name="phone" className="form-input" value={formData.phone} onChange={handleInputChange} required /></div>
              <div className="form-group"><label className="form-label">Email</label><input type="email" name="email" className="form-input" value={formData.email} onChange={handleInputChange} /></div>
              <div className="form-group"><label className="form-label">Address</label><textarea name="address" className="form-input" rows="2" value={formData.address} onChange={handleInputChange} /></div>
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingCustomer ? 'Save Changes' : 'Add Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
