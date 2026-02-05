import { getRefreshToken } from "../utlis/auth-tokens";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions = {
  skipAuth?: boolean;
  skipRefresh?: boolean;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

class ApiClient {
  private readonly BASE_URL: string;
  private accessToken: string | null = null;

  constructor() {
    this.BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
  }

  // =========================
  // Token refresh
  // =========================
  private async refreshAccessToken(): Promise<string> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(this.BASE_URL + "/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const res = await response.json();
    return res.data.tokens.accessToken as string;
  }

  // =========================
  // Shared request function (re-used by all methods)
  // =========================
  private async request<T>(
    method: HttpMethod,
    url: string,
    body?: unknown, // for JSON body
    options?: RequestOptions,
  ): Promise<T> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(options?.headers ?? {}),
    };

    if (!options) {
      options = {
        skipAuth: false,
        skipRefresh: false,
      };
    }

    if (!options?.skipAuth && this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    // build fetch config
    const config: RequestInit = {
      method,
      headers,
      signal: options?.signal,
      credentials: "include",
    };

    // attach JSON body if provided (NOT for GET/DELETE usually)
    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(body);
    }

    try {
      const res = await fetch(this.BASE_URL + url, config);
      console.log(res, "res");
      // success
      if (res.ok) {
        if (res.status === 204) return undefined as T;
        return (await res.json()) as T;
      }

      // auth retry once
      if (!options?.skipAuth && res.status === 401 && !options?.skipRefresh) {
        this.accessToken = await this.refreshAccessToken();
        return this.request<T>(method, url, body, {
          ...options,
          skipRefresh: true,
        });
      }

      // read error body (best effort)
      let errBody: unknown = null;
      try {
        errBody = await res.json();
      } catch {
        try {
          errBody = await res.text();
        } catch {}
      }
      throw new Error(
        typeof errBody === "string"
          ? errBody
          : String(
              (errBody as Record<string, unknown>)?.message || "Unknown error",
            ),
      );
    } catch (err) {
      console.error(`API ${method} error:`, err);
      throw err;
    }
  }

  // =========================
  // Special shared function for FormData (files)
  // =========================
  private async requestForm<T>(
    method: Exclude<HttpMethod, "GET">, // usually POST/PUT/PATCH
    url: string,
    formData: FormData,
    options?: RequestOptions,
  ): Promise<T> {
    if (!options) {
      options = {
        skipAuth: false,
        skipRefresh: false,
      };
    }
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(options?.headers ?? {}),
    };

    if (!options?.skipAuth && this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const res = await fetch(this.BASE_URL + url, {
        method,
        headers,
        body: formData,
        signal: options?.signal,
      });

      if (res.ok) {
        if (res.status === 204) return undefined as T;
        return (await res.json()) as T;
      }

      // auth retry once
      if (!options?.skipAuth && res.status === 401 && !options?.skipRefresh) {
        this.accessToken = await this.refreshAccessToken();
        return this.requestForm<T>(method, url, formData, {
          ...options,
          skipRefresh: true,
        });
      }

      let errBody: unknown = null;
      try {
        errBody = await res.json();
      } catch {
        try {
          errBody = await res.text();
        } catch {}
      }

      throw new Error(
        `API ${method} (FormData) failed: ${res.status} ${res.statusText}${
          errBody
            ? ` | ${typeof errBody === "string" ? errBody : JSON.stringify(errBody)}`
            : ""
        }`,
      );
    } catch (err) {
      console.error(`API ${method} (FormData) error:`, err);
      throw err;
    }
  }

  // =========================
  // Public methods
  // =========================
  get<T>({
    url,
    options,
  }: {
    url: string;
    options?: RequestOptions;
  }): Promise<T> {
    return this.request<T>("GET", url, undefined, options);
  }

  post<T>({
    url,
    data,
    options,
  }: {
    url: string;
    data?: unknown;
    options?: RequestOptions;
  }): Promise<T> {
    return this.request<T>("POST", url, data, options);
  }

  postAsFile<T>({
    url,
    formData,
    options,
  }: {
    url: string;
    formData: FormData;
    options?: RequestOptions;
  }): Promise<T> {
    return this.requestForm<T>("POST", url, formData, options);
  }

  put<T>({
    url,
    data,
    options,
  }: {
    url: string;
    data?: unknown;
    options?: RequestOptions;
  }): Promise<T> {
    return this.request<T>("PUT", url, data, options);
  }

  patch<T>({
    url,
    data,
    options,
  }: {
    url: string;
    data?: unknown;
    options?: RequestOptions;
  }): Promise<T> {
    return this.request<T>("PATCH", url, data, options);
  }

  delete<T>({
    url,
    options,
  }: {
    url: string;
    options?: RequestOptions;
  }): Promise<T> {
    return this.request<T>("DELETE", url, undefined, options);
  }
}

export const apiClient = new ApiClient();
