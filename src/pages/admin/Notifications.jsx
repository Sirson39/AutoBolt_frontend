import AdminLayout from '../../components/AdminLayout';
import { useState, useEffect } from 'react';
import { 
  Bell, AlertTriangle, Package, ChevronRight, 
  RefreshCw, ShoppingCart, Info, CheckCircle,
  Zap, Target, TrendingDown
} from 'lucide-react';

import axios from 'axios';
import toast from 'react-hot-toast';

export default function Notifications({ onNavigate }) {
  const [lowStockParts, setLowStockParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  

  const fetchLowStock = async (showToast = false) => {
    try {
      if (showToast) setScanning(true);
      else setLoading(true);
      
      const response = await axios.get('/api/parts/low-stock');
      const parts = response.data;
      
      // Simulate system scan time for premium feel
      if (showToast) await new Promise(r => setTimeout(r, 1500));
      
      setLowStockParts(parts);

      const ids = parts.map(p => p.id);
      localStorage.setItem('seenNotificationIds', JSON.stringify(ids));

      if (showToast) {
        toast.success('Inventory scan completed. Data is up to date.');
      }
    } catch (error) {
      toast.error('Failed to load low stock alerts.');
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  useEffect(() => {
    fetchLowStock(false); // initial load — no toast, but marks as read
  }, []);

  const handleRestockNow = (part) => {
    localStorage.setItem('restockPart', JSON.stringify(part));
    onNavigate('admin-create-purchase');
  };

  return (
    <>
      <header className="top-header glass-card" style={{ zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Bell size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span className="page-title">System Notifications</span>
             <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: '600' }}>Manage alerts and inventory warnings</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => fetchLowStock(true)} disabled={loading || scanning} style={{ borderRadius: 'var(--radius-sm)' }}>
            <RefreshCw size={18} className={scanning ? 'spin' : ''} /> {scanning ? 'SCANNING SYSTEM...' : 'RUN FULL SCAN'}
          </button>
        </div>
      </header>

      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }}>
          
          <div className="table-card">
            <div className="table-toolbar" style={{ background: 'var(--brand-light)', borderBottomColor: 'var(--brand)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand)', fontWeight: '800' }}>
                  <AlertTriangle size={20} />
                  LOW STOCK ALERTS ({lowStockParts.length})
               </div>
               <div style={{ fontSize: '0.85rem', color: 'var(--brand)', fontWeight: '600' }}>
                  Threshold: Less than 10 units
               </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              {loading ? (
                <div className="loading"><div className="spinner" /> Analyzing stock levels...</div>
              ) : lowStockParts.length === 0 ? (
                <div className="empty-state" style={{ padding: '4rem' }}>
                  <CheckCircle size={48} color="var(--success)" style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <h3>All clear!</h3>
                  <p>All parts have sufficient stock levels.</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Part Information</th>
                      <th>Current Stock</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockParts.map(part => (
                      <tr key={part.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ 
                              width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', 
                              background: 'var(--surface-2)', 
                              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                              color: 'var(--ink-soft)' 
                            }}>
                               {part.imageUrl ? (
                                 <img src={part.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                               ) : (
                                 <Package size={20} />
                               )}
                            </div>
                            <div>
                               <div style={{ fontWeight: '800', color: 'var(--ink)' }}>{part.name}</div>
                               <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>{part.category}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                           <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                              <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--danger)' }}>{part.stockQuantity}</span>
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--ink-soft)' }}>units left</span>
                           </div>
                        </td>
                        <td>
                           <span className="badge badge-danger">LOW STOCK</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                           <button
                             className="btn btn-primary btn-sm"
                             onClick={() => handleRestockNow(part)}
                           >
                              <ShoppingCart size={14} /> Restock Now
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="table-card shimmer" style={{ padding: '1.5rem', background: 'var(--brand)', color: '#fff', border: 'none', position: 'relative' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={18} fill="#fff" /> TOP PRIORITY
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {lowStockParts.slice(0, 3).map(p => (
                    <div key={p.id} style={{ background: 'rgba(255,255,255,0.15)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{p.name}</div>
                          <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Only {p.stockQuantity} left</div>
                       </div>
                       <button onClick={() => handleRestockNow(p)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand)', cursor: 'pointer' }}>
                          <ChevronRight size={16} />
                       </button>
                    </div>
                  ))}
                  {lowStockParts.length === 0 && <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>No items need immediate attention.</p>}
               </div>
            </div>

            <div className="table-card" style={{ padding: '1.5rem' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={18} color="var(--brand)" /> STOCK INSIGHTS
               </h3>
               <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  System analysis identifies {lowStockParts.length} items below the safety threshold. 
                  Immediate restocking is recommended to maintain service continuity.
               </p>
               <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--ink-soft)', marginBottom: '0.5rem' }}>HEALTH SCORE</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <div style={{ fontSize: '2rem', fontWeight: '900', color: lowStockParts.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
                        {Math.max(0, 100 - (lowStockParts.length * 10))}%
                     </div>
                     {lowStockParts.length > 0 && <TrendingDown size={20} color="var(--danger)" />}
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

