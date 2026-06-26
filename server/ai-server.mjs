import { createServer } from "node:http";
import { handleApiRequest, PORT } from "./ai-core.mjs";

const server = createServer(handleApiRequest);

server.listen(PORT, "127.0.0.1", () => {
  console.log(`AI server listening on http://127.0.0.1:${PORT}`);
});
