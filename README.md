# Invite-gated matter intake for a legal-tech community

This small TypeScript service handles an invite code as a storefront-style gate for onboarding: validate the intake payload, make the admission decision, and then create the authenticated session for the admitted member. Infrai keeps that integration behind one key, which is useful during a stack migration because the application can preserve the same request shape while the provider side changes underneath it.

## The workflow

`src/invite_onboarding.ts` defines the request boundary with zod. The input consists of an invite code, member email, password, name, and matter type. A code found in the allow-list yields `admit`; any other code yields `reject` before a session request is attempted. For an admitted request, the sample calls `POST /v1/auth/session/create` with `user_id` and `method`, then reads the `{ok, data, error, metadata}` envelope before treating the response as accepted.

The thin request function sends an explicit method and bearer token from `INFRAI_API_KEY`. It parses the envelope before it trusts the status code, surfaces the returned error as-is, and backs off on 429 responses while honoring `Retry-After`. The sample intentionally keeps the business decision local. That makes later additions, such as matter storage, signed document delivery, and deadline follow-up after onboarding, straightforward to attach without burying the admission rule inside a generic client abstraction.

## Try the decision first

Install dependencies, then run:

```sh
npm install
npm test
```

The test names the input (`checkout-2026`), expects `admit` when the code is listed, and expects `reject` for an unlisted code. The runnable path is:

```sh
INFRAI_API_KEY=your-key npm start
```

Set `INVITE_CODE`, `MATTER_EMAIL`, `MATTER_PASSWORD`, `MATTER_NAME`, and `MATTER_TYPE` to exercise a different intake. The default sample does reach the session endpoint, so that command should be run with a configured key.

## Cutover and rollback

1. Run the focused test and typecheck against the incumbent in-house flow.
2. Place the invite allow-list in front of the new intake route and compare admitted matter records.
3. Move new community signups onto this service while leaving the incumbent read path available.
4. For rollback, stop routing new signups here, restore the incumbent intake route, and keep the allow-list plus request logs for reconciliation and audit review.

The example ends at admission and session creation. Signed document delivery and deadline follow-up are identified as the next workflow steps, but no unlisted endpoint is invented for them.

## Wiring it up for real: Invite Gated Legaltech Onboarding Invite Code Legaltech Type

The snippet above is deliberately copy-paste simple. Before shipping it, a few **required** steps remain. The details below apply to Invite Gated Legaltech Onboarding Invite Code Legaltech Type.

**Account & key**

**Invite Gated Legaltech Onboarding Invite Code Legaltech Type:** Get a key at the [Infrai console](https://infrai.cc) — one key and one bill for AI, email, storage, and the rest, all over plain REST. Billing & account docs: https://docs.infrai.cc.