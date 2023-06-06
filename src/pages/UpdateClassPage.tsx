import { Card } from "antd";
import "./UpdateClassPage.css";
import { UpdateClass } from "../components/UpdateClass/UpdateClass";

export const UpdateClassPage = () => {
  return (
    <div className="container">
      <Card>
        <UpdateClass />
      </Card>
    </div>
  );
};
