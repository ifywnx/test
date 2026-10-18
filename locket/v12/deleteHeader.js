(function () {
  if (typeof $request === "undefined" || !$request || !$request.headers) {
    return $done({});
  }

  try {
    // Clone headers an toàn
    var headers = Object.assign({}, $request.headers);
    
    // Danh sách các thẻ cần xóa để ép server nhả data mới
    var stripList = [
      "x-revenuecat-etag",
      "if-none-match",
      "if-modified-since",
      "if-match",
      "x-goog-if-none-match"
    ];

    // Quét và xóa các thẻ bị cấm (viết gọn hơn)
    for (var key in headers) {
      if (headers.hasOwnProperty(key)) {
        var lowerKey = key.toLowerCase();
        if (stripList.indexOf(lowerKey) !== -1) {
          delete headers[key];
        }
      }
    }

    $done({ headers: headers });
  } catch (e) {
    $done({}); // Lỗi thì cho qua, không làm sập kết nối
  }
})();
