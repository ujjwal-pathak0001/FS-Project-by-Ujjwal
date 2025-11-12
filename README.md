

This project implements the core requirements with a Node.js/Express API, MongoDB, and a Vite/React frontend.

## Highlights
- **Tenant resolution middleware** supports route params, headers, JWT validation, and optional subdomains before allowing access.
- **Data isolation** enforced through tenant-aware controllers and compound indexes on MongoDB collections.
- **Tenant branding** persisted in MongoDB and returned during auth; the client applies themes via CSS variables.
- **Structured logging** logs request metadata (method, route, tenant, duration) for lightweight observability.
- **Containerised dev setup** (`docker-compose`) runs MongoDB, the API (nodemon dev mode), and the Vite client with hot reloads.

## Getting Started
```bash
# Install dependencies
cd Server && npm install
cd ../client/vite-project && npm install

# Run API locally
cd ../../Server
npm run dev

# Run client locally
cd ../client/vite-project
npm run dev
```

Set environment variables in `Server/.env` (defaults provided). The API expects MongoDB at `MONGO_URI`.

### Subdomain tenant routing
Set `TENANT_ROOT_DOMAIN` to your apex domain (for example `example.com`) to allow requests such as `tenant-a.example.com` to resolve the tenant automatically. For local development, entries like `tenant.localhost` are supported without additional configuration—add the hostname to your hosts file and point it at `127.0.0.1`. The middleware still honours explicit path (`/api/tenants/:tenant/posts`), header (`x-tenant-id`), or query overrides if you prefer those styles.

## Tests
```bash
cd Server
npm test
```
This runs the `tenantResolver` middleware tests with Node's built-in test runner.

## Docker (optional)
```bash
docker compose up --build
```
This starts MongoDB, the API (port `5000`), and the Vite client (port `5173`) with live reload against mounted source folders.
