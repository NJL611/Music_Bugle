// Turns on Next.js draft mode for the Studio's Presentation tool.
// Auth is Sanity's own preview-secret handshake — nothing here may be exposed to the browser.
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@sanity/lib/client";

const { GET: enableDraftMode } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN, useCdn: false }),
});

// Validating the secret requires an authenticated read, so a missing or expired token surfaces as
// a bare 500 and the editor just sees a blank iframe. Name the cause instead.
export async function GET(request: Request) {
  try {
    return await enableDraftMode(request);
  } catch (error) {
    // redirect() signals success by throwing — never swallow it.
    if (typeof (error as { digest?: unknown })?.digest === "string") {
      throw error;
    }

    const status = (error as { statusCode?: number })?.statusCode;
    const reason = !process.env.SANITY_API_READ_TOKEN
      ? "SANITY_API_READ_TOKEN is not set."
      : status === 401 || status === 403
        ? `Sanity rejected SANITY_API_READ_TOKEN (HTTP ${status}) — it is revoked or expired.`
        : null;

    if (!reason) {
      throw error;
    }

    console.error(`[preview] ${reason}`);

    return new Response(
      `Preview is unavailable.\n\n${reason}\n\n` +
        "Mint a replacement with the Viewer role in sanity.io/manage → project → API → Tokens,\n" +
        "then set SANITY_API_READ_TOKEN and restart the server.",
      { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }
}
