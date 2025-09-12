import { useQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE, STALE_TIME_MS, GC_TIME_MS } from "@/lib/constants";

export interface Client {
  id: string;
  name: string;
  campaignCount: number;
}

export interface ClientsResponse {
  clients: Client[];
  totalCount: number;
}

interface UseClientsParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
  initialData?: ClientsResponse;
}

// Fetch clients with pagination
export function useClients({
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  search = "",
  enabled = true,
  initialData,
}: UseClientsParams = {}) {
  return useQuery({
    queryKey: ["clients", page, limit, search],
    queryFn: async (): Promise<ClientsResponse> => {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await fetch(
        `/api/clients?page=${page}&limit=${limit}${searchParam}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      
      return response.json();
    },
    enabled,
    // Only use initialData for the first page and no search
    initialData: page === 1 && !search ? initialData : undefined,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
  });
}
