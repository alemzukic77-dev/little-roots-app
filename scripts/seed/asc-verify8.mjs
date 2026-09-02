import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");
const mkTok = () => jwt.sign({ iss:"2658663b-515b-4a57-a24c-53202c768e94", iat:Math.floor(Date.now()/1000), exp:Math.floor(Date.now()/1000)+1000, aud:"appstoreconnect-v1" }, readFileSync("/Users/alemzukic/little-roots-app/credentials/AuthKey_U4P57L2LZK.p8","utf8"), { algorithm:"ES256", header:{alg:"ES256",kid:"U4P57L2LZK",typ:"JWT"} });
const api = async (p,m="GET",b) => { const r=await fetch("https://api.appstoreconnect.apple.com"+p,{method:m,headers:{Authorization:"Bearer "+mkTok(),"Content-Type":"application/json"},body:b?JSON.stringify(b):undefined}); return {s:r.status, j: r.status===204?{}:await r.json()}; };
const GROUP = (await api("/v1/apps/6784954206/betaGroups")).j.data.find(g=>g.attributes.isInternalGroup)?.id;
for (let i=0;i<45;i++){
  const b = await api("/v1/builds?filter[app]=6784954206&limit=5&sort=-uploadedDate&fields[builds]=version,processingState,expired,expirationDate,uploadedDate");
  const b8 = (b.j.data||[]).find(x=>x.attributes.version==="8");
  const st = b8?.attributes.processingState;
  console.log(`[${i}] build 8: ${st||"not visible"}${b8?` expired=${b8.attributes.expired} expires=${b8.attributes.expirationDate}`:""}`);
  if (st==="VALID"){
    console.log(`\n>>> KEY RESULT: build 8 expired=${b8.attributes.expired}`);
    console.log(`>>> uploaded=${b8.attributes.uploadedDate}`);
    console.log(`>>> expires =${b8.attributes.expirationDate}  (now=${new Date().toISOString()})`);
    if (!b8.attributes.expired){
      const link = await api(`/v1/betaGroups/${GROUP}/relationships/builds`,"POST",{data:[{type:"builds",id:b8.id}]});
      console.log("attach to internal group:", link.s<400?"OK ✓ — Maryam can now install":`status ${link.s}`);
      console.log("RESULT_HEALTHY");
    } else {
      console.log("RESULT_STILL_EXPIRED — Apple-side bug, needs support ticket");
    }
    process.exit(0);
  }
  if (st==="INVALID"){ console.log("build 8 INVALID"); process.exit(1); }
  await new Promise(r=>setTimeout(r,60000));
}
console.log("timed out waiting for build 8");
