import axios from "axios";
import { BASE_URL } from "./common";
import { notification } from "antd";

export type ProgressMeanStudent = {
  email: string;
  repetition: number;
};

export type ProgressRepetitionMaterialStudent = {
  email: string;
  material: string;
  count: number;
  user_mean: number;
};

export type ProgressRepetitionMaterial = {
  material: string;
  count: number;
};

export const getMeanStudent = async () => {
  const { data, status } = await axios.get<ProgressMeanStudent[]>(
    BASE_URL + "progress/mean_student",
    {
      params: {
        token: localStorage.getItem("userToken"),
        class_code: localStorage.getItem("classCode"),
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (status !== 200 || !data) {
    notification.error({
      message: "Erro ao carregar dados de progresso no curso.",
    });
    return;
  }
  return data;
};

export const getRepetitionMaterialStudent = async () => {
  const { data, status } = await axios.get<ProgressRepetitionMaterialStudent[]>(
    BASE_URL + "progress/repetition_material_student",
    {
      params: {
        token: localStorage.getItem("userToken"),
        class_code: localStorage.getItem("classCode"),
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (status !== 200 || !data) {
    notification.error({
      message: "Erro ao carregar dados de progresso no curso.",
    });
    return;
  }
  return data;
};

export const getRepetitionMaterial = async () => {
  const { data, status } = await axios.get<ProgressRepetitionMaterial[]>(
    BASE_URL + "progress/repetition_material",
    {
      params: {
        token: localStorage.getItem("userToken"),
        class_code: localStorage.getItem("classCode"),
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (status !== 200 || !data) {
    notification.error({
      message: "Erro ao carregar dados de progresso no curso.",
    });
    return;
  }
  return data;
};
