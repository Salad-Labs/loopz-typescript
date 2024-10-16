"use client";

import { ILoopzContext } from "@src/interfaces/react/iloopzcontext";
import { Maybe } from "@src/types";
import { createContext } from "react";

export const LoopzContext = createContext<Maybe<ILoopzContext>>(null);
