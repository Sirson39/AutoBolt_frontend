import React, { useEffect, useState } from "react";
import { appRoutes, publicNav, publicPages, staffPages } from "./data/siteContent";
import { AuthPage, LandingPage, PublicPage } from "./pages/public/PublicPages";
import ForgotPasswordPage from "./pages/public/ForgotPassword";
import ResetPasswordPage from "./pages/public/ResetPassword";
import ChangePasswordPage from "./pages/shared/ChangePassword";
import UpdateProfilePage from "./pages/shared/UpdateProfile";
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
import AdminProfile from "./pages/admin/AdminProfile";
import BookingManagement from "./pages/admin/BookingManagement";
import PartRequestsManagement from "./pages/admin/PartRequestsManagement";
import ServiceReviewsManagement from "./pages/admin/ServiceReviewsManagement";
import { Toaster } from "react-hot-toast";
import VerifyEmail from "./pages/public/VerifyEmail";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import MyBookings from "./pages/customer/MyBookings";
import MyPartRequests from "./pages/customer/MyPartRequests";
import MyReviews from "./pages/customer/MyReviews";
import MyVehicles from "./pages/customer/MyVehicles";
import MyServiceHistory from "./pages/customer/MyServiceHistory";
import StaffWorkspace from "./pages/staff/StaffWorkspace";
import { isAuthenticated, getRole } from "./utils/auth";

const PROTECTED_PREFIXES = ['admin', 'staff', 'customer'];

function isProtected(route) {
  return PROTECTED_PREFIXES.some(p => route === p || route.startsWith(`${p}-`));
}

function parseRoute() {
  const hash = window.location.hash.replace(/^#/, "");
  const route = (hash || "home").split("?")[0];
  if (route.startsWith('admin-')) return route;
  if (route.startsWith('customer-')) return route;
  return appRoutes.has(route) ? route : "home";
}

export default function App() {
  const [route, setRoute] = useState(parseRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) window.location.hash = "#home";
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (isProtected(route) && !isAuthenticated()) {
      window.location.hash = '#signin';
    }
  }, [route]);

  useEffect(() => {
    if ((route === 'signin' || route === 'signup') && isAuthenticated()) {
      const role = getRole();
      if (role === 'Admin') window.location.hash = '#admin';
      else if (role === 'Staff') window.location.hash = '#staff-dashboard';
      else window.location.hash = '#customer';
    }
  }, [route]);

  useEffect(() => {
    const titles = {
      home: "AutoBolt | Home",
      "home-roles": "AutoBolt | Roles",
      "home-features": "AutoBolt | Features",
      "home-workflow": "AutoBolt | Workflow",
      "home-benefits": "AutoBolt | Benefits",
      about: "AutoBolt | About",
      contact: "AutoBolt | Contact",
      "customer-register": "AutoBolt | Customer Registration",
      signin: "AutoBolt | Sign In",
      signup: "AutoBolt | Sign Up",
      "forgot-password": "AutoBolt | Forgot Password",
      "reset-password": "AutoBolt | Reset Password",
      "change-password": "AutoBolt | Change Password",
      "update-profile": "AutoBolt | Update Profile",
      admin: "AutoBolt | Admin Dashboard",
      staff: "AutoBolt | Staff Dashboard",
      customer: "AutoBolt | Customer Dashboard",
      "staff-dashboard": "AutoBolt | Staff Dashboard",
      "customer-registration": "AutoBolt | Customer Registration",
      "customer-search": "AutoBolt | Customer Search",
      "customer-details": "AutoBolt | Customer Details",
      "vehicle-details": "AutoBolt | Vehicle Details",
      "verify-email": "AutoBolt | Account Verification",
      "sales-invoice": "AutoBolt | Sales Invoice",
      "email-invoice": "AutoBolt | Email Invoice",
      "customer-history": "AutoBolt | Service History",
      "customer-reports": "AutoBolt | Customer Reports",
      "customer-bookings": "AutoBolt | My Bookings",
      "customer-part-requests": "AutoBolt | Part Requests",
      "customer-reviews": "AutoBolt | My Reviews",
      "customer-vehicles": "AutoBolt | My Vehicles",
    };
    document.title = titles[route] || "AutoBolt";
  }, [route]);

  useEffect(() => {
    const isAdmin = route === 'admin' || route.startsWith('admin-');
    const isAuth = route === 'signin' || route === 'signup';
    const isPublic = route === 'home' || route === 'about' || route === 'contact' || route === 'customer-register';

    document.body.classList.toggle('admin-mode', isAdmin);
    document.body.classList.toggle('auth-page', isAuth);
    document.body.classList.toggle('public-page', isPublic);
  }, [route]);

  const onNavigate = (target) => { window.location.hash = target; };

  if (route === "signin" || route === "signup") {
    return <AuthPage mode={route} onNavigate={onNavigate} publicNav={publicNav} />;
  }

  if (route === "forgot-password") {
    return <ForgotPasswordPage onNavigate={onNavigate} publicNav={publicNav} />;
  }

  if (route === "reset-password") {
    return <ResetPasswordPage onNavigate={onNavigate} publicNav={publicNav} />;
  }

  if (route === "change-password") {
    return <ChangePasswordPage onNavigate={onNavigate} />;
  }

  if (route === "update-profile") {
    return <UpdateProfilePage onNavigate={onNavigate} />;
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
    "admin-profile": <AdminProfile onNavigate={onNavigate} />,
    "admin-bookings": <BookingManagement onNavigate={onNavigate} />,
    "admin-part-requests": <PartRequestsManagement onNavigate={onNavigate} />,
    "admin-reviews": <ServiceReviewsManagement onNavigate={onNavigate} />,
  };

  const customerRoutes = {
    "customer-bookings": <MyBookings onNavigate={onNavigate} />,
    "customer-part-requests": <MyPartRequests onNavigate={onNavigate} />,
    "customer-reviews": <MyReviews onNavigate={onNavigate} />,
    "customer-vehicles": <MyVehicles onNavigate={onNavigate} />,
    "customer-history": <MyServiceHistory onNavigate={onNavigate} />,
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {adminRoutes[route] ? (
        <AdminLayout onNavigate={onNavigate}>{adminRoutes[route]}</AdminLayout>
      ) : customerRoutes[route] && getRole() === 'Customer' ? (
        customerRoutes[route]
      ) : route === "customer" ? (
        <CustomerDashboard onNavigate={onNavigate} />
      ) : (route === "staff" || staffPages[route]) ? (
        <StaffWorkspace routeKey={route === "staff" ? "staff-dashboard" : route} onNavigate={onNavigate} />
      ) : route === "customer-register" ? (
        <PublicPage route={route} config={publicPages[route]} onNavigate={onNavigate} publicNav={publicNav} />
      ) : route === "home" || route === "home-roles" || route === "home-features" || route === "home-workflow" || route === "home-benefits" || route === "about" || route === "contact" ? (
        <LandingPage route={route} onNavigate={onNavigate} publicNav={publicNav} />
      ) : (
        <LandingPage route="home" onNavigate={onNavigate} publicNav={publicNav} />
      )}
    </>
  );
}
