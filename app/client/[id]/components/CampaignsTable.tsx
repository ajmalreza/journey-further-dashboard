import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  getStatusColor,
} from "@/lib/utils";

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

interface CampaignsTableProps {
  campaigns: Campaign[];
}

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  const columns = [
    "Campaign",
    "Start Date",
    "End Date",
    "Budget",
    "Channel",
    "Impressions",
    "Clicks",
    "Conversions",
    "Revenue",
    "Target Audience",
    "Status",
  ];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead className="bg-light-purple" key={column}>
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign, index) => (
            <TableRow
              key={campaign.campaign_id}
              className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
            >
              <TableCell>
                <div className="font-medium text-gray-900">
                  {campaign.campaign_name}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-700 font-medium">
                  {formatDate(campaign.start_date)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-700 font-medium">
                  {formatDate(campaign.end_date)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-700 font-medium">
                  {formatCurrency(campaign.budget)}
                </span>
              </TableCell>
              <TableCell>
                <span className={`font-bold text-sm`}>{campaign.channel}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-700 font-medium">
                  {campaign.impressions
                    ? formatNumber(campaign.impressions)
                    : "N/A"}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-700 font-medium">
                  {campaign.clicks ? formatNumber(campaign.clicks) : "N/A"}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-700 font-medium">
                  {campaign.conversions
                    ? formatNumber(campaign.conversions)
                    : "N/A"}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-700 font-medium">
                  {campaign.revenue_generated
                    ? formatCurrency(campaign.revenue_generated)
                    : "N/A"}
                </span>
              </TableCell>
              <TableCell className="max-w-xs">
                <div
                  className="text-sm text-gray-700 font-medium truncate"
                  title={campaign.target_audience}
                >
                  {campaign.target_audience}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    campaign.status
                  )}`}
                >
                  {campaign.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
