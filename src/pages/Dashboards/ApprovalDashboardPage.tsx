import { Card } from "antd";
import "./DashboardPage.css";
import { Dashboard } from "../../components/Dashboards/ApprovalDashboard/Dashboard";

export const ApprovalDashboardPage = () => {
  return (
    <div className="container">
      <Card>
        <Dashboard />
      </Card>
    </div>
  );
};
