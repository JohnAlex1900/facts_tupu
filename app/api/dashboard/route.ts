import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
  accelerateUrl: process.env.DATABASE_ACCELERATE_URL || "http://localhost:5432",
});

export async function GET() {
  try {
    // 1. FEED: Fetch active leaders paired with their regional hierarchy strings
    const leaders = await prisma.leader.findMany({
      include: {
        county: true,
        constituency: true,
        pillars: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    // 2. RISK RADAR: Isolate infrastructure nodes marked as STALLED or with large cash deltas
    const stalledProjects = await prisma.project.findMany({
      where: { satelliteStatus: "STALLED" },
      include: {
        leader: {
          select: { name: true, roleTitle: true },
        },
      },
      orderBy: { disbursedFunds: "desc" },
    });

    // 3. MONITOR: Stream the most recent 10 ingestion events from official oversight documents
    const ingestionLogs = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { date: "desc" },
      include: {
        leader: {
          select: { name: true },
        },
      },
    });

    // 4. SCORECARDS: Calculate ecosystem-wide averages for the 5 key indices
    const aggregateMetrics = await prisma.pillarScore.aggregate({
      _avg: {
        legislation: true,
        fiduciary: true,
        responsiveness: true,
        fidelity: true,
        integrity: true,
      },
    });

    return NextResponse.json({
      success: true,
      feed: leaders.map((l) => ({
        id: l.id,
        name: l.name,
        role: l.roleTitle,
        jurisdiction: `${l.constituency?.name || l.county.name} — Level ${l.type}`,
        jabaMeter: l.pillars
          ? Math.round((l.pillars.fiduciary + l.pillars.fidelity) / 2)
          : 0,
        footprint: l.communityFootprint,
      })),
      riskRadar: stalledProjects.map((p) => ({
        id: p.id,
        projectName: p.name,
        managedBy: p.leader.name,
        allocated: Number(p.allocatedFunds),
        disbursed: Number(p.disbursedFunds),
        leakageRisk:
          Number(p.disbursedFunds) - Number(p.allocatedFunds) * 0.5 > 0
            ? "HIGH"
            : "MEDIUM",
      })),
      monitor: ingestionLogs.map((log) => ({
        id: log.id,
        timestamp: log.date.toISOString().split("T")[0],
        source: log.source,
        target: log.leader.name,
        event: log.finding,
        status: log.severity,
      })),
      scorecards: {
        nationalLegislationAvg: Math.round(
          aggregateMetrics._avg.legislation || 0,
        ),
        nationalFiduciaryAvg: Math.round(aggregateMetrics._avg.fiduciary || 0),
        nationalResponsivenessAvg: Math.round(
          aggregateMetrics._avg.responsiveness || 0,
        ),
        nationalFidelityAvg: Math.round(aggregateMetrics._avg.fidelity || 0),
        nationalIntegrityAvg: Math.round(aggregateMetrics._avg.integrity || 0),
      },
    });
  } catch (error) {
    console.error("Dashboard Aggregator Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to assemble core platform data matrices",
      },
      { status: 500 },
    );
  }
}
