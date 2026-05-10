import React from "react";
import RoleDashboardView from "../shared/RoleDashboardView";
import { dashboardData } from "../../data/siteContent";
import { clearAuth, getUser } from "../../utils/auth";

export default function CustomerDashboard({ onNavigate }) {
  const currentUser = getUser();

  const handleLogout = () => {
    clearAuth();
    onNavigate('signin');
  };

  return (
    <RoleDashboardView
      role="customer"
      data={dashboardData.customer}
      onNavigate={onNavigate}
      onLogout={handleLogout}
      currentUser={currentUser}
    />
  );
}
