import { useState, useEffect, useRef } from 'react';
import { Package, Plus, Search, Edit2, Trash2, AlertCircle, CheckCircle2, X, Eye, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const HighlightText = ({ text, highlight }) => {
  if (!highlight.trim() || !text) return <span>{text}</span>;
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

export default function PartsManagement() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Modals and Panels
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [viewingPart, setViewingPart] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  // File upload reference
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '' // Empty by default
  });

  const fetchParts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/parts');
      const sortedParts = response.data.sort((a, b) => a.id - b.id);
      setParts(sortedParts);
    } catch (error) {
      console.error("Failed to fetch parts", error);
      toast.error("Failed to load inventory from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create local preview URL
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const openAddModal = () => {
    setEditingPart(null);
    setFormData({ name: '', description: '', price: '', stockQuantity: '', categoryId: '' });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (part) => {
    setEditingPart(part);
    setFormData({
      name: part.name,
      description: part.description || '',
      price: part.price,
      stockQuantity: part.stockQuantity,
      categoryId: part.categoryId !== undefined ? part.categoryId : (part.category === 'Engine' ? 0 : part.category === 'Brakes' ? 1 : 0)
    });
    setImagePreview(null); // Assuming API doesn't return image yet
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPart(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.stockQuantity || formData.categoryId === '') {
      toast.error("Please fill in all required fields, including Category.");
      return;
    }

    const loadToast = toast.loading(editingPart ? "Updating part..." : "Adding part...");

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description || '');
      payload.append('price', formData.price);
      payload.append('stockQuantity', formData.stockQuantity);
      payload.append('categoryId', formData.categoryId);
      
      if (fileInputRef.current?.files[0]) {
        payload.append('image', fileInputRef.current.files[0]);
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editingPart) {
        await axios.put(`/api/parts/${editingPart.id}`, payload, config);
        toast.success("Part updated successfully!", { id: loadToast });
      } else {
        await axios.post('/api/parts', payload, config);
        toast.success("New part added to inventory!", { id: loadToast });
      }
      
      closeModal();
      fetchParts();
    } catch (error) {
      console.error("Failed to save part", error);
      toast.error("Failed to save part. Please check connection.", { id: loadToast });
    }
  };

  const handleDelete = async (id) => {
    const loadToast = toast.loading("Deleting part...");
    try {
      await axios.delete(`/api/parts/${id}`);
      toast.success("Part deleted permanently.", { id: loadToast });
      setDeleteConfirmId(null);
      fetchParts();
    } catch (error) {
      console.error("Failed to delete part", error);
      toast.error("Failed to delete part.", { id: loadToast });
    }
  };

  const filteredParts = parts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredParts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentParts = filteredParts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <header className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package className="nav-icon" style={{ color: 'var(--brand)' }} />
          <span className="page-title">Parts & Inventory</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Add New Part
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
                placeholder="Search parts by name or category..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
              Total: {filteredParts.length} items
            </div>
          </div>

          <div style={{ overflowX: 'auto', minHeight: '300px' }}>
            {loading ? (
              <div className="loading"><div className="spinner" /> Loading inventory...</div>
            ) : filteredParts.length === 0 ? (
              <div className="empty-state">
                <Package size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <h3>No parts found</h3>
                <p>Try adjusting your search or add a new part.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Part Name</th>
                    <th>Category</th>
                    <th>Unit Price</th>
                    <th>Stock Level</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentParts.map(part => (
                    <tr key={part.id} style={{ transition: 'all 0.2s ease' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ 
                            width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', 
                            background: 'var(--surface-2)', border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0
                          }}>
                            {part.imageUrl ? (
                              <img src={`http://localhost:5098${part.imageUrl}`} alt={part.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <Package size={20} style={{ color: 'var(--ink-soft)', opacity: 0.6 }} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--ink)' }}>
                              <HighlightText text={part.name} highlight={searchQuery} />
                            </div>
                            {part.description && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '2px' }}>
                                {part.description.length > 40 ? part.description.substring(0, 40) + '...' : part.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink-soft)' }}>
                          <HighlightText text={part.category} highlight={searchQuery} />
                        </span>
                      </td>
                      <td style={{ fontWeight: '700' }}>
                        Rs {part.price.toFixed(2)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ 
                            width: '100%', 
                            maxWidth: '80px', 
                            height: '6px', 
                            background: 'var(--surface-2)', 
                            borderRadius: '999px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              height: '100%', 
                              width: `${Math.min((part.stockQuantity / 100) * 100, 100)}%`,
                              background: part.stockQuantity <= 0 ? 'var(--danger)' : part.stockQuantity < 10 ? 'var(--warning)' : 'var(--success)',
                              transition: 'width 0.4s ease'
                            }} />
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{part.stockQuantity}</span>
                        </div>
                      </td>
                      <td>
                        {part.stockQuantity <= 0 ? (
                          <span className="badge badge-danger"><AlertCircle size={12} style={{marginRight: '4px'}}/> Out of Stock</span>
                        ) : part.stockQuantity < 10 ? (
                          <span className="badge badge-warning"><AlertCircle size={12} style={{marginRight: '4px'}}/> Low Stock</span>
                        ) : (
                          <span className="badge badge-success"><CheckCircle2 size={12} style={{marginRight: '4px'}}/> In Stock</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setViewingPart(part)} style={{ marginRight: '0.25rem' }} title="View Details">
                          <Eye size={16} color="var(--brand)" />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(part)} style={{ marginRight: '0.25rem' }} title="Edit Part">
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirmId(part.id)} style={{ color: 'var(--danger)' }} title="Delete Part">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {filteredParts.length > 0 && (
            <div className="pagination">
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredParts.length)} of {filteredParts.length} entries
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

      {/* Side Panel for Viewing Part Details */}
      {viewingPart && (
        <div className="side-panel-overlay" onClick={() => setViewingPart(null)}>
          <div className="side-panel" onClick={e => e.stopPropagation()}>
            <div className="side-panel-header">
              <h3 className="modal-title">Part Profile</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewingPart(null)} style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>
            <div className="side-panel-content">
              <div style={{ background: 'var(--surface-2)', overflow: 'hidden', padding: viewingPart.imageUrl ? '0' : '2rem', borderRadius: 'var(--radius)', textAlign: 'center', marginBottom: '1.5rem', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {viewingPart.imageUrl ? (
                  <img src={`http://localhost:5098${viewingPart.imageUrl}`} alt={viewingPart.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Package size={64} style={{ color: 'var(--brand)', opacity: 0.8 }} />
                )}
              </div>
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'Sora, sans-serif', marginBottom: '0.5rem', color: 'var(--ink)' }}>
                {viewingPart.name}
              </h2>
              <div style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
                <span className="badge badge-brand">{viewingPart.category}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="form-label">Price</label>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>Rs {viewingPart.price.toFixed(2)}</div>
                </div>
                <div>
                  <label className="form-label">Stock Availability</label>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: viewingPart.stockQuantity <= 0 ? 'var(--danger)' : 'var(--ink)' }}>
                    {viewingPart.stockQuantity} units in stock
                  </div>
                </div>
                {viewingPart.description && (
                  <div>
                    <label className="form-label">Description</label>
                    <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: '1.6' }}>
                      {viewingPart.description}
                    </p>
                  </div>
                )}
              </div>
              
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                 <button className="btn btn-primary" onClick={() => { setViewingPart(null); openEditModal(viewingPart); }} style={{ flex: 1, justifyContent: 'center' }}>
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
            <h3 className="modal-title" style={{ marginBottom: '0.5rem' }}>Delete Part?</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this part? This action cannot be undone and will remove it from inventory.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteConfirmId(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirmId)} style={{ flex: 1, justifyContent: 'center' }}>Delete Part</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingPart ? 'Edit Part Details' : 'Add New Part'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal} style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1.5rem', marginBottom: '1rem' }}>
                <div>
                  <div className="form-group">
                    <label className="form-label">Part Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="form-input" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Ceramic Brake Pads"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select 
                      name="categoryId" 
                      className="form-input" 
                      value={formData.categoryId} 
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>-- Select Category --</option>
                      <option value="0">Engine</option>
                      <option value="1">Brakes</option>
                      <option value="2">Suspension</option>
                      <option value="3">Electrical</option>
                      <option value="4">Body</option>
                      <option value="5">Accessories</option>
                    </select>
                  </div>
                </div>

                {/* Photo Upload Area */}
                <div className="form-group">
                  <label className="form-label">Photo</label>
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
                    style={{ padding: imagePreview ? '0' : '1.5rem', overflow: 'hidden' }}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="image-preview" />
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
                  <label className="form-label">Price (Rs) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    step="0.01" 
                    className="form-input" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Stock *</label>
                  <input 
                    type="number" 
                    name="stockQuantity" 
                    className="form-input" 
                    value={formData.stockQuantity} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea 
                  name="description" 
                  className="form-input" 
                  rows="3" 
                  value={formData.description} 
                  onChange={handleInputChange}
                  placeholder="Additional details, manufacturer info, etc."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingPart ? 'Save Changes' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
