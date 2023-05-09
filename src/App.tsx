import React from "react";
import "./App.css";
import { useRoutes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ChooseClassPage } from "./pages/ChooseClassPage";
import { CreateClassPage } from "./pages/CreateClassPage";

function App() {
  const routes = useRoutes([
    { path: "/", element: <LoginPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/class/choose", element: <ChooseClassPage /> },
    { path: "/class/create", element: <CreateClassPage /> },
  ]);

  return routes;
}

export default App;
