import { Card } from "antd";
import "./DashboardPage.css";
import { Dashboard } from "../../components/Dashboards/ProgressDashboard/Dashboard";

export const ProgressDashboardPage = () => {
  return (
    <div className="container">
      <Card>
        <Dashboard />
      </Card>
    </div>
  );
};
