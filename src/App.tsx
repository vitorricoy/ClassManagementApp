import React from "react";
import "./App.css";
import { useRoutes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ChooseClassPage } from "./pages/ChooseClassPage";
import { CreateClassPage } from "./pages/CreateClassPage";
import { DeliveriesDashboardPage } from "./pages/Dashboards/DeliveriesDashboardPage";
import { GradesDashboardPage } from "./pages/Dashboards/GradesDashboardPage";
import { ModulesDashboardPage } from "./pages/Dashboards/ModulesDashboardPage";
import { ProgressDashboardPage } from "./pages/Dashboards/ProgressDashboardPage";
import { FrequencyDashboardPage } from "./pages/Dashboards/FrequencyDashboardPage";
import { ApprovalDashboardPage } from "./pages/Dashboards/ApprovalDashboardPage";
import { UpdateClassPage } from "./pages/UpdateClassPage";

function App() {
  const routes = useRoutes([
    { path: "/", element: <LoginPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/class/choose", element: <ChooseClassPage /> },
    { path: "/class/create", element: <CreateClassPage /> },
    { path: "/dashboard", element: <DeliveriesDashboardPage /> },
    { path: "/dashboard/deliveries", element: <DeliveriesDashboardPage /> },
    { path: "/dashboard/grades", element: <GradesDashboardPage /> },
    { path: "/dashboard/modules", element: <ModulesDashboardPage /> },
    { path: "/dashboard/progress", element: <ProgressDashboardPage /> },
    { path: "/dashboard/frequency", element: <FrequencyDashboardPage /> },
    { path: "/dashboard/approval", element: <ApprovalDashboardPage /> },
    { path: "/class/update", element: <UpdateClassPage /> },
  ]);

  return routes;
}

export default App;
