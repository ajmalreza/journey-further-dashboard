import { CardHeader, CardTitle } from "@/components/ui";
import { Users, Search, X } from "lucide-react";

interface ClientListHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ClientListHeader({ searchTerm, onSearchChange }: ClientListHeaderProps) {
  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-text-primary-900">
            <Users className="h-5 w-5 text-primary-500" />
            Clients
          </CardTitle>
        </div>
        
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 pl-10 pr-10 py-2 border border-input rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500 cursor-pointer hover:text-neutral-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </CardHeader>
  );
}
