import { Card } from "antd";
import "./ChooseClassPage.css";
import { ChooseClass } from "../components/ChooseClass/ChooseClass";

export const ChooseClassPage = () => {
  return (
    <div className="container">
      <Card>
        <ChooseClass />
      </Card>
    </div>
  );
};
