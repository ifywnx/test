// ============================================================
// IFYWNX V14 ULTIMATE - Video 60s, Captions, Shin-chan & VIP Popup
// ============================================================
(function () {
  var rawBody = (typeof $response !== "undefined" && $response && typeof $response.body === "string") ? $response.body : "{}";
  var result = { body: rawBody };

  function safeMergeJSON(rawValue, overrides) {
    if (typeof rawValue === "undefined" || rawValue === null || rawValue === "") {
      return JSON.stringify(overrides);
    }
    try {
      var parsed = typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return JSON.stringify(Object.assign({}, parsed, overrides));
      }
      return rawValue;
    } catch (e) {
      return rawValue;
    }
  }

  try {
    if (typeof $request === "undefined" || !$request || typeof $response === "undefined" || !$response || !$response.body) {
      return $done(result);
    }

    var headers = $request.headers || {};
    var ua = headers["User-Agent"] || headers["user-agent"] || headers["USER-AGENT"] || "";
    var reqUrl = typeof $request.url === "string" ? $request.url : "";

    var matchesProject = /^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/locket-4252a\/.+/i.test(reqUrl);
    var matchesUA = /(?:^|[^a-z0-9])locket(?=$|[^a-z0-9])/i.test(ua);

    if ((reqUrl && !matchesProject) || (!reqUrl && !matchesUA)) return $done(result);

    var data = JSON.parse($response.body);
    if (!data || typeof data !== "object" || Array.isArray(data) || !data.entries) return $done(result);

    var entries = data.entries;

    // ============================================================
    // 1. MỞ KHÓA TÍNH NĂNG CHÍNH VÀ CÁC CỜ BẢN QUYỀN + AI BETA
    // ============================================================
    entries.feature_gates = safeMergeJSON(entries.feature_gates, {
      app_icon_picker: "enabled", camera_roll: "enabled", camera_theme: "enabled",
      custom_widget_frames: "enabled", locket_views: "enabled", long_captions: "enabled",
      longer_video: "enabled", unlimited_friends: "enabled", priority_support: "enabled",
      profile_badge: "enabled", remove_ads: "enabled", streak_recovery: "enabled",
      video: "enabled", video_audio: "enabled", high_quality_video: "enabled",
      hd_media_upload: "enabled", rollcall: "enabled", time_travel: "enabled",
      group_chats: "enabled", magic_cutout: "enabled", ai_captions: "enabled",
      lenses: "enabled", photo_booth: "enabled"
    });

    entries.upsell_features = safeMergeJSON(entries.upsell_features, {
      app_icon_picker: true, camera_roll: true, camera_theme: true,
      custom_widget_frames: true, locket_views: true, remove_ads: true,
      longer_video: true, streak_recovery: true
    });

    // ============================================================
    // 2. VIDEO 60 GIÂY, CÓ TIẾNG & FIX LỖI TIME-OUT (10S / 6MB)
    // ============================================================
    entries.max_video_length_seconds = "60.0";
    entries.gold_max_duration = "60.0";
    entries.video_max_duration = "60.0";
    entries.max_file_size_mb = "200";
    entries.hd_video_max_file_size_mb = "200";
    entries.upload_timeout_seconds = "120";

    var videoOverrides = {
      gold_max_duration: 60.0, goldMaxDuration: 60.0, max_duration: 60.0, max_video_length_seconds: 60.0,
      ultra_wide: true, ultraWide: true, volume_button: true, volumeButton: true,
      flash_button: true, telephoto: true, audio_enabled: true, record_audio: true,
      keep_original_audio: true, mute_by_default: false, unmute_by_default: true,
      audio_bitrate: 256000, video_bitrate: 8000000, compression_quality: 0.9, max_file_size_mb: 200, hd_video: true
    };
    entries.camera = safeMergeJSON(entries.camera, videoOverrides);
    entries.camera_roll = safeMergeJSON(entries.camera_roll, videoOverrides);
    entries.video_config = safeMergeJSON(entries.video_config, videoOverrides);
    entries.media_upload = safeMergeJSON(entries.media_upload, videoOverrides);

    // ============================================================
    // 3. KHUNG WIDGET SHIN-CHAN & POPUP CHÀO MỪNG IFYWNX
    // ============================================================
    entries.widget_frame_event = JSON.stringify({
      uid: "shin_chan_custom_anh",
      url: "https://i.ibb.co/sdx3xg0D/A-nh-Chat-GPT-12-39-54-18-thg-10-2026.png",
      placement: "below", use_local_time_zone: true, start_at: "2020-01-01T00:00:00", end_at: "2099-12-31T23:59:59"
    });
    entries.android_widget_frame_event_enabled = "true";
    entries.widget_badge_enabled = "true";

    entries.feature_discovery_popup_config = JSON.stringify({
      tag: "LOCKET GOLD",
      tag_gradient: true,
      tag_style: "gold_gradient",
      title: "Lên Locket Gold rồi đó 😎",
      feature_set: [
        {
          title: "Chào mừng đến với ifywnx ✨",
          body: "Chúc bạn chia sẻ thật nhiều khoảnh khắc đẹp 💛",
          imageURL: "https://ifywnx-install.agilechub512.chatgpt.site/images/locket-welcome-ifywnx-v5.png"
        }
      ],
      primary_button_title: "Xong",
      campaign: "ifywnx_welcome_v5",
      start_at: "2020-01-01T00:00:00",
      end_at: "2099-12-31T23:59:59",
      use_local_time_zone: true
    });

    // ============================================================
    // 4. CẤU HÌNH TỐI ƯU APP & CHẶN TRACKING THEO DÕI
    // ============================================================
    Object.assign(entries, {
      captions_enabled: "true", overlay_navigator_enabled: "true", music_caption_enabled: "true",
      music_caption_song_preview_enabled: "true", profile_badge_visible: "true", custom_profile_pics: "true",
      max_friends_count: "999999", friend_limit_mode: "0", show_friend_limit_on_cam: "false",
      history_ads_mode: "off", unsend_message_enabled: "true", moment_views_enabled: "true",
      moment_views_v2: "true", time_travel_rewind_v2_enabled: "true",
      enable_analytics: "false", crashlytics_enabled: "false", firebase_performance_enabled: "false",
      disable_telemetry: "true", show_watermark: "false", watermark_enabled: "false"
    });

    // ============================================================
    // 5. TRỌN BỘ KHO CAPTION (TỐI ƯU TỐC ĐỘ GỘP)
    // ============================================================
    var existing = [];
    if (typeof entries.overlay_items === "string") {
      try { existing = JSON.parse(entries.overlay_items) || []; } catch (err) {}
    } else if (Array.isArray(entries.overlay_items)) {
      existing = entries.overlay_items;
    }

    var seen = new Set();
    existing.forEach(function(grp) {
      if (Array.isArray(grp.items)) {
        grp.items.forEach(function(item) {
          if (item && item.overlay_id) seen.add(item.overlay_id);
        });
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
        section: "🎨 Holiday & VIP Edition",
        items: [
          { overlay_id: "caption:halloween_2026", source: "remote", caption: { background: { colors: ["#150804", "#C8540D"] }, icon: { data: "🎃", type: "emoji" }, max_lines: 1, text: "Halloween", localized_text: { en: "Halloween", vn: "Halloween" }, text_color: "#FFB182", type: "static_content" } },
          { overlay_id: "caption:autumn_2026", source: "remote", caption: { background: { colors: ["#FFE0A0", "#F6A53A"] }, icon: { data: "🍂", type: "emoji" }, max_lines: 1, text: "Xin chào Mùa Thu", localized_text: { en: "Xin chào Mùa Thu", vn: "Xin chào Mùa Thu" }, text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:christmas_day_2026", source: "remote", caption: { background: { colors: ["#E53935", "#A81818"] }, icon: { data: "🎄", type: "emoji" }, max_lines: 1, text: "Giáng sinh an lành", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:new_years_day_2027", source: "remote", caption: { background: { colors: ["#3B00EC", "#823FFF"] }, icon: { data: "💫", type: "emoji" }, max_lines: 1, text: "Xin chào 2027!", text_color: "#FFFFFF", type: "static_content" } }
        ]
      },
      {
        section: "🎨 Decorative by Locket",
        items: [
          { overlay_id: "caption:toi_nho_em", source: "remote", caption: { background: { colors: ["#FFFFFF", "#6D9EEB"] }, max_lines: 1, text: "보고 싶어 🥺", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:party_time", source: "remote", caption: { background: { colors: ["#5EFFF5", "#FCFF57"] }, icon: { data: "🪩", type: "emoji" }, max_lines: 1, text: "Party Time!", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:good_morning", source: "remote", daily_start_hour: 5, daily_end_hour: 10, caption: { background: { colors: ["#EF7402", "#EABF0F"] }, icon: { data: "☀️", type: "emoji" }, max_lines: 1, text: "Good morning", text_color: "#FFFFFFE5", type: "static_content" } },
          { overlay_id: "caption:goodnight", source: "remote", daily_start_hour: 19.5, daily_end_hour: 24, caption: { background: { colors: ["#370C6F", "#575CD4"] }, icon: { data: "🌙", type: "emoji" }, max_lines: 1, text: "Goodnight", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:miss_you", source: "remote", caption: { background: { colors: ["#EC0C00", "#FF493F"] }, icon: { data: "🥰", type: "emoji" }, max_lines: 1, text: "Miss you", text_color: "#FFFFFFDB", type: "static_content" } }
        ]
      },
      {
        section: "🎨 Decorative by ifywnx",
        items: [
          { overlay_id: "caption:ifywnx", source: "remote", caption: { background: { colors: ["#B8E7FF", "#A8F5D0", "#DCCBFF"] }, max_lines: 1, text: "💻 ifywnx", text_color: "#183153", type: "static_content" } },
          { overlay_id: "caption:feeling_cute", source: "remote", caption: { background: { colors: ["#F8BBD0", "#E91E63"] }, icon: { data: "🌷", type: "emoji" }, max_lines: 1, text: "Feeling Cute", text_color: "#FFFFFFE5", type: "static_content" } },
          { overlay_id: "caption:cu", source: "remote", caption: { background: { colors: ["#FFD6A5", "#FFF1A8", "#FFC4D6"] }, max_lines: 1, text: "Cu 🐎", text_color: "#633B24", type: "static_content" } },
          { overlay_id: "caption:wedding_time", source: "remote", caption: { background: { colors: ["#FFE4E1", "#E73C7E"] }, icon: { data: "💍", type: "emoji" }, max_lines: 1, text: "Wedding Time!", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:cam_thay_hanh_phuc", source: "remote", caption: { background: { colors: ["#EC407A", "#F8BBD0"] }, icon: { data: "🇻🇳", type: "emoji" }, max_lines: 1, text: "Cảm thấy hạnh phúc", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:coffee_time", source: "remote", caption: { background: { colors: ["#4E342E", "#8D6E63"] }, icon: { data: "☕", type: "emoji" }, max_lines: 1, text: "Coffee Time!", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:snake_vibes", source: "remote", caption: { background: { colors: ["#2E7D32", "#66BB6A"] }, icon: { data: "🐍", type: "emoji" }, max_lines: 1, text: "Snake Vibes", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:mixue_time", source: "remote", caption: { background: { colors: ["#FFF9C4", "#F8BBD0"] }, icon: { data: "🍦", type: "emoji" }, max_lines: 1, text: "Mixue Time!", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:locket_time", source: "remote", caption: { background: { colors: ["#ECEFF1", "#B3E5FC"] }, icon: { data: "📷", type: "emoji" }, max_lines: 1, text: "Locket Time!", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:cinema_time", source: "remote", caption: { background: { colors: ["#1A237E", "#455A64"] }, icon: { data: "🎬", type: "emoji" }, max_lines: 1, text: "Cinema Time!", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:dating_time", source: "remote", caption: { background: { colors: ["#E91E63", "#F44336"] }, icon: { data: "💕", type: "emoji" }, max_lines: 1, text: "Dating Time!", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:graduation_day", source: "remote", caption: { background: { colors: ["#1A237E", "#283593"] }, icon: { data: "🎓", type: "emoji" }, max_lines: 1, text: "Happy Graduation Day!", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:shopping_time", source: "remote", caption: { background: { colors: ["#B3E5FC", "#FFFFFF"] }, icon: { data: "🛍️", type: "emoji" }, max_lines: 1, text: "Shopping Time!", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:dinner_time", source: "remote", caption: { background: { colors: ["#FFCCBC", "#FF8A80"] }, icon: { data: "🍽️", type: "emoji" }, max_lines: 1, text: "Dinner Time!", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:chilling_time", source: "remote", caption: { background: { colors: ["#E1BEE7", "#F8BBD0"] }, icon: { data: "🌴", type: "emoji" }, max_lines: 1, text: "Chilling Time!", text_color: "#FFFFFFE6", type: "static_content" } }
        ]
      },
      {
        section: "🌸 Độc lạ & Bất ổn",
        items: [
          { overlay_id: "caption:xin_vinh_biet_cu", source: "remote", caption: { background: { colors: ["#232526", "#414345"] }, icon: { data: "🕯️", type: "emoji" }, max_lines: 1, text: "Xin vĩnh biệt cụ", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:chay_ngay_di", source: "remote", caption: { background: { colors: ["#D31027", "#EA384D"] }, icon: { data: "🏃💨", type: "emoji" }, max_lines: 1, text: "Chạy ngay đi", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:cu_tu_tu_khoai_se_nhu", source: "remote", caption: { background: { colors: ["#56AB2F", "#A8E063"] }, icon: { data: "🥔", type: "emoji" }, max_lines: 1, text: "Cứ từ từ khoai sẽ nhừ", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:kiem_tra_nhan_pham", source: "remote", caption: { background: { colors: ["#654EA3", "#EAAFC8"] }, icon: { data: "🎲", type: "emoji" }, max_lines: 1, text: "Kiểm tra nhân phẩm", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:doc_so_tai_khoan", source: "remote", caption: { background: { colors: ["#1E90FF", "#00D4FF"] }, icon: { data: "💳", type: "emoji" }, max_lines: 1, text: "đọc số tài khoản", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:ai_so_thi_di_ve", source: "remote", caption: { background: { colors: ["#B71C1C", "#FF5722"] }, icon: { data: "🏃", type: "emoji" }, max_lines: 1, text: "ai sợ thì đi về", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:con_cai_nit", source: "remote", caption: { background: { colors: ["#D7CCC8", "#8D6E63"] }, icon: { data: "🧶", type: "emoji" }, max_lines: 1, text: "còn cái nịt", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:canh_bao_co_hat", source: "remote", caption: { background: { colors: ["#9C27B0", "#E91E63"] }, icon: { data: "🎤", type: "emoji" }, max_lines: 1, text: "cảnh báo có hát", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:than_chua_ma_don", source: "remote", caption: { background: { colors: ["#607D8B", "#37474F"] }, icon: { data: "😔", type: "emoji" }, max_lines: 1, text: "Thân chưa mà dỡn", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:ai_muon", source: "remote", caption: { background: { colors: ["#E91E63", "#F44336"] }, icon: { data: "🤔", type: "emoji" }, max_lines: 1, text: "Ai mượn?", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:hay_ra_de_qua_a", source: "remote", caption: { background: { colors: ["#FFF59D", "#80DEEA"] }, icon: { data: "🥺", type: "emoji" }, max_lines: 1, text: "Hay ra dẻ quá à!", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:giam_suc_manh_con_tuong", source: "remote", caption: { background: { colors: ["#4CAF50", "#00BCD4"] }, icon: { data: "🎮", type: "emoji" }, max_lines: 1, text: "Giảm sức mạnh con tướng", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:mac_co_qua_hai_oi", source: "remote", caption: { background: { colors: ["#FFB74D", "#F8BBD0"] }, icon: { data: "😭", type: "emoji" }, max_lines: 1, text: "Mắc cỡ quá hai ơi", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:minh_la_lop", source: "remote", caption: { background: { colors: ["#263238", "#455A64"] }, icon: { data: "🛞", type: "emoji" }, max_lines: 1, text: "Mình là lốp", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:dep_trai_co_gi_sai", source: "remote", caption: { background: { colors: ["#FF5722", "#FFC107"] }, icon: { data: "😎", type: "emoji" }, max_lines: 1, text: "Đẹp trai có gì sai", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:mong_ton_hoa_sen", source: "remote", caption: { background: { colors: ["#D8B4E2", "#F8BBD0"] }, icon: { data: "🪷", type: "emoji" }, max_lines: 1, text: "Mong tôn hoa sen thấy cảnh này", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:dam_nhau_khong", source: "remote", caption: { background: { colors: ["#E53935", "#FF7043"] }, icon: { data: "🥊", type: "emoji" }, max_lines: 1, text: "đấm nhau không", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:sieu_cap_ba_khi", source: "remote", caption: { background: { colors: ["#EC407A", "#F44336"] }, icon: { data: "🐉", type: "emoji" }, max_lines: 1, text: "siêu cấp bá khí", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:du_an_ma", source: "remote", caption: { background: { colors: ["#263238", "#455A64"] }, icon: { data: "👻", type: "emoji" }, max_lines: 1, text: "dự án ma", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:doi_roi", source: "remote", caption: { background: { colors: ["#FF5F6D", "#FFC371"] }, icon: { data: "😤", type: "emoji" }, max_lines: 1, text: "Dỗi rồi", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:dang_ban_tuong_tu", source: "remote", caption: { background: { colors: ["#1A2980", "#26D0CE"] }, icon: { data: "💭", type: "emoji" }, max_lines: 1, text: "Đang bận tương tư", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:mo_hon_nhung_tam_hien", source: "remote", caption: { background: { colors: ["#FFB75E", "#ED8F03"] }, icon: { data: "🐤", type: "emoji" }, max_lines: 1, text: "Mỏ hỗn nhưng tâm hiền", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:luon_vui_tuoi", source: "remote", caption: { background: { colors: ["#00F2FE", "#4FACFE"] }, icon: { data: "🤡", type: "emoji" }, max_lines: 1, text: "Luôn vui tươi", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:bat_on_that_su", source: "remote", caption: { background: { colors: ["#636363", "#A2AB58"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "Bất ổn thật sự", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:khong_cam_xuc", source: "remote", caption: { background: { colors: ["#434343", "#000000"] }, icon: { data: "🗿", type: "emoji" }, max_lines: 1, text: "Không cảm xúc", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:phu_huynh_dung_xem", source: "remote", caption: { background: { colors: ["#FF0844", "#FFB199"] }, icon: { data: "🙈", type: "emoji" }, max_lines: 1, text: "Phụ huynh đừng xem", text_color: "#FFFFFFE6", type: "static_content" } }
        ]
      },
      {
        section: "🌸 Trend TikTok & Gen Z",
        items: [
          { overlay_id: "caption:hoi_chieu_troi_mua", source: "remote", caption: { background: { colors: ["#546E7A", "#263238"] }, icon: { data: "🌧️", type: "emoji" }, max_lines: 1, text: "Hồi chiều trời mưa...", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:con_vien_la_lan", source: "remote", caption: { background: { colors: ["#12C2E9", "#F64F59"] }, icon: { data: "🍂", type: "emoji" }, max_lines: 1, text: "côn viên lá làn", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:tuyet_doi_khong_nghe", source: "remote", caption: { background: { colors: ["#FF416C", "#FF4B2B"] }, icon: { data: "🙉", type: "emoji" }, max_lines: 1, text: "Tuyệt đối không nghe", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:flex_den_hoi_tho_cuoi", source: "remote", caption: { background: { colors: ["#F7971E", "#FFD200"] }, icon: { data: "💎", type: "emoji" }, max_lines: 1, text: "Flex đến hơi thở cuối", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:overthinking_vai_chuong", source: "remote", caption: { background: { colors: ["#2C3E50", "#4CA1AF"] }, icon: { data: "🤯", type: "emoji" }, max_lines: 1, text: "Overthinking vai chưởng", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:chan_bo_may_di", source: "remote", caption: { background: { colors: ["#870000", "#190A05"] }, icon: { data: "🙄", type: "emoji" }, max_lines: 1, text: "Chan bố mày đi", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:oach_xa_lach", source: "remote", caption: { background: { colors: ["#11998E", "#38EF7D"] }, icon: { data: "🥬", type: "emoji" }, max_lines: 1, text: "oách xà lách", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:ua_alo", source: "remote", caption: { background: { colors: ["#8E2DE2", "#4A00E0"] }, icon: { data: "📞", type: "emoji" }, max_lines: 1, text: "Ủa alo", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:ke_chuyen_nghe_choi", source: "remote", caption: { background: { colors: ["#8A2387", "#E94057"] }, icon: { data: "🍿", type: "emoji" }, max_lines: 1, text: "Kể chuyện nghe chơi", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:hom_nay_toi_buon", source: "remote", caption: { background: { colors: ["#141E30", "#243B55"] }, icon: { data: "🥀", type: "emoji" }, max_lines: 1, text: "hôm nay tôi buồn", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:xinh_dep_tuyet_voi", source: "remote", caption: { background: { colors: ["#FC5C7D", "#6A82FB"] }, icon: { data: "💅", type: "emoji" }, max_lines: 1, text: "Xinh đẹp tuyệt vời", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:tram_cam_nhe", source: "remote", caption: { background: { colors: ["#1F1C2C", "#928DAB"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "Trầm cảm nhẹ", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:chua_du_wow", source: "remote", caption: { background: { colors: ["#FF5349", "#EB0C00"] }, icon: { data: "⭐", type: "emoji" }, max_lines: 1, text: "Chưa đủ wow", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:boc_trung_sit_rit", source: "remote", caption: { background: { colors: ["#9C27B0", "#7B1FA2"] }, icon: { data: "🎁", type: "emoji" }, max_lines: 1, text: "Bóc trúng sít rịt", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:hen_lam_moi_xui_duoc_vay_a", source: "remote", caption: { background: { colors: ["#00BCD4", "#0097A7"] }, icon: { data: "😅", type: "emoji" }, max_lines: 1, text: "Hèn lắm mới xui được vậy á", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:ra_duong_ne_moi_anh", source: "remote", caption: { background: { colors: ["#2196F3", "#1976D2"] }, icon: { data: "👤", type: "emoji" }, max_lines: 1, text: "Ra đường nể mỗi anh", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:cung_cung_di", source: "remote", caption: { background: { colors: ["#FFC107", "#FFA000"] }, icon: { data: "🚀", type: "emoji" }, max_lines: 1, text: "Cũng cứng đi", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:tuyet_doi_dien_anh", source: "remote", caption: { background: { colors: ["#455A64", "#263238"] }, icon: { data: "📷", type: "emoji" }, max_lines: 1, text: "Tuyệt đối điện ảnh", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:du_ba_khi_chua", source: "remote", caption: { background: { colors: ["#FF5722", "#E64A19"] }, icon: { data: "⚡", type: "emoji" }, max_lines: 1, text: "Đủ bá khí chưa", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:ua_alo_question", source: "remote", caption: { background: { colors: ["#9C27B0", "#7B1FA2"] }, icon: { data: "❓", type: "emoji" }, max_lines: 1, text: "Ủa alo?", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:cai_gi_vay_troi", source: "remote", caption: { background: { colors: ["#F44336", "#D32F2F"] }, icon: { data: "❗", type: "emoji" }, max_lines: 1, text: "Cái gì vậy trời", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:nay_la_het_cuu", source: "remote", caption: { background: { colors: ["#607D8B", "#455A64"] }, icon: { data: "❌", type: "emoji" }, max_lines: 1, text: "Này là hết cứu", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:qua_la_dien_anh", source: "remote", caption: { background: { colors: ["#26A69A", "#00897B"] }, icon: { data: "📷", type: "emoji" }, max_lines: 1, text: "Quá là điện ảnh", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:hao_han", source: "remote", caption: { background: { colors: ["#114357", "#F29492"] }, icon: { data: "🗡️", type: "emoji" }, max_lines: 1, text: "Hảo hán", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:cam_lanh", source: "remote", caption: { background: { colors: ["#2193B0", "#6DD5ED"] }, icon: { data: "🤧", type: "emoji" }, max_lines: 1, text: "Cảm lạnh", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:bat_luc", source: "remote", caption: { background: { colors: ["#2C3E50", "#3498DB"] }, icon: { data: "🏳️", type: "emoji" }, max_lines: 1, text: "Bất lực", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:xin_lui_duoc_chua", source: "remote", caption: { background: { colors: ["#F6D365", "#FDA085"] }, icon: { data: "🥺", type: "emoji" }, max_lines: 1, text: "Xin lũi được chưa", text_color: "#000000", type: "static_content" } },
          { overlay_id: "caption:rot_nuoc_mat", source: "remote", caption: { background: { colors: ["#1CB5E0", "#000046"] }, icon: { data: "😭", type: "emoji" }, max_lines: 1, text: "Rớt nước mắt", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:guc_nga", source: "remote", caption: { background: { colors: ["#3A1C71", "#D76D77"] }, icon: { data: "📉", type: "emoji" }, max_lines: 1, text: "Gục ngã", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:tien_dinh", source: "remote", caption: { background: { colors: ["#C33764", "#1D2671"] }, icon: { data: "🌪️", type: "emoji" }, max_lines: 1, text: "Tiền đình", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:che_manh", source: "remote", caption: { background: { colors: ["#FF4E50", "#F9D423"] }, icon: { data: "👎", type: "emoji" }, max_lines: 1, text: "Chê mạnh", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:xinh_gai_an_phim_1", source: "remote", caption: { background: { colors: ["#F77062", "#FE5196"] }, icon: { data: "💅", type: "emoji" }, max_lines: 1, text: "Xinh gái ấn phím 1", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:di_lam_vi_dam_me", source: "remote", caption: { background: { colors: ["#FDC830", "#F37335"] }, icon: { data: "🤡", type: "emoji" }, max_lines: 1, text: "Đi làm vì đam mê", text_color: "#FFFFFF", type: "static_content" } },
          { overlay_id: "caption:tinh_hoa_hoi_tu", source: "remote", caption: { background: { colors: ["#FFD700", "#FF8C00"] }, icon: { data: "✨", type: "emoji" }, max_lines: 1, text: "Tinh hoa hội tụ", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:phu_tinh_khong_phu_ban", source: "remote", caption: { background: { colors: ["#8E2DE2", "#4A00E0"] }, icon: { data: "🕶️", type: "emoji" }, max_lines: 1, text: "Phụ tình không phụ bản", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:ngoan_xinh_yeu", source: "remote", caption: { background: { colors: ["#FFAFBD", "#FFC3A0"] }, icon: { data: "🌸", type: "emoji" }, max_lines: 1, text: "Ngoan xinh yêu của ai?", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:nhin_la_biet_uy_tin", source: "remote", caption: { background: { colors: ["#2980B9", "#2C3E50"] }, icon: { data: "👌", type: "emoji" }, max_lines: 1, text: "Nhìn là biết uy tín", text_color: "#FFFFFFE6", type: "static_content" } }
        ]
      },
      {
        section: "🌸 Meme vui nhộn & Đời sống",
        items: [
          { overlay_id: "caption:cuoi_xiu", source: "remote", caption: { background: { colors: ["#FFEB3B", "#FF9800"] }, icon: { data: "😎", type: "emoji" }, max_lines: 1, text: "Cười xỉu", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:toang_that_roi", source: "remote", caption: { background: { colors: ["#F44336", "#B71C1C"] }, icon: { data: "🐉", type: "emoji" }, max_lines: 1, text: "Toang thật rồi", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:toi_roi_toi_roi", source: "remote", caption: { background: { colors: ["#673AB7", "#512DA8"] }, icon: { data: "❗", type: "emoji" }, max_lines: 1, text: "Tới rồi tới rồi", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:khong_the_tin_noi", source: "remote", caption: { background: { colors: ["#00BCD4", "#0097A7"] }, icon: { data: "❓", type: "emoji" }, max_lines: 1, text: "Không thể tin nổi", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:ngay_moi_vui_ve", source: "remote", caption: { background: { colors: ["#4CAF50", "#2E7D32"] }, icon: { data: "☀️", type: "emoji" }, max_lines: 1, text: "Ngày mới vui vẻ", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:ngu_ngon", source: "remote", caption: { background: { colors: ["#3F51B5", "#1A237E"] }, icon: { data: "🌙", type: "emoji" }, max_lines: 1, text: "Ngủ ngon", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:an_com_chua", source: "remote", caption: { background: { colors: ["#FF9800", "#F57C00"] }, icon: { data: "🍽️", type: "emoji" }, max_lines: 1, text: "Ăn cơm chưa?", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:di_choi_khong", source: "remote", caption: { background: { colors: ["#E91E63", "#C2185B"] }, icon: { data: "✈️", type: "emoji" }, max_lines: 1, text: "Đi chơi không?", text_color: "#FFFFFFE6", type: "static_content" } }
        ]
      },
      {
        section: "🌸 Check VAR & Hóng hớt",
        items: [
          { overlay_id: "caption:check_var_2", source: "remote", caption: { background: { colors: ["#11998E", "#38EF7D"] }, icon: { data: "📺", type: "emoji" }, max_lines: 1, text: "Check VAR liền", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:qua_nhieu_su_de_thuong", source: "remote", caption: { background: { colors: ["#F38181", "#FCE38A"] }, icon: { data: "🎀", type: "emoji" }, max_lines: 1, text: "Quá nhiều sự dễ thương", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:mac_bay_tinh_yeu", source: "remote", caption: { background: { colors: ["#EE9CA7", "#FFDDE1"] }, icon: { data: "💘", type: "emoji" }, max_lines: 1, text: "Mắc bẫy tình yêu", text_color: "#000000E6", type: "static_content" } },
          { overlay_id: "caption:song_gio_phu_doi_trai", source: "remote", caption: { background: { colors: ["#3A1C71", "#D76D77"] }, icon: { data: "🌪️", type: "emoji" }, max_lines: 1, text: "Sóng gió phủ đời trai", text_color: "#FFFFFFE6", type: "static_content" } }
        ]
      },
      {
        section: "🌸 Góc Deadline & Đi Làm",
        items: [
          { overlay_id: "caption:deadline_ruot", source: "remote", caption: { background: { colors: ["#ED213A", "#93291E"] }, icon: { data: "🔥", type: "emoji" }, max_lines: 1, text: "Deadline dí tụt quần", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:tien_dau_ma_tieu", source: "remote", caption: { background: { colors: ["#11998E", "#38EF7D"] }, icon: { data: "💸", type: "emoji" }, max_lines: 1, text: "Tiền đâu mà tiêu", text_color: "#FFFFFFE6", type: "static_content" } },
          { overlay_id: "caption:nghien_cuu_khoa_hoc", source: "remote", caption: { background: { colors: ["#0F2027", "#2C5364"] }, icon: { data: "☕", type: "emoji" }, max_lines: 1, text: "Cần nạp cafein gấp", text_color: "#FFFFFFE6", type: "static_content" } }
        ]
      }
    ];

    catalog.forEach(function(grp) {
      var missing = grp.items.filter(function(item) {
        return !seen.has(item.overlay_id);
      });
      
      if (missing.length > 0) {
        var existingGrp = null;
        for (var k = 0; k < existing.length; k++) {
          if (existing[k].section === grp.section) {
            existingGrp = existing[k];
            break;
          }
        }
        
        if (existingGrp) {
          existingGrp.items = existingGrp.items.concat(missing);
        } else {
          existing.push({ section: grp.section, items: missing });
        }
      }
    });

    entries.overlay_items = JSON.stringify(existing);
    result = { body: JSON.stringify(data) };

  } catch (error) {
    result = { body: rawBody };
  }

  $done(result);
})();
