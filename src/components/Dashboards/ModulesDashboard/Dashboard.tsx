import React from "react";
import "./Dashboard.css";
import { NavigationMenu } from "../../NavigationMenu/NavigationMenu";
import Plot from "react-plotly.js";
import { Menu, Spin } from "antd";
import { ModuleHeatmap, getConclusionHeatmap } from "../../../api/module";

const ModuleHeatmapPlot = () => {
  const [moduleHeatmapData, setModuleHeatmapData] =
    React.useState<ModuleHeatmap>();

  React.useEffect(() => {
    if (!moduleHeatmapData) {
      getConclusionHeatmap().then((data) => {
        if (data) {
          setModuleHeatmapData(data);
        }
      });
    }
  });

  const getEmails = () => {
    const emails = moduleHeatmapData ? Object.keys(moduleHeatmapData) : [];
    const emailsCont: [string, number][] = emails.map((email) => {
      const entries = moduleHeatmapData
        ? Object.entries(moduleHeatmapData[email])
        : [];
      const delivereds: number[] = entries.map((e) => e[1]);
      const cont = delivereds.reduce((acc, v) => acc + v, 0);
      return [email, cont];
    });

    return emailsCont.sort((a, b) => a[1] - b[1]).map((v) => v[0]);
  };
  const getModules = () =>
    moduleHeatmapData ? Object.keys(moduleHeatmapData[getEmails()[0]]) : [];

  const getZValue = () => {
    const emails = getEmails();
    const modules = getModules();
    const zValue: number[][] = new Array(emails.length)
      .fill(0)
      .map((o, i) => new Array(modules.length).fill(0));

    if (!moduleHeatmapData) {
      return;
    }

    for (let i = 0; i < modules.length; i++) {
      for (let j = 0; j < emails.length; j++) {
        const grade = moduleHeatmapData[emails[j]][modules[i]];
        zValue[j][i] = grade;
      }
    }
    return zValue;
  };

  const getPlot = () => {
    const layout = {
      annotations: [],
      title: "Conclusão por aluno e por módulo",
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

    const xValues = getModules();
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
            text: zValues[i][j].toFixed(2),
            font: {
              family: "Arial",
              size: 12,
              color: currentValue >= 60 ? "black" : "white",
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
          },
        ]}
        layout={layout}
      />
    );
  };

  return moduleHeatmapData ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const ModuleConclusionPlot = () => {
  const [moduleHeatmapData, setModuleHeatmapData] =
    React.useState<ModuleHeatmap>();

  React.useEffect(() => {
    if (!moduleHeatmapData) {
      getConclusionHeatmap().then((data) => {
        if (data) {
          setModuleHeatmapData(data);
        }
      });
    }
  });

  const getEmailsForModule = (module: string) => {
    if (!moduleHeatmapData) return [];
    const emails = moduleHeatmapData ? Object.keys(moduleHeatmapData) : [];
    const emailsCont: [string, number][] = emails.map((email) => {
      return [email, moduleHeatmapData[email][module]];
    });

    return emailsCont.sort((a, b) => b[1] - a[1]).map((v) => v[0]);
  };

  const modules = moduleHeatmapData
    ? Object.keys(moduleHeatmapData[Object.keys(moduleHeatmapData)[0]])
    : [];

  const getPlotModule = (module: string) => {
    const emails = getEmailsForModule(module);

    if (!moduleHeatmapData) return null;

    return (
      <Plot
        key={module}
        style={{ paddingTop: "20px" }}
        data={[
          {
            x: emails,
            y: emails.map((e) => moduleHeatmapData[e][module]),
            type: "bar",
          },
        ]}
        layout={{
          title: "Percentual completo do módulo " + module,
          margin: {
            t: 50,
            b: 250,
            l: 50,
            r: 50,
            pad: 0,
          },
          width: window.innerWidth - 20,
          height: window.innerHeight - 200,
        }}
      />
    );
  };

  const getPlot = () => {
    return <div>{modules.map((m) => getPlotModule(m))}</div>;
  };

  return moduleHeatmapData ? (
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
      <Menu.Item key="heatmap">Conclusão por aluno e por módulo</Menu.Item>
      <Menu.Item key="conclusion">
        Conclusão por aluno (de cada módulo)
      </Menu.Item>
    </Menu>
  );
};

export const Dashboard = () => {
  const [currentItem, setCurrentItem] = React.useState<string>("heatmap");

  const getCurrentItemComponent = () => {
    const map = new Map<string, JSX.Element>([
      ["heatmap", <ModuleHeatmapPlot />],
      ["conclusion", <ModuleConclusionPlot />],
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
