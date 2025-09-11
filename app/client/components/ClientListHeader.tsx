import { CardHeader, CardTitle } from "@/components/ui";
import { Users, Search } from "lucide-react";

interface ClientListHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ClientListHeader({ searchTerm, onSearchChange }: ClientListHeaderProps) {
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
            className="w-64 pl-10 pr-4 py-2 border border-neutral-200 rounded-lg bg-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </CardHeader>
  );
}
