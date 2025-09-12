import { notFound } from "next/navigation";
import Link from "next/link";
import { Button, StatCardGrid } from "@/components/ui";
import {
  ArrowLeft,
  PoundSterling,
  TrendingUp,
  MousePointer,
  Eye,
  Target,
} from "lucide-react";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import CampaignsList from "./campaigns-list";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

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

interface ClientData {
  client: {
    id: string;
    name: string;
    campaignCount: number;
  };
  statistics: {
    totalBudget: number;
    totalConversions: number;
    totalClicks: number;
    totalImpressions: number;
    totalRevenue: number;
    conversionRate: number;
    clickThroughRate: number;
    mostUsedChannel: string;
  };
  initialCampaigns: {
    campaigns: Campaign[];
    totalCount: number;
  };
}

async function getClientData(clientId: string): Promise<ClientData | null> {
  try {
    // Get client first
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return null;
    }

    // Calculate aggregated statistics at database level for better performance
    const [stats, campaignCount, channelData, initialCampaigns] =
      await Promise.all([
        // Get aggregated sums
        prisma.campaign.aggregate({
          where: { clientId: clientId },
          _sum: {
            budget: true,
            conversions: true,
            clicks: true,
            impressions: true,
            revenue_generated: true,
          },
        }),
        // Get campaign count
        prisma.campaign.count({
          where: { clientId: clientId },
        }),
        // Get channel distribution for most used channel
        prisma.campaign.groupBy({
          by: ["channel"],
          where: { clientId: clientId },
          _count: {
            channel: true,
          },
          orderBy: {
            _count: {
              channel: "desc",
            },
          },
          take: 1,
        }),
        // Get initial campaigns for the first page
        prisma.campaign.findMany({
          where: { clientId: clientId },
          orderBy: {
            start_date: "desc",
          },
          take: DEFAULT_PAGE_SIZE,
        }),
      ]);

    const totalBudget = stats._sum.budget || 0;
    const totalConversions = stats._sum.conversions || 0;
    const totalClicks = stats._sum.clicks || 0;
    const totalImpressions = stats._sum.impressions || 0;
    const totalRevenue = stats._sum.revenue_generated || 0;

    // Calculate conversion rate
    const conversionRate =
      totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    // Calculate click-through rate
    const clickThroughRate =
      totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    // Get most used channel
    const mostUsedChannel =
      channelData.length > 0 ? channelData[0].channel : "N/A";

    return {
      client: {
        id: client.id,
        name: client.name,
        campaignCount,
      },
      statistics: {
        totalBudget,
        totalConversions,
        totalClicks,
        totalImpressions,
        totalRevenue,
        conversionRate,
        clickThroughRate,
        mostUsedChannel,
      },
      initialCampaigns: {
        campaigns: initialCampaigns.map((campaign) => ({
          campaign_id: campaign.campaign_id,
          campaign_name: campaign.campaign_name,
          start_date: campaign.start_date?.toISOString() || null,
          end_date: campaign.end_date?.toISOString() || null,
          budget: campaign.budget,
          channel: campaign.channel,
          impressions: campaign.impressions,
          clicks: campaign.clicks,
          conversions: campaign.conversions,
          revenue_generated: campaign.revenue_generated,
          target_audience: campaign.target_audience,
          status: campaign.status,
        })),
        totalCount: campaignCount,
      },
    };
  } catch (error) {
    console.error("Error fetching client data:", error);
    return null;
  }
}

export default async function ClientViewPage({
  params,
}: {
  params: { id: string };
}) {
  const clientData = await getClientData(params.id);

  if (!clientData) {
    notFound();
  }

  const { client, statistics, initialCampaigns } = clientData;

  const statCards = [
    {
      id: "total-budget",
      title: "Total Budget",
      value: formatCurrency(statistics.totalBudget),
      icon: PoundSterling,
      tooltip:
        "Total budget allocated across all campaigns for this client. This represents the maximum amount planned to be spent on advertising.",
    },
    {
      id: "most-used-channel",
      title: "Most Used Channel",
      value: statistics.mostUsedChannel,
      icon: Target,
      tooltip:
        "The advertising channel (Google, Facebook, Instagram, etc.) that this client uses most frequently across their campaigns.",
    },
    {
      id: "total-impressions",
      title: "Total Impressions",
      value: formatNumber(statistics.totalImpressions),
      icon: Eye,
      tooltip:
        "Total number of times this client's ads were displayed to users. This shows the reach and visibility of their campaigns.",
    },
    {
      id: "total-clicks",
      title: "Total Clicks",
      value: formatNumber(statistics.totalClicks),
      icon: MousePointer,
      subtitle: `${formatPercentage(statistics.clickThroughRate)} CTR`,
      tooltip:
        "Total number of clicks on this client's ads. CTR (Click-Through Rate) shows how effectively their ads attract user engagement.",
    },
    {
      id: "total-conversions",
      title: "Total Conversions",
      value: formatNumber(statistics.totalConversions),
      icon: TrendingUp,
      subtitle: `${formatPercentage(
        statistics.conversionRate
      )} conversion rate`,
      tooltip:
        "Total successful conversions (purchases, sign-ups, etc.) for this client. The conversion rate shows how well their campaigns turn clicks into actions.",
    },
    {
      id: "total-revenue",
      title: "Revenue Generated",
      value: formatCurrency(statistics.totalRevenue),
      icon: PoundSterling,
      tooltip:
        "Total revenue generated from this client's campaigns. This represents the actual monetary value earned from their advertising efforts.",
    },
  ];

  return (
    <div className="mb-8">
      <div className="mb-6">
        <div className="flex items-start space-x-4">
          <Link href="/dashboard" className="cursor-pointer">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground mt-2">
              {client.campaignCount} campaign
              {client.campaignCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <StatCardGrid cards={statCards} />

      {/* Campaigns List */}
      <CampaignsList
        clientId={client.id}
        clientName={client.name}
        initialData={initialCampaigns}
      />
    </div>
  );
}
