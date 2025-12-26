import type { VercelRequest, VercelResponse } from "@vercel/node";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

const parseBody = (req: VercelRequest) => {
  if (!req.body) return null;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return null;
    }
  }
  return req.body as Record<string, unknown>;
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: "ADMIN_PASSWORD not configured" });
  }

  const body = parseBody(req);
  if (!body || typeof body.password !== "string") {
    return res.status(400).json({ error: "Password is required" });
  }

  if (body.password === ADMIN_PASSWORD) {
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: "Unauthorized" });
}
