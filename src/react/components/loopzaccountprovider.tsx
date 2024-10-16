"use client";

import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { LoopzAccountContext } from "../context/loopzaccountcontext";
import { useLoopz } from "../hooks";
import { LoopzAccountHookValue } from "@src/index";

export const LoopzAccountProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { instance, initialized } = useLoopz();

  const [authStatus, setAuthStatus] = useState<LoopzAccountHookValue>({
    isLoading: true,
    isAuthenticated: false,
    isLoggingOut: false,
    account: null,
  });

  const handleAuthChange = useCallback(() => {
    if (!initialized) return;

    setAuthStatus({
      isLoading: false,
      isAuthenticated: instance.auth.isAuthenticated(),
      isLoggingOut: instance.auth.isLoggingOut(),
      account: instance.auth.getCurrentAccount(),
    } as LoopzAccountHookValue);
  }, [initialized, instance]);

  useEffect(() => {
    if (!initialized) return;

    instance.auth.on("auth", handleAuthChange);
    instance.auth.on("__onLogoutComplete", handleAuthChange);
    instance.auth.on("__logout", handleAuthChange);

    return () => {
      instance.auth.off("auth", handleAuthChange);
      instance.auth.off("__onLogoutComplete", handleAuthChange);
      instance.auth.off("__logout", handleAuthChange);
    };
  }, [initialized, instance]);

  return (
    <LoopzAccountContext.Provider value={authStatus}>
      {children}
    </LoopzAccountContext.Provider>
  );
};
