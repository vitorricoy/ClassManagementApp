import { Card } from "antd";
import { Register } from "../components/Register/Register";
import "./RegisterPage.css";

export const RegisterPage = () => {
  return (
    <div className="container">
      <Card>
        <Register />
      </Card>
    </div>
  );
};
