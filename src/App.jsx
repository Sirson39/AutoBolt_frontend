import React, { useEffect, useState } from "react";
import { appRoutes, publicNav, publicPages, staffPages } from "./data/siteContent";
import { AuthPage, LandingPage, PublicPage } from "./pages/public/PublicPages";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import PartsManagement from "./pages/admin/PartsManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import VendorManagement from "./pages/admin/VendorManagement";
import VehicleManagement from "./pages/admin/VehicleManagement";
import StaffManagement from "./pages/admin/StaffManagement";
import SalesManagement from "./pages/admin/SalesManagement";
import PurchaseManagement from "./pages/admin/PurchaseManagement";
import FinancialReports from "./pages/admin/FinancialReports";
import InventoryReport from "./pages/admin/InventoryReport";
import Notifications from "./pages/admin/Notifications";
import ShopSettings from "./pages/admin/ShopSettings";
import CreateInvoice from "./pages/admin/CreateInvoice";
import CreatePurchaseInvoice from "./pages/admin/CreatePurchaseInvoice";
import LoyaltyProgram from "./pages/admin/LoyaltyProgram";
import { Toaster } from "react-hot-toast";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import StaffWorkspace from "./pages/staff/StaffWorkspace";

function parseRoute() {
  const hash = window.location.hash.replace(/^#/, "");
  const route = hash || "home";
  // Always allow admin routes to prevent redirection issues
  if (route.startsWith('admin-')) return route;
  return appRoutes.has(route) ? route : "home";
}

export default function App() {
  const [route, setRoute] = useState(parseRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) {
      window.location.hash = "#home";
    }
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const titles = {
      home: "AutoBolt | Landing",
      about: "AutoBolt | About",
      contact: "AutoBolt | Contact",
      "customer-register": "AutoBolt | Customer Register",
      signin: "AutoBolt | Sign In",
      signup: "AutoBolt | Sign Up",
      admin: "AutoBolt | Admin Dashboard",
      staff: "AutoBolt | Staff Dashboard",
      customer: "AutoBolt | Customer Dashboard",
      "staff-dashboard": "AutoBolt | Staff Dashboard",
      "customer-registration": "AutoBolt | Customer Registration",
      "customer-search": "AutoBolt | Customer Search",
      "customer-details": "AutoBolt | Customer Details",
      "vehicle-details": "AutoBolt | Vehicle Details",
      "sales-invoice": "AutoBolt | Sales Invoice",
      "email-invoice": "AutoBolt | Email Invoice",
      "customer-history": "AutoBolt | Customer History",
      "customer-reports": "AutoBolt | Customer Reports"
    };
    document.title = titles[route] || "AutoBolt";
  }, [route]);

  useEffect(() => {
    if (route === 'admin' || route.startsWith('admin-')) {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
  }, [route]);

  const onNavigate = (target) => {
    window.location.hash = target;
  };

  if (route === "signin" || route === "signup") {
    return <AuthPage mode={route} onNavigate={onNavigate} publicNav={publicNav} />;
  }

  const adminRoutes = {
    "admin": <Dashboard onNavigate={onNavigate} />,
    "admin-parts": <PartsManagement onNavigate={onNavigate} />,
    "admin-customers": <CustomerManagement onNavigate={onNavigate} />,
    "admin-vehicles": <VehicleManagement onNavigate={onNavigate} />,
    "admin-vendors": <VendorManagement onNavigate={onNavigate} />,
    "admin-staff": <StaffManagement onNavigate={onNavigate} />,
    "admin-sales": <SalesManagement onNavigate={onNavigate} />,
    "admin-purchase": <PurchaseManagement onNavigate={onNavigate} />,
    "admin-reports": <FinancialReports onNavigate={onNavigate} />,
    "admin-inventory": <InventoryReport onNavigate={onNavigate} />,
    "admin-notifications": <Notifications onNavigate={onNavigate} />,
    "admin-settings": <ShopSettings onNavigate={onNavigate} />,
    "admin-create-invoice": <CreateInvoice onNavigate={onNavigate} />,
    "admin-create-purchase": <CreatePurchaseInvoice onNavigate={onNavigate} />,
    "admin-loyalty": <LoyaltyProgram onNavigate={onNavigate} />,
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {adminRoutes[route] ? (
        <AdminLayout onNavigate={onNavigate}>{adminRoutes[route]}</AdminLayout>
      ) : route === "customer" ? (
        <CustomerDashboard onNavigate={onNavigate} />
      ) : (route === "staff" || staffPages[route]) ? (
        <StaffWorkspace routeKey={route === "staff" ? "staff-dashboard" : route} onNavigate={onNavigate} />
      ) : publicPages[route] ? (
        <PublicPage route={route} config={publicPages[route]} onNavigate={onNavigate} publicNav={publicNav} />
      ) : (
        <LandingPage onNavigate={onNavigate} publicNav={publicNav} />
      )}
    </>
  );
}
