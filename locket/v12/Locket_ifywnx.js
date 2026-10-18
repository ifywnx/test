(function () {
  var result = {};
  try { result = rewrite(); } catch (error) { /* Preserve original response. */ }
  $done(result);

  function rewrite() {
    var ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";
    var obj = JSON.parse($response.body);

    // Chỉ chạy nếu là Locket và có dữ liệu RevenueCat (Tránh lỗi app khác)
    if (!ua.includes("Locket") || !obj || !obj.subscriber || !obj.subscriber.subscriptions || !obj.subscriber.entitlements) {
        return {};
    }

    // ========= LỜI NHẮN CỦA ANH ========= //
    obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";

    // ========= DỮ LIỆU ĐĂNG KÝ (SUBSCRIPTION) ========= //
    var ifywnx = {
      auto_resume_date: null,
      display_name: "Locket Gold (1 Year)", // Hiển thị tên gói đẹp hơn
      is_sandbox: false, // BẮT BUỘC FALSE: Để Locket không quét ra đây là bill ảo
      ownership_type: "PURCHASED",
      billing_issues_detected_at: null,
      management_url: "https://apps.apple.com/account/subscriptions",
      period_type: "normal",
      price: {
        amount: 399000.0,
        currency: "VND"
      },
      expires_date: "9999-01-09T10:10:14Z",
      grace_period_expires_date: null,
      refunded_at: null,
      unsubscribe_detected_at: null,
      original_purchase_date: "2006-01-09T10:10:15Z", // Ngày tham gia của anh
      purchase_date: "2006-01-09T10:10:14Z",
      store: "app_store",
      store_transaction_id: "2000001108724193"
    };

    // ========= QUYỀN LỢI ĐƯỢC HƯỞNG (ENTITLEMENTS) ========= //
    var locketGold = {
      grace_period_expires_date: null,
      purchase_date: "2006-01-09T10:10:14Z",
      product_identifier: "locket_1600_1y",
      expires_date: "9999-01-09T10:10:14Z"
    };

    // Bơm thẳng dữ liệu vào app (Tối ưu tốc độ, bỏ vòng lặp Mapping cũ)
    obj.subscriber.subscriptions["locket_1600_1y"] = ifywnx;
    obj.subscriber.entitlements["Gold"] = locketGold;

    // Ép phiên bản cài đặt gốc về 1.0.0 để ăn trọn các event kỷ niệm của Locket
    if (!obj.subscriber.original_application_version) {
        obj.subscriber.original_application_version = "1.0.0";
    }

    return { body: JSON.stringify(obj) };
  }
})();
