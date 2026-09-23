/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type AccountTier = "anonymous" | "weekly_uploader" | "journalist";

type QuotaContextType = {
  lookupCount: number;
  maxQuota: number;
  isGateOpen: boolean;
  accountTier: AccountTier;
  setIsGateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAccountTier: (tier: AccountTier) => void;
  registerLookup: (representativeId: string) => boolean;
  resetQuotaAfterPayment: () => void;
};

const QuotaContext = createContext<QuotaContextType>({
  lookupCount: 0,
  maxQuota: 5,
  isGateOpen: false,
  accountTier: "anonymous",
  setIsGateOpen: () => {},
  setAccountTier: () => {},
  registerLookup: () => true,
  resetQuotaAfterPayment: () => {},
});

export const QuotaProvider = ({ children }: { children: React.ReactNode }) => {
  const [lookupCount, setLookupCount] = useState(0);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [accountTier, setAccountTierState] = useState<AccountTier>("anonymous");
  const QUOTA_LIMIT = 5;

  // Synchronize authentication tier state layer from browser memory
  useEffect(() => {
    const savedCount = localStorage.getItem("neuro_talent_quota");
    const savedTier = localStorage.getItem("facts_tupu_tier") as AccountTier;

    if (savedCount) {
      setLookupCount(parseInt(savedCount, 10));
    }
    if (savedTier) {
      setAccountTierState(savedTier);
    }
  }, []);

  const setAccountTier = (tier: AccountTier) => {
    setAccountTierState(tier);
    localStorage.setItem("facts_tupu_tier", tier);
  };

  const registerLookup = (representativeId: string) => {
    // PRE-FLIGHT CHECK: Premium active accounts bypass quota checks completely
    if (accountTier !== "anonymous") {
      return true;
    }

    const historyRaw = localStorage.getItem("neuro_talent_history") || "[]";
    const history = JSON.parse(historyRaw);

    if (history.includes(representativeId)) {
      return true;
    }

    const nextCount = lookupCount + 1;

    if (nextCount > QUOTA_LIMIT) {
      setIsGateOpen(true);
      return false;
    }

    setLookupCount(nextCount);
    localStorage.setItem("neuro_talent_quota", nextCount.toString());

    history.push(representativeId);
    localStorage.setItem("neuro_talent_history", JSON.stringify(history));
    return true;
  };

  const resetQuotaAfterPayment = () => {
    setLookupCount(0);
    setIsGateOpen(false);
    setAccountTier("anonymous");
    localStorage.removeItem("neuro_talent_quota");
    localStorage.removeItem("neuro_talent_history");
    localStorage.removeItem("facts_tupu_tier");
  };

  return (
    <QuotaContext.Provider
      value={{
        lookupCount,
        maxQuota: QUOTA_LIMIT,
        isGateOpen,
        accountTier,
        setIsGateOpen,
        setAccountTier,
        registerLookup,
        resetQuotaAfterPayment,
      }}
    >
      {children}
    </QuotaContext.Provider>
  );
};

export const useQuota = () => {
  const context = useContext(QuotaContext);
  if (!context) {
    throw new Error("useQuota must be wrapped inside a QuotaProvider");
  }
  return context;
};
