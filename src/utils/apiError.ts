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

const formatDetails = (details?: ApiErrorDetail) => {
  if (!details) return "";

  if (typeof details === "string") {
    return details;
  }

  if (Array.isArray(details)) {
    return details
      .map((detail) => {
        if (detail.field && detail.message) {
          return `${detail.field}: ${detail.message}`;
        }
        return detail.message;
      })
      .filter(Boolean)
      .join(". ");
  }

  return details.message ?? "";
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
    return response.data.message;
  }

  if (response?.status === 401) {
    return "Invalid email or password.";
  }

  if (response?.status === 409) {
    return "This account detail is already in use.";
  }

  if (response?.status === 400 || response?.data?.message === "Validation failed") {
    return "Please check the form fields and try again.";
  }

  return fallback;
};
