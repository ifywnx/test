// IFYWNX V11 — request-header compatibility probe (read-only).
// No Authorization, cache validators or subscription headers are removed in the public test build.
(function(){
 try {
  var request=(typeof $request!=="undefined"&&$request)||{};
  if(!request.headers)return $done({});
  var ua="";
  for(var key in request.headers){
   if(Object.prototype.hasOwnProperty.call(request.headers,key)&&key.toLowerCase()==="user-agent"){ua=String(request.headers[key]||"");break;}
  }
  if(/(?:^|[^a-z0-9])locket(?=$|[^a-z0-9])/i.test(ua)&&typeof console!=="undefined"&&typeof console.log==="function"){
   console.log("[IFYWNX V11] Request headers preserved");
  }
 }catch(e){}
 $done({});
})();
