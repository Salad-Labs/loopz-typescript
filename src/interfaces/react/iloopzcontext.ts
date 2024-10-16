import { Auth } from "@src/auth";
import { Chat } from "@src/chat";
import { Oracle } from "@src/oracle";
import { Proposal } from "@src/proposal";
import { Order } from "@src/order";

export type ILoopzContext =
  | {
      initialized: false;
      instance: {
        auth: null;
        order: null;
        proposal: null;
        oracle: null;
        chat: null;
      };
    }
  | {
      initialized: true;
      instance: {
        auth: Auth;
        order: Order;
        proposal: Proposal;
        oracle: Oracle;
        chat: Chat;
      };
    };
