interface TopBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  activeTab: "monitor" | "grid";
  setActiveTab: (tab: "monitor" | "grid") => void;
}

export default function DashboardTopBar({
  searchQuery,
  onSearchChange,
  activeTab,
  setActiveTab,
}: TopBarProps) {
  return (
    <div className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input Node */}
      <div className="w-96 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Facts Tupu..."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition"
        />
        <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">
          🔍
        </span>
      </div>

      {/* View Segment Switchers */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("monitor")}
          className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${
            activeTab === "monitor"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Monitor
        </button>
        <button
          onClick={() => setActiveTab("grid")}
          className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${
            activeTab === "grid"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Summary Grid
        </button>
      </div>
    </div>
  );
}
