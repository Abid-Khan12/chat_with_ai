"use client";

import axios, { AxiosError } from "axios";
import { useState } from "react";

interface MutationProps {
  api_url: string;
  method?: "post" | "delete" | "put";
}

interface ValidationErrors {
  [key: string]: string[];
}

interface MutationResponse {
  data?: any;
  message?: string;
  status?: number;
  isError?: boolean;
  validationErrors?: ValidationErrors;
}

interface MutationResult<TPayload> {
  mutate: (payload: TPayload) => Promise<MutationResponse>;
  isLoading: boolean;
}

const useMutation = <TPayload = any,>({
  api_url,
  method = "post",
}: MutationProps): MutationResult<TPayload> => {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (payload: TPayload): Promise<MutationResponse> => {
    setIsLoading(true);

    switch (method) {
      // case "delete":
      //   try {
      //     const { data } = await axios.delete(api_url);
      //     setResponse(data);
      //   } catch (err) {
      //     setError(err instanceof Error ? err.message : "An error occurred");
      //   } finally {
      //     setIsLoading(false);
      //   }
      //   break;

      // case "put":
      //   try {
      //     const { data } = await axios.put(api_url, { payload });

      //     setResponse(data);
      //   } catch (err) {
      //     setError(err instanceof Error ? err.message : "An error occurred");
      //   } finally {
      //     setIsLoading(false);
      //   }
      //   break;

      default:
        try {
          const { data } = await axios.post(api_url, payload);

          console.log("response data", data);

          return {
            data: data,
            message: data.message,
            status: data.status,
            isError: false,
          };
        } catch (err) {
          const error = err as AxiosError<{
            message?: string;
            status?: number;
            error?: ValidationErrors;
          }>;

          console.error(`${api_url} Error`, error);

          if (
            error.response?.data?.message === "Validation error" &&
            error.response?.data?.error
          ) {
            return {
              data: undefined,
              message: error.response?.data?.message,
              status: error.response?.data?.status,
              validationErrors: error.response.data.error,
              isError: true,
            };
          }

          return {
            data: undefined,
            message: error.response?.data?.message,
            status: error.response?.data?.status,
            isError: true,
          };
        } finally {
          setIsLoading(false);
        }
    }
  };

  return {
    mutate,
    isLoading,
  };
};

export default useMutation;
