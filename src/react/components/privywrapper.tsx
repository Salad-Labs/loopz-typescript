"use client";

import React, { FC } from "react";
import { PrivyWrapperProps } from "@src/interfaces/adapter/privywrapperprops";
import { usePrivyLinkAccount } from "../hooks/usePrivyLinkAccount";
import { usePrivyLogin } from "../hooks/usePrivyLogin";
import { usePrivyLogout } from "../hooks/usePrivyLogout";
import { usePrivyUnlinkAccount } from "../hooks/usePrivyUnlinkAccount";
import { usePrivyWallets } from "../hooks/usePrivyWallets";

export const PrivyWrapper: FC<PrivyWrapperProps> = ({
  auth,
  order,
  children,
}) => {
  //used in desktop environment (React, Angular, Vanilla js, Vue)
  //if device is equal to "mobile" for example, inside the hooks there is a check to avoid that these functions will be executed.
  usePrivyLogout(auth);
  usePrivyLogin(auth);
  usePrivyLinkAccount(auth);
  usePrivyUnlinkAccount(auth);
  usePrivyWallets(order);

  return children;
};
