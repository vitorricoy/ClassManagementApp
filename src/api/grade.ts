import axios from "axios";
import { BASE_URL } from "./common";
import { notification } from "antd";

export type GradeHeatmap = {
    [email in string]: {
        [material in string]: number
    }
};

export type GradeStudent = {
    email: string;
    grade: number;
};

export const getGradeHeatmap = async () => {
    const { data, status } = await axios.get<GradeHeatmap>(BASE_URL + "grade/heatmap", {
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
        notification.error({ message: "Erro ao carregar dados das notas." });
        return;
    }
    return data;
};

export const getGradeStudent = async () => {
    const { data, status } = await axios.get<GradeStudent[]>(BASE_URL + "grade/student", {
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
        notification.error({ message: "Erro ao carregar dados das notas." });
        return;
    }
    return data;
};