import { useState, useEffect } from 'react';
import { 
  Settings, MapPin, Phone, Mail, Globe, 
  DollarSign, Percent, Save, RefreshCw, Palette, 
  ShieldCheck, Layout, Bell, Info, Landmark,
  Store, User, Award, ArrowRight, Package, Edit3, Eye, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from '../components/NotificationDropdown';

export default function ShopSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [settings, setSettings] = useState({
    shopName: 'AutoBolt',
    tagline: 'Modern Vehicle Service Center',
    address: 'Kathmandu, Nepal',
    phone: '+977-9800000000',
    email: 'contact@autobolt.com',
    website: 'www.autobolt.com',
    currency: 'Rs',
    loyaltyThreshold: 5000,
    loyaltyDiscount: 10,
    taxRate: 13,
    invoicePrefix: 'INV-',
    lowStockThreshold: 10,
    enableNotifications: true,
    darkMode: false,
    primaryColor: '#d95d39',
    sessionTimeout: 30,
    minPasswordLength: 8
  });

  // Apply Dark Mode & Theme
  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [settings.darkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--brand', settings.primaryColor);
  }, [settings.primaryColor]);

  useEffect(() => {
    // Load from localStorage if exists
    const saved = localStorage.getItem('shopSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('shopSettings', JSON.stringify(settings));
      setLoading(false);
      setIsEditing(false);
      toast.success('Settings updated successfully!');
      window.dispatchEvent(new Event('settingsUpdated'));
    }, 2000);
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: Store },
    { id: 'business', label: 'Business Rules', icon: Landmark },
    { id: 'interface', label: 'Look & Feel', icon: Palette },
    { id: 'security', label: 'Security', icon: ShieldCheck }
  ];

  const InputField = ({ label, name, type = 'text', placeholder, icon: Icon, suffix }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />}
        <input 
          type={type} 
          disabled={!isEditing}
          className="form-input" 
          style={{ 
            paddingLeft: Icon ? '2.5rem' : '1rem', 
            paddingRight: suffix ? '4rem' : '1rem',
            width: '100%',
            opacity: isEditing ? 1 : 0.8,
            cursor: isEditing ? 'text' : 'not-allowed'
          }}
          placeholder={placeholder}
          value={settings[name]}
          onChange={(e) => setSettings({ ...settings, [name]: e.target.value })}
        />
        {suffix && <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', fontWeight: '800', color: 'var(--ink-soft)' }}>{suffix}</span>}
      </div>
    </div>
  );

  return (
    <>
      <header className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Settings style={{ color: 'var(--brand)' }} size={22} />
          <span className="page-title">Shop Settings</span>
        </div>
        <div className="header-actions">
          <NotificationDropdown />
          {!isEditing ? (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <Edit3 size={18} /> EDIT SETTINGS
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>CANCEL</button>
              <button className="btn btn-primary" disabled={loading} onClick={handleSave}>
                {loading ? <RefreshCw className="spinner" size={18} /> : <><Save size={18} /> SAVE CHANGES</>}
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="page-content" style={{ animation: 'fadeIn 0.5s ease', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        
        {/* Sidebar Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', gap: '0.75rem', padding: '1rem' }}
            >
              <tab.icon size={18} />
              <span style={{ fontWeight: '700' }}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="table-card" style={{ padding: '2rem' }}>
          
          {activeTab === 'general' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Store size={20} color="var(--brand)" /> Store Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <InputField label="Shop Name" name="shopName" icon={Store} placeholder="AutoBolt" />
                <InputField label="Tagline" name="tagline" icon={Info} placeholder="Modern Vehicle Service Center" />
                <div style={{ gridColumn: 'span 2' }}>
                  <InputField label="Address" name="address" icon={MapPin} placeholder="Kathmandu, Nepal" />
                </div>
                <InputField label="Phone Number" name="phone" icon={Phone} placeholder="+977-..." />
                <InputField label="Email Address" name="email" icon={Mail} placeholder="contact@..." />
                <InputField label="Website" name="website" icon={Globe} placeholder="www.autobolt.com" />
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Landmark size={20} color="var(--brand)" /> Business Rules & Logic
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <InputField label="Currency Symbol" name="currency" icon={DollarSign} placeholder="Rs" />
                <InputField label="Tax Rate (VAT)" name="taxRate" type="number" icon={Percent} suffix="%" />
                <InputField label="Loyalty Threshold" name="loyaltyThreshold" type="number" icon={Award} suffix="Spent" />
                <InputField label="Loyalty Discount" name="loyaltyDiscount" type="number" icon={Percent} suffix="%" />
                <InputField label="Invoice Prefix" name="invoicePrefix" icon={Layout} placeholder="INV-" />
                <InputField label="Low Stock Alert" name="lowStockThreshold" type="number" icon={Package} suffix="Units" />
              </div>
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--brand-light)', borderRadius: 'var(--radius)', border: '1px dashed var(--brand)' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Info size={20} color="var(--brand)" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--ink)', lineHeight: '1.5' }}>
                    <strong>Note:</strong> Loyalty rules are applied automatically during the POS checkout process. 
                    Customers spending more than the threshold will receive the specified discount percentage.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interface' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Palette size={20} color="var(--brand)" /> Appearance & Notifications
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Primary Brand Color</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input 
                      type="color" 
                      value={settings.primaryColor} 
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      style={{ width: '60px', height: '40px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>{settings.primaryColor.toUpperCase()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem', background: 'var(--surface-2)', borderRadius: '50%' }}>
                      <Bell size={20} color="var(--ink)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700' }}>Push Notifications</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>Receive alerts for low stock and new orders</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.enableNotifications} 
                    onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem', background: 'var(--surface-2)', borderRadius: '50%' }}>
                      {settings.darkMode ? <Layout size={20} color="var(--ink)" /> : <Palette size={20} color="var(--ink)" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700' }}>Dark Mode</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>Switch between light and dark themes</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    disabled={!isEditing}
                    checked={settings.darkMode} 
                    onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: isEditing ? 'pointer' : 'not-allowed' }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="var(--brand)" /> Security & Session
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <InputField label="Session Timeout" name="sessionTimeout" type="number" icon={RefreshCw} suffix="Minutes" />
                <InputField label="Min Password Length" name="minPasswordLength" type="number" icon={Lock} suffix="Chars" />
              </div>

              <div style={{ padding: '1.5rem', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                 <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <ShieldCheck size={24} color="var(--brand)" />
                    <div>
                       <p style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Role Based Access Control</p>
                       <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: '1.4' }}>
                          Detailed permissions for Sales, Inventory, and Financial reports are managed per staff member.
                       </p>
                       <button className="btn btn-ghost btn-sm" style={{ marginTop: '1rem', padding: '0.4rem 0.8rem' }} onClick={() => navigate('/admin/staff')}>
                          Manage Staff Permissions <ArrowRight size={14} />
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          )}

        </div>

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .dropdown-item:hover { background: var(--brand-light); color: var(--brand); }
      `}</style>
    </>
  );
}
