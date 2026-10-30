import { intakeRequest, onboardMatter } from "./invite_onboarding.ts";

const input = intakeRequest.parse({
  inviteCode: process.env.INVITE_CODE ?? "checkout-2026",
  email: process.env.MATTER_EMAIL ?? "counsel@example.com",
  password: process.env.MATTER_PASSWORD ?? "correct-horse-battery",
  name: process.env.MATTER_NAME ?? "Casey Counsel",
  matterType: process.env.MATTER_TYPE ?? "lease review"
});

const result = await onboardMatter(input, new Set(["checkout-2026"]));
console.log(JSON.stringify({ decision: result.decision, matterType: input.matterType, next: "signed document delivery and deadline follow-up" }, null, 2));
