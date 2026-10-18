// IFYWNX V11 — RevenueCat compatibility probe (read-only).
// Public test edition. Does not change purchases, entitlements, product IDs or subscription receipts.
(function(){
 var result={};
 try {
  var headers=(typeof $request!=="undefined"&&$request&&$request.headers)||{};
  var ua="";
  for(var key in headers)if(Object.prototype.hasOwnProperty.call(headers,key)&&key.toLowerCase()==="user-agent"){ua=String(headers[key]||"");break;}
  if(/(?:^|[^a-z0-9])locket(?=$|[^a-z0-9])/i.test(ua)&&typeof console!=="undefined"&&typeof console.log==="function"){
   console.log("[IFYWNX V11] Locket subscription response observed; original response preserved");
  }
 } catch(e) {}
 $done(result);
})();
