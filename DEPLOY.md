# Deploy TradeOS to Render

Domain: `tradeos.gt.tc`
- **Frontend** → `tradeos.gt.tc`
- **Backend API** → `api.tradeos.gt.tc`

---

## Step 1: Connect Repo

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. **New +** → **Blueprint** → select `CodeBuilderRaj-07/TradeOS-og` → **Connect**

Render reads `render.yaml` and shows two services:
- `tradeos-backend` (Docker) — Spring Boot API
- `tradeos-frontend` (Static Site) — Vite React app

---

## Step 2: Fill In Secrets

Backend env vars (expand **Environment** section):

| Key | Value (fill from your `.env` or dashboard) |
|-----|--------------------------------------------|
| `DB_URL` | `jdbc:postgresql://tradeos-rajkumarpattnail-973d.h.aivencloud.com:25270/defaultdb?sslmode=require` |
| `DB_USERNAME` | `avnadmin` |
| `DB_PASSWORD` | *(your Aiven DB password)* |
| `OPENROUTER_API_KEY` | *(your OpenRouter key)* |
| `TWELVEDATA_API_KEY` | *(your Twelve Data key)* |
| `NEWS_API_KEY` | *(your News API key)* |
| `GOLD_API_KEY` | *(your Gold API key)* |

`JWT_SECRET` auto-generates — leave it.

---

## Step 3: Deploy Blueprint

1. Click **Apply Blueprint**
2. Wait ~5–10 min:
   - Backend: Docker build + deploy (cold start ~2-3 min)
   - Frontend: `npm ci && npm run build` + deploy (~1 min)

Watch logs in Render dashboard.

---

## Step 4: Add Custom Domain — Backend

1. Go to `tradeos-backend` service page
2. **Settings** → **Custom Domain**
3. Add `api.tradeos.gt.tc`
4. Copy the provided DNS target (e.g. `xxxx.onrender.com`)
5. At your DNS provider, add a **CNAME** record:
   - **Name:** `api`
   - **Target:** `xxxx.onrender.com`
6. Wait for DNS to propagate (minutes to hours)

---

## Step 5: Add Custom Domain — Frontend

1. Go to `tradeos-frontend` service page
2. **Settings** → **Custom Domain**
3. Add `tradeos.gt.tc`
4. Copy the DNS target
5. At your DNS provider, add:
   - **CNAME** record:
     - **Name:** `@` (or `tradeos`)
     - **Target:** the Render frontend target

---

## Step 6: Verify

- Visit `https://tradeos.gt.tc`
- Log in / register
- Open DevTools → Network tab — API calls should hit `api.tradeos.gt.tc`
- Dashboard loads with data

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|------|
| Backend deploy fails | Out of memory on free plan | Check build logs |
| "Too many redirects" | SSL misconfig | Render auto-provisions SSL — may take a few minutes |
| DNS not resolving | Propagation delay | Wait up to 48h, or use `dig` / `nslookup` to check |
| API calls returning 401 | JWT_SECRET mismatch | Not a problem — Render auto-generated it |
| Blank page on frontend | VITE_API_URL wrong | Check frontend env vars in Render dashboard |
| DB connection fails | Credentials wrong | Double-check DB_URL, DB_USERNAME, DB_PASSWORD |
| "No data" on dashboard | No trades | Log a trade in the journal |
