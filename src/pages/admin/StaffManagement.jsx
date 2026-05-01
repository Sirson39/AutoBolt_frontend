import AdminLayout from '../../../components/AdminLayout';
import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, Edit2, Trash2, 
  Shield, ShieldAlert, Mail, Phone, Calendar, 
  CheckCircle2, XCircle, X, ChevronRight, Filter,
  FileSpreadsheet, Eye, LayoutGrid, List
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
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

export default function StaffManagement({ onNavigate }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [viewingStaff, setViewingStaff] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 2 // Default to Staff
  });

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/staff');
      setStaff(response.data.sort((a, b) => a.id - b.id));
    } catch (error) {
      toast.error("Failed to load staff list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'role' ? Number(value) : value 
    }));
  };

  const openAddModal = () => {
    setEditingStaff(null);
    setFormData({ fullName: '', email: '', phone: '', password: '', role: 2 });
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingStaff(member);
    setFormData({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      password: '', 
      role: member.role
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading(editingStaff ? "Updating staff..." : "Registering staff member...");

    try {
      if (editingStaff) {
        await axios.put(`/api/staff/${editingStaff.id}`, formData);
        toast.success("Staff updated successfully!", { id: loadToast });
      } else {
        await axios.post('/api/staff', formData);
        toast.success("Staff member registered!", { id: loadToast });
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch (error) {
      toast.error("Failed to save changes.", { id: loadToast });
    }
  };

  const handleDelete = async (id) => {
    const loadToast = toast.loading("Removing staff...");
    try {
      await axios.delete(`/api/staff/${id}`);
      toast.success("Staff member removed.", { id: loadToast });
      setDeleteConfirmId(null);
      fetchStaff();
    } catch (error) {
      toast.error("Failed to remove staff.", { id: loadToast });
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.post(`/api/staff/${id}/toggle-status`);
      toast.success("Status updated.");
      fetchStaff();
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const filteredStaff = staff.filter(s => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);

  const handleExport = () => {
    const exportData = staff.map(s => ({
      ...s,
      createdAt: new Date(s.createdAt).toLocaleDateString()
    }));
    exportToCSV(exportData, 'Staff_List');
  };

  return (
    <>
      <header className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users className="nav-icon" style={{ color: 'var(--brand)' }} />
          <span className="page-title">Staff Management</span>
        </div>
        <div className="header-actions">
          <NotificationDropdown />
          <button className="btn btn-ghost" onClick={handleExport}>
            <FileSpreadsheet size={18} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            <UserPlus size={18} /> Add New Staff
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
                placeholder="Search staff by name, email, or phone..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                Total: {filteredStaff.length} {filteredStaff.length === 1 ? 'member' : 'members'}
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
              <div className="loading"><div className="spinner" /> Loading staff...</div>
            ) : filteredStaff.length === 0 ? (
              <div className="empty-state">
                <Users size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <h3>No staff members found</h3>
                <p>Register new staff to give them access.</p>
              </div>
            ) : viewMode === 'list' ? (
              <table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Contact Info</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStaff.map(member => (
                    <tr key={member.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ 
                            width: '36px', height: '36px', borderRadius: '50%', 
                            background: member.role === 1 ? 'var(--brand-light)' : 'var(--surface-2)',
                            color: member.role === 1 ? 'var(--brand)' : 'var(--ink-soft)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '800', fontSize: '0.85rem', border: '1px solid var(--border)'
                          }}>
                            {member.fullName.charAt(0)}
                          </div>
                          <div style={{ fontWeight: '700', color: 'var(--ink)' }}>
                            <HighlightText text={member.fullName} highlight={searchQuery} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={12} style={{ color: 'var(--ink-soft)' }} /> 
                            <HighlightText text={member.email} highlight={searchQuery} />
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={12} /> 
                            <HighlightText text={member.phone} highlight={searchQuery} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '0.25rem 0.65rem', borderRadius: '999px',
                          background: member.role === 1 ? 'var(--brand-light)' : 'rgba(31, 42, 54, 0.05)',
                          color: member.role === 1 ? 'var(--brand)' : 'var(--ink)',
                          fontSize: '0.75rem', fontWeight: '800'
                        }}>
                          {member.role === 1 ? <Shield size={12} /> : <Users size={12} />}
                          {member.roleName}
                        </div>
                      </td>
                      <td>
                        <button 
                          onClick={() => toggleStatus(member.id)}
                          style={{ 
                            background: member.isActive ? 'var(--success-light)' : 'var(--danger-light)',
                            color: member.isActive ? 'var(--success)' : 'var(--danger)',
                            border: 'none', padding: '0.25rem 0.65rem', borderRadius: '999px',
                            fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '4px'
                          }}
                        >
                          {member.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {member.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {new Date(member.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setViewingStaff(member)} title="View Details">
                          <Eye size={16} color="var(--brand)" />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(member)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirmId(member.id)} style={{ color: 'var(--danger)' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="grid-view">
                {currentStaff.map(member => (
                  <div key={member.id} className="grid-card">
                    <div className="grid-card-body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ 
                          width: '48px', height: '48px', borderRadius: '50%', 
                          background: member.role === 1 ? 'var(--brand-light)' : 'var(--surface-2)',
                          color: member.role === 1 ? 'var(--brand)' : 'var(--ink-soft)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '800', fontSize: '1.1rem', border: '1px solid var(--border)'
                        }}>
                          {member.fullName.charAt(0)}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--ink)' }}>
                            <HighlightText text={member.fullName} highlight={searchQuery} />
                          </h4>
                          <div style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            padding: '0.15rem 0.5rem', borderRadius: '999px',
                            background: member.role === 1 ? 'var(--brand-light)' : 'rgba(0,0,0,0.05)',
                            color: member.role === 1 ? 'var(--brand)' : 'var(--ink-soft)',
                            fontSize: '0.65rem', fontWeight: '800', marginTop: '4px'
                          }}>
                            {member.role === 1 ? <Shield size={10} /> : <Users size={10} />}
                            {member.roleName}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--ink)' }}>
                          <Mail size={14} color="var(--ink-soft)" />
                          <HighlightText text={member.email} highlight={searchQuery} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--ink)' }}>
                          <Phone size={14} color="var(--ink-soft)" />
                          <HighlightText text={member.phone} highlight={searchQuery} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                        <button 
                          onClick={() => toggleStatus(member.id)}
                          style={{ 
                            background: member.isActive ? 'var(--success-light)' : 'var(--danger-light)',
                            color: member.isActive ? 'var(--success)' : 'var(--danger)',
                            border: 'none', padding: '0.25rem 0.65rem', borderRadius: '999px',
                            fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer'
                          }}
                        >
                          {member.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setViewingStaff(member)}><Eye size={16} color="var(--brand)" /></button>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(member)}><Edit2 size={16} /></button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirmId(member.id)} style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredStaff.length > 0 && (
            <div className="pagination">
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStaff.length)} of {filteredStaff.length} entries
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

      {/* View Side Panel */}
      {viewingStaff && (
        <div className="side-panel-overlay" onClick={() => setViewingStaff(null)}>
          <div className="side-panel" onClick={e => e.stopPropagation()}>
            <div className="side-panel-header">
              <h3 className="modal-title">Staff Profile</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewingStaff(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="side-panel-content">
              <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--surface-2)', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', 
                  background: viewingStaff.role === 1 ? 'var(--brand)' : 'var(--ink)',
                  color: '#fff', margin: '0 auto 1rem', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '800'
                }}>
                  {viewingStaff.fullName.charAt(0)}
                </div>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--ink)', marginBottom: '0.25rem' }}>{viewingStaff.fullName}</h2>
                <div style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '0.25rem 0.75rem', borderRadius: '999px',
                  background: viewingStaff.role === 1 ? 'var(--brand-light)' : 'rgba(0,0,0,0.05)',
                  color: viewingStaff.role === 1 ? 'var(--brand)' : 'var(--ink-soft)',
                  fontSize: '0.8rem', fontWeight: '800'
                }}>
                  {viewingStaff.role === 1 ? <Shield size={14} /> : <Users size={14} />}
                  {viewingStaff.roleName}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="info-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ fontSize: '1rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} color="var(--brand)" /> {viewingStaff.email}
                  </div>
                </div>
                <div className="info-group">
                  <label className="form-label">Phone Number</label>
                  <div style={{ fontSize: '1rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={16} color="var(--brand)" /> {viewingStaff.phone}
                  </div>
                </div>
                <div className="info-group">
                  <label className="form-label">Account Status</label>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', 
                    color: viewingStaff.isActive ? 'var(--success)' : 'var(--danger)',
                    fontWeight: '700'
                  }}>
                    {viewingStaff.isActive ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    {viewingStaff.isActive ? 'Active Account' : 'Suspended Account'}
                  </div>
                </div>
                <div className="info-group">
                  <label className="form-label">Member Since</label>
                  <div style={{ fontSize: '1rem', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} /> {new Date(viewingStaff.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setViewingStaff(null); openEditModal(viewingStaff); }}>
                  <Edit2 size={16} /> Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingStaff ? 'Edit Staff Profile' : 'Register New Staff'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" name="fullName" className="form-input" required 
                  value={formData.fullName} onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" name="email" className="form-input" required 
                    value={formData.email} onChange={handleInputChange}
                    placeholder="staff@autobolt.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" name="phone" className="form-input" required 
                    value={formData.phone} onChange={handleInputChange}
                    placeholder="98XXXXXXXX"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Account Role</label>
                <select 
                  name="role" className="form-input" required 
                  value={formData.role} onChange={handleInputChange}
                >
                  <option value={2}>Staff Member (Limited Access)</option>
                  <option value={1}>Administrator (Full Access)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{editingStaff ? 'New Password (Leave blank to keep current)' : 'Account Password'}</label>
                <input 
                  type="password" name="password" className="form-input" 
                  required={!editingStaff} 
                  value={formData.password} onChange={handleInputChange}
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingStaff ? 'Save Profile' : 'Register Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal" style={{ maxWidth: '350px', textAlign: 'center' }}>
            <ShieldAlert size={48} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
            <h3 className="modal-title">Remove Staff?</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              This staff member will lose all access to the system. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDeleteConfirmId(null)}>Cancel</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(deleteConfirmId)}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

