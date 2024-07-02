import { TextDocumentIdentifier, documents } from "../../documents";
import log from "../../log";
import { RequestMessage } from "../../server";
import * as fs from "fs";

const words = fs.readFileSync("data/words").toString().split("\n");

export type CompletionItem = {
  label: string;
};

export interface CompletionList {
  isIncomplete: boolean;
  items: CompletionItem[];
}

interface Position {
  line: number;
  character: number;
}

interface TextDocumentPositionParams {
  textDocument: TextDocumentIdentifier;
  position: Position;
}

export interface CompletionParams extends TextDocumentPositionParams {}

export const completion = (msg: RequestMessage): CompletionList | null => {
  const params = msg.params as CompletionParams;
  const content = documents.get(params.textDocument.uri);

  if (!content) return null;

  const curLine = content?.split("\n")[params.position.line];
  const lineUntilCursor = curLine.slice(0, params.position.character);
  const curPrefix = lineUntilCursor.replace(/.*\W(.*?)/, "$1");

  const items = words
    .filter((word) => word.startsWith(curPrefix))
    .slice(0, 100)
    .map((word) => ({ label: word }));

  log.write({
    completions: {
      curLine,
      lineUntilCursor,
      curPrefix,
    },
  });

  return {
    isIncomplete: true,
    items,
  };
};
