import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AvatarInitials } from "@/components/ui";

interface Client {
  id: string;
  name: string;
  campaignCount: number;
}

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
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
  );
}
