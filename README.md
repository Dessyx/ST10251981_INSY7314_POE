# ST10251981_INSY7314_Part2

## Local Secure Development (HTTPS without Browser Warnings)

This project uses **mkcert** to generate _trusted_ localhost TLS certificates so that
Chrome, Edge, Firefox, and Safari show the secure padlock (no self‑signed warning)
when you access the React client (`https://localhost:3000`) and API (`https://localhost:4000`).

> We do **not** commit certificates or private keys. Each developer generates them locally.

### 1. Install mkcert

Pick the method for your OS (run once per machine):

| OS | Command / Steps |
|----|-----------------|
| Windows (Chocolatey) | `choco install mkcert nss-tools` |
| macOS (Homebrew) | `brew install mkcert nss` |
| Linux (Debian/Ubuntu) | `sudo apt install libnss3-tools` then download release binary from mkcert repo, place in `/usr/local/bin`, `chmod +x mkcert` |

Firefox: mkcert will also add the root CA to Firefox via NSS (requires `nss-tools` / `libnss3-tools`). If Firefox was open, restart it once.

### 2. Generate / Refresh Dev Certificates

From repository root:

```
cd api-server
npm run setup:certs
```

This script will:
1. Ensure the local root CA is installed (`mkcert -install`) – idempotent.
2. Generate `ssl/cert.pem` & `ssl/key.pem` for `localhost`, `127.0.0.1`, and `::1`.

### 3. Configure React Dev Server

Inside `customer-portal`, run the existing HTTPS setup (if not already):

```
node setup-https.js
```

That creates/updates `.env` with:
```
HTTPS=true
SSL_CRT_FILE=../api-server/ssl/cert.pem
SSL_KEY_FILE=../api-server/ssl/key.pem
REACT_APP_API_URL=https://localhost:4000
```

### 4. Start Services

In two terminals (or run backend first):
```
cd api-server && npm start
cd customer-portal && npm start
```

Open:
* API Health: https://localhost:4000/health
* App: https://localhost:3000/

You should now see a valid secure connection (no red “Not secure”).

### Troubleshooting

| Issue | Resolution |
|-------|------------|
| Still shows warning | Ensure you used **https**, not cached http tab; hard refresh (Ctrl+Shift+R). |
| Firefox only still untrusted | Close all Firefox windows, re-run `npm run setup:certs`, reopen Firefox. |
| mkcert not found | Re-check install step; confirm it’s on PATH (`where mkcert` on Windows / `which mkcert`). |
| Corporate restrictions | You may need to manually import mkcert root CA printed during `mkcert -install`. |

### Production Note

For real deployments use a public CA (e.g. Let’s Encrypt) on a proper domain – never distribute your local mkcert root to end users.

### Security Hygiene

* Private keys (`ssl/key.pem`) are **ignored** by Git via `.gitignore`.
* Regenerate yearly or when compromised by re-running the script.
* Do not rename the files unless you also update references in `setup-https.js` and server config.

---
Generated cert workflow summary:

`mkcert root CA (trusted locally)` → signs → `localhost cert` → used by Node HTTPS & React dev server → browsers trust chain → no warning.
