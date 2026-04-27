import { useState, useEffect } from 'react';
import { 
  BarChart2, Package, Download, 
  TrendingDown, DollarSign, Filter,
  AlertTriangle, PieChart as PieIcon, BarChart as BarIcon,
  ShoppingCart, CheckCircle, Printer
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { exportToCSV } from '../utils/exportUtils';
import NotificationDropdown from '../components/NotificationDropdown';
import { useNavigate } from 'react-router-dom';

export default function InventoryReport() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/parts');
        setParts(response.data);
      } catch (error) {
        toast.error("Failed to load inventory data.");
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, []);

  const categories = ['All', ...new Set(parts.map(p => p.category))];
  
  const filteredParts = filterCategory === 'All' 
    ? parts 
    : parts.filter(p => p.category === filterCategory);

  const totalItems = filteredParts.reduce((sum, p) => sum + p.stockQuantity, 0);
  const totalValue = filteredParts.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);
  const lowStockCount = filteredParts.filter(p => p.stockQuantity < 10).length;
  const allTotalValue = parts.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);

  const handleExport = () => {
    const exportData = filteredParts.map(p => ({
      Name: p.name,
      Category: p.category,
      'Unit Price': p.price,
      'Stock Quantity': p.stockQuantity,
      'Total Value': p.price * p.stockQuantity,
      Status: p.stockQuantity < 10 ? 'LOW STOCK' : 'OK'
    }));
    exportToCSV(exportData, `Inventory_Report_${new Date().toISOString().split('T')[0]}`);
  };

  // Reusable clickable summary card — same pattern as FinancialReports
  const SummaryCard = ({ title, value, subValue, icon: Icon, theme = 'brand', link, danger }) => (
    <div
      className="stat-card"
      onClick={() => link && navigate(link)}
      style={{
        cursor: link ? 'pointer' : 'default',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: danger ? '3px solid var(--danger)' : undefined
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="stat-card-label">{title}</span>
          <h2 className="stat-card-value" style={{ fontSize: '1.75rem', marginTop: '0.25rem', color: danger ? 'var(--danger)' : undefined }}>{value}</h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: '0.4rem' }}>
            {subValue}
          </div>
        </div>
        <div className={`stat-card-icon ${theme}`}>
          <Icon size={22} />
        </div>
      </div>
      {link && (
        <div style={{ 
          position: 'absolute', bottom: 0, left: 0, right: 0, 
          height: '3px', background: 'var(--brand)', 
          transform: 'scaleX(0)', transformOrigin: 'left',
          transition: 'transform 0.3s ease'
        }} className="card-underline" />
      )}
    </div>
  );

  if (loading) {
    return <div className="loading"><div className="spinner" /> Generating report...</div>;
  }

  return (
    <>
      <header className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BarChart2 className="nav-icon" style={{ color: 'var(--brand)' }} />
          <span className="page-title">Inventory Report</span>
        </div>
        <div className="header-actions">
          <NotificationDropdown />
          <button className="btn btn-ghost" onClick={() => window.print()}>
            <Download size={18} /> Export PDF
          </button>
        </div>
      </header>

      <div className="page-content" style={{ animation: 'fadeIn 0.5s ease' }}>
        
        {/* Clickable Summary Cards */}
        <div className="stat-grid">
          <SummaryCard
            title="Total Stock Units"
            value={totalItems.toLocaleString()}
            subValue="Across all parts"
            icon={Package}
            theme="brand"
            link="/admin/parts"
          />
          <SummaryCard
            title="Total Inventory Value"
            value={`Rs ${totalValue.toLocaleString()}`}
            subValue="Current valuation"
            icon={DollarSign}
            theme="accent"
          />
          <SummaryCard
            title="Low Stock Alerts"
            value={lowStockCount}
            subValue="Items below 10 units"
            icon={AlertTriangle}
            theme="danger"
            danger={lowStockCount > 0}
            link="/admin/notifications"
          />
          <SummaryCard
            title="Restock Required"
            value={lowStockCount > 0 ? 'Yes' : 'No'}
            subValue={lowStockCount > 0 ? 'Click to restock now' : 'All levels healthy'}
            icon={lowStockCount > 0 ? ShoppingCart : CheckCircle}
            theme={lowStockCount > 0 ? 'danger' : 'brand'}
            link={lowStockCount > 0 ? '/admin/create-purchase' : undefined}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Main Table */}
          <div className="table-card">
            <div className="table-toolbar">
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontWeight: '800', color: 'var(--ink)' }}>Inventory Breakdown</div>
                  <div className="search-box" style={{ minWidth: '200px' }}>
                    <Filter size={16} color="var(--ink-soft)" />
                    <select 
                      style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.85rem', width: '100%', fontWeight: '700' }}
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
               </div>
               <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                 {filteredParts.length} items
               </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Stock Value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParts.map(part => (
                    <tr 
                      key={part.id} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate('/admin/parts')}
                    >
                      <td style={{ fontWeight: '700' }}>{part.name}</td>
                      <td>{part.category}</td>
                      <td>Rs {part.price.toLocaleString()}</td>
                      <td style={{ fontWeight: '800', color: part.stockQuantity < 10 ? 'var(--danger)' : 'var(--ink)' }}>{part.stockQuantity}</td>
                      <td style={{ fontWeight: '900', color: 'var(--brand)' }}>
                        Rs {(part.price * part.stockQuantity).toLocaleString()}
                      </td>
                      <td>
                        {part.stockQuantity < 10 ? (
                          <span className="badge badge-danger">LOW</span>
                        ) : (
                          <span className="badge badge-success">OK</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Analytics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div className="table-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <PieIcon size={18} color="var(--brand)" /> CATEGORY SPLIT
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {categories.filter(c => c !== 'All').map(cat => {
                  const catParts = parts.filter(p => p.category === cat);
                  const catVal = catParts.reduce((s, p) => s + (p.price * p.stockQuantity), 0);
                  const percentage = allTotalValue > 0 ? (catVal / allTotalValue * 100) : 0;
                  
                  return (
                    <div 
                      key={cat} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => setFilterCategory(cat)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px' }}>
                        <span style={{ color: filterCategory === cat ? 'var(--brand)' : 'var(--ink)' }}>{cat}</span>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--surface-2)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${percentage}%`, 
                          background: filterCategory === cat ? 'var(--brand)' : 'var(--ink-soft)',
                          transition: 'all 0.3s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div 
              className="table-card" 
              style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s ease' }}
              onClick={() => navigate('/admin/parts')}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <BarIcon size={18} color="var(--accent)" /> TOP ASSETS
                 <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--brand)', fontWeight: '700' }}>View All →</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {parts
                  .sort((a, b) => (b.price * b.stockQuantity) - (a.price * a.stockQuantity))
                  .slice(0, 5)
                  .map((p, i) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '900', flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)' }}>Rs {(p.price * p.stockQuantity).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .stat-card:hover {
          transform: translateY(-12px) scale(1.02) !important;
          box-shadow: 0 20px 40px rgba(217, 93, 57, 0.15) !important;
          border-color: var(--brand) !important;
          z-index: 10;
        }
        .stat-card:hover .card-underline { transform: scaleX(1) !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media print {
          .sidebar, .top-header, .header-actions, .no-print { display: none !important; }
          .admin-layout { display: block !important; }
          .main-content { margin-left: 0 !important; width: 100% !important; padding: 0 !important; }
          .page-content { padding: 0 !important; width: 100% !important; }
          .stat-grid {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 15px !important;
            margin-bottom: 30px !important;
          }
          .stat-card {
            border: 1px solid #eee !important;
            box-shadow: none !important;
            transform: none !important;
            break-inside: avoid;
            padding: 15px !important;
          }
          .table-card {
            border: 1px solid #eee !important;
            box-shadow: none !important;
            break-inside: avoid;
            margin-top: 20px !important;
          }
          body { background: #fff !important; margin: 0 !important; padding: 0 !important; }
          @page { size: A4 landscape; margin: 1cm; }
        }
      `}</style>
    </>
  );
}
