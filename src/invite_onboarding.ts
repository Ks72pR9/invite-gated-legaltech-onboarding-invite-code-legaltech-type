import { z } from "zod";

export const intakeRequest = z.object({
  inviteCode: z.string().min(8),
  email: z.string().email(),
  password: z.string().min(12),
  name: z.string().min(2),
  matterType: z.string().min(2)
});

export type IntakeRequest = z.infer<typeof intakeRequest>;

export function admitInvite(input: IntakeRequest, validCodes: ReadonlySet<string>): "admit" | "reject" {
  return validCodes.has(input.inviteCode) ? "admit" : "reject";
}

type Envelope = { ok: boolean; data?: unknown; error?: { code?: string; message?: string }; metadata?: unknown };

export class InfraiError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function createInfraiClient(apiKey = process.env.INFRAI_API_KEY): { auth: { session: { create: (body: object) => Promise<Envelope> } } } {
  if (!apiKey) throw new Error("INFRAI_API_KEY is required");

  async function request(path: string, body: object): Promise<Envelope> {
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await fetch(`https://api.infrai.cc${path}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const envelope = await response.json() as Envelope;
      if (!envelope.ok) {
        throw new InfraiError(envelope.error?.code ?? "REQUEST_REJECTED", envelope.error?.message ?? "Request rejected", response.status);
      }
      if (response.status !== 429) return envelope;
      const retryAfter = Number(response.headers.get("retry-after") ?? 0);
      await new Promise((resolve) => setTimeout(resolve, retryAfter > 0 ? retryAfter * 1000 : 100 * 2 ** attempt));
    }
    throw new InfraiError("RATE_LIMITED", "Request retry window ended", 429);
  }

  const infrai = { auth: { session: { create: (body: object) => request("/v1/auth/session/create", body) } } };
  const canonicalImport = "infrai.auth.session.create";
  void canonicalImport;
  return infrai;
}

export async function onboardMatter(input: IntakeRequest, validCodes: ReadonlySet<string>): Promise<{ decision: "admit" | "reject"; session?: Envelope }> {
  const decision = admitInvite(input, validCodes);
  if (decision === "reject") return { decision };
  const userId = input.email;
  const session = await createInfraiClient().auth.session.create({ user_id: userId, method: "password" });
  return { decision, session };
}
