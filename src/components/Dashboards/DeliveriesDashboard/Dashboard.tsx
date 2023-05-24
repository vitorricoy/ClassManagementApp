import React from "react";
import "./Dashboard.css";
import { NavigationMenu } from "../../NavigationMenu/NavigationMenu";
import Plot from "react-plotly.js";
import {
  DeliveryActivityCount,
  DeliveryHeatmap,
  DeliveryStudentCount,
  getDeliveryActivityCount,
  getDeliveryHeatmap,
  getDeliveryStudentCount,
} from "../../../api/delivery";
import { Datum } from "plotly.js";
import { Menu, Spin } from "antd";

const DeliveryHeatmapPlot = () => {
  const [deliveryHeatmapData, setDeliveryHeatmapData] =
    React.useState<DeliveryHeatmap>();

  React.useEffect(() => {
    if (!deliveryHeatmapData) {
      getDeliveryHeatmap().then((data) => {
        if (data) {
          setDeliveryHeatmapData(data);
        }
      });
    }
  });

  const getEmails = () => {
    const emails = deliveryHeatmapData ? Object.keys(deliveryHeatmapData) : [];
    const emailsCont: [string, number][] = emails.map((email) => {
      const entries = deliveryHeatmapData
        ? Object.entries(deliveryHeatmapData[email])
        : [];
      const delivereds: number[] = entries.map((e) => (e[1] ? 1 : 0));
      const cont = delivereds.reduce((acc, v) => acc + v, 0);
      return [email, cont];
    });

    return emailsCont.sort((a, b) => b[1] - a[1]).map((v) => v[0]);
  };
  const getMaterials = () =>
    deliveryHeatmapData ? Object.keys(deliveryHeatmapData[getEmails()[0]]) : [];

  const getZValue = () => {
    const emails = getEmails();
    const materials = getMaterials();
    const zValue: Datum[][] = new Array(emails.length)
      .fill(0)
      .map((o, i) => new Array(materials.length).fill(false));

    if (!deliveryHeatmapData) {
      return;
    }

    for (let i = 0; i < materials.length; i++) {
      for (let j = 0; j < emails.length; j++) {
        const delivered = deliveryHeatmapData[emails[j]][materials[i]];
        zValue[j][i] = delivered ? 1 : 0;
      }
    }
    return zValue;
  };

  const getPlot = () => {
    return (
      <Plot
        style={{ paddingTop: "20px" }}
        data={[
          {
            x: getMaterials(),
            y: getEmails(),
            z: getZValue(),
            xgap: 1,
            ygap: 1,
            type: "heatmap",
            colorscale: [
              [0.0, "rgb(0,0,131)"],
              [1.0, "rgb(128,0,0)"],
            ],
            colorbar: {
              title: "Entregue = 1 / Não entregue = 0",
              titleside: "right",
            },
          },
        ]}
        layout={{
          title: "Entregas por aluno e atividade",
          margin: {
            t: 50,
            b: 180,
            l: 250,
            r: 120,
            pad: 0,
          },
          width: window.innerWidth - 20,
          height: getEmails().length * 20,
        }}
      />
    );
  };

  return deliveryHeatmapData ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const DeliveryStudentNumberPlot = () => {
  const [deliveryStudentCount, setDeliveryStudentCount] =
    React.useState<DeliveryStudentCount[]>();

  React.useEffect(() => {
    if (!deliveryStudentCount) {
      getDeliveryStudentCount().then((data) => {
        if (data) {
          setDeliveryStudentCount(data);
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
            x: deliveryStudentCount?.map((v) => v.email),
            y: deliveryStudentCount?.map((v) => v.count),
            type: "bar",
          },
        ]}
        layout={{
          title: "Número de entregas por aluno",
          margin: {
            t: 50,
            b: 250,
            l: 80,
            r: 50,
            pad: 0,
          },
          xaxis: { title: { text: "Aluno", standoff: 0 } },
          yaxis: { title: "Número de entregas" },
          width: window.innerWidth - 20,
          height: window.innerHeight - 200,
        }}
      />
    );
  };

  return deliveryStudentCount ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const DeliveryHistogramPlot = () => {
  const [deliveryStudentCount, setDeliveryStudentCount] =
    React.useState<number[]>();

  React.useEffect(() => {
    if (!deliveryStudentCount) {
      getDeliveryStudentCount().then((data) => {
        if (data) {
          setDeliveryStudentCount(data.map((v) => v.count));
        }
      });
    }
  });

  const getPlot = () => {
    const maxDelivery = deliveryStudentCount
      ? Math.max(...deliveryStudentCount)
      : 0;
    return (
      <Plot
        style={{ paddingTop: "20px" }}
        data={[
          {
            x: deliveryStudentCount,
            type: "histogram",
            xbins: {
              start: 0,
              end: maxDelivery,
              size: 1,
            },
          },
        ]}
        layout={{
          title: "Histograma da média de entregas por aluno",
          bargap: 0.1,
          margin: {
            t: 50,
            b: 50,
            l: 80,
            r: 50,
            pad: 0,
          },
          xaxis: {
            nticks: maxDelivery,
            tick0: 0.4999,
            dtick: 1,
            tickformat: "d",
            title: "Número de entregas",
          },
          yaxis: { title: "Número de alunos" },
          width: window.innerWidth - 20,
          height: window.innerHeight - 200,
        }}
      />
    );
  };

  return deliveryStudentCount ? (
    getPlot()
  ) : (
    <div className="spinner">
      <Spin />
    </div>
  );
};

const DeliveryActivityNumberPlot = () => {
  const [deliveryActivityCount, setDeliveryActivityCount] =
    React.useState<DeliveryActivityCount[]>();

  React.useEffect(() => {
    if (!deliveryActivityCount) {
      getDeliveryActivityCount().then((data) => {
        if (data) {
          setDeliveryActivityCount(data);
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
            x: deliveryActivityCount?.map((v) => v.activity),
            y: deliveryActivityCount?.map((v) => v.count),
            type: "bar",
          },
        ]}
        layout={{
          title: "Número de entregas por atividade",
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
            title: { text: "Atividade", standoff: 0 },
          },
          yaxis: { title: "Número de alunos que entregaram a atividade" },
        }}
      />
    );
  };

  return deliveryActivityCount ? (
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
      <Menu.Item key="heatmap">Entregas por aluno e atividade</Menu.Item>
      <Menu.Item key="deliveries_student">
        Número de entregas por aluno
      </Menu.Item>
      <Menu.Item key="histogram">
        Histograma da média de entregas por aluno
      </Menu.Item>
      <Menu.Item key="deliveries_activity">
        Número de entregas por atividade
      </Menu.Item>
    </Menu>
  );
};

export const Dashboard = () => {
  const [currentItem, setCurrentItem] = React.useState<string>("heatmap");

  const getCurrentItemComponent = () => {
    const map = new Map<string, JSX.Element>([
      ["heatmap", <DeliveryHeatmapPlot />],
      ["deliveries_student", <DeliveryStudentNumberPlot />],
      ["histogram", <DeliveryHistogramPlot />],
      ["deliveries_activity", <DeliveryActivityNumberPlot />],
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
