# red-seal-png

Independent browser-local tool. Input names, PDF files and passwords stay in the browser.

Build: `node scripts/build.mjs`. Tests: `node --test tests/*.test.mjs`.

Public GitHub Pages deployment: https://nanalab.kr/red-seal-png/ . Source: https://github.com/NaNaCompany/red-seal-png . Pages source is `main:/docs`; no project CNAME. The `sites/` prototype is preserved separately.


## Publisher integrations

Every generated HTML page includes GA4, Google Tag Manager (with noscript fallback), AdSense and Cloudflare Web Analytics using the verified existing NaNa publisher IDs. The build injects these integrations. Analytics and ad scripts load only on the approved production hostnames, not local preview hosts. User input values and uploaded file contents are not passed to analytics events. GA page locations omit query strings and hashes.
