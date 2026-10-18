// ============================================================
// IFYWNX File 3 - RevenueCat Header Bypass (Final)
// Chỉ chạy với Locket, chỉ xóa header cache RevenueCat
// ============================================================
(function () {
  try {
    var headers = $request.headers || {};
    var ua = headers['User-Agent'] || headers['user-agent'] || headers['USER-AGENT'] || '';

    // Chỉ xử lý request từ Locket
    if (!ua.includes('Locket')) return $done({});

    var result = Object.assign({}, headers);

    // Danh sách header cần xóa (chỉ những header RevenueCat dùng để cache)
    // KHÔNG xóa if-none-match / if-modified-since vì đây là header HTTP chuẩn
    var stripList = [
      'x-revenuecat-etag',      // thẻ chính RevenueCat dùng để cache
      'x-revenuecat-request-id' // thẻ phụ, xóa để tránh server skip
    ];

    for (var key in result) {
      if (result.hasOwnProperty(key)) {
        var lower = key.toLowerCase();
        if (stripList.indexOf(lower) !== -1) {
          delete result[key];
        }
      }
    }

    $done({ headers: result });
  } catch (e) {
    $done({});
  }
})();
