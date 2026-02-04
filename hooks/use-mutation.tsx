"use client";

import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface ValidationErrors {
  [key: string]: string[];
}

interface MutationResponse<T = any> {
  data?: T;
  message?: string;
  status?: number;
}

interface ErrorResponse<TError> {
  message?: string;
  status?: number;
  validationErrors?: ValidationErrors;
  data?: TError;
}

interface CustomMutationProps {
  api_url: string;
  api_key: string[];
}

interface PostProps<T> {
  api_url: string;
  api_key: string[];
  payload: T;
}

interface MutationVariables<TPayload> {
  payload: TPayload;
  method?: "post" | "delete" | "put";
  slug?: string;
}

const handlePost = async <TPayload, TResponse, TError>({
  api_url,
  api_key,
  payload,
}: PostProps<TPayload>): Promise<MutationResponse<TResponse>> => {
  try {
    const { data } = await axios.post(api_url, payload);

    console.log(`${api_key.join()} response data`, data);

    return {
      data: data,
      message: data.message,
      status: data.status,
    };
  } catch (err) {
    const error = err as AxiosError<{
      message?: string;
      status?: number;
      error?: ValidationErrors;
      data?: TError;
    }>;

    console.error(`${api_url} Error`, error);

    if (
      error.response?.data?.message === "Validation error" &&
      error.response?.data?.error
    ) {
      throw {
        message: error.response?.data?.message,
        status: error.response?.data?.status,
        validationErrors: error.response.data.error,
      };
    }

    throw {
      message: error.response?.data?.message,
      status: error.response?.data?.status,
      data: error.response?.data,
    };
  }
};

const useCustomMutation = <TResponse = any, TPayload = any, TError = any>({
  api_url,
  api_key,
}: CustomMutationProps): UseMutationResult<
  MutationResponse<TResponse>,
  ErrorResponse<TError>,
  MutationVariables<TPayload>
> => {
  return useMutation<
    MutationResponse<TResponse>,
    ErrorResponse<TError>,
    MutationVariables<TPayload>
  >({
    mutationKey: api_key,
    mutationFn: ({ payload, method = "post", slug }) => {
      switch (method) {
        // case "delete":
        //   return handleDelete<TResponse>(api_url, api_key, slug);

        // case "put":
        //   return handlePut<TPayload, TResponse>(api_url, api_key, payload, slug);

        default:
          return handlePost<TPayload, TResponse, TError>({
            api_key,
            api_url,
            payload,
          });
      }
    },
  });
};

export default useCustomMutation;
