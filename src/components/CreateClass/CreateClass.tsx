import React, { SetStateAction } from "react";
import "./CreateClass.css";
import { createClass, getClasses } from "../../api/class";
import { Button, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";

const logKeyMap = {
  Componente: "component",
  "Contexto do Evento": "context",
  Descrição: "description",
  Hora: "hour",
  "Nome completo": "fullName",
  "Nome do evento": "eventName",
  Origem: "origin",
  "Usuário afetado": "affectedUser",
  "endereço IP": "ipAddress",
};

const gradeKeyMap = {
  "Endereço de email": "email",
  Nome: "name",
  Sobrenome: "lastName",
} as Record<string, string>;

const deliveryExclusionData = [
  "",
  "Endereço de email",
  "Dúvidas",
  "Cronograma",
];

type GradeData = {
  email: string;
  name: string;
  lastName: string;
};

type FormFields = {
  name: string;
  fileLog: File;
  fileGrade: File;
  fileDelivery: File;
};

export const CreateClass = () => {
  const [loading, setLoading] = React.useState(false);

  const [materials, setDeliveryData] = React.useState<string[]>([]);
  const [names, setGradeData] = React.useState<string[]>([]);

  const beforeUpload =
    (setFn: SetStateAction<any>, type: "log" | "delivery" | "grade") =>
    (file: RcFile) => {
      if (type === "log") {
        return false;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        Papa.parse(e.target?.result as any, {
          header: type === "grade",
          skipEmptyLines: true,
          complete: function (results) {
            if (type === "grade") {
              const actualData = (results.data as Record<string, string>[]).map(
                (entry: Record<string, string>) => {
                  const currentKeys = Object.keys(gradeKeyMap);
                  return currentKeys.reduce((result, key) => {
                    result[gradeKeyMap[key]] = entry[key];
                    return result;
                  }, {} as Record<string, string>);
                }
              ) as GradeData[];
              const names = actualData.map((d) => d.name + " " + d.lastName);
              setFn(names);
            } else {
              const materials = (results.data[0] as string[]).filter(
                (v: string) => !deliveryExclusionData.includes(v)
              );
              setFn(materials);
            }
          },
        });
      };
      reader.readAsText(file);

      return false;
    };

  const getFile = (e: UploadChangeParam<UploadFile<any>>) => {
    return e && e.file;
  };

  const getFileLog = (e: UploadChangeParam<UploadFile<any>>) => getFile(e);

  const getFileGrade = (e: UploadChangeParam<UploadFile<any>>) => getFile(e);

  const getFileDelivery = (e: UploadChangeParam<UploadFile<any>>) => getFile(e);

  const navigate = useNavigate();

  const onFinish = (fields: FormFields) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("class_name", fields.name);
    formData.append("file_log", fields.fileLog);
    formData.append("file_delivery", fields.fileDelivery);
    formData.append("file_grade", fields.fileGrade);
    formData.append(
      "ignore_user_names",
      "Vitor Rodarte Ricoy,Vitor Assunção Rabello de Oliveira,Luana Luiza Bastos,Raquel Cardoso de Melo Minardi,Luciana Carvalho,Nailton Monteiro do Nascimento Júnior,-"
    );
    formData.append("ignore_activities", "");
    createClass(formData).then((userClass) => {
      setLoading(false);
      if (userClass) {
        localStorage.setItem("classCode", userClass.code.toString());
        navigate("/dashboard");
      }
    });
  };

  return (
    <div>
      <h2>Cadastrar uma nova turma</h2>
      <Form className="login-form" onFinish={onFinish}>
        <Form.Item required name="name">
          <Input placeholder="Nome da turma" />
        </Form.Item>
        <Form.Item required name="fileLog" getValueFromEvent={getFileLog}>
          <Upload
            maxCount={1}
            accept=".csv"
            beforeUpload={beforeUpload(undefined, "log")}
            onChange={getFileLog}
            multiple={false}
          >
            <Button icon={<UploadOutlined />}>Enviar csv dos logs</Button>
          </Upload>
        </Form.Item>
        <Form.Item required name="fileGrade" getValueFromEvent={getFileGrade}>
          <Upload
            maxCount={1}
            accept=".csv"
            beforeUpload={beforeUpload(setGradeData, "grade")}
            onChange={getFileGrade}
            multiple={false}
          >
            <Button icon={<UploadOutlined />}>Enviar csv das notas</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          required
          name="fileDelivery"
          getValueFromEvent={getFileDelivery}
        >
          <Upload
            maxCount={1}
            accept=".csv"
            beforeUpload={beforeUpload(setDeliveryData, "delivery")}
            onChange={getFileDelivery}
            multiple={false}
          >
            <Button icon={<UploadOutlined />}>Enviar csv das entregas</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="login-form-button"
          >
            Continuar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
