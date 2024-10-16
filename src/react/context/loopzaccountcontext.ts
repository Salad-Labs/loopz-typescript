"use client";

import { LoopzAccountHookValue, Maybe } from "../../types";
import { createContext } from "react";

export const LoopzAccountContext =
  createContext<Maybe<LoopzAccountHookValue>>(null);
