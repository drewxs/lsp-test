import {
  TextDocumentContentChangeEvent,
  VersionedTextDocumentIdentifier,
  documents,
} from "../../documents";
import log from "../../log";
import { NotificationMessage } from "../../server";

interface DidChangeTextDocumentParams {
  textDocument: VersionedTextDocumentIdentifier;
  contentChanges: TextDocumentContentChangeEvent[];
}

export const didChange = (msg: NotificationMessage): void => {
  const params = msg.params as DidChangeTextDocumentParams;

  documents.set(params.textDocument.uri, params.contentChanges[0].text);
};
