import React from "react";
import "./Dashboard.css";
import { NavigationMenu } from "../../NavigationMenu/NavigationMenu";
import Plot from "react-plotly.js";
import { Menu, Spin } from "antd";
import {
  GradeHeatmap,
  GradeStudent,
  getGradeHeatmap,
  getGradeStudent,
} from "../../../api/grade";

const GradeHeatmapPlot = () => {
  const [gradeHeatmapData, setGradeHeatmapData] =
    React.useState<GradeHeatmap>();

  React.useEffect(() => {
    if (!gradeHeatmapData) {
      getGradeHeatmap().then((data) => {
        if (data) {
          setGradeHeatmapData(data);
        }
      });
    }
  });

  const getEmails = () => {
    const emails = gradeHeatmapData ? Object.keys(gradeHeatmapData) : [];
    const emailsCont: [string, number][] = emails.map((email) => {
      const entries = gradeHeatmapData
        ? Object.entries(gradeHeatmapData[email])
        : [];
      const delivereds: number[] = entries.map((e) => e[1]);
      const cont = delivereds.reduce((acc, v) => acc + v, 0);
      return [email, cont];
    });

    return emailsCont.sort((a, b) => a[1] - b[1]).map((v) => v[0]);
  };
  const getGrades = () =>
    gradeHeatmapData ? Object.keys(gradeHeatmapData[getEmails()[0]]) : [];

  const getZValue = () => {
    const emails = getEmails();
    const grades = getGrades();
    const zValue: number[][] = new Array(emails.length)
      .fill(0)
      .map((o, i) => new Array(grades.length).fill(0));

    if (!gradeHeatmapData) {
      return;
    }

    for (let i = 0; i < grades.length; i++) {
      for (let j = 0; j < emails.length; j++) {
        const grade = gradeHeatmapData[emails[j]][grades[i]];
        zValue[j][i] = grade;
      }
    }
    return zValue;
  };

  const getPlot = () => {
    const layout = {
      annotations: [],
      title: "Nota por aluno e atividade",
      margin: {
        t: 50,
        b: 50,
        l: 250,
        r: 120,
        pad: 0,
      },
      width: window.innerWidth - 20,
      height: getEmails().length * 20,
    } as Pick<
      Plotly.Layout,
      "annotations" | "title" | "margin" | "width" | "height"
    >;

    const xValues = getGrades();
    const yValues = getEmails();
    const zValues = getZValue();
    if (zValues) {
      for (let i = 0; i < yValues.length; i++) {
        for (let j = 0; j < xValues.length; j++) {
          const currentValue = zValues[i][j];
          layout.annotations.push({
            xref: "x",
            yref: "y",
            x: xValues[j],
            y: yValues[i],
            text: zValues[i][j].toString(),
            font: {
              family: "Arial",
              size: 12,
              color: currentValue >= 6 ? "black" : "white",
            },
            showarrow: false,
          });
        }
      }
    }
    return (
      <Plot
        style={{ paddingTop: "20px" }}
        data={[
          {
            x: xValues,
            y: yValues,
            z: zValues,
            xgap: 1,
            ygap: 1,
            type: "heatmap",
            colorscale: "YlGnBu",
            colorbar: { title: "Nota do aluno", titleside: "right" },
          },
        ]}
        layout={layout}
      />
    );
  };

  return gradeHeatmapData ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const GradeStudentPlot = () => {
  const [gradeStudent, setGradeStudent] = React.useState<GradeStudent[]>();

  React.useEffect(() => {
    if (!gradeStudent) {
      getGradeStudent().then((data) => {
        if (data) {
          setGradeStudent(data);
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
            x: gradeStudent?.map((v) => v.email),
            y: gradeStudent?.map((v) => v.grade),
            type: "bar",
          },
        ]}
        layout={{
          title: "Nota total percentual do aluno",
          margin: {
            t: 50,
            b: 250,
            l: 80,
            r: 50,
            pad: 0,
          },
          xaxis: { title: { text: "Aluno", standoff: 0 } },
          yaxis: { title: "Nota (%)" },
          width: window.innerWidth - 20,
          height: window.innerHeight - 200,
        }}
      />
    );
  };

  return gradeStudent ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const GradeHistogramPlot = () => {
  const [gradeStudent, setGradeStudent] = React.useState<number[]>();

  React.useEffect(() => {
    if (!gradeStudent) {
      getGradeStudent().then((data) => {
        if (data) {
          setGradeStudent(data.map((v) => v.grade));
        }
      });
    }
  });

  const getPlot = () => {
    const maxDelivery = gradeStudent ? Math.max(...gradeStudent) : 0;
    return (
      <Plot
        style={{ paddingTop: "20px" }}
        data={[
          {
            x: gradeStudent,
            type: "histogram",
            xbins: {
              start: 0,
              end: maxDelivery,
              size: 10,
            },
          },
        ]}
        layout={{
          title: "Histograma da nota percentual média por aluno",
          bargap: 0.01,
          margin: {
            t: 50,
            b: 50,
            l: 80,
            r: 50,
            pad: 0,
          },
          yaxis: { title: "Número de alunos" },
          xaxis: {
            title: "Nota percentual média (%)",
            nticks: maxDelivery,
            tick0: 0,
            dtick: 5,
            tickformat: "d",
          },
          width: window.innerWidth - 20,
          height: window.innerHeight - 200,
        }}
      />
    );
  };

  return gradeStudent ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const GradeParetoPlot = () => {
  const [gradeHeatmapData, setGradeHeatmapData] =
    React.useState<GradeHeatmap>();

  React.useEffect(() => {
    if (!gradeHeatmapData) {
      getGradeHeatmap().then((data) => {
        if (data) {
          setGradeHeatmapData(data);
        }
      });
    }
  });

  const getEmailsSorted = (material: string) => {
    if (!gradeHeatmapData) return [];
    const emails = gradeHeatmapData ? Object.keys(gradeHeatmapData) : [];
    const emailsCont: [string, number][] = emails.map((email) => {
      return [email, gradeHeatmapData[email][material]];
    });

    return emailsCont.sort((a, b) => b[1] - a[1]).map((v) => v[0]);
  };

  const materials = gradeHeatmapData
    ? Object.keys(gradeHeatmapData[Object.keys(gradeHeatmapData)[0]])
    : [];

  const getPlotMaterial = (material: string) => {
    if (!gradeHeatmapData) return null;
    const emails = getEmailsSorted(material);
    const grades = emails.map((v) => gradeHeatmapData[v][material]);
    const maxGrade = Math.max(...grades);
    const percentageGrades = grades.map((g) => (g / maxGrade) * 100);
    const totalSum = grades.reduce((acc, cur) => acc + cur);
    const cumSum = [];
    let sum = 0;
    for (let i = 0; i < emails.length; i++) {
      sum += grades[i];
      cumSum.push((sum / totalSum) * 100);
    }
    return (
      <Plot
        key={material}
        style={{ paddingTop: "20px" }}
        data={[
          {
            x: emails,
            y: percentageGrades,
            type: "bar",
            name: "Nota",
          },
        ]}
        layout={{
          title: "Notas (" + material + ")",
          margin: {
            t: 50,
            b: 300,
            l: 80,
            r: 50,
            pad: 0,
          },
          width: window.innerWidth - 20,
          height: window.innerHeight - 150,
          xaxis: {
            tickangle: 90,
            title: { text: "Aluno", standoff: 0 },
          },
          yaxis: { title: "Nota (%)" },
        }}
      />
    );
  };

  const getPlot = () => {
    return <div>{materials.map((m) => getPlotMaterial(m))}</div>;
  };

  return gradeHeatmapData ? (
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
      <Menu.Item key="heatmap">Nota por aluno e atividade</Menu.Item>
      <Menu.Item key="grade">Nota total percentual do aluno</Menu.Item>
      <Menu.Item key="histogram">
        Histograma da nota percentual por aluno
      </Menu.Item>
      <Menu.Item key="pareto">Nota dos alunos (por atividade)</Menu.Item>
    </Menu>
  );
};

export const Dashboard = () => {
  const [currentItem, setCurrentItem] = React.useState<string>("heatmap");

  const getCurrentItemComponent = () => {
    const map = new Map<string, JSX.Element>([
      ["heatmap", <GradeHeatmapPlot />],
      ["grade", <GradeStudentPlot />],
      ["histogram", <GradeHistogramPlot />],
      ["pareto", <GradeParetoPlot />],
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
