"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, Button, AvatarInitials, Pagination } from "@/components/ui";
import {
  Users,
  ArrowRight,
  Upload,
  Loader2,
} from "lucide-react";
import { ClientListHeader } from "./components/ClientListHeader";

interface Client {
  id: string;
  name: string;
  campaignCount: number;
}

interface InitialData {
  clients: Client[];
  totalCount: number;
}

interface ClientListProps {
  initialData?: InitialData;
}

export default function ClientList({ initialData }: ClientListProps) {
  const [clients, setClients] = useState<Client[]>(initialData?.clients || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(initialData?.totalCount || 0);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const limit = 20;

  const fetchClients = useCallback(
    async (page = 1, search = "") => {
      try {
        setLoading(true);

        const searchParam = search
          ? `&search=${encodeURIComponent(search)}`
          : "";
        const response = await fetch(
          `/api/clients?page=${page}&limit=${limit}${searchParam}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }

        const data = await response.json();

        setClients(data.clients);
        setTotalCount(data.totalCount);
        setCurrentPage(page);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch clients when debounced search changes (only if no initial data or search is active)
  useEffect(() => {
    if (!initialData || searchDebounced) {
      fetchClients(1, searchDebounced);
    }
  }, [fetchClients, searchDebounced, initialData]);

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(totalCount / limit);
    if (newPage >= 1 && newPage <= totalPages) {
      fetchClients(newPage, searchDebounced);
    }
  };

  if (loading) {
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
            <div className="text-error mb-4 font-medium">Error: {error}</div>
            <Button
              onClick={() => fetchClients(1, searchDebounced)}
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
        {clients.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
            {searchDebounced ? (
              <>
                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                  No clients found
                </h3>
                <p className="text-neutral-500 mb-4">
                  No clients match your search for &quot;{searchDebounced}&quot;
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
              {clients.map((client) => (
                <Link
                  key={client.id}
                  href={`/client/${client.id}`}
                  className="block cursor-pointer"
                >
                  <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:bg-primary-50 hover:border-primary-500 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <AvatarInitials name={client.name} size="sm" />
                      <div>
                        <h3 className="font-semibold text-primary-900 text-sm">
                          {client.name}
                        </h3>
                        <p className="text-xs text-neutral-500">
                          {client.campaignCount} campaign
                          {client.campaignCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-neutral-500" />
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalCount / limit)}
              totalCount={totalCount}
              currentItemsCount={clients.length}
              loading={loading}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
