import { StatCardGrid } from "@/components/ui";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { Eye, MousePointer, PoundSterling, TrendingUp } from "lucide-react";
import ClientList from "./components/client-list";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export default async function DashboardPage() {
  // Fetch all data in parallel for better performance
  const limit = DEFAULT_PAGE_SIZE;
  const [stats, initialClients, totalClientCount] = await Promise.all([
    prisma.campaign.aggregate({
      _sum: {
        conversions: true,
        clicks: true,
        impressions: true,
        revenue_generated: true,
      },
    }),
    prisma.client.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { campaigns: true }
        }
      },
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.client.count(),
  ]);

  const initialClientData = {
    clients: initialClients.map((client) => ({
      id: client.id,
      name: client.name,
      campaignCount: client._count.campaigns,
    })),
    totalCount: totalClientCount,
  };

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

  const statCards = [
    {
      id: "total-revenue",
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: PoundSterling,
      tooltip: "Total revenue generated across all campaigns. This represents the monetary value earned from successful conversions.",
    },
    {
      id: "total-conversions",
      title: "Total Conversions",
      value: formatNumber(totalConversions),
      subtitle: `${formatPercentage(conversionRate)} conversion rate`,
      icon: TrendingUp,
      tooltip: "Total number of successful conversions (purchases, sign-ups, etc.) across all campaigns. The conversion rate shows the percentage of clicks that resulted in conversions.",
    },
    {
      id: "total-clicks",
      title: "Total Clicks",
      value: formatNumber(totalClicks),
      subtitle: `${formatPercentage(clickThroughRate)} CTR`,
      icon: MousePointer,
      tooltip: "Total number of clicks on your ads across all campaigns. CTR (Click-Through Rate) shows the percentage of impressions that resulted in clicks.",
    },
    {
      id: "total-impressions",
      title: "Total Impressions",
      value: formatNumber(totalImpressions),
      icon: Eye,
      tooltip: "Total number of times your ads were displayed to users across all campaigns. This represents the reach of your advertising campaigns.",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-text-primary-900 mb-2">Dashboard</h1>
          <p className="text-neutral-500">Welcome to your campaign analytics overview.</p>
        </div>
      </div>

      {/* Server-side rendered statistics cards - instant display */}
      <StatCardGrid
        cards={statCards}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      />

      {/* Client-side rendered client list with pagination */}
      <ClientList initialData={initialClientData} />
    </div>
  );
}
