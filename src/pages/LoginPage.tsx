import { Card } from "antd";
import { Login } from "../components/Login/Login";
import "./LoginPage.css";

export const LoginPage = () => {
  return (
    <div className="container">
      <Card>
        <Login />
      </Card>
    </div>
  );
};
