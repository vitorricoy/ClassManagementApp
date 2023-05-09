import { Card } from "antd";
import "./DashboardPage.css";
import { Dashboard } from "../../components/Dashboards/FrequencyDashboard/Dashboard";

export const FrequencyDashboardPage = () => {
  return (
    <div className="container">
      <Card>
        <Dashboard />
      </Card>
    </div>
  );
};
