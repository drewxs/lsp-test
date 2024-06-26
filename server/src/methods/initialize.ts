import { RequestMessage } from "../server";

type ServerCapabilities = Record<string, unknown>;

interface InitializeResult {
  capabilities: ServerCapabilities;
  severInfo?: {
    name: string;
    version?: string;
  };
}

export const initialize = (msg: RequestMessage): InitializeResult => {
  return {
    capabilities: { completionProvider: {} },
    severInfo: {
      name: "lsp-test",
      version: "0.0.1",
    },
  };
};
