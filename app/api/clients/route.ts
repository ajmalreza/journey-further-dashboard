import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = +(searchParams.get("limit") || DEFAULT_PAGE_SIZE);
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {};

    // Get clients with pagination using aggregation for campaign count
    const [clients, totalCount] = await Promise.all([
      prisma.client.findMany({
        where,
        select: {
          id: true,
          name: true,
          _count: {
            select: { campaigns: true }
          }
        },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.client.count({ where }),
    ]);

    return NextResponse.json({
      clients: clients.map((client) => ({
        id: client.id,
        name: client.name,
        campaignCount: client._count.campaigns,
      })),
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}
