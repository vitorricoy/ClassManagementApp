import React from "react";
import "./Dashboard.css";
import { NavigationMenu } from "../../NavigationMenu/NavigationMenu";
import Plot from "react-plotly.js";
import { Menu, Spin, Table } from "antd";
import {
  getMeanStudent,
  getRepetitionMaterial,
  getRepetitionMaterialStudent,
  ProgressMeanStudent,
  ProgressRepetitionMaterial,
  ProgressRepetitionMaterialStudent,
} from "../../../api/progress";

const ProgressMeanStudentPlot = () => {
  const [progressMeanStudent, setProgressMeanStudent] = React.useState<
    ProgressMeanStudent[]
  >([]);

  React.useEffect(() => {
    if (!progressMeanStudent.length) {
      getMeanStudent().then((data) => {
        if (data) {
          setProgressMeanStudent(data);
        }
      });
    }
  });

  const getPlot = () => {
    return (
      <Plot
        style={{ paddingTop: "20px" }}
        data={[
          {
            x: progressMeanStudent.map((v) => v.email),
            y: progressMeanStudent.map((v) => v.repetition),
            type: "bar",
          },
        ]}
        layout={{
          title:
            "Número médio de vezes que um material é repetido por aluno (dentre os materiais que ele viu ao menos uma vez)",
          yaxis: { title: "Frequência" },
          margin: {
            t: 50,
            b: 250,
            l: 80,
            r: 50,
            pad: 0,
          },
          width: window.innerWidth - 20,
          height: window.innerHeight - 150,
          xaxis: {
            title: { text: "Aluno", standoff: 0 },
            tickangle: 90,
          },
        }}
      />
    );
  };

  return progressMeanStudent.length ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const ProgressRepetitionMaterialStudentPlot = () => {
  const [progressRepetition, setProgressRepetition] = React.useState<
    ProgressRepetitionMaterialStudent[]
  >([]);

  React.useEffect(() => {
    if (!progressRepetition.length) {
      getRepetitionMaterialStudent().then((data) => {
        if (data) {
          setProgressRepetition(data);
        }
      });
    }
  });

  const columns = [
    {
      title: "Atividade",
      dataIndex: "material",
      key: "material",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Repetições da atividade",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Repetições média do aluno",
      dataIndex: "user_mean",
      key: "user_mean",
    },
  ];

  const getPlot = () => {
    return (
      <div style={{ padding: 20 }}>
        <Table
          pagination={{
            locale: {
              items_per_page: "itens",
              jump_to: "pular para",
              jump_to_confirm: "pular para confirmação",
              page: "Página",
              prev_page: "Página anterior",
              next_page: "Próxima página",
              prev_5: "Voltar 5 páginas",
              next_5: "Avançar 5 páginas",
              prev_3: "Voltar 3 páginas",
              next_3: "Avançar 3 páginas",
            },
          }}
          dataSource={progressRepetition.map((v) => {
            return {
              ...v,
              user_mean: v.user_mean.toFixed(2),
            };
          })}
          columns={columns}
        />
      </div>
    );
  };

  return progressRepetition.length ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const ProgressHistogramStudentPlot = () => {
  const [progressHistogramStudent, setProgressHistogramStudent] =
    React.useState<number[]>([]);

  React.useEffect(() => {
    if (!progressHistogramStudent.length) {
      getMeanStudent().then((data) => {
        if (data) {
          setProgressHistogramStudent(data.map((v) => v.repetition));
        }
      });
    }
  });

  const getPlot = () => {
    const maxRepetition = progressHistogramStudent
      ? Math.max(...progressHistogramStudent)
      : 0;
    return (
      <Plot
        style={{ paddingTop: "20px" }}
        data={[
          {
            x: progressHistogramStudent,
            type: "histogram",
            xbins: {
              start: 1,
              end: maxRepetition,
              size: 0.25,
            },
          },
        ]}
        layout={{
          title:
            "Histograma da repetição média da visualização de materiais por aluno",
          bargap: 0.1,
          margin: {
            t: 50,
            b: 50,
            l: 80,
            r: 50,
            pad: 0,
          },
          xaxis: {
            title: "Frequência",
            nticks: maxRepetition,
            tick0: 1,
            dtick: 0.25,
            tickformat: ".2f",
          },
          yaxis: {
            title: "Número de alunos",
          },
          width: window.innerWidth - 20,
          height: window.innerHeight - 200,
        }}
      />
    );
  };

  return progressHistogramStudent.length ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const ProgressRepetitionMaterialPlot = () => {
  const [progressRepetition, setProgressRepetition] = React.useState<
    ProgressRepetitionMaterial[]
  >([]);

  React.useEffect(() => {
    if (!progressRepetition.length) {
      getRepetitionMaterial().then((data) => {
        if (data) {
          setProgressRepetition(data);
        }
      });
    }
  });

  const columns = [
    {
      title: "Atividade",
      dataIndex: "material",
      key: "material",
    },
    {
      title: "Repetições médias da atividade",
      dataIndex: "count",
      key: "count",
    },
  ];

  const getPlot = () => {
    return (
      <div style={{ padding: 20 }}>
        <Table
          pagination={{
            locale: {
              items_per_page: "itens",
              jump_to: "pular para",
              jump_to_confirm: "pular para confirmação",
              page: "Página",
              prev_page: "Página anterior",
              next_page: "Próxima página",
              prev_5: "Voltar 5 páginas",
              next_5: "Avançar 5 páginas",
              prev_3: "Voltar 3 páginas",
              next_3: "Avançar 3 páginas",
            },
          }}
          dataSource={progressRepetition.map((v) => {
            return {
              ...v,
              count: v.count.toFixed(2),
            };
          })}
          columns={columns}
        />
      </div>
    );
  };

  return progressRepetition.length ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const ProgressHistogramMaterialPlot = () => {
  const [progressHistogramMaterial, setProgressRepetition] = React.useState<
    number[]
  >([]);

  React.useEffect(() => {
    if (!progressHistogramMaterial.length) {
      getRepetitionMaterial().then((data) => {
        if (data) {
          setProgressRepetition(data.map((v) => v.count));
        }
      });
    }
  });

  const getPlot = () => {
    const maxRepetition = progressHistogramMaterial
      ? Math.max(...progressHistogramMaterial)
      : 0;
    return (
      <Plot
        style={{ paddingTop: "20px" }}
        data={[
          {
            x: progressHistogramMaterial,
            type: "histogram",
            xbins: {
              start: 1,
              end: maxRepetition,
              size: 0.2,
            },
          },
        ]}
        layout={{
          title: "Histograma da repetição média de visualização por material",
          bargap: 0.1,
          margin: {
            t: 50,
            b: 50,
            l: 80,
            r: 50,
            pad: 0,
          },
          yaxis: {
            title: "Número de materiais",
          },
          xaxis: {
            title: "Frequência média",
            nticks: maxRepetition,
            tick0: 1,
            dtick: 0.2,
            tickformat: ".2f",
          },
          width: window.innerWidth - 20,
          height: window.innerHeight - 200,
        }}
      />
    );
  };

  return progressHistogramMaterial.length ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const DashboardPlotMenu = ({
  currentItem,
  setCurrentItem,
}: {
  currentItem: string;
  setCurrentItem: (v: string) => void;
}) => {
  return (
    <Menu
      selectedKeys={[currentItem]}
      onClick={(e) => setCurrentItem(e.key)}
      mode="horizontal"
      className="menu"
    >
      <Menu.Item key="mean_repetition_student">
        Repetição média de material por aluno
      </Menu.Item>
      <Menu.Item key="repetition_material_student">
        Frequência de repetição por material e aluno
      </Menu.Item>
      <Menu.Item key="histogram_student">
        Histograma de repetição média por aluno
      </Menu.Item>
      <Menu.Item key="repetition_material">
        Repetição média por material
      </Menu.Item>
      <Menu.Item key="histogram_material">
        Histograma da repetição média por material
      </Menu.Item>
    </Menu>
  );
};

export const Dashboard = () => {
  const [currentItem, setCurrentItem] = React.useState<string>(
    "mean_repetition_student"
  );

  const getCurrentItemComponent = () => {
    const map = new Map<string, JSX.Element>([
      ["mean_repetition_student", <ProgressMeanStudentPlot />],
      [
        "repetition_material_student",
        <ProgressRepetitionMaterialStudentPlot />,
      ],
      ["histogram_student", <ProgressHistogramStudentPlot />],
      ["repetition_material", <ProgressRepetitionMaterialPlot />],
      ["histogram_material", <ProgressHistogramMaterialPlot />],
    ]);
    return map.get(currentItem);
  };

  return (
    <div>
      <NavigationMenu />
      <DashboardPlotMenu
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
      />
      {getCurrentItemComponent()}
    </div>
  );
};
