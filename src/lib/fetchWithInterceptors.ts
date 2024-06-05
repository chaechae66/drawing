import { Store } from "@reduxjs/toolkit";
import moment from "moment";
import {
  removeToken,
  saveAccessToken,
} from "../store/features/token/tokenSlice";

interface FetchOptions extends RequestInit {
  url?: string;
  options?: FetchOptions;
}

interface FetchResponse<T> extends Response {
  data?: T;
}

type RequestInterceptor = (
  url: string,
  options: FetchOptions,
  store: Store
) => FetchOptions;
type ResponseInterceptor<T> = (
  response: Response,
  url: string,
  options: FetchOptions,
  store: Store
) => Promise<FetchResponse<T>>;
type ErrorInterceptor = (error: unknown) => Promise<FetchResponse<unknown>>;

const requestInterceptor: RequestInterceptor = (url, options, store) => {
  const accessToken = store.getState().token.accessToken;
  const uuid = store.getState().uuid.uuid;

  options.headers = {
    ...options.headers,
    uuid: uuid,
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
  };

  return { url, options };
};

const responseInterceptor = async (
  response: Response,
  url: string,
  options: FetchOptions,
  store: Store
) => {
  const accessToken = store.getState().token.accessToken;
  const refreshToken = store.getState().token.refreshToken;
  const expireAt = store.getState().token.expiredAt;

  if (response.ok) {
    return response.json();
  } else if (response.status === 401) {
    if (moment(Number(expireAt)).diff(moment()) < 0) {
      const res = await fetch(`http://localhost:3000/api/user/retoken`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          refreshToken,
        },
      });

      if (res.status == 200) {
        const data = await res.json();
        store.dispatch(saveAccessToken(data.data.accessToken));
        (options.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${data.data.accessToken}`;
        return fetch(url, options).then((response) => response.json());
      }
      if (res.status == 401) {
        store.dispatch(removeToken());
        window.alert("토큰이 만료되어 자동으로 로그아웃 되었습니다.");
      }

      return Promise.reject(new Error("Unauthorized"));
    }
  } else {
    return Promise.reject(new Error(response.statusText));
  }
};

const errorInterceptor: ErrorInterceptor = async (error) => {
  console.error("Fetch error:", error);

  const response = new Response(null, {
    status: 500,
    statusText: "Internal Server Error",
  });
  return Promise.reject(response);
};

export default async function fetchWithInterceptors<T>(
  url: string,
  options: FetchOptions,
  store: Store
): Promise<FetchResponse<T>> {
  if (requestInterceptor) {
    const modifiedRequest = requestInterceptor(url, options, store);
    url = modifiedRequest.url || url;
    options = modifiedRequest.options || options;
  }

  return fetch(url, options)
    .then(async (response) => {
      if (responseInterceptor as ResponseInterceptor<T>) {
        return responseInterceptor(response, url, options, store);
      }
      return response.json().then((data) => {
        (response as FetchResponse<T>).data = data;
        return response as FetchResponse<T>;
      });
    })
    .catch((error: unknown) => {
      return errorInterceptor(error);
    });
}
