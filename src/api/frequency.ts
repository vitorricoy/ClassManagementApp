import axios from "axios";
import { BASE_URL } from "./common";
import { notification } from "antd";

export type FrequencyHeatmap = {
    [email in string]: {
        [week in string]: number
    }
};

export type FrequencyStudentMean = {
    email: string;
    frequency: number;
};

export type FrequencyWeekMean = {
    week: string;
    frequency: number;
};

export const getFrequencyHeatmap = async () => {
    const { data, status } = await axios.get<FrequencyHeatmap>(BASE_URL + "frequency/heatmap", {
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
        notification.error({ message: "Erro ao carregar dados das frequências." });
        return;
    }
    return data;
};

export const getFrequencyStudentMean = async () => {
    const { data, status } = await axios.get<FrequencyStudentMean[]>(BASE_URL + "frequency/student_mean", {
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
        notification.error({ message: "Erro ao carregar dados das frequências." });
        return;
    }
    return data;
};

export const getFrequencyWeekMean = async () => {
    const { data, status } = await axios.get<FrequencyWeekMean[]>(BASE_URL + "frequency/week_mean", {
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
        notification.error({ message: "Erro ao carregar dados das frequências." });
        return;
    }
    return data;
};


