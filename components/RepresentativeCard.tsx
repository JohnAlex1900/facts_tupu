interface RepCardProps {
  rep: {
    id: number;
    name: string;
    role_type: string;
    party: string;
    integrityVector: number;
    publicEngagement: number;
    accountability: number;
    riskRadarIndex: number;
    tier: string;
    county: string;
    constituency: string | null;
    status: string;
    locationLabel: string;
    bioDetails: string | null;
    accountabilityScore: number;
  };
}

export function RepresentativeCard({ rep }: RepCardProps) {
  return (
    <div className="p-5 border border-slate-200 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between min-h-[220px]">
      <div>
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
              {rep.party} • {rep.status}
            </span>
            <h3 className="text-base font-black text-slate-900 tracking-tight mt-2">
              {rep.name}
            </h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              {rep.locationLabel}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-slate-900 block">
              {rep.accountabilityScore}%
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
              Accountability
            </span>
          </div>
        </div>

        {/* Controlled Content Clamp Layer */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="text-xs font-medium text-slate-500 line-clamp-3 leading-relaxed">
            {rep.bioDetails ||
              "No further anomalous proxy networks recorded for this entity."}
          </div>
        </div>
      </div>

      {/* Metric Vector Tracks */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-2 text-center text-[11px] font-bold text-slate-700 border-t border-slate-50">
        <div>
          <span className="block text-slate-400 text-[9px] uppercase tracking-wider">
            Integrity
          </span>
          <span className="text-emerald-600">{rep.integrityVector}%</span>
        </div>
        <div>
          <span className="block text-slate-400 text-[9px] uppercase tracking-wider">
            Engagement
          </span>
          <span className="text-indigo-600">{rep.publicEngagement}%</span>
        </div>
        <div>
          <span className="block text-slate-400 text-[9px] uppercase tracking-wider">
            Risk Index
          </span>
          <span className="text-red-600">{rep.riskRadarIndex}/100</span>
        </div>
      </div>
    </div>
  );
}
