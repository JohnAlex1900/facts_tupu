export interface RiskCategory {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
}

export function getRiskCategory(score: number): RiskCategory {
  if (score <= 15.0) {
    return {
      label: "Low Risk",
      badgeBg: "bg-emerald-500/10",
      badgeText: "text-emerald-400",
      badgeBorder: "border-emerald-500/20",
      dotColor: "bg-emerald-500",
    };
  }

  if (score <= 45.0) {
    return {
      label: "Moderate Risk",
      badgeBg: "bg-amber-500/10",
      badgeText: "text-amber-400",
      badgeBorder: "border-amber-500/20",
      dotColor: "bg-amber-500",
    };
  }

  return {
    label: "High Risk",
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-400",
    badgeBorder: "border-rose-500/20",
    dotColor: "bg-rose-500",
  };
}
