import axios from "axios";

export function getApiErrorMessage(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as { message?: string } | undefined;
    if (data?.message) {
      return data.message;
    }
    if (e.message) {
      return e.message;
    }
  }
  if (e instanceof Error) {
    return e.message;
  }
  return "Something went wrong";
}
