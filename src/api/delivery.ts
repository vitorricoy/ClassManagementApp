import axios from "axios";
import { BASE_URL } from "./common";
import { notification } from "antd";

export type DeliveryHeatmap = {
    [email in string]: {
        [material in string]: boolean
    }
};

export const getDeliveryHeatmap = async () => {
    const { data, status } = await axios.get<DeliveryHeatmap>(BASE_URL + "delivery/heatmap", {
        params: {
            token: localStorage.getItem("userToken"),
            class_code: localStorage.getItem("classCode"),
        },
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });

    if (status !== 200 || !data) {
        notification.error({ message: "Erro ao carregar dados das entregas." });
        return;
    }
    return data;
};