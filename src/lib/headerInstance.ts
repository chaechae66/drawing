import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { LocalStorage } from "./localStorage";
import moment from "moment";

const localStorage = new LocalStorage();
const API = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
});

API.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    try {
      const accessToken = localStorage.get("token");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        return config;
      } else {
        config;
      }
    } catch (err) {
      console.error(
        "[_axios.interceptors.request] config : " + (err as AxiosError).message
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
    const accessToken = localStorage.get("token");
    const refreshToken = localStorage.get("refreshToken");
    const expireAt = localStorage.get("expiredAt");
    if (response.status === 401) {
      if (moment(Number(expireAt)).diff(moment()) < 0) {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}user/retoken`,
          { headers: { Authorization: `Bearer ${accessToken}`, refreshToken } }
        );

        if (res.status == 200) {
          localStorage.set("token", res.data.data.accessToken);
          config.headers[
            "Authorization"
          ] = `Bearer ${res.data.data.accessToken}`;
          return axios(config);
        }
        if (res.status == 401) {
          localStorage.clear("token");
          localStorage.clear("refreshToken");

          window.alert("토큰이 만료되어 자동으로 로그아웃 되었습니다.");
        }

        return;
      }
      Promise.reject(error);
    }
    Promise.reject(error);
  }
);

export default API;
