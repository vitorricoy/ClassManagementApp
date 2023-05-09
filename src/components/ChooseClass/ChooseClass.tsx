import { Button, Card, Spin } from "antd";
import React from "react";
import "./ChooseClass.css";
import { RightOutlined } from "@ant-design/icons";
import { Class, getClasses } from "../../api/class";
import { useNavigate } from "react-router-dom";

export const ChooseClassWithClass = ({
  userClasses,
  loading,
}: {
  userClasses: Class[];
  loading: boolean;
}) => {
  const navigate = useNavigate();

  const chooseClass = (code: number) => {
    localStorage.setItem("classCode", code.toString());
    navigate("/dashboard");
  };

  return (
    <div className="cardContainer">
      <div style={{ textAlign: "center" }}>
        <h2>Escolher turma</h2>
      </div>
      <Card className="borderInBetween clickable">
        {userClasses.map((item) => (
          <div
            key={item.code}
            className="list-item"
            onClick={() => chooseClass(item.code)}
          >
            {item.name} <RightOutlined />
          </div>
        ))}
      </Card>
      <Button
        loading={loading}
        onClick={() => navigate("/class/create")}
        type="primary"
      >
        Criar turma
      </Button>
    </div>
  );
};

export const ChooseClassNoClass = ({ loading }: { loading: boolean }) => {
  const navigate = useNavigate();

  return (
    <div className="cardContainer">
      <div style={{ textAlign: "center" }}>
        <h2>Você ainda não tem turmas</h2>
      </div>
      <Button
        loading={loading}
        onClick={() => navigate("/class/create")}
        type="primary"
      >
        Criar turma
      </Button>
    </div>
  );
};

export const ChooseClass = () => {
  const [loading, setLoading] = React.useState(false);
  const [classes, setClasses] = React.useState<Class[]>([]);

  React.useEffect(() => {
    setLoading(true);
    getClasses().then((classes) => {
      setLoading(false);
      if (classes) {
        setClasses(classes);
      }
    });
  }, []);

  if (loading) {
    return <Spin />;
  }

  if (!loading && classes.length) {
    return <ChooseClassWithClass userClasses={classes} loading={loading} />;
  }

  return <ChooseClassNoClass loading={loading} />;
};
