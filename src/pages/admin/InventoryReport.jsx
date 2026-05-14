import React from 'react';
import { useState, useEffect } from 'react';
import {
  BarChart2, Package, Download, Printer,
  TrendingUp, TrendingDown, DollarSign, Filter,
  AlertTriangle, PieChart as PieIcon, BarChart as BarIcon,
  ShoppingCart, CheckCircle, ArrowRight, ArrowLeft, Activity, Layers, Tag
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { exportToCSV } from '../../utils/exportUtils';
import NotificationDropdown from '../../components/NotificationDropdown';

export default function InventoryReport({ onNavigate }) {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/parts');
        setParts(response.data || []);
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

  // Pagination Logic
  const totalPages = Math.ceil(filteredParts.length / itemsPerPage);
  const paginatedParts = filteredParts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCategoryChange = (val) => {
    setFilterCategory(val);
    setCurrentPage(1);
  };

  const totalItems = parts.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);
  const totalValue = parts.reduce((sum, p) => sum + ((p.price || 0) * (p.stockQuantity || 0)), 0);
  const lowStockCount = parts.filter(p => (p.stockQuantity || 0) < 10).length;

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

  // Data for Pie Chart
  const pieData = categories.filter(c => c !== 'All').map(cat => {
    const catParts = parts.filter(p => p.category === cat);
    return {
      name: cat,
      value: catParts.reduce((s, p) => s + ((p.price || 0) * (p.stockQuantity || 0)), 0)
    };
  }).filter(d => d.value > 0);

  const COLORS = ['#d95d39', '#2d3436', '#636e72', '#b2bec3', '#00cec9', '#0984e3'];

  // Data for Bar Chart (Top 5 Assets)
  const barData = [...parts]
    .sort((a, b) => ((b.price || 0) * (b.stockQuantity || 0)) - ((a.price || 0) * (a.stockQuantity || 0)))
    .slice(0, 5)
    .map(p => ({
      name: (p.name || 'Unknown').split(' ')[0], // Safety guard for split
      Value: Math.round((p.price || 0) * (p.stockQuantity || 0))
    }));

  const SummaryCard = ({ title, value, subValue, icon: Icon, theme = 'brand', link, danger }) => (
    <div
      className="stat-card"
      onClick={() => link && onNavigate(link)}
      style={{
        cursor: link ? 'pointer' : 'default',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        borderLeft: danger ? '4px solid var(--danger)' : '1px solid var(--border)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="stat-card-label" style={{ fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</span>
          <h2 className="stat-card-value" style={{ fontSize: '1.8rem', marginTop: '0.5rem', fontWeight: '900', color: danger ? 'var(--danger)' : 'var(--ink)' }}>{value}</h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '0.5rem', fontWeight: '600' }}>{subValue}</div>
        </div>
        <div className={`stat-card-icon ${theme}`} style={{ borderRadius: '12px' }}><Icon size={22} /></div>
      </div>
    </div>
  );

  if (loading) return <div className="loading"><div className="spinner" /> Analyzing inventory assets...</div>;

  return (
    <>
      <header className="top-header glass-card" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--brand) 0%, #b84a2a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            boxShadow: '0 4px 12px rgba(217, 93, 57, 0.3)'
          }}>
            <BarChart2 size={22} />
          </div>
          <div>
            <span className="page-title" style={{ fontSize: '1.25rem', fontWeight: '900' }}>Inventory Analytics</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: '600' }}>Asset valuation, stock health, and category distribution</div>
          </div>
        </div>
        <div className="header-actions">
          <NotificationDropdown onNavigate={onNavigate} />
          <button className="btn btn-ghost" onClick={() => window.print()}>
            <Download size={18} /> EXPORT PDF
          </button>
        </div>
      </header>

      <div className="page-content" style={{ animation: 'fadeUp 0.6s ease both' }}>

        {/* Top Analytics Banner */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem', marginBottom: '1.5rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            borderRadius: 'var(--radius)', padding: '2rem', color: '#fff', position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: 'var(--shadow-luxury)'
          }}>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.05 }}><Activity size={240} /></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand)', fontWeight: '900', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
                <Layers size={16} /> Portfolio Summary
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '900', margin: 0 }}>Rs {totalValue.toLocaleString()}</h1>
              <p style={{ fontSize: '1rem', opacity: 0.7, marginTop: '0.5rem', fontWeight: '500' }}>Total current market valuation of {totalItems.toLocaleString()} stock units.</p>

              <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ borderLeft: '3px solid var(--brand)', paddingLeft: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: '800', textTransform: 'uppercase' }}>Assets Count</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>{parts.length} Lines</div>
                </div>
                <div style={{ borderLeft: '3px solid #fff', paddingLeft: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: '800', textTransform: 'uppercase' }}>Avg Item Value</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>Rs {parts.length > 0 ? Math.round(totalValue / parts.length).toLocaleString() : 0}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="table-card" style={{ padding: '1.5rem', background: 'var(--surface)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '1rem' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--brand)" strokeWidth="3" strokeDasharray={`${Math.max(0, 100 - (lowStockCount * 10))}, 100`} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900' }}>{Math.max(0, 100 - (lowStockCount * 10))}%</span>
                <span style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--ink-soft)' }}>HEALTH</span>
              </div>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: '0.5rem 0' }}>Inventory Health</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              {lowStockCount > 0 ? `${lowStockCount} items require immediate restocking to improve score.` : "Perfect! All stock levels are above safety threshold."}
            </p>
            {lowStockCount > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('admin-notifications')} style={{ marginTop: '1rem', color: 'var(--brand)' }}>
                View Alerts <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
          <SummaryCard title="In Stock" value={totalItems.toLocaleString()} subValue="Live units on shelf" icon={Package} theme="brand" link="admin-parts" />
          <SummaryCard title="Low Stock Items" value={lowStockCount} subValue="Below safety threshold" icon={AlertTriangle} theme="danger" danger={lowStockCount > 0} link="admin-notifications" />
          <SummaryCard title="Top Category" value={categories.length - 1} subValue="Distinct groups managed" icon={Layers} theme="accent" />
          <SummaryCard title="Restock Lead" value="2.4 Days" subValue="Avg. vendor response" icon={TrendingDown} theme="warning" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

          {/* Charts Section */}
          <div className="table-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieIcon size={20} color="var(--brand)" /> Distribution by Category
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="table-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarIcon size={20} color="var(--brand)" /> High-Value Assets
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: '700' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={v => `${v / 1000}k`} />
                  <Tooltip cursor={{ fill: 'rgba(217, 93, 57, 0.05)' }} formatter={(value) => value.toLocaleString()} />
                  <Bar
                    dataKey="Value"
                    fill="var(--brand)"
                    radius={[8, 8, 0, 0]}
                    label={{
                      position: 'top',
                      fill: 'var(--ink)',
                      fontSize: 10,
                      fontWeight: '800',
                      formatter: (v) => v.toLocaleString()
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="table-card" style={{ boxShadow: 'var(--shadow-luxury)' }}>
          <div className="table-toolbar" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div>
                <span style={{ fontWeight: '900', fontSize: '1.1rem' }}>Inventory Ledger</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '4px' }}>Filtered breakdown by item and category</p>
              </div>
              <div className="search-box" style={{ marginLeft: '2rem', minWidth: '220px' }}>
                <Filter size={16} color="var(--brand)" />
                <select
                  className="form-input"
                  style={{ border: 'none', background: 'none', padding: '0 1rem', width: '100%', fontWeight: '800', color: 'var(--brand)' }}
                  value={filterCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleExport} style={{ color: 'var(--brand)' }}>
              <Download size={16} /> Export CSV
            </button>
            <table>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '2rem' }}>Part Name</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th style={{ paddingRight: '2rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedParts.length > 0 ? paginatedParts.map(p => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => onNavigate('admin-parts')}>
                    <td style={{ fontWeight: '800', paddingLeft: '2rem' }}>{p.name || 'Unnamed Part'}</td>
                    <td><span className="badge badge-brand" style={{ fontSize: '0.65rem' }}>{p.category || 'General'}</span></td>
                    <td style={{ color: 'var(--ink-soft)' }}>Rs {(p.price || 0).toLocaleString()}</td>
                    <td style={{ fontWeight: '800', color: (p.stockQuantity || 0) < 10 ? 'var(--danger)' : 'inherit' }}>{p.stockQuantity || 0}</td>
                    <td style={{ fontWeight: '900', color: 'var(--brand)' }}>Rs {((p.price || 0) * (p.stockQuantity || 0)).toLocaleString()}</td>
                    <td style={{ paddingRight: '2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.stockQuantity < 10 ? 'var(--danger)' : 'var(--success)' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: p.stockQuantity < 10 ? 'var(--danger)' : 'var(--success)' }}>
                          {p.stockQuantity < 10 ? 'LOW STOCK' : 'HEALTHY'}
                        </span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '4rem', color: 'var(--ink-soft)' }}>No items found in this category.</td></tr>
                )}
              </tbody>
            </table>

            {filteredParts.length > 0 && (
              <div className="pagination no-print" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderTop: '1px solid var(--border)', padding: '1.25rem 2rem', background: 'var(--surface-2)',
                width: '100%', boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
                  Showing <span style={{ color: 'var(--ink)', fontWeight: '800' }}>{(currentPage - 1) * itemsPerPage + 1}</span> to <span style={{ color: 'var(--ink)', fontWeight: '800' }}>{Math.min(currentPage * itemsPerPage, filteredParts.length)}</span> of <span style={{ fontWeight: '800' }}>{filteredParts.length}</span>
                </span>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      borderRadius: '10px', padding: '0.6rem 1.2rem',
                      background: '#fff',
                      border: currentPage === 1 ? '1px solid var(--border-light)' : '1px solid var(--border)',
                      color: currentPage === 1 ? 'var(--ink-soft)' : 'var(--ink)',
                      cursor: currentPage === 1 ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      fontWeight: '700', transition: 'all 0.2s ease'
                    }}
                  >
                    <ArrowLeft size={16} /> Prev
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      borderRadius: '10px', padding: '0.6rem 1.2rem',
                      background: '#fff',
                      border: currentPage === totalPages ? '1px solid var(--border-light)' : '1px solid var(--border)',
                      color: currentPage === totalPages ? 'var(--ink-soft)' : 'var(--ink)',
                      cursor: currentPage === totalPages ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      fontWeight: '700', transition: 'all 0.2s ease'
                    }}
                  >
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- FORMAL PRINT-ONLY REPORT TEMPLATE (Moved to Root) --- */}
      <div className="print-only-report">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '900', color: '#000' }}>AUTOBOLT</h1>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', fontWeight: '700' }}>PREMIUM AUTOMOTIVE SOLUTIONS</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>INVENTORY ASSET REPORT</h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Generated: {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ border: '1px solid #000', padding: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.7rem', color: '#666' }}>FINANCIAL VALUATION</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>Rs {totalValue.toLocaleString()}</div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem' }}>Total valuation across {parts.length} line items.</p>
          </div>
          <div style={{ border: '1px solid #000', padding: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.7rem', color: '#666' }}>STOCK HEALTH</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{Math.max(0, 100 - (lowStockCount * 10))}%</div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem' }}>{lowStockCount} items currently below safety threshold.</p>
          </div>
        </div>

        <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>DETAILED ASSET BREAKDOWN</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #000', textAlign: 'left', fontSize: '0.8rem' }}>
              <th style={{ padding: '0.5rem 0' }}>PART NAME</th>
              <th>CATEGORY</th>
              <th>UNIT PRICE</th>
              <th>STOCK</th>
              <th style={{ textAlign: 'right' }}>TOTAL VALUE</th>
            </tr>
          </thead>
          <tbody>
            {parts.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee', fontSize: '0.8rem' }}>
                <td style={{ padding: '0.5rem 0', fontWeight: '700' }}>{p.name}</td>
                <td>{p.category}</td>
                <td>Rs {p.price.toLocaleString()}</td>
                <td>{p.stockQuantity}</td>
                <td style={{ textAlign: 'right', fontWeight: '800' }}>Rs {(p.price * p.stockQuantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '1rem', fontSize: '0.7rem', color: '#999', textAlign: 'center' }}>
          This is a computer-generated inventory report from AutoBolt ERP. Internal use only.
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .stat-card:hover { transform: translateY(-8px) !important; box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; border-color: var(--brand-soft) !important; }
        
        .print-only-report { display: none; }

        @media print {
          /* Hide the web containers specifically, but not the root */
          .admin-layout > *:not(.main-content), .top-header, .page-content, .sidebar, .sidebar-overlay {
            display: none !important;
          }

          /* Reset all potential push-margins from AdminLayout */
          .admin-layout, .main-content, .page-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
            width: 100% !important;
          }

          .print-only-report { 
            display: block !important; 
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            color: #000 !important;
          }

          body, html {
            background: #fff !important;
            height: auto !important;
            margin: 0 !important;
          }
          @page { margin: 1cm; size: auto; }
        }
      `}</style>
    </>
  );
}
