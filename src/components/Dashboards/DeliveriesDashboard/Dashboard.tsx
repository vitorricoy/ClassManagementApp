import React from "react";
import "./Dashboard.css";
import { NavigationMenu } from "../../NavigationMenu/NavigationMenu";
import Plot from 'react-plotly.js';
import { DeliveryHeatmap, getDeliveryHeatmap } from "../../../api/delivery";
import { Datum } from "plotly.js";
import { Menu, Spin } from "antd";

const DeliveryHeatmapPlot = () => {
  const [deliveryHeatmapData, setDeliveryHeatmapData] = React.useState<DeliveryHeatmap>();

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
    const emailsCont: [string, number][] = emails.map(email => {
      const entries = deliveryHeatmapData ? Object.entries(deliveryHeatmapData[email]) : [];
      const delivereds: number[] = entries.map(e => e[1] ? 1 : 0);
      const cont = delivereds.reduce((acc, v) => acc + v, 0);
      return [email, cont];
    })

    return emailsCont.sort((a, b) => b[1] - a[1]).map(v => v[0]);
  };
  const getMaterials = () => deliveryHeatmapData ? Object.keys(deliveryHeatmapData[getEmails()[0]]) : [];

  const getZValue = () => {
    const emails = getEmails();
    const materials = getMaterials();
    const zValue: Datum[][] = new Array(emails.length).fill(0).map((o, i) => new Array(materials.length).fill(false));

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
    return <Plot
      style={{ paddingTop: '20px' }}
      data={[
        {
          x: getMaterials(),
          y: getEmails(),
          z: getZValue(),
          xgap: 1,
          ygap: 1,
          type: 'heatmap',
          colorscale: [[0.0, 'rgb(0,0,131)'], [1.0, 'rgb(128,0,0)']],
        },
      ]}
      layout={{
        title: 'Entrega de atividades por aluno',
        margin: {
          t: 50,
          b: 180,
          l: 250,
          r: 120,
          pad: 0,
        },
        width: window.innerWidth - 20,
        height: getEmails().length * 20,
      }
      }
    />
  };

  return deliveryHeatmapData ? getPlot() : <div className="spinner"><Spin /></div>;
};

const DashboardPlotMenu = ({ currentItem, setCurrentItem }: { currentItem: string; setCurrentItem: (v: string) => void; }) => {
  return (
    <Menu
      selectedKeys={[currentItem]}
      onClick={(e) => setCurrentItem(e.key)}
      mode="horizontal"
      className="menu"
    >
      <Menu.Item
        key="heatmap"
      >
        Entregas por aluno e atividade
      </Menu.Item>
      <Menu.Item
        key="delivery_mean"
      >
        Média de entregas por aluno
      </Menu.Item>
      <Menu.Item
        key="histogram"
      >
        Histograma da média de entregas por aluno
      </Menu.Item>
      <Menu.Item
        key="number_deliveries"
      >
        Média de entregas por atividade
      </Menu.Item>
    </Menu>
  );
};

export const Dashboard = () => {
  const [currentItem, setCurrentItem] = React.useState<string>("heatmap");

  const getCurrentItemComponent = () => {
    if (currentItem === 'heatmap') {
      return <DeliveryHeatmapPlot />;
    }
    return null;
  };

  return (
    <div>
      <NavigationMenu />
      <DashboardPlotMenu currentItem={currentItem} setCurrentItem={setCurrentItem} />
      {getCurrentItemComponent()}
    </div>
  );
};
