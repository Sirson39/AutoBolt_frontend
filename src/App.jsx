import React, { useEffect, useState } from "react";
import { appRoutes, publicNav, publicPages, staffPages } from "./data/siteContent";
import { AuthPage, LandingPage, PublicPage } from "./pages/public/PublicPages";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PartsManagement from "./pages/admin/PartsManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import VendorManagement from "./pages/admin/VendorManagement";
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

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import StaffWorkspace from "./pages/staff/StaffWorkspace";

function parseRoute() {
  const hash = window.location.hash.replace(/^#/, "");
  const route = hash || "home";
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

  const onNavigate = (target) => {
    window.location.hash = target;
  };

  if (route === "signin" || route === "signup") {
    return <AuthPage mode={route} onNavigate={onNavigate} publicNav={publicNav} />;
  }

  const adminRoutes = {
    "admin": <AdminDashboard onNavigate={onNavigate} />,
    "admin-parts": <PartsManagement onNavigate={onNavigate} />,
    "admin-customers": <CustomerManagement onNavigate={onNavigate} />,
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

  if (adminRoutes[route]) {
    return adminRoutes[route];
  }

  if (route === "customer") {
    return <CustomerDashboard onNavigate={onNavigate} />;
  }

  if (route === "staff" || staffPages[route]) {
    const routeKey = route === "staff" ? "staff-dashboard" : route;
    return <StaffWorkspace routeKey={routeKey} onNavigate={onNavigate} />;
  }

  if (publicPages[route]) {
    return <PublicPage route={route} config={publicPages[route]} onNavigate={onNavigate} publicNav={publicNav} />;
  }

  return <LandingPage onNavigate={onNavigate} publicNav={publicNav} />;
}
