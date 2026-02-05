import { Setter } from "../types/general";
import { RequestOptions } from "./api-client";

export type FetcherArgs<TData> = {
  path: string;
  setLoading: Setter<boolean>;
  setData?: Setter<TData | undefined>;
  setError?: Setter<string | null>;
  setMessage?: Setter<string>;
  toastMessage?: string;
  method?: "post" | "put" | "patch" | "delete" | "get";
  // credentials?: RequestCredentials;
  options?: RequestOptions;
};

export type SubmitJsonArgs<TData, TBody = unknown> = FetcherArgs<TData> & {
  isFileUpload?: false;
  data?: TBody;
};

export type SubmitFileArgs<TData> = FetcherArgs<TData> & {
  isFileUpload: true;
  data: FormData;
};

export type SubmitDataArgs<TData, TBody = unknown> =
  | SubmitJsonArgs<TData, TBody>
  | SubmitFileArgs<TData>;

export type GetData<TData> = FetcherArgs<TData> & {
  page?: number;
  limit?: number;
  filters?: Record<string, unknown>;
  search?: string;
  sort?: string;
};

// export async function uploadInChunks(file, setProgress, setOverlay, isClient) {

export type ChunkUploadProgress = {
  loadedChunks: number;
  totalChunks: number;
  percentage: number;
};
export type ChunkUploadResult<T = unknown> = {
  status: boolean;
  url?: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileMimeType?: string;
  extraData?: T;
};
export type ChunkUploadHandlers = {
  setProgress: (progress: number) => void;
  setOverlay?: (isVisible: boolean) => void;
};
export type ChunkUploadArgs = {
  file: File;
  isClient?: boolean;
} & ChunkUploadHandlers;
