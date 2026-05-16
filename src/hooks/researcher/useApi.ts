import axios from "axios";
import { getSafeUserMessage } from "@/utils/apiError";

export const api = axios.create({
  baseURL: "/",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error.response?.data;

    if (responseData?.message) {
      responseData.message = getSafeUserMessage(responseData.message);
    }

    if (typeof responseData?.error === "string") {
      responseData.error = getSafeUserMessage(responseData.error);
    }

    return Promise.reject(error);
  }
);
