import React, { useState, useEffect } from "react";
import RoleDashboardView from "../shared/RoleDashboardView";
import { dashboardData } from "../../data/siteContent";
import { clearAuth, getUser } from "../../utils/auth";
import api from "../../utils/api";
import toast from "react-hot-toast";

const RISK_COLORS = { Low: '#16a34a', Moderate: '#d97706', High: '#ea580c', Critical: '#dc2626' };
const RISK_BG = { Low: '#f0fdf4', Moderate: '#fffbeb', High: '#fff7ed', Critical: '#fef2f2' };

export default function CustomerDashboard({ onNavigate }) {
  const currentUser = getUser();
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState(null);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fallback to empty array if customerId is missing (e.g. admin viewing as customer)
        const custId = currentUser?.customerId || currentUser?.id;
        
        const [invoicesRes, vehiclesRes, predictionsRes] = await Promise.all([
          api.get('/api/invoices'),
          custId ? api.get(`/api/vehicles/customer/${custId}`) : { data: [] },
          custId ? api.get(`/api/vehicles/customer/${custId}/predictions`).catch(() => ({ data: [] })) : { data: [] }
        ]);
        setPredictions(Array.isArray(predictionsRes.data) ? predictionsRes.data : []);

        // Filter invoices to just this customer
        const myInvoices = custId ? invoicesRes.data.filter(i => String(i.customerId) === String(custId)) : [];
        const myVehicles = vehiclesRes.data || [];

        // Build dynamic dashboard data
        const baseData = dashboardData.customer;
        
        // Calculate items purchased safely
        let itemsPurchased = 0;
        myInvoices.forEach(inv => {
          if (inv.items && Array.isArray(inv.items)) {
            itemsPurchased += inv.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
          } else {
            itemsPurchased += 1; // Fallback if items array isn't populated
          }
        });

        // Create rows for recent activity
        const recentRows = myInvoices.slice(0, 4).map(inv => [
          `Invoice ${inv.invoiceNumber || '#' + inv.id}`, 
          'Completed', 
          new Date(inv.invoiceDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }), 
          'good'
        ]);

        if (recentRows.length === 0 && myVehicles.length > 0) {
          recentRows.push([
            myVehicles[0].model || myVehicles[0].registrationNumber,
            'Registered',
            'Active',
            'good'
          ]);
        }

        const predData = Array.isArray(predictionsRes.data) ? predictionsRes.data : [];
        const alertCount = predData.filter(p => p.riskLevel !== 'Low').length;

        setLiveData({
          ...baseData,
          kpis: [
            { label: "Vehicles Registered", value: myVehicles.length.toString(), delta: "Active fleet" },
            { label: "Service Invoices", value: myInvoices.length.toString(), delta: "Total visits" },
            { label: "Items Purchased", value: itemsPurchased.toString(), delta: "Parts & services" },
            { label: "AI Alerts", value: alertCount.toString(), delta: alertCount > 0 ? "Vehicles need attention" : "All vehicles healthy" }
          ],
          rows: recentRows.length > 0 ? recentRows : [["No recent activity", "-", "-", "warn"]]
        });

      } catch (err) {
        console.error(err);
        toast.error("Failed to load customer dashboard data");
        setLiveData(dashboardData.customer); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleLogout = () => {
    clearAuth();
    onNavigate('signin');
  };

  if (loading) {
    return <div className="loading"><div className="spinner" /> Loading your dashboard...</div>;
  }

  return (
    <RoleDashboardView
      role="customer"
      data={liveData || dashboardData.customer}
      onNavigate={onNavigate}
      onLogout={handleLogout}
      currentUser={currentUser}
    >
      {predictions.length > 0 && (
        <section style={{ padding: '1.5rem 2rem 2rem' }}>
          <h3 style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '1rem' }}>Vehicle Health Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {predictions.map(p => (
              <div key={p.vehicleId} style={{
                padding: '1rem 1.25rem', borderRadius: '12px',
                background: RISK_BG[p.riskLevel] || '#f9fafb',
                borderLeft: `4px solid ${RISK_COLORS[p.riskLevel] || '#6b7280'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>
                    {p.licensePlate} — {p.make} {p.model}
                  </span>
                  <span style={{
                    padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700',
                    background: RISK_COLORS[p.riskLevel] + '20',
                    color: RISK_COLORS[p.riskLevel]
                  }}>
                    {p.riskLevel} Risk
                  </span>
                </div>
                {p.predictions.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: '#16a34a', margin: 0 }}>No issues detected.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                    {p.predictions.map((msg, i) => <li key={i}>{msg}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </RoleDashboardView>
  );
}
