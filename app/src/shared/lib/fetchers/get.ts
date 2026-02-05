import { ApiResponse } from "@/shared/types/api";
import { GetData } from "../types";
import { apiClient } from "../api-client";

function buildQueryParams(params?: Record<string, unknown>): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (k === "filters" && typeof v === "object") {
      searchParams.set(k, JSON.stringify(v));
    } else {
      searchParams.set(k, String(v));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export async function getData<TData = unknown>({
  path = "",
  setLoading,
  setData,
  setError,
  setMessage,
  page,
  limit,
  filters,
  search,
  sort,
  options,
}: GetData<TData>): Promise<ApiResponse<TData> | undefined> {
  try {
    setLoading(true);

    const queryParams = buildQueryParams({
      page,
      limit,
      search,
      sort,
      filters,
    });

    const result = await apiClient.get<ApiResponse<TData>>({
      url: `${path}${queryParams}`,
      options,
    });

    if (setData && result.data) {
      setData(result.data);
    }

    if (setMessage) {
      setMessage(result.message || "");
    }

    return result;
  } catch (e) {
    if (setError && e instanceof Error) {
      setError(e.message);
    }
    if (setMessage && e instanceof Error) {
      setMessage(e.message);
    }
    console.error("getData error:", e);
  } finally {
    setLoading(false);
  }
}
