import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20'); // Increased default limit

    // Get paginated campaigns
    const skip = (page - 1) * limit;
    const [campaigns, totalCount] = await Promise.all([
      prisma.campaign.findMany({
        where: { clientId: clientId },
        orderBy: {
          start_date: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.campaign.count({
        where: { clientId: clientId },
      }),
    ]);

    return NextResponse.json({
      campaigns: campaigns.map(campaign => ({
        campaign_id: campaign.campaign_id,
        campaign_name: campaign.campaign_name,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        budget: campaign.budget,
        channel: campaign.channel,
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        conversions: campaign.conversions,
        revenue_generated: campaign.revenue_generated,
        target_audience: campaign.target_audience,
        status: campaign.status,
      })),
      totalCount,
    });

  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}
