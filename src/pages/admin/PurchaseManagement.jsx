import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useState, useEffect } from 'react';
import { 
  ShoppingCart, Plus, Search, Eye, Calendar, 
  X, Truck, FileSpreadsheet, Trash2, Hash, Printer,
  ArrowLeft as PrevIcon, ArrowRight as NextIcon
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { exportToCSV } from '../../utils/exportUtils';
import NotificationDropdown from '../../components/NotificationDropdown';

const HighlightText = ({ text, highlight }) => {
  if (!highlight?.trim()) return <span>{text}</span>;
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

export default function PurchaseManagement({ onNavigate }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingInvoice, setViewingInvoice] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/purchase');
      const data = Array.isArray(response.data) ? response.data : [];
      setInvoices(data.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)));
    } catch (error) {
      console.error("Purchase Fetch Error:", error);
      toast.error("Failed to load purchase records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <header className="top-header glass-card no-print" style={{ position: 'sticky', top: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <ShoppingCart size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span className="page-title">Purchase Management</span>
             <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: '600' }}>Manage supply chain, track inventory restocking, and verify supplier expenditure</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => exportToCSV(invoices, 'Purchase_History')} style={{ borderRadius: 'var(--radius-sm)' }}>
            <FileSpreadsheet size={18} /> Export CSV
          </button>
          <button onClick={() => onNavigate('admin-create-purchase')} className="btn btn-primary" style={{ borderRadius: 'var(--radius-sm)' }}>
            <Plus size={18} /> Restock Inventory
          </button>
        </div>
      </header>

      <div className="page-content no-print" style={{ animation: 'fadeUp 0.6s ease both' }}>
        <div className="table-card" style={{ boxShadow: 'var(--shadow-luxury)', border: '1px solid rgba(255,255,255,0.4)' }}>
          <div className="table-toolbar">
            <div className="search-box">
              <Search size={18} color="var(--ink-soft)" />
              <input 
                type="text" 
                placeholder="Search by invoice # or vendor..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
               Total Expenditure: <span style={{ color: 'var(--ink)', fontWeight: '800' }}>Rs {invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()}</span>
            </div>
          </div>

          <div style={{ overflowX: 'auto', minHeight: '300px' }}>
            {loading ? (
              <div className="loading"><div className="spinner" /> Loading records...</div>
            ) : filteredInvoices.length === 0 ? (
              <div className="empty-state">
                <ShoppingCart size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <h3>No purchase records</h3>
                <p>Click "New Purchase" to add items to stock.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Invoice Details</th>
                    <th>Vendor</th>
                    <th>Total Amount</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInvoices.map(inv => (
                    <tr key={inv.id}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div style={{ fontWeight: '800', color: 'var(--ink)', fontSize: '1rem' }}>
                            <HighlightText text={inv.invoiceNumber} highlight={searchQuery} />
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} /> {new Date(inv.purchaseDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                       <td>
                        <div 
                          onClick={() => onNavigate('vendors')}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                        >
                          <Truck size={14} color="var(--ink-soft)" />
                          <div style={{ fontWeight: '700' }}>
                            <HighlightText text={inv.vendorName} highlight={searchQuery} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '900', fontSize: '1.05rem', color: 'var(--ink)' }}>
                          Rs {inv.totalAmount.toLocaleString()}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setViewingInvoice(inv)}>
                          <Eye size={18} color="var(--brand)" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {filteredInvoices.length > 0 && (
            <div className="pagination" style={{ borderTop: '1px solid var(--border)', padding: '1.25rem 1.5rem', background: 'var(--surface-2)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                Showing <span style={{ color: 'var(--ink)' }}>{indexOfFirstItem + 1}</span> to <span style={{ color: 'var(--ink)' }}>{Math.min(indexOfLastItem, filteredInvoices.length)}</span> of {filteredInvoices.length}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{ borderRadius: '8px', padding: '0.5rem 1rem' }}
                >
                  <PrevIcon size={14} style={{ marginRight: '6px' }} /> Prev
                </button>
                
                {totalPages > 1 && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: 'none',
                          background: currentPage === page ? 'var(--brand)' : 'transparent',
                          color: currentPage === page ? '#fff' : 'var(--ink-soft)',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {page}
                      </button>
                    )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                  </div>
                )}

                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  style={{ borderRadius: '8px', padding: '0.5rem 1rem' }}
                >
                  Next <NextIcon size={14} style={{ marginLeft: '6px' }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal / Receipt View */}
      {viewingInvoice && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.8)', zIndex: 1000 }}>
          <div className="modal" style={{ maxWidth: '600px', width: '100%', padding: 0, overflow: 'hidden' }}>
            <div className="no-print" style={{ padding: '0.75rem 1.5rem', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: '800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={16} /> PURCHASE RECEIPT
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary btn-sm" onClick={handlePrint}>
                  <Printer size={14} /> Print
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setViewingInvoice(null)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div id="printable-history-receipt" style={{ padding: '2rem', background: '#fff', color: '#000', maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: '#d95d39' }}>AutoBolt</h1>
                <p style={{ color: '#666', margin: '2px 0', fontSize: '0.8rem' }}>Stock Purchase Record</p>
                <p style={{ color: '#666', margin: '2px 0', fontSize: '0.75rem' }}>Kathmandu, Nepal</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '0.5rem 0', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Vendor</div>
                  <div style={{ fontWeight: '800' }}>{viewingInvoice.vendorName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Purchase Order</div>
                  <div style={{ fontWeight: '800' }}>{viewingInvoice.invoiceNumber}</div>
                  <div style={{ fontSize: '0.8rem' }}>{new Date(viewingInvoice.purchaseDate).toLocaleDateString()}</div>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #000' }}>
                    <th style={{ textAlign: 'left', paddingBottom: '0.5rem' }}>Item Description</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Unit Cost</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingInvoice.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '0.75rem 0' }}>
                        <div style={{ fontWeight: '700' }}>{item.partName}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right' }}>Rs {item.unitCost.toLocaleString()}</td>
                      <td style={{ textAlign: 'right', fontWeight: '800' }}>Rs {item.subtotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginLeft: 'auto', width: '220px', fontSize: '1.1rem', fontWeight: '900', borderTop: '2px solid #000', paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>GRAND TOTAL</span>
                  <span>Rs {viewingInvoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '1.5rem', fontSize: '0.8rem' }}>
                <p style={{ margin: '1rem 0 0', fontWeight: '800' }}>System Generated Purchase Record</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #printable-history-receipt, #printable-history-receipt * { 
            visibility: visible !important; 
          }
          #printable-history-receipt { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            max-height: none !important; 
            overflow: visible !important;
          }
          @page { margin: 1cm; }
          .no-print { display: none !important; }
        }
      `}</style>
    </>
  );
}

