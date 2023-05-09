import { Card } from "antd";
import "./DashboardPage.css";
import { Dashboard } from "../../components/Dashboards/DeliveriesDashboard/Dashboard";

export const DeliveriesDashboardPage = () => {
  return (
    <div className="container">
      <Card>
        <Dashboard />
      </Card>
    </div>
  );
};
