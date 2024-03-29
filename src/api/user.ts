import { notification } from "antd";
import { BASE_URL } from "./common";
import axios from "axios";

type TokenResponse = {
  token: string;
};

export const createUser = async (
  email: string,
  name: string,
  password: string
) => {
  try {
    const { data, status } = await axios.post<TokenResponse>(
      BASE_URL + "user",
      {
        email,
        name,
        password,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (status !== 200 || !data) {
      notification.error({ message: "Erro ao criar conta." });
      return;
    }
    return data.token;
  } catch (e) {
    notification.error({ message: "Erro ao criar conta." });
  }
};

export const login = async (email: string, password: string) => {
  try {
    const { data, status } = await axios.post<TokenResponse>(
      BASE_URL + "user/login",
      {
        email,
        password,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (status !== 200 || !data) {
      notification.error({ message: "Erro ao logar." });
      return;
    }
    return data.token;
  } catch (e) {
    notification.error({
      message: "Erro ao logar. Verifique o seu e-mail e senha.",
    });
  }
};
