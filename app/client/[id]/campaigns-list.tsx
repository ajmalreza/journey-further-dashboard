"use client";

import { Card, CardContent, Pagination } from "@/components/ui";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useCampaigns, type Campaign } from "@/lib/hooks/use-campaigns";
import { useState } from "react";
import { CampaignsListHeader } from "./components/CampaignsListHeader";
import { CampaignsTable } from "./components/CampaignsTable";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { LoadingState } from "./components/LoadingState";

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
  const [currentPage, setCurrentPage] = useState(1);
  const limit = DEFAULT_PAGE_SIZE;

  // Use React Query for data fetching
  const { data, isLoading, error, isFetching } = useCampaigns({
    clientId,
    page: currentPage,
    limit,
    enabled: true,
  });

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(
      (data?.totalCount || initialData?.totalCount || 0) / limit
    );
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Use initial data if available and no query data yet
  const campaigns = data?.campaigns || initialData?.campaigns || [];
  const totalCount = data?.totalCount || initialData?.totalCount || 0;
  const loading = isLoading && !initialData;
  const hasError = !!error;

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (hasError) {
      return (
        <ErrorState
          error={error instanceof Error ? error.message : "An error occurred"}
        />
      );
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
          loading={isFetching}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  return (
    <Card>
      <CampaignsListHeader clientName={clientName} />
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
