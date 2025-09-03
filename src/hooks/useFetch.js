import { useData } from "@/context/DataContext";
import { useState } from "react";
import { apiClient } from "../lib/apiClient";

export function useFetch() {
  const { data, cambiarData } = useData();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const solicitudApi = async (endpoint, key) => {
    try {
      setLoading(true);

      const { data, error, msg } = await apiClient(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (error) {
        setError(msg);
      } else {
        cambiarData(key, data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    solicitudApi,
  };
}
