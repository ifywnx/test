// ============================================================
// IFYWNX V12 ULTIMATE - 60s Video + Full Audio + Anti-Compress + Filter/Theme Fix + Shin-chan Frame
// Target: ^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/locket-4252a\/.+
// ============================================================
(function () {
  var rawBody = (typeof $response !== "undefined" && $response && typeof $response.body === "string") ? $response.body : "{}";
  var result = { body: rawBody };

  // Helper gộp JSON an toàn: Giữ nguyên 100% tài nguyên Filter/Theme gốc từ server, chỉ tiêm thêm tính năng
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
    // 1. MỞ KHÓA TOÀN BỘ FEATURE GATES (BAO GỒM FILTER, THEME, AUDIO, 60S)
    // ============================================================
    entries.feature_gates = safeMergeJSON(entries.feature_gates, {
      app_icon_picker: "enabled",
      camera_roll: "enabled",
      camera_theme: "enabled",
      custom_widget_frames: "enabled",
      locket_views: "enabled",
      long_captions: "enabled",
      longer_video: "enabled",
      unlimited_friends: "enabled",
      priority_support: "enabled",
      profile_badge: "enabled",
      remove_ads: "enabled",
      streak_recovery: "enabled",
      video: "enabled",
      video_audio: "enabled",
      high_quality_video: "enabled",
      hd_media_upload: "enabled",
      rollcall: "enabled",
      time_travel: "enabled"
    });

    entries.upsell_features = safeMergeJSON(entries.upsell_features, {
      app_icon_picker: true,
      camera_roll: true,
      camera_theme: true,
      custom_widget_frames: true,
      locket_views: true,
      remove_ads: true,
      longer_video: true,
      streak_recovery: true
    });

    // ============================================================
    // 2. CẤU HÌNH VIDEO 60 GIÂY, GIỮ ÂM THANH GỐC & DUNG LƯỢNG LỚN (200MB)
    // ============================================================
    var videoOverrides = {
      gold_max_duration: 60.0,
      goldMaxDuration: 60.0,
      max_duration: 60.0,
      maxDuration: 60.0,
      max_video_length_seconds: 60.0,
      video_max_duration: 60.0,
      ultra_wide: true,
      ultraWide: true,
      volume_button: true,
      volumeButton: true,
      flash_button: true,
      telephoto: true,
      audio_enabled: true,
      audioEnabled: true,
      record_audio: true,
      recordAudio: true,
      keep_original_audio: true,
      mute_by_default: false,
      unmute_by_default: true,
      audio_bitrate: 256000,
      video_bitrate: 20000000,
      compression_quality: 1.0,
      video_export_preset: "AVAssetExportPresetHighestQuality",
      max_file_size_mb: 200,
      hd_video: true,
      fps: 60
    };

    entries.camera = safeMergeJSON(entries.camera, videoOverrides);
    entries.camera_roll = safeMergeJSON(entries.camera_roll, videoOverrides);

    entries.live_photos = safeMergeJSON(entries.live_photos, {
      capture: true,
      viewing: true,
      catch_up: true,
      audio_enabled: true
    });

    // Bật toàn bộ các biến rời rạc điều khiển Video, Audio & Độ phân giải
    Object.assign(entries, {
      camera_roll_preview_enabled: "true",
      camera_roll_video_enabled: "true",
      camera_roll_video_upload_enabled: "true",
      internal_camera_roll_video_upload_enabled: "true",
      longer_camera_roll_videos_enabled: "true",
      gold_max_duration: "60.0",
      goldMaxDuration: "60.0",
      video_max_duration: "60.0",
      camera_roll_max_duration: "60.0",
      max_video_duration_seconds: "60",
      video_audio_enabled: "true",
      record_video_with_audio: "true",
      unmute_video_by_default: "true",
      mute_video_by_default: "false",
      high_quality_upload_enabled: "true",
      video_compression_quality: "1.0",
      image_compression_quality: "1.0",
      max_video_upload_size_mb: "200",
      zoom_enabled: "true"
    });

    // ============================================================
    // 3. MỞ KHÓA XEM AI ĐÃ XEM ẢNH (VIEWS), CHAT, STREAK GRADIENT & ROLLCALL
    // ============================================================
    entries.streak_config = safeMergeJSON(entries.streak_config, {
      minimum_recovery_count: 0,
      minimum_display_count: 0,
      free_recovery_enabled: true
    });

    entries.journal_settings = safeMergeJSON(entries.journal_settings, {
      debug_menu_enabled: false,
      focus_animation: true,
      compact_header: true,
      friends_button: true,
      reverse_scroll_direction: false,
      streak_visualization: true,
      streak_visualization_style: "gradient",
      streak_header_minimum_count: 0,
      streak_visualization_minimum_count: 1,
      overlay_indicators: { location: true, music: true, static_content: true, weather: true }
    });

    Object.assign(entries, {
      // Xem ai đã xem Locket
      moment_views_enabled: "true",
      moment_views_v2: "true",
      record_moment_views: "true",
      notify_moment_views: "true",
      get_moment_views_as_cloud_function: "true",

      // Nâng cấp Chat & Thu hồi tin nhắn
      moment_reactions_v2: "true",
      chat_reactions_enabled: "true",
      conversation_reactions: "true",
      typing_indicators_enabled: "true",
      unsend_message_enabled: "true",
      reply_prototype_enabled: "true",
      messages_integration: "true",
      conversations_enabled: "true",
      groups_enabled: "true",

      // Chế độ Tự gửi cho bản thân, Tua ngược lịch sử & Xóa ảnh lịch
      send_to_self_only_mode: "always_enabled",
      time_travel_rewind_v2_enabled: "true",
      calendar_delete_moment_enabled: "true",
      locket_yearbook_story_sharing_encouraged: "true",
      rollcall_enabled: "true",
      rollcall_comment_actions: "true",
      rollcall_profile_button: "true",

      // Giao diện, Icon, Badge & Captions
      captions_enabled: "true",
      overlay_navigator_enabled: "true",
      music_caption_enabled: "true",
      music_caption_song_preview_enabled: "true",
      link_caption_link_enabled: "true",
      lunar_new_year_app_icon_enabled: "true",
      profile_badge_visible: "true",
      custom_profile_pics: "true",
      profile_menu_v2_enabled: "true",
      activity_bar_enabled: "true",
      journal_activity_bar_enabled: "true",

      // Bạn bè không giới hạn & Chặn sạch Quảng cáo
      max_friends_count: "999999",
      friend_limit_mode: "0",
      soft_friend_limit_threshold_count: "999999",
      show_friend_limit_on_cam: "false",
      signup_max_friends_count: "999999",
      celebrity_inbox_limit: "999999",
      history_ads_mode: "off",
      history_ads_prefetch_count: "0",
      history_ads_dynamic_insertion: "false",
      sentry_sample_rate: "0.0",
      sentry_network_tracing: "false",
      sentry_performance_tracking: "false"
    });

    // ============================================================
    // 4. KHUNG WIDGET SHIN-CHAN CỦA ANH (ĐÃ CHÈN SẴN LINK TRỰC TIẾP)
    // ============================================================
    var SHIN_CHAN_FRAME = "https://i.ibb.co/sdx3xg0D/A-nh-Chat-GPT-12-39-54-18-thg-10-2026.png";

    entries.widget_frame_event = JSON.stringify({
      uid: "shin_chan_v12_pro",
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
    // 5. KHO CAPTION ĐỒ SỘ V12 (KHÔNG GHI ĐÈ FILTER GỐC)
    // ============================================================
    var existingSections = [];
    var canModifyOverlays = true;

    if (entries.overlay_items !== undefined && entries.overlay_items !== null && entries.overlay_items !== "") {
      try {
        var parsedOverlay = typeof entries.overlay_items === "string" ? JSON.parse(entries.overlay_items) : entries.overlay_items;
        if (Array.isArray(parsedOverlay)) {
          existingSections = parsedOverlay;
        } else {
          canModifyOverlays = false;
        }
      } catch (err) {
        canModifyOverlays = false;
      }
    }

    if (canModifyOverlays) {
      var seenIds = Object.create(null);
      var mergedSections = existingSections.slice();

      for (var i = 0; i < existingSections.length; i++) {
        var grp = existingSections[i];
        if (!grp || !Array.isArray(grp.items)) continue;
        for (var j = 0; j < grp.items.length; j++) {
          var it = grp.items[j];
          if (it && typeof it.overlay_id === "string") seenIds[it.overlay_id] = true;
        }
      }

      var catalog = [
        {
          section: "🎨 General (Đa năng)",
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
            { overlay_id: "caption:an_vip_dev", source: "remote", caption: { background: { colors: ["#0F2027", "#203A43", "#2C5364"] }, icon: { data: "⚡", type: "emoji" }, max_lines: 2, text: "Full-Stack Developer Mode", text_color: "#00FFCC", type: "static_content" } },
            { overlay_id: "caption:shin_chan_vibe", source: "remote", caption: { background: { colors: ["#FF512F", "#DD2476"] }, icon: { data: "🖍️", type: "emoji" }, max_lines: 2, text: "Shin-chan Vibe ✨", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:coding_night", source: "remote", caption: { background: { colors: ["#141E30", "#243B55"] }, icon: { data: "💻", type: "emoji" }, max_lines: 2, text: "Fix bug xuyên màn đêm", text_color: "#FFD700", type: "static_content" } },
            { overlay_id: "caption:no_bug_today", source: "remote", caption: { background: { colors: ["#11998E", "#38EF7D"] }, icon: { data: "🚀", type: "emoji" }, max_lines: 2, text: "Deploy phát ăn ngay!", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:coffee_overflow", source: "remote", caption: { background: { colors: ["#3E2723", "#795548"] }, icon: { data: "☕", type: "emoji" }, max_lines: 2, text: "Chạy bằng Cafein", text_color: "#FFE0B2", type: "static_content" } }
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
          section: "🎨 Decorative by Locket",
          items: [
            { overlay_id: "caption:toi_nho_em", source: "remote", caption: { background: { colors: ["#FFFFFF", "#6D9EEB"] }, max_lines: 1, text: "보고 싶어 🥺", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:party_time", source: "remote", caption: { background: { colors: ["#5EFFF5", "#FCFF57"] }, icon: { data: "🪩", type: "emoji" }, max_lines: 1, text: "Party Time!", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:good_morning", source: "remote", daily_start_hour: 5, daily_end_hour: 10, caption: { background: { colors: ["#EF7402", "#EABF0F"] }, icon: { data: "☀️", type: "emoji" }, max_lines: 1, text: "Good morning", text_color: "#FFFFFFE5", type: "static_content" } },
            { overlay_id: "caption:goodnight", source: "remote", daily_start_hour: 19.5, daily_end_hour: 24, caption: { background: { colors: ["#370C6F", "#575CD4"] }, icon: { data: "🌙", type: "emoji" }, max_lines: 1, text: "Goodnight", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:ootd", source: "remote", caption: { background: { colors: ["#FFFFFF", "#DBDBDB"] }, icon: { data: "🕶", type: "emoji" }, max_lines: 1, text: "OOTD", text_color: "#101010E6", type: "static_content" } },
            { overlay_id: "caption:miss_you", source: "remote", caption: { background: { colors: ["#EC0C00", "#FF493F"] }, icon: { data: "🥰", type: "emoji" }, max_lines: 1, text: "Miss you", text_color: "#FFFFFFDB", type: "static_content" } }
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
            { overlay_id: "caption:mixue_time", source: "remote", caption: { background: { colors: ["#FFF9C4", "#F8BBD0"] }, icon: { data: "🍦", type: "emoji" }, max_lines: 1, text: "Mixue Time!", localized_text: { en: "Mixue Time!", vn: "Giờ Mixue!" }, text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:locket_time", source: "remote", caption: { background: { colors: ["#ECEFF1", "#B3E5FC"] }, icon: { data: "📷", type: "emoji" }, max_lines: 1, text: "Locket Time!", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:cinema_time", source: "remote", caption: { background: { colors: ["#1A237E", "#455A64"] }, icon: { data: "🎬", type: "emoji" }, max_lines: 1, text: "Cinema Time!", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:dating_time", source: "remote", caption: { background: { colors: ["#E91E63", "#F44336"] }, icon: { data: "💕", type: "emoji" }, max_lines: 1, text: "Dating Time!", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:chilling_time", source: "remote", caption: { background: { colors: ["#E1BEE7", "#F8BBD0"] }, icon: { data: "🌴", type: "emoji" }, max_lines: 1, text: "Chilling Time!", localized_text: { en: "Chilling Time!", vn: "Giờ thư giãn!" }, text_color: "#FFFFFFE6", type: "static_content" } }
          ]
        },
        {
          section: "🌸 Độc lạ & Trend TikTok",
          items: [
            { overlay_id: "caption:xin_vinh_biet_cu", source: "remote", caption: { background: { colors: ["#232526", "#414345"] }, icon: { data: "🕯️", type: "emoji" }, max_lines: 1, text: "Xin vĩnh biệt cụ", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:chay_ngay_di", source: "remote", caption: { background: { colors: ["#D31027", "#EA384D"] }, icon: { data: "🏃💨", type: "emoji" }, max_lines: 1, text: "Chạy ngay đi", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:kiem_tra_nhan_pham", source: "remote", caption: { background: { colors: ["#654EA3", "#EAAFC8"] }, icon: { data: "🎲", type: "emoji" }, max_lines: 1, text: "Kiểm tra nhân phẩm", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:doc_so_tai_khoan", source: "remote", caption: { background: { colors: ["#1E90FF", "#00D4FF"] }, icon: { data: "💳", type: "emoji" }, max_lines: 1, text: "đọc số tài khoản", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:con_cai_nit", source: "remote", caption: { background: { colors: ["#D7CCC8", "#8D6E63"] }, icon: { data: "🧶", type: "emoji" }, max_lines: 1, text: "còn cái nịt", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:flex_den_hoi_tho_cuoi", source: "remote", caption: { background: { colors: ["#F7971E", "#FFD200"] }, icon: { data: "💎", type: "emoji" }, max_lines: 1, text: "Flex đến hơi thở cuối", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:overthinking_vai_chuong", source: "remote", caption: { background: { colors: ["#2C3E50", "#4CA1AF"] }, icon: { data: "🤯", type: "emoji" }, max_lines: 1, text: "Overthinking vai chưởng", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:oach_xa_lach", source: "remote", caption: { background: { colors: ["#11998E", "#38EF7D"] }, icon: { data: "🥬", type: "emoji" }, max_lines: 1, text: "oách xà lách", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:tuyet_doi_dien_anh", source: "remote", caption: { background: { colors: ["#455A64", "#263238"] }, icon: { data: "📷", type: "emoji" }, max_lines: 1, text: "Tuyệt đối điện ảnh", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:nay_la_het_cuu", source: "remote", caption: { background: { colors: ["#607D8B", "#455A64"] }, icon: { data: "❌", type: "emoji" }, max_lines: 1, text: "Này là hết cứu", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:tinh_hoa_hoi_tu", source: "remote", caption: { background: { colors: ["#FFD700", "#FF8C00"] }, icon: { data: "✨", type: "emoji" }, max_lines: 1, text: "Tinh hoa hội tụ", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:ngoan_xinh_yeu", source: "remote", caption: { background: { colors: ["#FFAFBD", "#FFC3A0"] }, icon: { data: "🌸", type: "emoji" }, max_lines: 1, text: "Ngoan xinh yêu của ai?", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:check_var", source: "remote", caption: { background: { colors: ["#11998E", "#38EF7D"] }, icon: { data: "📺", type: "emoji" }, max_lines: 1, text: "Check VAR liền", text_color: "#FFFFFFE6", type: "static_content" } }
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
        var group = catalog[n];
        var missing = [];
        for (var m = 0; m < group.items.length; m++) {
          var candidate = group.items[m];
          if (!seenIds[candidate.overlay_id]) {
            seenIds[candidate.overlay_id] = true;
            missing.push(candidate);
          }
        }
        if (!missing.length) continue;

        var pos = -1;
        for (var t = 0; t < mergedSections.length; t++) {
          if (mergedSections[t] && mergedSections[t].section === group.section && Array.isArray(mergedSections[t].items)) {
            pos = t;
            break;
          }
        }

        if (pos < 0) {
          mergedSections.push({ section: group.section, items: missing });
        } else {
          var copy = Object.assign({}, mergedSections[pos]);
          copy.items = mergedSections[pos].items.concat(missing);
          mergedSections[pos] = copy;
        }
      }

      entries.overlay_items = JSON.stringify(mergedSections);
    }

    var serialized = JSON.stringify(data);
    if (serialized.length < 520000) {
      result = { body: serialized };
    }
  } catch (error) {
    result = { body: rawBody };
  }

  $done(result);
})();
