// ============================================================
// LOCKET REMOTE CONFIG - V11 PRO MAX (FULL CAPTIONS + FRAMES)
// Target: ^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/locket-4252a\/namespaces\/firebaseremoteconfig:fetch
// ============================================================
(function () {
  // 1. Luôn ưu tiên trả về body gốc nếu gặp lỗi hoặc điều kiện skip
  var rawBody = (typeof $response !== "undefined" && $response && typeof $response.body === "string") ? $response.body : "{}";
  var result = { body: rawBody };

  function log(msg) {
    if (typeof console !== "undefined" && typeof console.log === "function") {
      console.log("[Locket_V11_Pro] " + msg);
    }
  }

  try {
    if (typeof $request === "undefined" || !$request || !$request.headers || typeof $response === "undefined" || !$response || !$response.body) {
      $done(result);
      return;
    }

    var headers = $request.headers;
    var ua = headers["User-Agent"] || headers["user-agent"] || headers["USER-AGENT"] || "";
    var reqUrl = typeof $request.url === "string" ? $request.url : "";

    var matchesProject = /^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/locket-4252a\/.+/i.test(reqUrl);
    var matchesUA = /(?:^|[^a-z0-9])locket(?=$|[^a-z0-9])/i.test(ua);

    if ((reqUrl && !matchesProject) || (!reqUrl && !matchesUA)) {
      $done(result);
      return;
    }

    var data;
    try {
      data = JSON.parse($response.body);
    } catch (parseErr) {
      log("JSON parse error: " + parseErr.message);
      $done(result);
      return;
    }

    if (!data || typeof data !== "object" || Array.isArray(data) || !data.entries || typeof data.entries !== "object" || Array.isArray(data.entries)) {
      $done(result);
      return;
    }

    var entries = data.entries;
    data.Attention = "ifywnx x An - Locket V11 Pro Enhanced";

    // ============================================================
    // A. BẬT BỘ ĐIỀU KHIỂN HIỂN THỊ CAPTION & OVERLAY CỦA APP
    // ============================================================
    entries.captions_enabled = "true";
    entries.overlay_navigator_enabled = "true";
    entries.music_caption_enabled = "true";
    entries.music_caption_song_preview_enabled = "true";
    entries.link_caption_link_enabled = "true";
    entries.overlays_v2_config = JSON.stringify({ suggestions_enabled: true });

    // Đăng ký toàn bộ dynamic tokens để app nhận diện
    var dynamicList = [
      "standard", "poll", "color_palette", "review", "music", "location",
      "weather", "time", "streak", "star_sign", "party_time", "locket_count",
      "good_morning", "goodnight", "ootd", "miss_you", "custom",
      "phunu_2010", "halloween_2026"
    ];
    entries.overlay_dynamic_captions = JSON.stringify(dynamicList);

    // ============================================================
    // B. XỬ LÝ KHUNG WIDGET (FRAME)
    // ============================================================
    // Anh có thể dán link ảnh khung tùy chọn vào đây (hoặc để trống để dùng Shin-chan)
    var CUSTOM_FRAME_URL = ""; 
    var defaultFrameUrl = "https://i.ibb.co/1Yt1Dzzy/Shin-chan-1.png";
    var activeFrameUrl = (CUSTOM_FRAME_URL && /^https:\/\/.+/i.test(CUSTOM_FRAME_URL)) ? CUSTOM_FRAME_URL : defaultFrameUrl;

    var hasServerFrame = false;
    try {
      if (entries.widget_frame_event) {
        var parsedFrame = typeof entries.widget_frame_event === "string" ? JSON.parse(entries.widget_frame_event) : entries.widget_frame_event;
        if (parsedFrame && typeof parsedFrame === "object" && typeof parsedFrame.url === "string" && parsedFrame.url.length > 10) {
          hasServerFrame = true;
        }
      }
    } catch (e) {}

    if (!hasServerFrame || CUSTOM_FRAME_URL) {
      entries.widget_frame_event = JSON.stringify({
        uid: "ifywnx_v11_frame",
        url: activeFrameUrl,
        placement: "below",
        use_local_time_zone: true,
        start_at: "2020-01-01T00:00:00",
        end_at: "2099-12-31T23:59:59"
      });
      entries.custom_widget_frames = "enabled";
      entries.android_widget_frame_event_enabled = "true";
      entries.widget_frame_event_max_images = "5";
    }

    // ============================================================
    // C. GỘP TOÀN BỘ DANH MỤC CAPTION ĐỒ SỘ (V10, V11, TREND)
    // ============================================================
    var existingSections = [];
    if (entries.overlay_items) {
      try {
        var parsed = typeof entries.overlay_items === "string" ? JSON.parse(entries.overlay_items) : entries.overlay_items;
        if (Array.isArray(parsed)) existingSections = parsed;
      } catch (err) {
        log("Cannot parse existing overlay_items: " + err.message);
      }
    }

    var seenIds = new Set();
    var cleanSections = [];

    // Lưu các mục hiện có từ server
    existingSections.forEach(function (sec) {
      if (!sec || typeof sec !== "object" || !Array.isArray(sec.items)) return;
      var items = sec.items.filter(function (it) {
        if (!it || typeof it.overlay_id !== "string" || !it.overlay_id || seenIds.has(it.overlay_id)) return false;
        seenIds.add(it.overlay_id);
        return true;
      });
      if (items.length > 0) {
        cleanSections.push(Object.assign({}, sec, { items: items }));
      }
    });

    var catalog = [
      {
        section: "🎨 General",
        items: [
          { overlay_id: "caption:standard", source: "local", caption: { type: "standard" } },
          { overlay_id: "caption:review", source: "local", caption: { type: "review" } },
          { overlay_id: "caption:music", source: "local", caption: { type: "music" } },
          { overlay_id: "caption:location", source: "local", caption: { type: "location" } },
          { overlay_id: "caption:weather", source: "local", caption: { type: "weather" } },
          { overlay_id: "caption:time", source: "local", caption: { type: "time" } },
          { overlay_id: "caption:streak", source: "local", caption: { type: "streak" } },
          { overlay_id: "caption:star_sign", source: "local", caption: { type: "star_sign" } },
          { overlay_id: "caption:poll", source: "local", caption: { type: "poll" } },
          { overlay_id: "caption:color_palette", source: "local", caption: { type: "color_palette" } },
          { overlay_id: "caption:locket_count", source: "local", caption: { type: "locket_count" } }
        ]
      },
      {
        section: "🎨 Holiday Caption",
        items: [
          { overlay_id: "caption:halloween_2026", source: "remote", caption: { background: { colors: ["#150804", "#C8540D"] }, icon: { data: "🎃", type: "emoji" }, max_lines: 1, text: "Halloween", localized_text: { en: "Halloween", vn: "Halloween" }, text_color: "#FFB182", type: "static_content" } },
          { overlay_id: "caption:autumn_2026", source: "remote", caption: { background: { colors: ["#FFE0A0", "#F6A53A"] }, icon: { data: "🍂", type: "emoji" }, max_lines: 1, text: "Xin chào Mùa Thu", localized_text: { en: "Xin chào Mùa Thu", vn: "Xin chào Mùa Thu" }, text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:christmas_eve_2026", source: "remote", caption: { background: { colors: ["#2FA85F", "#176B3A"] }, icon: { data: "🕯️", type: "emoji" }, max_lines: 1, text: "Giáng sinh an lành", localized_text: { en: "Giáng sinh an lành", vn: "Giáng sinh an lành" }, text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:christmas_day_2026", source: "remote", caption: { background: { colors: ["#E53935", "#A81818"] }, icon: { data: "🎄", type: "emoji" }, max_lines: 1, text: "Giáng sinh an lành", localized_text: { en: "Giáng sinh an lành", vn: "Giáng sinh an lành" }, text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:new_years_eve_2026", source: "remote", caption: { background: { colors: ["#FFC64B", "#FFEDBF"] }, icon: { data: "🥂", type: "emoji" }, max_lines: 1, text: "Xin chào 2027!", localized_text: { en: "Xin chào 2027!", vn: "Xin chào 2027!" }, text_color: "#643F00", type: "static_content" } },
          { overlay_id: "caption:new_years_day_2027", source: "remote", caption: { background: { colors: ["#3B00EC", "#823FFF"] }, icon: { data: "💫", type: "emoji" }, max_lines: 1, text: "Xin chào 2027!", localized_text: { en: "Xin chào 2027!", vn: "Xin chào 2027!" }, text_color: "#FFFFFF", type: "static_content" } }
        ]
      },
      {
        section: "🎨 Decorative by ifywnx",
        items: [
          { overlay_id: "caption:ifywnx", source: "remote", caption: { background: { colors: ["#B8E7FF", "#A8F5D0", "#DCCBFF"] }, max_lines: 1, text: "💻 ifywnx", text_color: "#183153", type: "static_content" } },
          { overlay_id: "caption:feeling_cute", source: "remote", caption: { background: { colors: ["#F8BBD0", "#E91E63"] }, icon: { data: "🌷", type: "emoji" }, max_lines: 1, text: "Feeling Cute", localized_text: { en: "Feeling Cute", vn: "Cảm thấy dthw" }, text_color: "#FFFFFFE5", type: "static_content" } },
          { overlay_id: "caption:cu", source: "remote", caption: { background: { colors: ["#FFD6A5", "#FFF1A8", "#FFC4D6"] }, max_lines: 1, text: "Cu 🐎", text_color: "#633B24", type: "static_content" } },
          { overlay_id: "caption:wedding_time", source: "remote", caption: { background: { colors: ["#FFE4E1", "#E73C7E"] }, icon: { data: "💍", type: "emoji" }, max_lines: 1, text: "Wedding Time!", localized_text: { en: "Wedding Time!", vn: "Đám cưới nè!" }, text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:cam_thay_hanh_phuc", source: "remote", caption: { background: { colors: ["#EC407A", "#F8BBD0"] }, icon: { data: "🇻🇳", type: "emoji" }, max_lines: 1, text: "Cảm thấy hạnh phúc", localized_text: { en: "Feeling Happy", vn: "Cảm thấy hạnh phúc" }, text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:coffee_time", source: "remote", caption: { background: { colors: ["#4E342E", "#8D6E63"] }, icon: { data: "☕", type: "emoji" }, max_lines: 1, text: "Coffee Time!", localized_text: { en: "Coffee Time!", vn: "Giờ uống cà phê!" }, text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:locket_time", source: "remote", caption: { background: { colors: ["#ECEFF1", "#B3E5FC"] }, icon: { data: "📷", type: "emoji" }, max_lines: 1, text: "Locket Time!", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:chilling_time", source: "remote", caption: { background: { colors: ["#E1BEE7", "#F8BBD0"] }, icon: { data: "🌴", type: "emoji" }, max_lines: 1, text: "Chilling Time!", localized_text: { en: "Chilling Time!", vn: "Giờ thư giãn!" }, text_color: "#FFFFFFE6", type: "static_content" } }
        ]
      },
      {
        section: "🌸 Trend TikTok & Gen Z",
        items: [
          { overlay_id: "caption:tinh_hoa_hoi_tu", source: "remote", caption: { background: { colors: ["#FFD700", "#FF8C00"] }, icon: { data: "✨", type: "emoji" }, max_lines: 1, text: "Tinh hoa hội tụ", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:ngoan_xinh_yeu", source: "remote", caption: { background: { colors: ["#FFAFBD", "#FFC3A0"] }, icon: { data: "🌸", type: "emoji" }, max_lines: 1, text: "Ngoan xinh yêu của ai?", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:overthinking_vai_chuong", source: "remote", caption: { background: { colors: ["#2C3E50", "#4CA1AF"] }, icon: { data: "🤯", type: "emoji" }, max_lines: 1, text: "Overthinking vai chưởng", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:flex_den_hoi_tho_cuoi", source: "remote", caption: { background: { colors: ["#F7971E", "#FFD200"] }, icon: { data: "💎", type: "emoji" }, max_lines: 1, text: "Flex đến hơi thở cuối", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:bat_on_that_su", source: "remote", caption: { background: { colors: ["#636363", "#A2AB58"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "Bất ổn thật sự", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:check_var", source: "remote", caption: { background: { colors: ["#11998E", "#38EF7D"] }, icon: { data: "📺", type: "emoji" }, max_lines: 1, text: "Check VAR liền", text_color: "#FFFFFFE6", type: "static_content" } }
        ]
      },
      {
        section: "🐹 Capybara vui vẻ",
        items: [
          { overlay_id: "caption:ifywnx_v10_01_01", source: "remote", caption: { type: "static_content", text: "Capy chill hết phần thiên hạ", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "🐹" } } },
          { overlay_id: "caption:ifywnx_v10_01_02", source: "remote", caption: { type: "static_content", text: "Đi cà phê cùng Capy", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "☕" } } },
          { overlay_id: "caption:ifywnx_v10_01_03", source: "remote", caption: { type: "static_content", text: "Capy không vội đâu", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "🌿" } } },
          { overlay_id: "caption:ifywnx_v10_01_04", source: "remote", caption: { type: "static_content", text: "Hôm nay sống chậm", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "🫶" } } }
        ]
      },
      {
        section: "🐶 Chihuahua & Mèo đáng yêu",
        items: [
          { overlay_id: "caption:ifywnx_v10_02_01", source: "remote", caption: { type: "static_content", text: "Bé chó hơi quạu", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "🐶" } } },
          { overlay_id: "caption:ifywnx_v10_02_04", source: "remote", caption: { type: "static_content", text: "Mood hôm nay: Quạu", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "😆" } } },
          { overlay_id: "caption:ifywnx_v10_03_01", source: "remote", caption: { type: "static_content", text: "Meow meow xin chào", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "🐱" } } },
          { overlay_id: "caption:ifywnx_v10_03_02", source: "remote", caption: { type: "static_content", text: "Mèo nhỏ cần được yêu", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "🎀" } } }
        ]
      },
      {
        section: "💌 Crush & Tình yêu",
        items: [
          { overlay_id: "caption:ifywnx_v10_05_01", source: "remote", caption: { type: "static_content", text: "Crush rep tin nhắn đi", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "💌" } } },
          { overlay_id: "caption:ifywnx_v10_05_02", source: "remote", caption: { type: "static_content", text: "Thích là phải nói", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "❤️" } } },
          { overlay_id: "caption:ifywnx_v10_05_04", source: "remote", caption: { type: "static_content", text: "Cho mình một cái ôm", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "🫂" } } }
        ]
      },
      {
        section: "📚 Deadline & Học tập",
        items: [
          { overlay_id: "caption:ifywnx_v10_06_01", source: "remote", caption: { type: "static_content", text: "Deadline đang đuổi", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "📚" } } },
          { overlay_id: "caption:ifywnx_v10_06_02", source: "remote", caption: { type: "static_content", text: "Code chưa chạy anh ơi", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "💻" } } },
          { overlay_id: "caption:ifywnx_v10_06_03", source: "remote", caption: { type: "static_content", text: "Bug này là của ai", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "🐛" } } }
        ]
      }
    ];

    catalog.forEach(function (sec) {
      if (!sec || !Array.isArray(sec.items)) return;
      var validItems = sec.items.filter(function (it) {
        if (!it || typeof it.overlay_id !== "string" || !it.overlay_id || seenIds.has(it.overlay_id)) return false;
        seenIds.add(it.overlay_id);
        return true;
      });

      if (validItems.length > 0) {
        var targetSection = cleanSections.find(function (g) {
          return g && g.section === sec.section;
        });
        if (targetSection) {
          targetSection.items = targetSection.items.concat(validItems);
        } else {
          cleanSections.push(Object.assign({}, sec, { items: validItems }));
        }
      }
    });

    entries.overlay_items = JSON.stringify(cleanSections);

    // ============================================================
    // D. ĐÓNG GÓI BODY AN TOÀN
    // ============================================================
    var finalBody = JSON.stringify(data);
    result = { body: finalBody };
    log("Thành công: Tổng nhóm overlay = " + cleanSections.length);
  } catch (error) {
    log("Catch error: " + (error && error.message ? error.message : "unknown"));
    result = { body: rawBody };
  }

  $done(result);
})();
