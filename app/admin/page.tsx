import { headers } from "next/headers";
import { isAdmin } from "../../lib/server";
import { chatGPTSignInPath, chatGPTSignOutPath } from "../chatgpt-auth";
import { Dashboard } from "../../components/admin";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Studio Staff",
  robots: { index: false, follow: false },
};
export default async function Admin() {
  const h = await headers();
  const authorized = isAdmin(
    new Request("https://internal/admin", { headers: h }),
  );
  return (
    <div className="wrap">
      <div className="page-intro">
        <span className="eyebrow">BEHIND THE WHEEL</span>
        <h1>The studio desk.</h1>
        <p>
          Manage session availability, booking requests, and ceramic inquiries.
        </p>
      </div>
      {authorized ? (
        <>
          <p style={{ marginBottom: 25, fontSize: 11 }}>
            Signed in as {h.get("oai-authenticated-user-email")} ·{" "}
            <a
              className="text-link"
              href={chatGPTSignOutPath("/admin")}
              target="_top"
            >
              Sign out
            </a>
          </p>
          <Dashboard />
        </>
      ) : (
        <div className="notice" style={{ marginBottom: 70 }}>
          <p>
            Sign in with the authorized studio account to access customer
            information and manage availability.
          </p>
          <a
            className="button"
            style={{ marginTop: 20 }}
            href={chatGPTSignInPath("/admin")}
            target="_top"
          >
            Sign in with ChatGPT ↗
          </a>
          {h.get("oai-authenticated-user-email") && (
            <p style={{ marginTop: 15 }}>
              This account is not on the staff list.{" "}
              <a href={chatGPTSignOutPath("/admin")} target="_top">
                Sign out and use your studio account.
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
