# struq.design

The landing page for the Struq skill, built from one `/struq` prompt with the skill in `../skills/struq/`. The plan it was built to is `STRUQ.md`; where the skill tripped is `FRICTION.md`.

```bash
npm install
npm run build && npx next start -p 3207
```

Verify scripts (run against the production server): `scripts/shots.mjs` (screenshots into `shots/`), `scripts/trace.mjs` (first 3 seconds), `scripts/vitals.mjs` (LCP and CLS, throttled), `scripts/firstload.mjs` (first-load JS), `scripts/probe.mjs` (footer height, horizontal overflow). `scripts/wordmark.mjs` outlines the wordmark into `brand/logo.svg`.

This folder is not part of the installed skill: the skills CLI installs from `skills/struq/` only.
