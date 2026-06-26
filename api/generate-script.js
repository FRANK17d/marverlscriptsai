import { handleApiRequest } from "../server/ai-core.mjs";

export default function handler(req, res) {
  return handleApiRequest(req, res);
}
