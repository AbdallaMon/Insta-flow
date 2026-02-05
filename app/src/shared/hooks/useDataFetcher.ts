"use client";
import { useEffect, useState } from "react";
import { initialPageLimit } from "../utlis/constants";
import { getData } from "../lib/fetchers/get";
import { useLoading } from "@/providers/LoadingProvider";

interface FetchedData {
  data?: unknown;
  totalPages?: number;
  total?: number;
  extraData?: unknown;
}

export default function useDataFetcher({
  url,
  noArr,
  initialFilters = {},
}: {
  url: string;
  noArr?: boolean;
  initialFilters?: Record<string, unknown>;
}) {
  const [data, setData] = useState<unknown>(noArr ? null : []);
  const { loading, setLoading } = useLoading();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialPageLimit);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [printMode, setPrintMode] = useState(false);
  const [render, setRender] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extraData, setExtraData] = useState<unknown>(null);

  useEffect(() => {
    async function fetchData() {
      if (printMode) return;

      await getData<FetchedData>({
        path: url,
        setLoading,
        setData: (fetchedData) => {
          if (fetchedData && typeof fetchedData !== "function") {
            setData(fetchedData.data || (noArr ? null : []));
            setTotalPages(fetchedData.totalPages || 0);
            setTotal(fetchedData.total || 0);
            setExtraData(fetchedData.extraData || null);
            setError(null);
          }
        },
        setError: (errorMsg) => {
          if (typeof errorMsg === "string") {
            setError(errorMsg);
          }
        },
        page,
        limit,
        filters,
        search,
        sort,
      });
    }

    fetchData();
  }, [page, limit, filters, search, sort, render, printMode, url, noArr]);

  return {
    data,
    loading,
    setData,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    filters,
    setFilters,
    setSearch,
    search,
    setSort,
    total,
    setTotal,
    setPrintMode,
    setTotalPages,
    setRender,
    error,
    setError,
    extraData,
    setExtraData,
  };
}
