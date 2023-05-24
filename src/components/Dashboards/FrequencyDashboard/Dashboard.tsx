import React from "react";
import "./Dashboard.css";
import { NavigationMenu } from "../../NavigationMenu/NavigationMenu";
import Plot from "react-plotly.js";
import { Menu, Spin } from "antd";
import {
  FrequencyHeatmap,
  FrequencyStudentMean,
  FrequencyWeekMean,
  getFrequencyHeatmap,
  getFrequencyStudentMean,
  getFrequencyWeekMean,
} from "../../../api/frequency";

const getDateFromString = (str: string) => {
  var parts = str.split("/");
  return new Date(
    parseInt(parts[2], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[0], 10)
  );
};

const FrequencyHeatmapPlot = () => {
  const [frequencyHeatmapData, setFrequencyHeatmapData] =
    React.useState<FrequencyHeatmap>();

  React.useEffect(() => {
    if (!frequencyHeatmapData) {
      getFrequencyHeatmap().then((data) => {
        if (data) {
          setFrequencyHeatmapData(data);
        }
      });
    }
  });

  const getEmails = () => {
    const emails = frequencyHeatmapData
      ? Object.keys(frequencyHeatmapData)
      : [];
    const emailsCont: [string, number][] = emails.map((email) => {
      const entries = frequencyHeatmapData
        ? Object.entries(frequencyHeatmapData[email])
        : [];
      const delivereds: number[] = entries.map((e) => e[1]);
      const cont = delivereds.reduce((acc, v) => acc + v, 0);
      return [email, cont];
    });

    return emailsCont.sort((a, b) => a[1] - b[1]).map((v) => v[0]);
  };
  const getWeeks = () => {
    const week = frequencyHeatmapData
      ? Object.keys(frequencyHeatmapData[getEmails()[0]])
      : [];
    return week.sort(
      (a, b) => getDateFromString(a).getTime() - getDateFromString(b).getTime()
    );
  };

  const getZValue = () => {
    const emails = getEmails();
    const weeks = getWeeks();
    const zValue: number[][] = new Array(emails.length)
      .fill(0)
      .map((o, i) => new Array(weeks.length).fill(0));

    if (!frequencyHeatmapData) {
      return;
    }

    for (let i = 0; i < weeks.length; i++) {
      for (let j = 0; j < emails.length; j++) {
        const frequency = frequencyHeatmapData[emails[j]][weeks[i]];
        zValue[j][i] = frequency;
      }
    }
    return zValue;
  };

  const getPlot = () => {
    const layout = {
      annotations: [],
      title: "Entradas na página do curso por aluno e por semana",
      margin: {
        t: 50,
        b: 70,
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

    const xValues = getWeeks();
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
            text: currentValue.toString(),
            font: {
              family: "Arial",
              size: 12,
              color: currentValue >= 70 ? "black" : "white",
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
            colorbar: { title: "Número de entradas", titleside: "right" },
          },
        ]}
        layout={layout}
      />
    );
  };

  return frequencyHeatmapData ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const FrequencyStudentMeanPlot = () => {
  const [frequencyCount, setFrequencyCount] =
    React.useState<FrequencyStudentMean[]>();

  React.useEffect(() => {
    if (!frequencyCount) {
      getFrequencyStudentMean().then((data) => {
        if (data) {
          setFrequencyCount(data);
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
            x: frequencyCount?.map((v) => v.email),
            y: frequencyCount?.map((v) => v.frequency.toPrecision(2)),
            type: "bar",
          },
        ]}
        layout={{
          title: "Média de acessos do aluno ao curso por semana",
          margin: {
            t: 50,
            b: 280,
            l: 80,
            r: 50,
            pad: 0,
          },
          xaxis: { title: { text: "Aluno", standoff: 0 } },
          yaxis: { title: "Número médio de acessos" },
          width: window.innerWidth - 20,
          height: window.innerHeight - 120,
        }}
      />
    );
  };

  return frequencyCount ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const FrequencyStudentHistogramPlot = () => {
  const [frequencyCount, setFrequencyCount] = React.useState<number[]>();

  React.useEffect(() => {
    if (!frequencyCount) {
      getFrequencyStudentMean().then((data) => {
        if (data) {
          setFrequencyCount(data.map((v) => v.frequency));
        }
      });
    }
  });

  const getPlot = () => {
    const maxDelivery = frequencyCount ? Math.max(...frequencyCount) : 0;
    return (
      <Plot
        style={{ paddingTop: "20px" }}
        data={[
          {
            x: frequencyCount,
            type: "histogram",
            xbins: {
              start: 0,
              end: maxDelivery,
              size: 2,
            },
          },
        ]}
        layout={{
          title: "Histograma da frequência média de entrada no curso por aluno",
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
            title: "Frequência média de entrada",
            nticks: maxDelivery,
            tick0: 0,
            dtick: 2,
            tickformat: "d",
          },
          width: window.innerWidth - 20,
          height: window.innerHeight - 200,
        }}
      />
    );
  };

  return frequencyCount ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const FrequencyWeekMeanPlot = () => {
  const [frequencyCount, setFrequencyCount] =
    React.useState<FrequencyWeekMean[]>();

  React.useEffect(() => {
    if (!frequencyCount) {
      getFrequencyWeekMean().then((data) => {
        if (data) {
          setFrequencyCount(data);
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
            x: frequencyCount?.map((v) => v.week),
            y: frequencyCount?.map((v) => v.frequency.toPrecision(2)),
            type: "bar",
          },
        ]}
        layout={{
          title: "Média de acessos dos alunos ao curso por semana",
          margin: {
            t: 50,
            b: 250,
            l: 80,
            r: 50,
            pad: 0,
          },
          xaxis: { title: "Semana" },
          yaxis: { title: "Número médio de entradas" },
          width: window.innerWidth - 20,
          height: window.innerHeight - 100,
        }}
      />
    );
  };

  return frequencyCount ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const FrequencyWeekHistogramPlot = () => {
  const [frequencyCount, setFrequencyCount] = React.useState<number[]>();

  React.useEffect(() => {
    if (!frequencyCount) {
      getFrequencyWeekMean().then((data) => {
        if (data) {
          setFrequencyCount(data.map((v) => v.frequency));
        }
      });
    }
  });

  const getPlot = () => {
    const maxDelivery = frequencyCount ? Math.max(...frequencyCount) : 0;
    return (
      <Plot
        style={{ paddingTop: "20px" }}
        data={[
          {
            x: frequencyCount,
            type: "histogram",
            xbins: {
              start: 0,
              end: maxDelivery,
              size: 1,
            },
          },
        ]}
        layout={{
          title:
            "Histograma da frequência média de entrada no curso por semana",
          bargap: 0.1,
          margin: {
            t: 50,
            b: 50,
            l: 80,
            r: 50,
            pad: 0,
          },
          yaxis: { title: "Número de semanas" },
          xaxis: {
            title: "Frequência média de entrada",
            nticks: maxDelivery,
            tick0: 0,
            dtick: 1,
            tickformat: "d",
          },
          width: window.innerWidth - 20,
          height: window.innerHeight - 200,
        }}
      />
    );
  };

  return frequencyCount ? (
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
      <Menu.Item key="heatmap">
        Entradas na página do curso por semana e aluno
      </Menu.Item>
      <Menu.Item key="student_frequency">
        Média de acessos ao curso por aluno
      </Menu.Item>
      <Menu.Item key="histogram_student">
        Histograma da média de entrada no curso por aluno
      </Menu.Item>
      <Menu.Item key="week_frequency">
        Média de acessos ao curso por semana
      </Menu.Item>
      <Menu.Item key="histogram_week">
        Histograma da média de entrada no curso por semana
      </Menu.Item>
    </Menu>
  );
};

export const Dashboard = () => {
  const [currentItem, setCurrentItem] = React.useState<string>("heatmap");

  const getCurrentItemComponent = () => {
    const map = new Map<string, JSX.Element>([
      ["heatmap", <FrequencyHeatmapPlot />],
      ["student_frequency", <FrequencyStudentMeanPlot />],
      ["histogram_student", <FrequencyStudentHistogramPlot />],
      ["week_frequency", <FrequencyWeekMeanPlot />],
      ["histogram_week", <FrequencyWeekHistogramPlot />],
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
