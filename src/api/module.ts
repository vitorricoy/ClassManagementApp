import axios from "axios";
import { BASE_URL } from "./common";
import { notification } from "antd";

export type ModuleHeatmap = {
    [email in string]: {
        [module in string]: number
    }
};

export const getConclusionHeatmap = async () => {
    const { data, status } = await axios.get<ModuleHeatmap>(BASE_URL + "module/heatmap", {
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
        notification.error({ message: "Erro ao carregar dados de conclusão dos módulos." });
        return;
    }
    return data;
};