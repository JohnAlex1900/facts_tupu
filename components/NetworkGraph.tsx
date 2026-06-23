/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- TypeScript Definitions ---
interface Node {
  id: string;
  label: string;
  type: "politician" | "corporation" | "agency";
  sector?: string;
  riskScore: number; // 0 to 100
  details: {
    title: string;
    description: string;
    metrics: { label: string; value: string }[];
  };
}

interface Edge {
  id: string;
  source: string;
  target: string;
  relationship:
    | "tender_award"
    | "shareholder"
    | "family_tie"
    | "campaign_donation";
  value?: string;
  riskHighlight: boolean;
}

// --- Mock Dataset (Corporate-Political Entanglement) ---
const INITIAL_NODES: Node[] = [
  {
    id: "p1",
    label: "Hon. Alpha Omwamba",
    type: "politician",
    sector: "Ministry of Infrastructure",
    riskScore: 84,
    details: {
      title: "Cabinet Secretary & Committee Chair",
      description:
        "Oversees public infrastructure allocation budgets. Publicly declares zero commercial conflicts of interest.",
      metrics: [
        { label: "Public Assets Declared", value: "$1.4M" },
        { label: "Unexplained Wealth Delta", value: "+$3.2M" },
        { label: "Direct Family Board Seats", value: "3 Positions" },
      ],
    },
  },
  {
    id: "c1",
    label: "Mamba Logistics Ltd",
    type: "corporation",
    sector: "Transport & Shipping",
    riskScore: 92,
    details: {
      title: "Primary Logistics Contractor",
      description:
        "Incorporated 3 months prior to winning a major $45M port expansion supply tender bypass route.",
      metrics: [
        { label: "Total State Tenders Won", value: "$42.8M" },
        { label: "Beneficial Ownership Match", value: "98% (Via Proxy)" },
        { label: "Tax Compliance Rating", value: "Critical Alert" },
      ],
    },
  },
  {
    id: "c2",
    label: "Apex Holdings LLC",
    type: "corporation",
    sector: "Shell / Investment Holding",
    riskScore: 45,
    details: {
      title: "Offshore Venture Entity",
      description:
        "Registered in a tax haven jurisdiction with layered hidden proxy shares pointing back to state agencies.",
      metrics: [
        { label: "Subsidiaries Monitored", value: "4 Entities" },
        { label: "Foreign Wire Inflows", value: "$12.4M" },
        { label: "Audit Trait Status", value: "Obfuscated" },
      ],
    },
  },
  {
    id: "a1",
    label: "National Port Authority",
    type: "agency",
    sector: "State Department",
    riskScore: 60,
    details: {
      title: "Public Procurement Body",
      description:
        "Responsible for vetting commercial logistics tenders for the coastline transportation network.",
      metrics: [
        { label: "Annual Disbursal Budget", value: "$180M" },
        { label: "Contested Procurement Rate", value: "41%" },
        { label: "Independent Audits Failed", value: "2 Sequence Cycles" },
      ],
    },
  },
];

const INITIAL_EDGES: Edge[] = [
  {
    id: "e1",
    source: "p1",
    target: "c1",
    relationship: "shareholder",
    value: "Proxy Ownership (49%)",
    riskHighlight: true,
  },
  {
    id: "e2",
    source: "c1",
    target: "a1",
    relationship: "tender_award",
    value: "$42.8M Infrastructure Payout",
    riskHighlight: true,
  },
  {
    id: "e3",
    source: "p1",
    target: "c2",
    relationship: "campaign_donation",
    value: "$250,000 Unlisted Contribution",
    riskHighlight: false,
  },
  {
    id: "e4",
    source: "c2",
    target: "c1",
    relationship: "shareholder",
    value: "Parent Entity Umbrella",
    riskHighlight: false,
  },
];

export default function NetworkGraph() {
  // Global Workspace Interaction States
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges] = useState<Edge[]>(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("p1");
  const [filterType, setFilterType] = useState<string>("all");
  const [riskThreshold, setRiskThreshold] = useState<number>(0);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  // Dynamic Layout Coordinate Generation Map
  // Prevents node collisions by allocating semantic zones inside the viewport coordinate grid.
  const nodePositions = useMemo(() => {
    const width = 800;
    const height = 500;
    const positions: Record<string, { x: number; y: number }> = {};

    nodes.forEach((node, idx) => {
      if (node.type === "politician") {
        positions[node.id] = { x: width * 0.25, y: height * 0.35 + idx * 40 };
      } else if (node.type === "agency") {
        positions[node.id] = { x: width * 0.5, y: height * 0.65 };
      } else {
        positions[node.id] = { x: width * 0.75, y: height * 0.3 + idx * 50 };
      }
    });
    return positions;
  }, [nodes]);

  const [positions, setPositions] =
    useState<Record<string, { x: number; y: number }>>(nodePositions);

  useEffect(() => {
    setPositions(nodePositions);
  }, [nodePositions]);

  // Node Drag Mechanics
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNodeId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPositions((prev) => ({
      ...prev,
      [draggedNodeId]: { x, y },
    }));
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  // Node Data Filters (Type Filtering + Risk Severity Cutoff)
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesType = filterType === "all" || node.type === filterType;
      const matchesRisk = node.riskScore >= riskThreshold;
      return matchesType && matchesRisk;
    });
  }, [nodes, filterType, riskThreshold]);

  const activeNodeIds = useMemo(
    () => new Set(filteredNodes.map((n) => n.id)),
    [filteredNodes],
  );

  const filteredEdges = useMemo(() => {
    return edges.filter(
      (edge) =>
        activeNodeIds.has(edge.source) && activeNodeIds.has(edge.target),
    );
  }, [edges, activeNodeIds]);

  const selectedNodeData = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId],
  );

  return (
    <div className="w-full min-height-[650px] bg-slate-950 rounded-xl border border-slate-800 text-slate-100 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* --- Left Work Area: Simulation Graph Canvas --- */}
      <div className="flex-1 p-6 flex flex-col relative min-w-[300px]">
        {/* Real-time Control Header HUD */}
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-between z-10 bg-slate-950/80 backdrop-blur-sm p-3 rounded-lg border border-slate-900">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Layer View:
            </span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 text-sm text-slate-200 border border-slate-800 rounded px-2 py-1 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Sectors Connected</option>
              <option value="politician">Politicians Only</option>
              <option value="corporation">Private Firms</option>
              <option value="agency">State Institutions</option>
            </select>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
              Risk Floor: {riskThreshold}%
            </span>
            <input
              type="range"
              min="0"
              max="90"
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(Number(e.target.value))}
              className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Dynamic SVG Node-Link Network Wrapper */}
        <div className="flex-1 bg-slate-900/40 rounded-lg border border-slate-900 relative min-h-[400px]">
          <svg
            className="w-full h-full min-h-[450px] select-none cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Context Definition Patterns for Directed Arrows */}
            <defs>
              <marker
                id="arrow-standard"
                viewBox="0 0 10 10"
                refX="28"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
              </marker>
              <marker
                id="arrow-risk"
                viewBox="0 0 10 10"
                refX="28"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
              </marker>
            </defs>

            {/* Edge Link Layers */}
            {filteredEdges.map((edge) => {
              const start = positions[edge.source];
              const end = positions[edge.target];
              if (!start || !end) return null;

              const isHighlighted = edge.riskHighlight;

              return (
                <g key={edge.id} className="transition-all duration-150">
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={isHighlighted ? "#ef4444" : "#475569"}
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                    strokeDasharray={
                      edge.relationship === "campaign_donation"
                        ? "4 4"
                        : undefined
                    }
                    markerEnd={
                      isHighlighted
                        ? "url(#arrow-risk)"
                        : "url(#arrow-standard)"
                    }
                    opacity={0.75}
                  />
                  {/* Mid-point Connection Relationship Label tags */}
                  <text
                    x={(start.x + end.x) / 2}
                    y={(start.y + end.y) / 2 - 6}
                    textAnchor="middle"
                    className="text-[9px] font-mono tracking-tight fill-slate-400 bg-slate-950 pointer-events-none"
                  >
                    {edge.relationship.replace("_", " ")}
                  </text>
                </g>
              );
            })}

            {/* Interactive Node Vector Layer */}
            {filteredNodes.map((node) => {
              const pos = positions[node.id] || { x: 100, y: 100 };
              const isSelected = selectedNodeId === node.id;

              // Structural design variants based on Entity Classification Type
              let nodeColor = "fill-slate-800 stroke-slate-600";
              if (node.type === "politician")
                nodeColor = "fill-amber-950 stroke-amber-500 text-amber-400";
              if (node.type === "agency")
                nodeColor = "fill-blue-950 stroke-blue-500 text-blue-400";
              if (node.type === "corporation")
                nodeColor = "fill-rose-950 stroke-rose-500 text-rose-400";

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-grab active:cursor-grabbing group"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDraggedNodeId(node.id);
                    setSelectedNodeId(node.id);
                  }}
                >
                  {/* Subtle outer focal ring indicator for current active node focus */}
                  {isSelected && (
                    <motion.circle
                      r={24}
                      className="fill-none stroke-slate-100 stroke-1 stroke-dasharray-[4,2]"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}

                  {/* Core Interactive Hit Target Ring */}
                  <circle
                    r={16}
                    className={`${nodeColor} stroke-2 transition-colors duration-200 shadow-xl drop-shadow-md`}
                  />

                  {/* Realtime Risk Factor Rating Badge Accent */}
                  <circle
                    cx={11}
                    cy={-11}
                    r={7}
                    className={`${node.riskScore > 75 ? "fill-red-600" : "fill-slate-700"} stroke-slate-950 stroke-1`}
                  />
                  <text
                    x={11}
                    y={-9}
                    textAnchor="middle"
                    className="text-[7px] font-bold fill-white pointer-events-none"
                  >
                    {node.riskScore}
                  </text>

                  {/* Accessible Floating Text Node Anchors */}
                  <text
                    y={32}
                    textAnchor="middle"
                    className={`text-xs font-medium tracking-wide pointer-events-none select-none ${
                      isSelected
                        ? "fill-white font-semibold"
                        : "fill-slate-300 group-hover:fill-white"
                    }`}
                  >
                    {node.label}
                  </text>
                  <text
                    y={44}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-500 uppercase font-mono tracking-wider pointer-events-none select-none"
                  >
                    {node.sector}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Clean User Instructions Footnote inside HUD Canvas */}
          <div className="absolute bottom-3 left-3 pointer-events-none bg-slate-950/90 text-[10px] text-slate-400 px-2 py-1 rounded border border-slate-800 font-mono">
            💡 Drag nodes to rearrange • Click to audit relationships
          </div>
        </div>
      </div>

      {/* --- Right Work Area: Forensic Data Inspection Sidebar --- */}
      <div className="w-full md:w-80 bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800 p-6 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {selectedNodeData ? (
            <motion.div
              key={selectedNodeData.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="flex-1 flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded border ${
                      selectedNodeData.type === "politician"
                        ? "bg-amber-950/40 text-amber-400 border-amber-900"
                        : selectedNodeData.type === "agency"
                          ? "bg-blue-950/40 text-blue-400 border-blue-900"
                          : "bg-rose-950/40 text-rose-400 border-rose-900"
                    }`}
                  >
                    {selectedNodeData.type}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 font-mono">
                      Risk Index:
                    </span>
                    <span
                      className={`text-sm font-bold ${selectedNodeData.riskScore > 75 ? "text-red-500" : "text-slate-300"}`}
                    >
                      {selectedNodeData.riskScore}/100
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-100 tracking-tight leading-tight mb-1">
                  {selectedNodeData.label}
                </h3>
                <p className="text-xs font-mono text-amber-500 mb-4">
                  {selectedNodeData.sector}
                </p>

                <hr className="border-slate-900 my-4" />

                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Cross-Reference Summary
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-900 mb-5">
                  {selectedNodeData.details.description}
                </p>

                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Flagged Integrity Metrics
                </h4>
                <div className="space-y-2">
                  {selectedNodeData.details.metrics.map((metric, i) => (
                    <div
                      key={i}
                      className="bg-slate-900/40 border border-slate-900 rounded p-2.5 flex items-center justify-between"
                    >
                      <span className="text-xs text-slate-400">
                        {metric.label}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-200">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-900">
                <button
                  onClick={() =>
                    alert(
                      `Opening deep forensic investigative trace file for: ${selectedNodeData.label}`,
                    )
                  }
                  className="w-full bg-slate-900 hover:bg-slate-800 text-xs font-medium py-2 rounded border border-slate-800 hover:border-slate-700 text-slate-200 transition-all text-center"
                >
                  Generate Complete Conflict Report →
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-4">
              <p className="text-xs text-slate-500 font-mono">
                Select an entity vector node inside the viewport workspace to
                analyze network integrity connections.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
