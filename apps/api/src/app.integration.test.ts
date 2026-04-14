import { EventEmitter } from "node:events";
import type { Express } from "express";
import httpMocks from "node-mocks-http";
import { beforeAll, describe, expect, it } from "vitest";

let app: Express;

beforeAll(async () => {
  process.env.DATABASE_URL =
    process.env.DATABASE_URL ||
    "postgresql://dummy:dummy@127.0.0.1:5432/dummy";

  ({ app } = await import("./app"));
});

async function runRequest(method: string, url: string) {
  const req = httpMocks.createRequest({
    method,
    url,
  });

  const res = httpMocks.createResponse({
    eventEmitter: EventEmitter,
  });

  await new Promise<void>((resolve) => {
    res.on("end", resolve);
    app.handle(req, res);
  });

  return res;
}

describe("app integration", () => {
  it("returns ok on GET /health", async () => {
    const res = await runRequest("GET", "/health");

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ status: "ok" });
  });

  it("rejects invalid ids on POST /apps/:id/capture", async () => {
    const res = await runRequest("POST", "/apps/%20/capture");

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Invalid id" });
  });
});
