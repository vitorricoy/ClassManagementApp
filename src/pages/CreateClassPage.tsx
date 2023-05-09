import { Card } from "antd";
import "./CreateClassPage.css";
import { CreateClass } from "../components/CreateClass/CreateClass";

export const CreateClassPage = () => {
  return (
    <div className="container">
      <Card>
        <CreateClass />
      </Card>
    </div>
  );
};
