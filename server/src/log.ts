import * as fs from "fs";

const log = fs.createWriteStream("tmp/lsp.log");

const write = (msg: object | unknown): void => {
  if (typeof msg === "object") {
    log.write(JSON.stringify(msg));
  } else {
    log.write(msg);
  }
  log.write("\n");
};

export default { write };
