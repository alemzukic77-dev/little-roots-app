// Add an internal TestFlight tester via the App Store Connect API.
// Usage: node asc-add-tester.mjs "email" "First" "Last"
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");

const KEY_ID = "U4P57L2LZK";
const ISSUER = "2658663b-515b-4a57-a24c-53202c768e94";
const APP_ID = "6784954206";
const KEY_PATH = "/Users/alemzukic/little-roots-app/credentials/AuthKey_U4P57L2LZK.p8";

const [email, firstName = "Maryam", lastName = "Richards"] = process.argv.slice(2);
if (!email) { console.error("email required"); process.exit(1); }

const token = jwt.sign(
  { iss: ISSUER, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 1200, aud: "appstoreconnect-v1" },
  readFileSync(KEY_PATH, "utf8"),
  { algorithm: "ES256", header: { alg: "ES256", kid: KEY_ID, typ: "JWT" } },
);

const api = async (path, method = "GET", body) => {
  const res = await fetch(`https://api.appstoreconnect.apple.com${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json; try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  return { status: res.status, json };
};

// 1. confirm app + list its beta groups
const groups = await api(`/v1/apps/${APP_ID}/betaGroups?limit=200`);
if (groups.status >= 400) { console.error("app/groups error", groups.status, JSON.stringify(groups.json)); process.exit(1); }
const internal = groups.json.data.find((g) => g.attributes.isInternalGroup);
console.log("beta groups:", groups.json.data.map((g) => `${g.attributes.name}${g.attributes.isInternalGroup ? " [internal]" : ""}`).join(", ") || "(none)");

let groupId = internal?.id;
if (!groupId) {
  // create an internal group
  const created = await api(`/v1/betaGroups`, "POST", {
    data: {
      type: "betaGroups",
      attributes: { name: "Internal Testers", isInternalGroup: true },
      relationships: { app: { data: { type: "apps", id: APP_ID } } },
    },
  });
  if (created.status >= 400) { console.error("create group error", created.status, JSON.stringify(created.json)); process.exit(1); }
  groupId = created.json.data.id;
  console.log("created internal group:", groupId);
} else {
  console.log("using internal group:", internal.attributes.name, groupId);
}

// 2. add the tester to the internal group
const add = await api(`/v1/betaTesters`, "POST", {
  data: {
    type: "betaTesters",
    attributes: { firstName, lastName, email },
    relationships: { betaGroups: { data: [{ type: "betaGroups", id: groupId }] } },
  },
});
if (add.status === 201) {
  console.log(`✓ added ${email} as internal tester — Apple emails a TestFlight invite once a build is processed`);
} else if (add.status === 409 || JSON.stringify(add.json).includes("already exists")) {
  console.log(`ℹ ${email} already a tester; ensuring group membership…`);
  const tid = add.json?.data?.id;
  // best-effort: fetch tester id and link to group
  const found = await api(`/v1/betaTesters?filter[email]=${encodeURIComponent(email)}`);
  const id = tid || found.json?.data?.[0]?.id;
  if (id) {
    const link = await api(`/v1/betaGroups/${groupId}/relationships/betaTesters`, "POST", { data: [{ type: "betaTesters", id }] });
    console.log(link.status < 400 ? "✓ linked to internal group" : `link status ${link.status}: ${JSON.stringify(link.json)}`);
  }
} else {
  console.error("add tester error", add.status, JSON.stringify(add.json));
  process.exit(1);
}
process.exit(0);
