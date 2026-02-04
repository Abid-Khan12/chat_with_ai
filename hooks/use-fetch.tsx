"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface FetchProps {
  api_url: string;
  api_key: string[];
}

interface ErrorResponse {
  status?: number;
  message?: string;
}

const handleFetch = async <TData,>(
  url: string,
  api_key: string[],
): Promise<TData> => {
  try {
    const { data } = await axios.get<TData>(url);

    console.log(`${api_key} Response`, data);

    return data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string; status: number }>;
    console.error(`Error occured in ${api_key.join()}`, error);
    throw {
      status: err.response?.data.status,
      message: err.response?.data.message,
    };
  }
};

const useFetch = <TData = any,>({
  api_url,
  api_key,
}: FetchProps): UseQueryResult<TData, ErrorResponse> => {
  return useQuery<TData, ErrorResponse>({
    queryKey: api_key,
    queryFn: () => handleFetch(api_url, api_key),
  });
};

export default useFetch;
