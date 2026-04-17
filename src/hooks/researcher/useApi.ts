import axios, { type AxiosAdapter, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { BENEFEK_CODE } from "@/lib/researcher/dummyData";

type JsonRecord = Record<string, unknown>;

const ok = (config: AxiosRequestConfig, data: unknown): AxiosResponse => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config,
});

const badRequest = (config: AxiosRequestConfig, message: string): AxiosResponse => ({
  data: { error: message },
  status: 400,
  statusText: "Bad Request",
  headers: {},
  config,
});

const normalizeUrl = (url?: string) => (url || "").replace(/^\/+/, "");

const mockAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const url = normalizeUrl(config.url);
  const method = (config.method || "get").toLowerCase();

  if (method === "post" && url.endsWith("api/auth/login")) {
    const payload = (config.data ? JSON.parse(config.data as string) : {}) as JsonRecord;
    const username = String(payload.username || "");
    const password = String(payload.password || "");

    if (!username || !password) return badRequest(config, "Invalid credentials");
    return ok(config, { access: "mock-access-token" });
  }

  if (method === "post" && url.endsWith("api/auth/register")) {
    const payload = (config.data ? JSON.parse(config.data as string) : {}) as JsonRecord;
    const email = String(payload.email || "");
    const username = String(payload.username || "");
    const password = String(payload.password || "");

    if (!email || !username || !password) return badRequest(config, "Please fill in all fields");
    return ok(config, { id: "researcher-1", email, username });
  }

  if (method === "post" && url.endsWith("api/check-quiz-code/")) {
    const payload = (config.data ? JSON.parse(config.data as string) : {}) as JsonRecord;
    const code = String(payload.code || "").trim();

    if (!code) return badRequest(config, "Missing code");

    if (code.toUpperCase() === BENEFEK_CODE) {
      return ok(config, { exists: true, health_condition: { code } });
    }

    return ok(config, { exists: false });
  }

  return ok(config, {});
};

export const api = axios.create({
  baseURL: "/",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  adapter: mockAdapter,
});

