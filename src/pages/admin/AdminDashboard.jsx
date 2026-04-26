import React from "react";
import RoleDashboardView from "../shared/RoleDashboardView";
import { dashboardData } from "../../data/siteContent";

export default function AdminDashboard({ onNavigate }) {
  return <RoleDashboardView role="admin" data={dashboardData.admin} onNavigate={onNavigate} />;
}
