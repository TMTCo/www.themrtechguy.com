# TMTCo Main Site — Cloudflare Worker

Same stack as tmtco-ssrp: **Cloudflare Workers + Hono + KV sessions**.

## Deploy Steps

### 1. Push to GitHub
Push this repo to a **private** GitHub repo under TMTCo.

### 2. Create the Worker in Cloudflare
Dashboard → **Workers & Pages** → **Create** → **Workers** →
**Connect to GitHub** → select this repo → Framework preset: **None** → Deploy.

### 3. Create KV Namespace
Dashboard → **Storage & Databases** → **KV** → **Create namespace**
Name it: `TMTCO_SITE_SESSIONS`

### 4. Set Variables in the Worker
Worker → **Settings** → **Variables & Secrets**:

| Type | Name | Value |
|------|------|-------|
| Variable | `TENANT_ID` | `f1011f75-0d96-4d08-b8d4-6c79c851f9ba` |
| Variable | `CLIENT_ID` | `db8b6556-cec8-4b83-94b1-364cefd24203` |
| Variable | `BASE_URL` | `https://themrtechguy.com` |
| **Secret** | `CLIENT_SECRET` | *(your Entra app client secret — see below)* |

### 5. Bind the KV Namespace
Worker → **Settings** → **Bindings** → **KV Namespace** →
Binding name: `SESSIONS`, Namespace: `TMTCO_SITE_SESSIONS`

Then update `wrangler.jsonc` with the KV namespace ID from the dashboard.

### 6. Add Custom Domain
Worker → **Settings** → **Triggers** → **Custom Domains** →
Add: `themrtechguy.com`

### 7. Create a Client Secret in Entra
Entra ID → App registrations → Themrtechguy.com →
**Certificates & secrets** → **New client secret** →
Copy the **Value** (not the ID) → paste into Cloudflare as the `CLIENT_SECRET` secret.

### 8. Update the Redirect URI in Entra
Entra ID → App registrations → Themrtechguy.com → **Authentication** →
Change the redirect URI to:
`https://themrtechguy.com/auth/callback`
Platform type: **Web** (server-side flow, not SPA)

---

## Local Dev
Create a `.dev.vars` file (never commit this):
```
TENANT_ID=f1011f75-0d96-4d08-b8d4-6c79c851f9ba
CLIENT_ID=db8b6556-cec8-4b83-94b1-364cefd24203
CLIENT_SECRET=your_secret_here
BASE_URL=http://localhost:8787
```
Then run: `npm install && npm run dev`
