import { useState, useEffect, useRef } from 'react';
import { 
  Bell, AlertTriangle, Package, ShoppingCart, 
  ChevronRight, RefreshCw, CheckCircle 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [lowStockParts, setLowStockParts] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchLowStock = async () => {
    try {
      const response = await axios.get('/api/parts/low-stock');
      const parts = response.data;
      setLowStockParts(parts);
      
      // Calculate how many are "new" since last seen
      const seenIds = JSON.parse(localStorage.getItem('seenNotificationIds') || '[]');
      const newParts = parts.filter(p => !seenIds.includes(p.id));
      setUnseenCount(newParts.length);
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  useEffect(() => {
    fetchLowStock();
    const interval = setInterval(fetchLowStock, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen) {
      // Mark all current alerts as "seen"
      const currentIds = lowStockParts.map(p => p.id);
      localStorage.setItem('seenNotificationIds', JSON.stringify(currentIds));
      setUnseenCount(0);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="notification-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        className={`header-icon-btn ${isOpen ? 'active' : ''}`}
        onClick={toggleDropdown}
        style={{
          position: 'relative',
          background: isOpen ? 'var(--brand-light)' : 'transparent',
          color: isOpen ? 'var(--brand)' : 'var(--ink-soft)',
          border: 'none',
          padding: '8px',
          borderRadius: '50%',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Bell size={20} />
        {unseenCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            background: 'var(--danger)',
            color: 'white',
            fontSize: '10px',
            fontWeight: '900',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--surface)',
            animation: 'pulse 2s infinite'
          }}>
            {unseenCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown shadow-xl" style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '12px',
          width: '320px',
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          zIndex: 1000,
          overflow: 'hidden',
          animation: 'fadeDown 0.2s ease'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)' }}>
            <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>System Alerts</span>
            <span className="badge badge-danger">{lowStockParts.length} Critical</span>
          </div>

          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {lowStockParts.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
                <CheckCircle size={32} color="var(--success)" style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.85rem' }}>No critical alerts found.</p>
              </div>
            ) : (
              lowStockParts.slice(0, 5).map(part => (
                <div key={part.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <AlertTriangle size={20} />
                   </div>
                   <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--ink)' }}>{part.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: '700' }}>Only {part.stockQuantity} remaining</div>
                   </div>
                   <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand)', padding: '4px' }}
                      onClick={() => { setIsOpen(false); navigate('/admin/create-purchase', { state: { preSelectedPart: part } }); }}
                      title="Restock this part"
                   >
                      <ShoppingCart size={16} />
                   </button>
                </div>
              ))
            )}
          </div>

          <Link 
            to="/admin/notifications" 
            onClick={() => setIsOpen(false)}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.75rem', fontSize: '0.8rem', fontWeight: '800', color: 'var(--brand)',
              background: 'var(--surface-2)', textDecoration: 'none'
            }}
          >
            View All Notifications <ChevronRight size={14} />
          </Link>
        </div>
      )}

      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.4); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(229, 62, 62, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 62, 62, 0); }
        }
      `}</style>
    </div>
  );
}
