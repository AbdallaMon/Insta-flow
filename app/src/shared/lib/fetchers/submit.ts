import { Failed, Success } from "@/shared/utlis/toastStatus";
import { toast } from "react-toastify";
import { SubmitDataArgs } from "../types";
import { ApiResponse } from "@/shared/types/api";
import { apiClient } from "../api-client";

export async function submitData<TData = unknown, TBody = unknown>({
  data,
  setLoading,
  setData,
  setError,
  setMessage,
  path,
  toastMessage = "Sending...",
  method = "post",
  isFileUpload = false,
  options,
}: SubmitDataArgs<TData, TBody>): Promise<ApiResponse<TData>> {
  setLoading(true);
  const toastId = toast.loading(toastMessage);
  try {
    const req = isFileUpload
      ? await apiClient.postAsFile<ApiResponse<TData>>({
          url: path,
          formData: data as FormData,
          options,
        })
      : await apiClient[method]<ApiResponse<TData>>({
          url: path,
          data,
          options,
        });

    setData?.(req.data as unknown as TData);
    const message = req.message || "Request successful";
    setMessage?.(message);
    toast.update(toastId, Success(message));
    return req;
  } catch (error) {
    console.log("submitData error:", error);

    if (error instanceof Error) {
      toast.update(toastId, Failed(error.message));
      setError?.(error.message);
      setMessage?.(error.message);

      console.error("An error occurred:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }

    return {
      status: 500,
      message:
        "Error, " + (error instanceof Error ? error.message : "Unknown error"),
    };
  } finally {
    setLoading(false);
  }
}
