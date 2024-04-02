import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import moment from "moment";
import {
  removeToken,
  saveAccessToken,
} from "../store/features/token/tokenSlice";
import { Store } from "@reduxjs/toolkit";

export const setupAxiosInstance = (store: Store) => {
  const API = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  });

  const accessToken = store.getState().token.accessToken;
  const refreshToken = store.getState().token.refreshToken;
  const expireAt = store.getState().token.expiredAt;
  const uuid = store.getState().uuid.uuid;

  API.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {
      try {
        config.headers["uuid"] = uuid;
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
          return config;
        } else {
          return config;
        }
      } catch (err) {
        console.error(
          "[_axios.interceptors.request] config : " +
            (err as AxiosError).message
        );
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  API.interceptors.response.use(
    function (response) {
      return response.data;
    },
    async function (error) {
      const { response, config } = error;
      if (response.status === 401) {
        if (moment(Number(expireAt)).diff(moment()) < 0) {
          const res = await axios.get(
            `${import.meta.env.VITE_REACT_APP_BASE_URL}user/retoken`,
            {
              headers: { Authorization: `Bearer ${accessToken}`, refreshToken },
            }
          );

          if (res.status == 200) {
            store.dispatch(saveAccessToken(res.data.data.accessToken));
            config.headers[
              "Authorization"
            ] = `Bearer ${res.data.data.accessToken}`;
            return axios(config);
          }
          if (res.status == 401) {
            store.dispatch(removeToken());
            window.alert("토큰이 만료되어 자동으로 로그아웃 되었습니다.");
          }

          return;
        }
        Promise.reject(error);
      }
      Promise.reject(error);
    }
  );

  return API;
};
