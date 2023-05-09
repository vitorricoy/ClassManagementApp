import { notification } from "antd";
import { BASE_URL } from "./common";
import axios from "axios";

export type Class = {
  code: number;
  name: string;
  userCode: number;
};

export const getClasses = async () => {
  const { data, status } = await axios.get<Class[]>(BASE_URL + "class", {
    params: {
      token: localStorage.getItem("userToken"),
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (status !== 200 || !data) {
    notification.error({ message: "Erro ao carregar turmas." });
    return;
  }
  return data;
};
