(function () {
  if (typeof $request === "undefined" || !$request || !$request.headers) {
    return $done({});
  }
  try {
    var headers = Object.assign({}, $request.headers);
    var stripList = [
      "x-revenuecat-etag",
      "if-none-match",
      "if-modified-since",
      "if-match",
      "x-goog-if-none-match"
    ];
    var keys = Object.keys(headers);
    for (var i = 0; i < keys.length; i++) {
      if (stripList.indexOf(keys[i].toLowerCase()) !== -1) {
        delete headers[keys[i]];
      }
    }
    $done({ headers: headers });
  } catch (e) {
    $done({});
  }
})();
