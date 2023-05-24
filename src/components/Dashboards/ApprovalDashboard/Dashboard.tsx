import React from "react";
import "./Dashboard.css";
import { NavigationMenu } from "../../NavigationMenu/NavigationMenu";
import Plot from "react-plotly.js";
import { Menu, Spin } from "antd";
import { ApprovalProbability, getProbability } from "../../../api/approval";

const ApprovalProbabilityPlot = () => {
  const [probabilityData, setProbabilityData] =
    React.useState<ApprovalProbability[]>();

  React.useEffect(() => {
    if (!probabilityData) {
      getProbability().then((data) => {
        if (data) {
          setProbabilityData(data);
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
            x: probabilityData?.map((v) => v.email),
            y: probabilityData?.map((v) => v.probability.toPrecision(2)),
            type: "bar",
          },
        ]}
        layout={{
          title: "Probabilidade de aprovação por aluno",
          margin: {
            t: 50,
            b: 300,
            l: 80,
            r: 50,
            pad: 0,
          },
          yaxis: { title: "Probabilidade de aprovação (%)" },
          xaxis: { title: { text: "Aluno", standoff: 0 } },
          width: window.innerWidth - 20,
          height: window.innerHeight - 120,
        }}
      />
    );
  };

  return probabilityData ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const ApprovalHistogramPlot = () => {
  const [probabilityData, setProbabilityData] = React.useState<number[]>();

  React.useEffect(() => {
    if (!probabilityData) {
      getProbability().then((data) => {
        if (data) {
          setProbabilityData(
            data.map((v) => Math.round(v.probability * 1000) / 1000)
          );
        }
      });
    }
  });

  const getPlot = () => {
    const maxRepetition = probabilityData ? Math.max(...probabilityData) : 0;
    return (
      <Plot
        style={{ paddingTop: "20px" }}
        data={[
          {
            x: probabilityData,
            type: "histogram",
            xbins: {
              start: 0,
              end: maxRepetition,
              size: 5,
            },
          },
        ]}
        layout={{
          title: "Histograma da ptobabilidade de completar o curso por aluno",
          bargap: 0.1,
          margin: {
            t: 50,
            b: 50,
            l: 80,
            r: 50,
            pad: 0,
          },
          yaxis: { title: "Número de alunos" },
          xaxis: {
            title: "Probabilidade de aprovação",
            nticks: maxRepetition,
            tick0: 0,
            dtick: 5,
            tickformat: ".2f",
          },
          width: window.innerWidth - 20,
          height: window.innerHeight - 200,
        }}
      />
    );
  };

  return probabilityData ? (
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
      <Menu.Item key="probability">
        Probabilidade de completar o curso por aluno
      </Menu.Item>
      <Menu.Item key="histogram">
        Histograma da probabilidade de completar o curso por aluno
      </Menu.Item>
    </Menu>
  );
};

export const Dashboard = () => {
  const [currentItem, setCurrentItem] = React.useState<string>("probability");

  const getCurrentItemComponent = () => {
    const map = new Map<string, JSX.Element>([
      ["probability", <ApprovalProbabilityPlot />],
      ["histogram", <ApprovalHistogramPlot />],
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
