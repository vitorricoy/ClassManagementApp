import { Card } from "antd";
import "./DashboardPage.css";
import { Dashboard } from "../../components/Dashboards/ModulesDashboard/Dashboard";

export const ModulesDashboardPage = () => {
  return (
    <div className="container">
      <Card>
        <Dashboard />
      </Card>
    </div>
  );
};
