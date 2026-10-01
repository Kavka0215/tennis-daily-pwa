# Tennis Daily

Training log for a one-year tennis programme. Single-file app, zero dependencies.

- `index.html` — **the whole app**. This is the only file to edit.
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA shell (installable, offline).
- `vercel.json` — `sw.js` served no-cache so deploys aren't pinned to an old build.

Data lives in the browser: sessions in `localStorage`, photos in IndexedDB.
Nothing is synced — use **Data → Export backup** to get a JSON file out, and
**Import** to restore it (photos are included as base64).

## Local preview

```
node ../.claude/serve.mjs    # http://localhost:4178
```

## Deploy

Push to `main` → Vercel builds and promotes automatically. Other branches get
their own preview URL. Rollback: Vercel dashboard → Deployments → Promote.
