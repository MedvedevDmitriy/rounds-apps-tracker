type GooglePlayUrlData = {
  url: string;
  googlePlayId: string;
};

export function parseGooglePlayUrl(input: string): GooglePlayUrlData {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(input);
  } catch {
    throw new Error("Invalid URL");
  }

  const hostname = parsedUrl.hostname.replace(/^www\./, "");

  if (hostname !== "play.google.com") {
    throw new Error("URL must be a Google Play app URL");
  }

  if (parsedUrl.pathname !== "/store/apps/details") {
    throw new Error("URL must point to a Google Play app details page");
  }

  const packageName = parsedUrl.searchParams.get("id");

  if (!packageName || !packageName.trim()) {
    throw new Error("Google Play app id is missing");
  }

  return {
    url: input.trim(),
    googlePlayId: packageName.trim(),
  };
}
