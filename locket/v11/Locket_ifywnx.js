// ============================================================
// IFYWNX V11 PRO MAX - RevenueCat Active Unlocked Engine
// Target: ^https?:\/\/api\.revenuecat\.com\/.+\/(receipts|subscribers)
// ============================================================
(function () {
  var rawBody = (typeof $response !== "undefined" && $response && typeof $response.body === "string") ? $response.body : "{}";
  var result = { body: rawBody };

  function log(msg) {
    if (typeof console !== "undefined" && typeof console.log === "function") {
      console.log("[Locket_RC_V11_Pro] " + msg);
    }
  }

  try {
    if (typeof $request === "undefined" || !$request || !$request.headers || typeof $response === "undefined" || !$response || !$response.body) {
      $done(result);
      return;
    }

    var headers = $request.headers;
    var ua = headers["User-Agent"] || headers["user-agent"] || headers["USER-AGENT"] || "";

    // 1. Kiểm tra chính xác client Locket
    if (!/(?:^|[^a-z0-9])locket(?=$|[^a-z0-9])/i.test(ua)) {
      $done(result);
      return;
    }

    // 2. Parse Body an toàn tuyệt đối
    var obj;
    try {
      obj = JSON.parse($response.body);
    } catch (parseErr) {
      log("Parse error: " + parseErr.message);
      $done(result);
      return;
    }

    if (!obj || typeof obj !== "object") {
      $done(result);
      return;
    }

    // 3. Chuẩn hóa bộ khung dữ liệu RevenueCat Subscriber
    obj.subscriber = obj.subscriber || {};
    obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
    obj.subscriber.entitlements = obj.subscriber.entitlements || {};
    obj.subscriber.non_subscriptions = obj.subscriber.non_subscriptions || {};
    obj.subscriber.other_purchases = obj.subscriber.other_purchases || {};
    obj.subscriber.subscriber_attributes = obj.subscriber.subscriber_attributes || {};

    var now = new Date();
    var purchaseDate = "2024-01-01T00:00:00.000Z";
    var expiresDate = "2099-12-31T23:59:59.000Z";
    var primaryProductId = "locket_1600_1y";
    var transactionId = "2000001108724193";

    // 4. Payload chi tiết gói Subscription
    var baseSubscription = {
      auto_resume_date: null,
      billing_issues_detected_at: null,
      display_name: primaryProductId,
      expires_date: expiresDate,
      grace_period_expires_date: null,
      is_sandbox: false,
      management_url: "https://apps.apple.com/account/subscriptions",
      ownership_type: "PURCHASED",
      period_type: "normal",
      price: {
        amount: 0.0,
        currency: "VND"
      },
      product_identifier: primaryProductId,
      purchase_date: purchaseDate,
      original_purchase_date: purchaseDate,
      refunded_at: null,
      store: "app_store",
      store_transaction_id: transactionId,
      unsubscribe_detected_at: null
    };

    // 5. Payload Entitlement quyền lợi
    var entitlementPayload = {
      grace_period_expires_date: null,
      product_identifier: primaryProductId,
      purchase_date: purchaseDate,
      original_purchase_date: purchaseDate,
      expires_date: expiresDate
    };

    // 6. Kích hoạt song song mọi gói cước phổ biến của Locket
    var productList = [
      "locket_1600_1y",
      "locket_monthly",
      "locket_yearly",
      "locket_gold_lifetime"
    ];

    productList.forEach(function (id) {
      obj.subscriber.subscriptions[id] = Object.assign({}, baseSubscription, {
        product_identifier: id,
        display_name: id
      });
    });

    // 7. Cấp quyền trọn đời không định kỳ (Non-Subscriptions fallback)
    obj.subscriber.non_subscriptions["locket_gold_lifetime"] = [
      {
        id: transactionId,
        is_sandbox: false,
        original_purchase_date: purchaseDate,
        purchase_date: purchaseDate,
        store: "app_store",
        store_transaction_id: transactionId
      }
    ];

    // 8. Đăng ký toàn bộ alias Entitlement (Chống hụt khi app đổi key kiểm tra)
    var targetEntitlements = [
      "Gold",
      "pro",
      "Premium",
      "Plus",
      "locket_gold",
      "VIP",
      "gold_access"
    ];

    targetEntitlements.forEach(function (key) {
      obj.subscriber.entitlements[key] = entitlementPayload;
    });

    // 9. Giả lập cờ Tester / VIP Attributes cho tài khoản
    var mockAttributes = {
      "$is_tester": "true",
      "$has_gold": "true",
      "$is_beta": "true",
      "unlimited_reactions": "true",
      "hd_upload_enabled": "true",
      "custom_themes_enabled": "true"
    };

    Object.keys(mockAttributes).forEach(function (attr) {
      obj.subscriber.subscriber_attributes[attr] = {
        value: mockAttributes[attr],
        updated_at_ms: now.getTime()
      };
    });

    // 10. Xóa triệt để các cảnh báo lỗi thanh toán nếu server gốc trả về
    if (obj.subscriber.billing_issues_detected_at) {
      obj.subscriber.billing_issues_detected_at = null;
    }

    result = { body: JSON.stringify(obj) };
    log("Locket Gold & Entitlements injected successfully");
  } catch (error) {
    log("Catch error, preserving raw body: " + (error && error.message ? error.message : "unknown"));
    result = { body: rawBody };
  }

  $done(result);
})();
