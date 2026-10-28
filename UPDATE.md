# 도장 만들기 — Update log

## 2026-10-28

- Page title and main heading changed to `도장 만들기`.
- Removed NaNa Lab / SMALL TOOLS from the header and removed decorative introductory copy.
- Preserved the free-font licenses, seal controls and transparent PNG export.
- Browser verification: the new title and header render correctly. Rendering/export logic is unchanged from the previously verified build.
- Deployment target: https://red-seal-png.bahn1307.chatgpt.site (owner-private).


## 2026-10-28 — GitHub Pages public release

- Public repository: https://github.com/NaNaCompany/red-seal-png . Public app: https://nanalab.kr/red-seal-png/ .
- Changed hosting target to GitHub Pages `main:/docs`, retained licenses and attribution, added `.nojekyll`, public canonical/robots/sitemap URLs and removed private-preview noindex directives. The private Sites prototype is preserved separately.
- Added verified GA4 `G-2ZYSF0173P`, GTM `GTM-NV2WWQXB`, AdSense `ca-pub-9767176956440077` and Cloudflare Web Analytics `9f3423bb0d034d91bbe1a12afeff2429` to every HTML page. Local/test hosts do not initialize analytics or advertising scripts. No input contents are sent in custom analytics events.

- Public output validation passed: 2 HTML pages; all four integrations, canonical URLs and indexable metadata checked.

- Public browser QA exposed AdSense vignette interception of generated downloads. Download anchors now use `data-google-vignette="false"` and `data-google-interstitial="false"`, and are attached to the document for the click. Publisher tags remain enabled. Official AdSense documentation: https://support.google.com/adsense/answer/17016693?hl=en .
