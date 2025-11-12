import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import { tenantResolver } from "../src/middlewares/tenantResolver.js";

const createContext = ({ params = {}, headers = {}, query = {}, user = null } = {}) => {
  const normalisedHeaders = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value])
  );
  const req = {
    params,
    headers: normalisedHeaders,
    query,
    user,
    header(name) {
      return this.headers[name.toLowerCase()];
    },
  };

  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  return { req, res, next, get nextCalled() { return nextCalled; } };
};

describe("tenantResolver middleware", () => {
  const originalRootDomain = process.env.TENANT_ROOT_DOMAIN;

  afterEach(() => {
    if (typeof originalRootDomain === "undefined") {
      delete process.env.TENANT_ROOT_DOMAIN;
    } else {
      process.env.TENANT_ROOT_DOMAIN = originalRootDomain;
    }
  });

  it("resolves tenant from route params and matches JWT", () => {
    const ctx = createContext({
      params: { tenantId: "t1" },
      user: { tenantId: "t1" },
    });

    tenantResolver(ctx.req, ctx.res, ctx.next);

    assert.equal(ctx.req.tenantId, "t1");
    assert.equal(ctx.nextCalled, true);
    assert.equal(ctx.res.statusCode, 200);
  });

  it("falls back to x-tenant-id header when params absent", () => {
    const ctx = createContext({
      headers: { "x-tenant-id": "t2" },
      user: { tenantId: "t2" },
    });

    tenantResolver(ctx.req, ctx.res, ctx.next);

    assert.equal(ctx.req.tenantId, "t2");
    assert.equal(ctx.nextCalled, true);
  });

  it("derives tenant from subdomain when configured", () => {
    process.env.TENANT_ROOT_DOMAIN = "example.com";
    const ctx = createContext({
      headers: { host: "alpha.example.com:5000" },
      user: { tenantId: "alpha" },
    });

    tenantResolver(ctx.req, ctx.res, ctx.next);

    assert.equal(ctx.req.tenantId, "alpha");
    assert.equal(ctx.nextCalled, true);
  });

  it("supports *.localhost subdomains for development", () => {
    delete process.env.TENANT_ROOT_DOMAIN;
    const ctx = createContext({
      headers: { host: "beta.localhost:5000" },
      user: { tenantId: "beta" },
    });

    tenantResolver(ctx.req, ctx.res, ctx.next);

    assert.equal(ctx.req.tenantId, "beta");
    assert.equal(ctx.nextCalled, true);
  });

  it("blocks when resolved tenant differs from token", () => {
    const ctx = createContext({
      params: { tenantId: "t1" },
      headers: { "x-tenant-id": "t2" },
      user: { tenantId: "t2" },
    });

    tenantResolver(ctx.req, ctx.res, ctx.next);

    assert.equal(ctx.nextCalled, false);
    assert.equal(ctx.res.statusCode, 403);
    assert.equal(ctx.res.body.message, "Tenant mismatch for authenticated user");
  });
});
