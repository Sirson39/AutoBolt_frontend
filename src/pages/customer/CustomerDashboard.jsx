import React from "react";
import RoleDashboardView from "../shared/RoleDashboardView";
import { dashboardData } from "../../data/siteContent";

export default function CustomerDashboard({ onNavigate }) {
  return <RoleDashboardView role="customer" data={dashboardData.customer} onNavigate={onNavigate} />;
}
