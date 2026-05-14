import type { AxiosError } from "axios";

type ApiErrorDetail =
  | string
  | { field?: string; message?: string }
  | Array<{ field?: string; message?: string }>;

type ApiErrorResponse = {
  message?: string;
  error?: {
    details?: ApiErrorDetail;
  };
};

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

export const isTechnicalErrorMessage = (message?: string) => {
  if (!message) return false;

  return [
    /prisma/i,
    /findUnique|findFirst|findMany|create\(|update\(|delete\(|upsert\(/i,
    /invocation/i,
    /column .* does not exist/i,
    /unknown arg|unknown argument/i,
    /database|datasource|query engine|sql|mysql|postgres/i,
    /\b[A-Za-z0-9_]+\.[A-Za-z0-9_]+\.[A-Za-z0-9_]+\b/,
    /node_modules|src\\|src\/|\.ts:\d+|\.js:\d+/i,
    /stack trace|TypeError|ReferenceError|SyntaxError/i,
    /request failed with status code \d+/i,
    /\bstatus code \d+/i,
    /foreign key|constraint failed|unique constraint/i,
    /C:\\|\/Users\//i
  ].some((pattern) => pattern.test(message));
};

export const getSafeUserMessage = (
  message?: string,
  fallback = DEFAULT_ERROR_MESSAGE
) => {
  if (!message || isTechnicalErrorMessage(message)) {
    return fallback;
  }

  return message;
};

const formatDetails = (details?: ApiErrorDetail) => {
  if (!details) return "";

  if (typeof details === "string") {
    return getSafeUserMessage(details, "");
  }

  if (Array.isArray(details)) {
    return details
      .map((detail) => {
        if (detail.field && detail.message) {
          return `${detail.field}: ${getSafeUserMessage(detail.message, "Please check this field.")}`;
        }
        return getSafeUserMessage(detail.message, "");
      })
      .filter(Boolean)
      .join(". ");
  }

  return getSafeUserMessage(details.message, "");
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again."
) => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const response = axiosError.response;
  const detailsMessage = formatDetails(response?.data?.error?.details);

  if (detailsMessage) {
    return detailsMessage;
  }

  if (response?.data?.message && response.data.message !== "Validation failed") {
    return getSafeUserMessage(response.data.message, fallback);
  }

  if (response?.status === 401) {
    return "Invalid email or password.";
  }

  if (response?.status === 409) {
    return "This account detail is already in use.";
  }

  if (response?.status === 429) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (response?.status === 400 || response?.data?.message === "Validation failed") {
    return "Please check the form fields and try again.";
  }

  return fallback;
};
