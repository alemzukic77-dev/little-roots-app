import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");
const mkTok = () => jwt.sign({ iss:"2658663b-515b-4a57-a24c-53202c768e94", iat:Math.floor(Date.now()/1000), exp:Math.floor(Date.now()/1000)+1000, aud:"appstoreconnect-v1" }, readFileSync("/Users/alemzukic/little-roots-app/credentials/AuthKey_U4P57L2LZK.p8","utf8"), { algorithm:"ES256", header:{alg:"ES256",kid:"U4P57L2LZK",typ:"JWT"} });
const api = async (p,m="GET",b) => { const r=await fetch("https://api.appstoreconnect.apple.com"+p,{method:m,headers:{Authorization:"Bearer "+mkTok(),"Content-Type":"application/json"},body:b?JSON.stringify(b):undefined}); return {s:r.status, j: r.status===204?{}:await r.json()}; };
const now = new Date();
const builds = await api("/v1/builds?filter[app]=6784954206&limit=8&sort=-uploadedDate&fields[builds]=version,processingState,expired,uploadedDate,expirationDate,usesNonExemptEncryption");
console.log("=== builds ===");
for (const b of (builds.j.data||[])) { const a=b.attributes; const exp=a.expirationDate?new Date(a.expirationDate):null; console.log(`build ${a.version}: state=${a.processingState} expired=${a.expired} enc=${a.usesNonExemptEncryption} uploaded=${a.uploadedDate?.slice(0,16)} expires=${a.expirationDate?.slice(0,16)||"—"}${exp&&exp<now?" <-- PAST":""}`); }
const grp = (await api("/v1/apps/6784954206/betaGroups?fields[betaGroups]=name,isInternalGroup")).j.data.find(g=>g.attributes.isInternalGroup);
const gb = await api(`/v1/betaGroups/${grp.id}/builds?fields[builds]=version,expired&limit=10`);
console.log("=== internal group builds ===");
(gb.j.data||[]).forEach(b=>console.log(`  build ${b.attributes.version} expired=${b.attributes.expired}`));
const testers = await api(`/v1/betaGroups/${grp.id}/betaTesters?fields[betaTesters]=email,state,inviteType`);
console.log("=== internal group testers ===");
(testers.j.data||[]).forEach(t=>console.log(`  ${t.attributes.email} state=${t.attributes.state} invite=${t.attributes.inviteType}`));
