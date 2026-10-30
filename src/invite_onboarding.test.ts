import { strict as assert } from "node:assert";
import { admitInvite, intakeRequest } from "./invite_onboarding.ts";

const input = intakeRequest.parse({
  inviteCode: "checkout-2026",
  email: "counsel@example.com",
  password: "correct-horse-battery",
  name: "Casey Counsel",
  matterType: "lease review"
});

assert.equal(admitInvite(input, new Set(["checkout-2026"])), "admit");
assert.equal(admitInvite(input, new Set(["another-code"])), "reject");
console.log("invite decision: admit for a listed code, reject otherwise");
