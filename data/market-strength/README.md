# Private market-strength prototype

24 user-selected ETFs plus SPY. No API key or paid service. Yahoo chart history is fetched via system curl with TLS verification; adjusted closes are required. Python 3.9+ and curl must be installed on the local machine.

Run `npm run data:refresh` for a manual refresh. The local Next server also checks on the first dashboard visit per New York calendar day and starts a background refresh when needed. It retries failed refreshes no more than once per hour. This is access-triggered, not an installed operating-system schedule. Keep the preview server running for automatic checks. The client checks for completion while the page is open.

All 25 instruments must supply adequate history. Returns share the latest common trading date strictly before today in New York. Calendar months use the last common session on or before the lookback date; one week is seven calendar days. Snapshots are replaced atomically only after every instrument and period passes validation. Failures retain the last complete file. Rank changes compare the current rolling window with the equivalent window one week before.

`latest.json` is a changing research snapshot, separate from Issue 001. This is a local Node/Python implementation, not a serverless deployment workflow. Before any paid/public deployment, establish Yahoo/provider display rights and replace the refresh mechanism as required by the hosting environment. No publication or GitHub action has been configured.

Validation: `python3 scripts/test-market-strength.py`.
