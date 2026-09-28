# IONQ legacy wheel — local review

Opportunity `opportunity-006`, route `/premium/opportunities/ionq-006`.
Publication date: September 28, 2026. Active; Legacy / Pre-launch; Wheel Strategy; technical stage unassigned.

## Canonical position

100 shares, $45.00 broker share basis ($4,500 total). Shares originated through put assignment; the exact assignment date is unknown. `trade.enteredAt` records the June 22 start of the wheel, as explicitly explained in documentation; it is not presented as the share-assignment date.

Filled sell-to-open history: June 22 July 17 $45 put at $1.10 (assigned); July 30 August 28 $45 call at $1.45 (closing outcome unverified); September 8 October 9 $50 call at $2.00 (open/current). Each is one contract for 100 shares. Gross opening premiums total $455; no realized options profit, adjusted basis or combined performance is claimed.

Personal ownership zones, multi-year thesis, conditional $500 stock-only assignment gain, wheel mechanics and risks are included. No conventional stop, target, stage, new put or future option outcome is fabricated.

## Implementation

- `lib/premium-content.ts`: optional legacy origin, wheel strategy/fills, put-assignment entry type and update notification suppression. No database migration.
- `lib/premium-opportunities.ts`: one IONQ record and one explicitly non-notifying legacy archive update.
- `components/premium/wheel-position.tsx`: legacy disclosure, compact position summary and horizontally scrollable option-history table, with separate gross-credit disclosure.
- `components/premium/opportunity-card.tsx`: uses wheel summary instead of conventional entry/stop/target metadata.
- `app/premium/opportunities/[slug]/page.tsx`: adds wheel details and appropriate editorial headings without a standard trade framework.
- `components/premium/opportunities.css`: scoped disclosure, summary and history styles.
- `lib/email/events.ts`: excludes legacy publication events and explicitly suppressed historical updates; later management updates remain eligible for manual notification.
- `scripts/test-opportunities.cjs`, `scripts/test-weekly-outlook.cjs`: updated totals and wheel regression coverage.

The existing Dashboard selector includes IONQ once as active, without Dashboard code changes. All five previous opportunities and all pre-existing updates were compared to HEAD and are unchanged. Auth, Stripe and billing are untouched.

## Validation

Typecheck passed. All 62 offline tests passed. Production build passed. Local Chrome desktop/mobile checks passed: one IONQ dashboard card, three option rows, prominent legacy disclosure, $455 gross-only label, no page overflow at 390px, and no IONQ notification event. Existing NOW closure remains intact.

Nothing pushed or emailed. The referenced `image.png` was not attached, so the brokerage evidence image is not included; facts are transcribed from Justin's supplied written brief. Attach the original image to add supporting evidence without losing dates, strikes, fills or order types.
