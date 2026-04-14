export function applyPlayStoreLocaleParams(
  url: string,
  hl: string,
  gl: string,
): string {
  const u = new URL(url);
  u.searchParams.set("hl", hl);
  u.searchParams.set("gl", gl);
  return u.toString();
}
