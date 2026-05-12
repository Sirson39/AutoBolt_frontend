import React, { useState, useEffect } from "react";
import RoleDashboardView from "../shared/RoleDashboardView";
import { dashboardData } from "../../data/siteContent";
import { clearAuth, getUser } from "../../utils/auth";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function CustomerDashboard({ onNavigate }) {
  const currentUser = getUser();
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fallback to empty array if customerId is missing (e.g. admin viewing as customer)
        const custId = currentUser?.customerId || currentUser?.id;
        
        const [invoicesRes, vehiclesRes] = await Promise.all([
          api.get('/api/invoices'),
          custId ? api.get(`/api/vehicles/customer/${custId}`) : { data: [] }
        ]);

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

        setLiveData({
          ...baseData,
          kpis: [
            { label: "Vehicles Registered", value: myVehicles.length.toString(), delta: "Active fleet" },
            { label: "Service Invoices", value: myInvoices.length.toString(), delta: "Total visits" },
            { label: "Items Purchased", value: itemsPurchased.toString(), delta: "Parts & services" },
            { label: "AI Alerts", value: "0", delta: "Predictive reminders active" }
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
    />
  );
}
