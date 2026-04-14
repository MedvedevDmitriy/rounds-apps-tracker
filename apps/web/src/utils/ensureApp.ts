import type { IApp } from "../shared/interfaces";

export function ensureApp(raw: IApp): IApp {
  return {
    ...raw,
    url: typeof raw.url === "string" ? raw.url : "",
    screenshots: Array.isArray(raw.screenshots) ? raw.screenshots : [],
  };
}
