"use client";

import { Card, CardContent, Pagination } from "@/components/ui";
import { useCallback, useEffect, useState } from "react";
import { CampaignsListHeader } from "./components/CampaignsListHeader";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { EmptyState } from "./components/EmptyState";
import { CampaignsTable } from "./components/CampaignsTable";

interface Campaign {
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

interface InitialData {
  campaigns: Campaign[];
  totalCount: number;
}

interface CampaignsListProps {
  clientId: string;
  clientName: string;
  initialData?: InitialData;
}

export default function CampaignsList({
  clientId,
  clientName,
  initialData,
}: CampaignsListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialData?.campaigns || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(initialData?.totalCount || 0);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const limit = 20;

  const fetchCampaigns = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/clients/${clientId}/campaigns?page=${page}&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch campaigns");
        }

        const data = await response.json();

        setCampaigns(data.campaigns);
        setTotalCount(data.totalCount);
        setCurrentPage(page);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [clientId, limit]
  );

  useEffect(() => {
    if (!initialData) {
      fetchCampaigns(1);
    }
  }, [fetchCampaigns, initialData]);

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(totalCount / limit);
    if (newPage >= 1 && newPage <= totalPages) {
      fetchCampaigns(newPage);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState error={error} />;
    }

    if (campaigns.length === 0) {
      return <EmptyState />;
    }

    return (
      <>
        <CampaignsTable campaigns={campaigns} />
        
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / limit)}
          totalCount={totalCount}
          currentItemsCount={campaigns.length}
          loading={loading}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  return (
    <Card>
      <CampaignsListHeader clientName={clientName} />
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
