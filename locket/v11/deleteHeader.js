// ============================================================
// IFYWNX V11 PRO - Active Request Header Optimizer
// Type: http-request
// Targets: 
//   - ^https?:\/\/api\.revenuecat\.com\/.+\/(receipts|subscribers)
//   - ^https:\/\/firebaseremoteconfig\.googleapis\.com\/.*
// ============================================================
(function () {
  // 1. Kiểm tra an toàn sự tồn tại của $request
  if (typeof $request === "undefined" || !$request || !$request.headers) {
    return $done({});
  }

  try {
    var headers = Object.assign({}, $request.headers);
    var ua = headers["User-Agent"] || headers["user-agent"] || headers["USER-AGENT"] || "";

    // 2. Nhận diện chính xác Locket (tránh ảnh hưởng app khác chạy nền)
    if (!/(?:^|[^a-z0-9])locket(?=$|[^a-z0-9])/i.test(ua)) {
      return $done({});
    }

    // 3. Danh sách các header cache cần triệt tiêu để chống dính HTTP 304
    var stripHeaders = [
      "x-revenuecat-etag",
      "if-none-match",
      "if-modified-since",
      "if-match",
      "if-unmodified-since"
    ];

    // 4. Quét và xóa sạch các header cache (không phân biệt hoa/thường)
    var headerKeys = Object.keys(headers);
    for (var i = 0; i < headerKeys.length; i++) {
      var key = headerKeys[i];
      if (stripHeaders.indexOf(key.toLowerCase()) !== -1) {
        delete headers[key];
      }
    }

    // 5. In log chẩn đoán khi chạy thử nghiệm
    if (typeof console !== "undefined" && typeof console.log === "function") {
      console.log("[Locket_Req_V11_Pro] Stripped cache headers for 200 OK force fetch");
    }

    $done({ headers: headers });
  } catch (err) {
    // Nếu có lỗi phát sinh ngoài ý muốn, trả về headers gốc an toàn
    $done({});
  }
})();
