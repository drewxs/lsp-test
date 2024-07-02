import log from "./log";
import { initialize } from "./methods/initialize";
import { completion } from "./methods/textDocument/completion";
import { didChange } from "./methods/textDocument/didChange";

export interface Message {
  jsonrpc: string;
}

export interface NotificationMessage extends Message {
  method: string;
  params?: unknown[] | object;
}

export interface RequestMessage extends NotificationMessage {
  id: number | string;
}

type RequestMethod = (
  msg: RequestMessage,
) => ReturnType<typeof initialize> | ReturnType<typeof completion>;

type NotificationMethod = (msg: NotificationMessage) => void;

const methods: Record<string, RequestMethod | NotificationMethod> = {
  initialize,
  "textDocument/completion": completion,
  "textDocument/didChange": didChange,
};

const respond = (id: RequestMessage["id"], result: object | null): void => {
  const msg = JSON.stringify({ id, result });
  const msgLen = Buffer.byteLength(msg, "utf-8");
  const header = `Content-Length: ${msgLen}\r\n\r\n`;

  log.write(header + msg);
  process.stdout.write(header + msg);
};

let buffer = "";
process.stdin.on("data", (chunk) => {
  buffer += chunk;

  while (true) {
    const lenMatch = buffer.match(/Content-Length: (\d+)\r\n/);
    if (!lenMatch) break;

    const contentLen = parseInt(lenMatch[1], 10);
    const msgStart = buffer.indexOf("\r\n\r\n") + 4;

    if (buffer.length < msgStart + contentLen) break;

    const rawMsg = buffer.substring(msgStart, msgStart + contentLen);
    const msg = JSON.parse(rawMsg);

    log.write({ id: msg.id, method: msg.method, params: msg.params });

    const method = methods[msg.method];

    if (method) {
      const result = method(msg);

      if (result !== undefined) {
        respond(msg.id, result);
      }
    }

    buffer = buffer.slice(msgStart + contentLen);
  }
});

process.stdout.write("");
