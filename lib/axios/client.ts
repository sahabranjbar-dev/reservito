import axios, { InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

const getErrorMessage = (error: any) => {
  if (axios.isAxiosError(error)) {
    const serverMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.msg;

    if (serverMessage) return serverMessage;

    switch (error.response?.status) {
      case 400:
        return "درخواست نامعتبر است.";
      case 401:
        return "برای انجام این عملیات باید وارد شوید.";
      case 403:
        return "دسترسی لازم را ندارید.";
      case 404:
        return "موردی یافت نشد.";
      case 422:
        return "اطلاعات وارد شده معتبر نیست.";
      case 500:
        return "خطای سرور رخ داده است. دوباره تلاش کنید.";
      default:
        return "خطایی رخ داده است. دوباره تلاش کنید.";
    }
  }

  if (error?.message?.includes("Network Error")) {
    return "اتصال اینترنت قطع است. لطفا اتصال خود را بررسی کنید.";
  }

  return "خطایی رخ داده است. دوباره تلاش کنید.";
};

export const createApiClient = (baseURL = process.env.NEXT_PUBLIC_API_URL) => {
  const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(onFulfilled, onRejected);

  api.interceptors.response.use(
    (res) => res,
    (err) => {
      const message = getErrorMessage(err);
      toast.error(message);
      return Promise.reject(err);
    }
  );

  return api;
};

function onFulfilled(
  config: InternalAxiosRequestConfig<any>
): InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>> {
  return config;
}

function onRejected(error: any) {
  const message = getErrorMessage(error);
  toast.error(message);
  return Promise.reject(error);
}
