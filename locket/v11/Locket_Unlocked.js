// ============================================================
// IFYWNX V12 CLEAN - Bảo toàn 100% Micro, Filter, Diện mạo + Khung Shin-chan + Full Captions
// ============================================================
(function () {
  var rawBody = (typeof $response !== "undefined" && $response && typeof $response.body === "string") ? $response.body : "{}";
  var result = { body: rawBody };

  try {
    if (typeof $request === "undefined" || !$request || !$request.headers || typeof $response === "undefined" || !$response || !$response.body) {
      return $done(result);
    }

    var headers = $request.headers;
    var ua = headers["User-Agent"] || headers["user-agent"] || headers["USER-AGENT"] || "";
    var reqUrl = typeof $request.url === "string" ? $request.url : "";

    var matchesProject = /^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/locket-4252a\/.+/i.test(reqUrl);
    var matchesUA = /(?:^|[^a-z0-9])locket(?=$|[^a-z0-9])/i.test(ua);

    if ((reqUrl && !matchesProject) || (!reqUrl && !matchesUA)) {
      return $done(result);
    }

    var data = JSON.parse($response.body);
    if (!data || typeof data !== "object" || Array.isArray(data) || !data.entries || typeof data.entries !== "object" || Array.isArray(data.entries)) {
      return $done(result);
    }

    var entries = data.entries;

    // ============================================================
    // 1. GIỮ NGUYÊN 100% CẤU HÌNH CAMERA, MICRO & FILTER CỦA SERVER
    // (Không ghi đè entries.camera và entries.feature_gates bằng biến lạ)
    // ============================================================
    // Chỉ bật nhẹ các công tắc đơn (boolean string) an toàn tuyệt đối:
    entries.captions_enabled = "true";
    entries.overlay_navigator_enabled = "true";
    entries.music_caption_enabled = "true";
    entries.music_caption_song_preview_enabled = "true";
    entries.link_caption_link_enabled = "true";
    entries.lunar_new_year_app_icon_enabled = "true";
    entries.profile_badge_visible = "true";
    entries.custom_profile_pics = "true";
    entries.profile_menu_v2_enabled = "true";
    entries.max_friends_count = "999999";
    entries.friend_limit_mode = "0";
    entries.show_friend_limit_on_cam = "false";
    entries.history_ads_mode = "off";
    entries.history_ads_prefetch_count = "0";
    entries.history_ads_dynamic_insertion = "false";

    // ============================================================
    // 2. KHUNG WIDGET SHIN-CHAN CỦA ANH
    // ============================================================
    var SHIN_CHAN_FRAME = "https://i.ibb.co/sdx3xg0D/A-nh-Chat-GPT-12-39-54-18-thg-10-2026.png";

    entries.widget_frame_event = JSON.stringify({
      uid: "shin_chan_clean_v12",
      url: SHIN_CHAN_FRAME,
      placement: "below",
      use_local_time_zone: true,
      start_at: "2020-01-01T00:00:00",
      end_at: "2099-12-31T23:59:59"
    });
    entries.widget_frame_event_max_images = "5";
    entries.android_widget_frame_event_enabled = "true";
    entries.widget_badge_enabled = "true";
    entries.widget_badge_v2 = "true";

    // ============================================================
    // 3. CHỈ BỔ SUNG CAPTIONS VÀO DANH SÁCH GỐC (KHÔNG XÓA ĐỒ CŨ)
    // ============================================================
    var existing = [];
    if (entries.overlay_items !== undefined && entries.overlay_items !== null && entries.overlay_items !== "") {
      try {
        var parsed = typeof entries.overlay_items === "string" ? JSON.parse(entries.overlay_items) : entries.overlay_items;
        if (Array.isArray(parsed)) {
          existing = parsed;
        } else {
          return $done({ body: JSON.stringify(data) });
        }
      } catch (err) {
        return $done({ body: JSON.stringify(data) });
      }
    }

    var merged = existing.slice();
    var seen = Object.create(null);

    for (var i = 0; i < existing.length; i++) {
      var group = existing[i];
      if (!group || !Array.isArray(group.items)) continue;
      for (var j = 0; j < group.items.length; j++) {
        var item = group.items[j];
        if (item && typeof item.overlay_id === "string") {
          seen[item.overlay_id] = true;
        }
      }
    }

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
        section: "👑 VIP Dev & IT Edition",
        items: [
          { overlay_id: "caption:an_vip_dev", source: "remote", caption: { background: { colors: ["#0F2027", "#203A43", "#2C5364"] }, icon: { data: "⚡", type: "emoji" }, max_lines: 1, text: "Full-Stack Mode", text_color: "#00FFCC", type: "static_content" } },
          { overlay_id: "caption:shin_chan_vibe", source: "remote", caption: { background: { colors: ["#FF512F", "#DD2476"] }, icon: { data: "🖍️", type: "emoji" }, max_lines: 1, text: "Shin-chan Vibe ✨", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:coding_night", source: "remote", caption: { background: { colors: ["#141E30", "#243B55"] }, icon: { data: "💻", type: "emoji" }, max_lines: 1, text: "Fix bug xuyên đêm", text_color: "#FFD700", type: "static_content" } }
        ]
      },
      {
        section: "🎨 Holiday Caption",
        items: [
          { overlay_id: "caption:halloween_2026", source: "remote", caption: { background: { colors: ["#150804", "#C8540D"] }, icon: { data: "🎃", type: "emoji" }, max_lines: 1, text: "Halloween", localized_text: { en: "Halloween", vn: "Halloween" }, text_color: "#FFB182", type: "static_content" } },
          { overlay_id: "caption:autumn_2026", source: "remote", caption: { background: { colors: ["#FFE0A0", "#F6A53A"] }, icon: { data: "🍂", type: "emoji" }, max_lines: 1, text: "Xin chào Mùa Thu", localized_text: { en: "Xin chào Mùa Thu", vn: "Xin chào Mùa Thu" }, text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:christmas_day_2026", source: "remote", caption: { background: { colors: ["#E53935", "#A81818"] }, icon: { data: "🎄", type: "emoji" }, max_lines: 1, text: "Giáng sinh an lành", localized_text: { en: "Giáng sinh an lành", vn: "Giáng sinh an lành" }, text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:new_years_day_2027", source: "remote", caption: { background: { colors: ["#3B00EC", "#823FFF"] }, icon: { data: "💫", type: "emoji" }, max_lines: 1, text: "Xin chào 2027!", localized_text: { en: "Xin chào 2027!", vn: "Xin chào 2027!" }, text_color: "#FFFFFF", type: "static_content" } }
        ]
      },
      {
        section: "🎨 Decorative by ifywnx",
        items: [
          { overlay_id: "caption:ifywnx", source: "remote", caption: { background: { colors: ["#B8E7FF", "#A8F5D0", "#DCCBFF"] }, max_lines: 1, text: "💻 ifywnx", text_color: "#183153", type: "static_content" } },
          { overlay_id: "caption:feeling_cute", source: "remote", caption: { background: { colors: ["#F8BBD0", "#E91E63"] }, icon: { data: "🌷", type: "emoji" }, max_lines: 1, text: "Feeling Cute", localized_text: { en: "Feeling Cute", vn: "Cảm thấy dthw" }, text_color: "#FFFFFFE5", type: "static_content" } },
          { overlay_id: "caption:coffee_time", source: "remote", caption: { background: { colors: ["#4E342E", "#8D6E63"] }, icon: { data: "☕", type: "emoji" }, max_lines: 1, text: "Coffee Time!", localized_text: { en: "Coffee Time!", vn: "Giờ uống cà phê!" }, text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:locket_time", source: "remote", caption: { background: { colors: ["#ECEFF1", "#B3E5FC"] }, icon: { data: "📷", type: "emoji" }, max_lines: 1, text: "Locket Time!", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:chilling_time", source: "remote", caption: { background: { colors: ["#E1BEE7", "#F8BBD0"] }, icon: { data: "🌴", type: "emoji" }, max_lines: 1, text: "Chilling Time!", localized_text: { en: "Chilling Time!", vn: "Giờ thư giãn!" }, text_color: "#FFFFFFE6", type: "static_content" } }
        ]
      },
      {
        section: "🌸 Độc lạ & Trend TikTok",
        items: [
          { overlay_id: "caption:xin_vinh_biet_cu", source: "remote", caption: { background: { colors: ["#232526", "#414345"] }, icon: { data: "🕯️", type: "emoji" }, max_lines: 1, text: "Xin vĩnh biệt cụ", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:chay_ngay_di", source: "remote", caption: { background: { colors: ["#D31027", "#EA384D"] }, icon: { data: "🏃💨", type: "emoji" }, max_lines: 1, text: "Chạy ngay đi", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:flex_den_hoi_tho_cuoi", source: "remote", caption: { background: { colors: ["#F7971E", "#FFD200"] }, icon: { data: "💎", type: "emoji" }, max_lines: 1, text: "Flex đến hơi thở cuối", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:overthinking_vai_chuong", source: "remote", caption: { background: { colors: ["#2C3E50", "#4CA1AF"] }, icon: { data: "🤯", type: "emoji" }, max_lines: 1, text: "Overthinking vai chưởng", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:tuyet_doi_dien_anh", source: "remote", caption: { background: { colors: ["#455A64", "#263238"] }, icon: { data: "📷", type: "emoji" }, max_lines: 1, text: "Tuyệt đối điện ảnh", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:check_var", source: "remote", caption: { background: { colors: ["#11998E", "#38EF7D"] }, icon: { data: "📺", type: "emoji" }, max_lines: 1, text: "Check VAR liền", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:tinh_hoa_hoi_tu", source: "remote", caption: { background: { colors: ["#FFD700", "#FF8C00"] }, icon: { data: "✨", type: "emoji" }, max_lines: 1, text: "Tinh hoa hội tụ", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:ngoan_xinh_yeu", source: "remote", caption: { background: { colors: ["#FFAFBD", "#FFC3A0"] }, icon: { data: "🌸", type: "emoji" }, max_lines: 1, text: "Ngoan xinh yêu của ai?", text_color: "#000000E6", type: "static_content" } }
        ]
      },
      {
        section: "🐹 Capybara & Thú cưng",
        items: [
          { overlay_id: "caption:ifywnx_v10_01_01", source: "remote", caption: { type: "static_content", text: "Capy chill hết phần thiên hạ", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "🐹" } } },
          { overlay_id: "caption:ifywnx_v10_01_02", source: "remote", caption: { type: "static_content", text: "Đi cà phê cùng Capy", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "☕" } } },
          { overlay_id: "caption:ifywnx_v10_02_01", source: "remote", caption: { type: "static_content", text: "Bé chó hơi quạu", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "🐶" } } },
          { overlay_id: "caption:ifywnx_v10_03_01", source: "remote", caption: { type: "static_content", text: "Meow meow xin chào", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "🐱" } } }
        ]
      },
      {
        section: "💌 Crush & Học tập",
        items: [
          { overlay_id: "caption:ifywnx_v10_05_01", source: "remote", caption: { type: "static_content", text: "Crush rep tin nhắn đi", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "💌" } } },
          { overlay_id: "caption:ifywnx_v10_05_04", source: "remote", caption: { type: "static_content", text: "Cho mình một cái ôm", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "🫂" } } },
          { overlay_id: "caption:ifywnx_v10_06_01", source: "remote", caption: { type: "static_content", text: "Deadline đang đuổi", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "📚" } } },
          { overlay_id: "caption:ifywnx_v10_06_02", source: "remote", caption: { type: "static_content", text: "Code chưa chạy anh ơi", max_lines: 2, text_color: "#24304A", background: { colors: ["#E9EFFF", "#FFF1EC"] }, icon: { type: "emoji", data: "💻" } } }
        ]
      }
    ];

    for (var n = 0; n < catalog.length; n++) {
      var grp = catalog[n];
      var missing = [];
      for (var m = 0; m < grp.items.length; m++) {
        var cand = grp.items[m];
        if (!seen[cand.overlay_id]) {
          seen[cand.overlay_id] = true;
          missing.push(cand);
        }
      }
      if (!missing.length) continue;

      var pos = -1;
      for (var t = 0; t < merged.length; t++) {
        if (merged[t] && merged[t].section === grp.section && Array.isArray(merged[t].items)) {
          pos = t;
          break;
        }
      }
      if (pos < 0) {
        merged.push({ section: grp.section, items: missing });
      } else {
        var copy = Object.assign({}, merged[pos]);
        copy.items = merged[pos].items.concat(missing);
        merged[pos] = copy;
      }
    }

    entries.overlay_items = JSON.stringify(merged);

    var serialized = JSON.stringify(data);
    if (serialized.length < 480000) {
      result = { body: serialized };
    }
  } catch (error) {
    result = { body: rawBody };
  }

  $done(result);
})();
