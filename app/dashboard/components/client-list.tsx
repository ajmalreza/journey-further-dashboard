"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  Button,
  Pagination,
} from "@/components/ui";
import { Users, Upload, Loader2 } from "lucide-react";
import { ClientListHeader } from "../../client/components/ClientListHeader";
import { ClientCard } from "./ClientCard";
import { useClients, type Client } from "@/lib/hooks/use-clients";
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "@/lib/constants";

interface InitialData {
  clients: Client[];
  totalCount: number;
}

interface ClientListProps {
  initialData?: InitialData;
}

export default function ClientList({ initialData }: ClientListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const limit = DEFAULT_PAGE_SIZE;

  // Use React Query for data fetching
  const {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useClients({
    page: currentPage,
    limit,
    search: searchTerm,
    enabled: true,
    initialData,
  });

  // Handle search with debouncing
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, SEARCH_DEBOUNCE_MS);

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil((data?.totalCount || 0) / limit);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  // React Query handles initial data automatically - use values directly

  if (isLoading) {
    return (
      <Card className="bg-white border border-neutral-200 shadow-sm">
        <ClientListHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
            <span className="ml-2 text-neutral-500">Loading clients...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white border border-neutral-200 shadow-sm">
        <ClientListHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <CardContent>
          <div className="text-center py-8">
            <div className="text-error mb-4 font-medium">
              Error: {error instanceof Error ? error.message : "An error occurred"}
            </div>
            <Button
              onClick={handleRetry}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-neutral-200 shadow-sm">
      <ClientListHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <CardContent>
        {data?.clients?.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
            {searchTerm ? (
              <>
                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                  No clients found
                </h3>
                <p className="text-neutral-500 mb-4">
                  No clients match your search for &quot;{searchTerm}&quot;
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                  No clients found
                </h3>
                <p className="text-neutral-500 mb-4">
                  Upload CSV data to get started
                </p>
                <Button asChild>
                  <Link href="/upload" className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Data
                  </Link>
                </Button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {data?.clients?.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil((data?.totalCount || 0) / limit)}
              totalCount={data?.totalCount || 0}
              currentItemsCount={(currentPage - 1) * limit + (data?.clients?.length || 0)}
              loading={isFetching}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
