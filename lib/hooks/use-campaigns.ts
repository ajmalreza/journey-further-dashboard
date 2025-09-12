import { useQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE, STALE_TIME_MS, GC_TIME_MS } from "@/lib/constants";

export interface Campaign {
  campaign_id: string;
  campaign_name: string;
  start_date: string | null;
  end_date: string | null;
  budget: number;
  channel: string;
  impressions: number | null;
  clicks: number | null;
  conversions: number | null;
  revenue_generated: number | null;
  target_audience: string;
  status: string;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
  totalCount: number;
}

interface UseCampaignsParams {
  clientId: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

// Fetch campaigns with pagination
export function useCampaigns({
  clientId,
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  enabled = true,
}: UseCampaignsParams) {
  return useQuery({
    queryKey: ["campaigns", clientId, page, limit],
    queryFn: async (): Promise<CampaignsResponse> => {
      const response = await fetch(
        `/api/clients/${clientId}/campaigns?page=${page}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }
      
      return response.json();
    },
    enabled: enabled && !!clientId,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
  });
}
