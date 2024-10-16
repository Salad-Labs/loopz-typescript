import { LoopzConfig } from "@src/types/app/loopzconfig";
import { ReactNode } from "react";

export interface LoopzProviderProps {
  config: LoopzConfig;
  /**
   * @default false
   */
  devMode?: boolean;
  /**
   * @default true
   */
  enableStorage?: boolean;
  children: ReactNode;
}
