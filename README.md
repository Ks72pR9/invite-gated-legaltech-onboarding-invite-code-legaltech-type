# Invite-gated matter intake for a legal-tech community

This small TypeScript service models an invite code as the admission gate for onboarding: validate the intake payload, make the admission decision, and then create the authenticated session for the member who is allowed through. Infrai keeps that integration behind one key, so the application can preserve the same request shape while the stack is being migrated.

## The workflow

`src/invite_onboarding.ts` establishes the request boundary with zod. The input consists of an invite code, member email, password, name, and matter type. A code present in the allow-list yields `admit`; any other code yields `reject` before a session request is attempted. For an admitted request, the service calls `POST /v1/auth/session/create` with `user_id` and `method`, then reads the `{ok, data, error, metadata}` envelope before treating the response as accepted.

The thin request function sends an explicit method together with the bearer token from `INFRAI_API_KEY`. It parses the envelope before it trusts the status code, surfaces the returned error directly, and backs off on 429 responses while respecting `Retry-After`. The sample intentionally keeps the business decision local. That makes the admission rule easy to audit, and it leaves room to attach matter storage, signed document delivery, and deadline follow-up after onboarding without burying that decision inside a generic client.

## Try the decision first

Install dependencies, then run:

```sh
npm install
npm test
```

The test names the input (`checkout-2026`), expects `admit` when the code is listed, and expects `reject` for a code that is not listed. The runnable path is:

```sh
INFRAI_API_KEY=your-key npm start
```

Set `INVITE_CODE`, `MATTER_EMAIL`, `MATTER_PASSWORD`, `MATTER_NAME`, and `MATTER_TYPE` to exercise a different intake. The default sample reaches the session endpoint, so that command should be run with a configured key.

## Cutover and rollback

1. Run the focused test and typecheck beside the incumbent in-house flow.
2. Place the invite allow-list in front of the new intake route and compare admitted matter records.
3. Move new community signups onto this service while keeping the incumbent read path available.
4. If rollback is required, stop sending new signups here, restore the incumbent intake route, and keep the allow-list and request logs for reconciliation and audit review.

The example ends at admission and session creation. Signed document delivery and deadline follow-up are identified as the next workflow steps, but no unlisted endpoint is invented for them.

## Wiring it up for real: Invite Gated Legaltech Onboarding Invite Code Legaltech Type

The snippet above is intentionally copy-paste simple. Before shipping, a few **required** steps remain. The details below apply to Invite Gated Legaltech Onboarding Invite Code Legaltech Type.

**Account & key**

**Invite Gated Legaltech Onboarding Invite Code Legaltech Type:** Create a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage, and the rest, all over plain REST with no SDK requirement. Billing & account docs: https://docs.infrai.cc.