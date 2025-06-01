import morgan from "morgan";
import { createWriteStream } from "fs";
// log the details in a file
const logger = morgan("combined", {
  stream: {
    write: (message) => {
      const logStream = createWriteStream("logs/submissionservice.log", {
        flags: "a",
      });
      logStream.write(`${message.trim()}\n`);
      logStream.end();
    },
  },
});

export default logger;
