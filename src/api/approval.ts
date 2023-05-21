import axios from "axios";
import { BASE_URL } from "./common";
import { notification } from "antd";

export type ApprovalProbability = {
  email: string;
  probability: number;
};

export const getProbability = async () => {
  const { data, status } = await axios.get<ApprovalProbability[]>(
    BASE_URL + "approval/probability",
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
      message: "Erro ao carregar dados de aprovação dos alunos.",
    });
    return;
  }
  return data;
};
