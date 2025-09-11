import { CardHeader, CardTitle } from "@/components/ui";

interface CampaignsListHeaderProps {
  clientName: string;
}

export function CampaignsListHeader({ clientName }: CampaignsListHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="text-text-primary-900">Campaigns for {clientName}</CardTitle>
    </CardHeader>
  );
}
