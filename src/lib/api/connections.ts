import { api } from "./base";
import type { BackendConnectionRequest } from "../../types/api";

export interface SendConnectionRequestPayload {
  receiverId: string;
  receiverType: "Alumni" | "Student";
}

export const connectionsAPI = {
  sendRequest: async (
    data: SendConnectionRequestPayload
  ): Promise<{
    message: string;
    connectionRequest: BackendConnectionRequest;
  }> => {
    return api.post<{
      message: string;
      connectionRequest: BackendConnectionRequest;
    }>("/connections/request", data);
  },
};

