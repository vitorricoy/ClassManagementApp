import React, { SetStateAction } from "react";
import "./CreateClass.css";
import { getClasses } from "../../api/class";
import { Button, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import Papa from "papaparse";

const logKeyMap = {
    "Componente": 'component',
    "Contexto do Evento": 'context',
    "Descrição": 'description',
    "Hora": 'hour',
    "Nome completo": 'fullName',
    "Nome do evento": 'eventName',
    "Origem": 'origin',
    "Usuário afetado": 'affectedUser',
    "endereço IP": 'ipAddress',
};

const gradeKeyMap = {
    "Endereço de email": 'email',
    "Nome": 'name',
    "Sobrenome": 'lastName',
} as Record<string, string>;

const deliveryExclusionData = [
    '',
    'Endereço de email',
    'Dúvidas',
    'Cronograma',
]

type GradeData = {
    email: string;
    name: string;
    lastName: string;
};

export const CreateClass = () => {
    const [loading, setLoading] = React.useState(false);

    const [materials, setDeliveryData] = React.useState<string[]>([]);
    const [names, setGradeData] = React.useState<string[]>([]);

    const beforeUpload = (setFn: SetStateAction<any>, type: 'log' | 'delivery' | 'grade') => (file: RcFile) => {
        if (type === 'log') {
            return false;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            Papa.parse(e.target?.result as any, {
                header: type === 'grade',
                skipEmptyLines: true,
                complete: function (results) {
                    if (type === 'grade') {
                        const actualData = (results.data as Record<string, string>[]).map((entry: Record<string, string>) => {
                            const currentKeys = Object.keys(gradeKeyMap);
                            return currentKeys.reduce((result, key) => {
                                result[gradeKeyMap[key]] = entry[key];
                                return result;
                            }, {} as Record<string, string>);
                        }) as GradeData[];
                        const names = actualData.map(d => d.name + " " + d.lastName);
                        setFn(names);
                    } else {
                        const materials = (results.data[0] as string[]).filter((v: string) => !deliveryExclusionData.includes(v));
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

    return (
        <div>
            <h2>Cadastrar uma nova turma</h2>
            <Form className="login-form" onFinish={console.log}>
                <Form.Item required name="name">
                    <Input placeholder="Nome da turma" />
                </Form.Item>
                <Form.Item required name="file_log" getValueFromEvent={getFileLog}>
                    <Upload
                        maxCount={1}
                        accept=".csv"
                        beforeUpload={beforeUpload(undefined, 'log')}
                        onChange={getFileLog}
                        multiple={false}
                    >
                        <Button icon={<UploadOutlined />}>Enviar csv dos logs</Button>
                    </Upload>
                </Form.Item>
                <Form.Item required name="file_grade" getValueFromEvent={getFileGrade}>
                    <Upload
                        maxCount={1}
                        accept=".csv"
                        beforeUpload={beforeUpload(setGradeData, 'grade')}
                        onChange={getFileGrade}
                        multiple={false}
                    >
                        <Button icon={<UploadOutlined />}>Enviar csv das notas</Button>
                    </Upload>
                </Form.Item>
                <Form.Item
                    required
                    name="file_delivery"
                    getValueFromEvent={getFileDelivery}
                >
                    <Upload
                        maxCount={1}
                        accept=".csv"
                        beforeUpload={beforeUpload(setDeliveryData, 'delivery')}
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
                        className="login-form-button"
                    >
                        Continuar
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
