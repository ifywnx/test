// ============================================================
// IFYWNX V15 - Video 30s / 0.9 Mbps
// Đưa thời lượng và bitrate video về mức V3; cần kiểm thử gửi/nhận trên thiết bị.
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
    if (typeof $request === "undefined" || !$request ||
        typeof $response === "undefined" || !$response || !$response.body) {
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

    // V3 compatibility experiment. Storage buckets remain server-controlled.
    Object.assign(entries, {
      live_photos: JSON.stringify({
            capture: true,
            viewing: true,
            catch_up: true,
            widget_looping_mode: "never"
        }),
      friend_limit_geo_override: JSON.stringify({ experiments: {}, area_code_overrides: {} }),
      friends_sheet_locket_count_config: JSON.stringify({
            items: [
                { threshold: 0, icon_name: "heart" },
                { threshold: 1, icon_name: "heart.fill" },
                { threshold: 10, emoji: "🤍" },
                { threshold: 100, emoji: "💛" },
                { threshold: 500, emoji: "❤️‍🔥" },
                { threshold: 1000, emoji: "🌟🫶🌟" },
                { threshold: 2000, emoji: "✨💟✨" },
                { threshold: 5000, emoji: "⚡️😵‍💫⚡" },
                { threshold: 10000, emoji: "✨⚡️😱⚡✨" }
            ]
        }),
      friend_locket_count_config: JSON.stringify({
            items: [
                { threshold: 0, icon_name: "heart" },
                { threshold: 1, icon_name: "heart.fill" },
                { threshold: 10, emoji: "🤍" },
                { threshold: 100, emoji: "💛" },
                { threshold: 500, emoji: "❤️‍🔥" },
                { threshold: 1000, emoji: "✨💗✨" },
                { threshold: 2000, emoji: "✨️⭐️✨" },
                { threshold: 5000, emoji: "✨💎✨" },
                { threshold: 10000, emoji: "✨🔐💛✨" }
            ]
        }),
      prompt_contact_permissions_on_search: "true",
      populate_phone_numbers_from_suggest_friends: "true",
      get_moment_views_as_cloud_function: "true",
      messages_integration: "true",
      fetch_moments_in_conversation: "true",
      hide_chat_button: "false",
      calendar_rewind_enabled: "false",
      locket_yearbook_story_sharing_encouraged: "true",
      rollcall_comment_actions: "true",
      rollcall_profile_button: "true",
      rollcall_prompt_export_after_share: "true",
      rollcall_confirm_skip_tagging: "false",
      rollcall_tap_to_tag_enabled: "false",
      widget_last_sent_indicator: "false",
      widget_sync_token_reload_mode: "clearTokenNever",
      live_activity_onboarding: "true",
      live_activity_onboarding_variant: "friending",
      register_live_activity_push_to_start_token: "true",
      live_activity_remove_stale_start_token: "true",
      notification_preferences_live_activities: "true",
      prompt_notification_permissions_after_friending: "true",
      qr_code_config: JSON.stringify({ profile_enabled: true, scanning_enabled: true }),
      profile_menu_v2_enabled: "true",
      use_doc_dir_for_image_cache: "true",
      efficient_history_cache_invalidation: "true",
      timestamp_based_history_fetches: "true",
      get_latest_moment_v2: "true",
      fetch_users_from_cloud_function: "true",
      keychain_access_retries: "true",
      blocked_users_cached_sync_enabled: "true",
      invite_link_preview_variant: "4",
      share_history_config: JSON.stringify({ prompt_enabled: false, fetching_enabled: true }),
      share_history_prompt_enabled: "false",
      use_thumbnails_for_sharing: "true",
      use_thumbnails_in_timeline: "true"
    });

    // Restore V3 self-only recipient option; verify recipients before sending.
    entries.send_to_self_only_mode = "always_enabled";

    // ============================================================
    // 1. GOLD + FEATURE GATES
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

    entries.paywall_presentation_config = JSON.stringify({
      uid: "paywall_testflight",
      onboarding: false,
      after_sent_moment: false,
      on_foreground: false,
      interval: 2592000,
      profile_banner: true
    });

    // ============================================================
    // 2. VIDEO 30s - CẤU HÌNH KIỂM THỬ
    // 30s + bitrate 0.9 Mbps; chưa xác nhận upload trên thiết bị.
    // KHÔNG fake max_file_size_mb / upload_timeout
    // KHÔNG tạo media_upload / video_config
    // ============================================================
    Object.assign(entries, {
      camera_roll_preview_enabled: "true",
      camera_roll_video_enabled: "true",
      camera_roll_video_upload_enabled: "true",
      internal_camera_roll_video_upload_enabled: "true",
      longer_camera_roll_videos_enabled: "true",
      camera_roll_video_max_duration: "30.0",
      camera_roll_max_duration: "30.0",
      camera_roll_duration: "30.0",
      max_video_duration: "30.0",
      video_max_duration: "30.0",
      video_trim_max_duration: "30.0",
      trim_max_duration: "30.0",
      gold_max_duration: "30.0",
      goldMaxDuration: "30.0",
      max_video_length_seconds: "30.0",
      video_quality_mbps: "0.9",
      video_sound_enabled: "true",
      microphone_enabled: "true",
      camera_microphone_enabled: "true",
      audio_session_deactivation_enabled: "true",
      zoom_enabled: "true",
      upload_main: "false",
      upload_main_image_quality: "1.0",
      upload_main_image_size: "1440",
      upload_thumbnail_image_quality: "1.0",
      upload_thumbnail_image_size: "1020"
    });

    entries.camera = safeMergeJSON(entries.camera, {
      gold_max_duration: 30.0, goldMaxDuration: 30.0,
      max_duration: 30.0, maxDuration: 30.0,
      ultra_wide: true, ultraWide: true,
      volume_button: true, volumeButton: true,
      flash_button: true, telephoto: true,
      srgb: true, lanczos: true,
      quality_mbps: 0.9, qualityMbps: 0.9
    });

    entries.camera_roll = safeMergeJSON(entries.camera_roll, {
      gold_max_duration: 30.0, goldMaxDuration: 30.0,
      video_max_duration: 30.0, videoMaxDuration: 30.0,
      max_duration: 30.0, maxDuration: 30.0,
      trim_max_duration: 30.0, trimMaxDuration: 30.0,
      camera_roll_max_duration: 30.0,
      quality_mbps: 0.9, qualityMbps: 0.9,
      flash_button: true
    });

    if (!entries.camera_filter_config || entries.camera_filter_config === "") {
      entries.camera_filter_config = JSON.stringify({
        allows_custom_filters: true, show_filter_button: true,
        sheet_enabled: true, open_sheet_immediately: true,
        sheet_filters: [
          { title: { en: "Goofy" }, filter_ids: ["okay_wig","influencer","looks_maxxing","toothless","bye_brows"] },
          { title: { en: "Looks" }, filter_ids: ["bowling_ball","blonde_bleached","beard","bob_cut","buns","tatted","mohawk","braces","bye_brows"] },
          { title: { en: "Celebrate" }, filter_ids: ["slimed","princess","disco_lights","cash_money","happy_birthday"] },
          { title: { en: "Cute" }, filter_ids: ["cutesy","sticker_face","flower_crown","love_bug"] },
          { title: { en: "Costumes" }, filter_ids: ["wedding","cowboy_cowgirl","giraffe","clown"] },
          { title: { en: "Holidays" }, filter_ids: ["easter_bunney_cutout","easter_chick_cutout","bearded","leprechaun","lucky_face","sweet_hearts","elf_cutout","santa_cutout","frosty"] }
        ],
        picker_filters: [
          "okay_wig","influencer","looks_maxxing","toothless","bye_brows",
          "bowling_ball","blonde_bleached","beard","bob_cut","buns","tatted","mohawk","braces",
          "slimed","princess","disco_lights","cash_money","happy_birthday",
          "cutesy","sticker_face","flower_crown","love_bug",
          "wedding","cowboy_cowgirl","giraffe","clown",
          "easter_bunney_cutout","easter_chick_cutout","bearded","leprechaun","lucky_face","sweet_hearts","elf_cutout","santa_cutout","frosty"
        ]
      });
    } else {
      entries.camera_filter_config = safeMergeJSON(entries.camera_filter_config, {
        show_filter_button: true, sheet_enabled: true
      });
    }

    // ============================================================
    // 3. WIDGET SHIN-CHAN + POPUP IFYWNX
    // ============================================================
    entries.widget_frame_event = JSON.stringify({
      uid: "shin_chan_custom_anh",
      url: "https://i.ibb.co/sdx3xg0D/A-nh-Chat-GPT-12-39-54-18-thg-10-2026.png",
      placement: "below", use_local_time_zone: true,
      start_at: "2020-01-01T00:00:00", end_at: "2099-12-31T23:59:59"
    });
    entries.android_widget_frame_event_enabled = "true";
    entries.widget_badge_enabled = "true";

    entries.feature_discovery_popup_config = JSON.stringify({
      tag: "LOCKET GOLD", tag_gradient: true, tag_style: "gold_gradient",
      title: "Lên Locket Gold rồi đó 😎",
      feature_set: [{
        title: "Chào mừng đến với ifywnx ✨",
        body: "Chúc bạn chia sẻ thật nhiều khoảnh khắc đẹp 💛",
        imageURL: "https://ifywnx-install.agilechub512.chatgpt.site/images/locket-welcome-ifywnx-v5.png"
      }],
      primary_button_title: "Xong",
      campaign: "ifywnx_welcome_v5",
      start_at: "2020-01-01T00:00:00", end_at: "2099-12-31T23:59:59",
      use_local_time_zone: true
    });

    // ============================================================
    // 4. ADS / TRACKING / SENTRY / APP CONFIG
    // ============================================================
    Object.assign(entries, {
      history_ads_mode: "off",
      history_ads_prefetch_count: "0",
      history_ads_prefetch_immediate: "false",
      history_ads_prefetch_reroute: "false",
      history_ads_dynamic_insertion: "false",
      history_ads_refresh_prefetch_on_foreground: "false",
      history_ads_floor_price: "0",
      history_ads_floor_price_att: "0",
      history_ad_log_displayed_on_background: "false",
      history_ads_debug_menu: "false",
      sentry_sample_rate: "0",
      sentry_network_tracing: "false",
      sentry_performance_tracking: "false",
      sentry_trace_sample_rate: "0",
      sentry_profiles_sample_rate: "0",
      enable_analytics: "false",
      crashlytics_enabled: "false",
      firebase_performance_enabled: "false",
      disable_telemetry: "true",
      show_watermark: "false",
      watermark_enabled: "false",
      profile_badge_visible: "true",
      custom_profile_pics: "true",
      android_subscribe_gold_button_enabled: "false",
      lunar_new_year_app_icon_enabled: "true",
      settings_tiktok_url: "https://tiktok.com/@ifywnx"
    });

    // ============================================================
    // 5. FRIENDS / MOMENTS / STREAK / CHAT
    // ============================================================
    Object.assign(entries, {
      max_friends_count: "999999",
      friend_limit_mode: "0",
      soft_friend_limit_threshold_count: "999999",
      show_friend_limit_on_cam: "false",
      signup_max_friends_count: "999999",
      celebrity_inbox_limit: "999999",
      new_friends_monitoring_enabled: "true",
      improved_friend_suggestions: "true",
      show_friend_suggestions_by_default: "true",
      emoji_friend_suggestions: "true",
      hide_friends_enabled: "true",
      hide_invite_links: "false",
      hide_skip_contacts: "true",
      show_all_contacts: "true",
      show_invite_suggestions: "true",
      show_no_friends_bottom_sheet: "false",
      signup_allow_skip_add_friends: "true",
      moment_views_enabled: "true",
      moment_views_v2: "true",
      record_moment_views: "true",
      notify_moment_views: "true",
      moment_reactions_v2: "true",
      chat_reactions_enabled: "true",
      conversation_reactions: "true",
      typing_indicators_enabled: "true",
      unsend_message_enabled: "true",
      reply_prototype_enabled: "true",
      conversations_enabled: "true",
      groups_enabled: "true",
      time_travel_rewind_v2_enabled: "true",
      calendar_delete_moment_enabled: "true",
      rollcall_enabled: "true"
    });

    try {
      var streak = JSON.parse(entries.streak_config || "{}");
      streak.minimum_recovery_count = 0;
      streak.minimum_display_count = 0;
      entries.streak_config = JSON.stringify(streak);
    } catch (e) {}

    // ============================================================
    // 6. CACHE / CDN / STORAGE / WIDGET CONFIG
    // ============================================================
    Object.assign(entries, {
      cdn_domain_replacements: JSON.stringify({
        "firebasestorage.googleapis.com": "cdn.locketcamera.com"
      }),
      cdn_domain_replacements_video: "true",
      image_cache_max_age_sec: "157680000",
      image_cache_max_size: "400000000",
      history_cache_age_days: "1000",
      user_cache_max_age_sec: "691200",
      friends_cache_max_age_sec: "2592000",
      image_fetch_cache: "true",
      image_cache_use_shared: "true",
      refresh_interval: "60",
      firestore_refresh_v2: "true",
      firestore_refresh_v3: "true",
      beta_features_enabled: "true",
      join_testflight_enabled: "true",
      safety_center: "true",
      help_center: "true",
      support_v2: "true",
      privacy_choices_setting: "true",
      request_att_permission: "true",
      persist_onboarding_step: "true",
      onboarding_contact_permission_step: "true",
      widget_frame_event_max_images: "5",
      widget_badge_v2: "true",
      widget_stale_state_enabled: "false",
      notification_preferences: "true",
      notification_reply_body_visible: "true",
      activity_bar_enabled: "true",
      journal_activity_bar_enabled: "true"
    });

    try {
      var journal = JSON.parse(entries.journal_settings || "{}");
      Object.assign(journal, {
        debug_menu_enabled: false,
        focus_animation: true,
        compact_header: true,
        friends_button: true,
        reverse_scroll_direction: false,
        streak_visualization: true,
        streak_visualization_style: "gradient",
        streak_header_minimum_count: 0,
        streak_visualization_minimum_count: 2,
        overlay_indicators: { location: true, music: true, static_content: true, weather: true }
      });
      entries.journal_settings = JSON.stringify(journal);
    } catch (e) {}

    // ============================================================
    // 7. OVERLAY & CAPTIONS (P1 - bắt đầu catalog)
    // ============================================================
    entries.overlay_navigator_enabled = "true";
    entries.overlays_v2_config = JSON.stringify({ suggestions_enabled: true });
    entries.captions_enabled = "true";
    entries.music_caption_enabled = "true";
    entries.music_caption_song_preview_enabled = "true";
    entries.link_caption_link_enabled = "true";
    entries.overlay_dynamic_captions = JSON.stringify([
      "standard", "poll", "color_palette", "review", "music", "location",
      "weather", "time", "streak", "star_sign", "party_time", "locket_count",
      "good_morning", "goodnight", "ootd", "miss_you", "custom", "phunu_2010", "halloween_2026"
    ]);

    var existing = [];
    if (typeof entries.overlay_items === "string") {
      try { existing = JSON.parse(entries.overlay_items) || []; } catch (err) {}
    } else if (Array.isArray(entries.overlay_items)) {
      existing = entries.overlay_items;
    }

    var seen = new Set();
    if (Array.isArray(existing)) {
      existing.forEach(function (grp) {
        if (grp && Array.isArray(grp.items)) {
          grp.items.forEach(function (it) {
            if (it && it.overlay_id) seen.add(it.overlay_id);
          });
        }
      });
    } else {
      existing = [];
    }

    var catalog = [
      { section: "🎨 General", items: [
        {"overlay_id":"caption:standard","source":"local","caption":{"type":"standard"}},
        {"overlay_id":"caption:review","source":"local","caption":{"type":"review"}},
        {"overlay_id":"caption:music","source":"local","caption":{"type":"music"}},
        {"overlay_id":"caption:location","source":"local","caption":{"type":"location"}},
        {"overlay_id":"caption:weather","source":"local","caption":{"type":"weather"}},
        {"overlay_id":"caption:time","source":"local","caption":{"type":"time"}},
        {"overlay_id":"caption:streak","source":"local","caption":{"type":"streak"}},
        {"overlay_id":"caption:star_sign","source":"local","caption":{"type":"star_sign"}},
        {"overlay_id":"caption:poll","source":"local","caption":{"type":"poll"}},
        {"overlay_id":"caption:color_palette","source":"local","caption":{"type":"color_palette"}},
        {"overlay_id":"caption:locket_count","source":"local","caption":{"type":"locket_count"}}
      ] },
      { section: "🎨 Decorative by ifywnx", items: [
        {"overlay_id":"caption:ifywnx","source":"remote","caption":{"background":{"colors":["#B8E7FF","#FFD6E7","#DCCBFF"]},"max_lines":1,"text":"💻 ifywnx","text_color":"#24324A","type":"static_content"}},
        {"overlay_id":"caption:feeling_cute","source":"remote","caption":{"background":{"colors":["#C7F0DB","#FFE0B5","#D6CCFF"]},"icon":{"data":"🌷","type":"emoji"},"max_lines":1,"text":"Feeling Cute","localized_text":{"en":"Feeling Cute","vn":"Cảm thấy dthw"},"text_color":"#31435C","type":"static_content"}},
        {"overlay_id":"caption:cu","source":"remote","caption":{"background":{"colors":["#F8D4E6","#C9E7FF","#FFF1B8"]},"max_lines":1,"text":"Cu 🐎","text_color":"#50304F","type":"static_content"}},
        {"overlay_id":"caption:wedding_time","source":"remote","caption":{"background":{"colors":["#D6F0FF","#EAD6FF","#FFE3C2"]},"icon":{"data":"💍","type":"emoji"},"max_lines":1,"text":"Wedding Time!","localized_text":{"en":"Wedding Time!","vn":"Đám cưới nè!"},"text_color":"#2F4060","type":"static_content"}},
        {"overlay_id":"caption:cam_thay_hanh_phuc","source":"remote","caption":{"background":{"colors":["#F9D8E5","#FFF0B2","#C7EED8"]},"icon":{"data":"💗","type":"emoji"},"max_lines":1,"text":"Cảm thấy hạnh phúc","localized_text":{"en":"Feeling Happy","vn":"Cảm thấy hạnh phúc"},"text_color":"#5A3457","type":"static_content"}},
        {"overlay_id":"caption:coffee_time","source":"remote","caption":{"background":{"colors":["#B8E7FF","#FFD6E7","#DCCBFF"]},"icon":{"data":"☕","type":"emoji"},"max_lines":1,"text":"Coffee Time!","localized_text":{"en":"Coffee Time!","vn":"Giờ uống cà phê!"},"text_color":"#24324A","type":"static_content"}},
        {"overlay_id":"caption:snake_vibes","source":"remote","caption":{"background":{"colors":["#C7F0DB","#FFE0B5","#D6CCFF"]},"icon":{"data":"🐍","type":"emoji"},"max_lines":1,"text":"Snake Vibes","localized_text":{"en":"Snake Vibes","vn":"Chất rắn"},"text_color":"#31435C","type":"static_content"}},
        {"overlay_id":"caption:mixue_time","source":"remote","caption":{"background":{"colors":["#F8D4E6","#C9E7FF","#FFF1B8"]},"icon":{"data":"🍦","type":"emoji"},"max_lines":1,"text":"Mixue Time!","localized_text":{"en":"Mixue Time!","vn":"Giờ Mixue!"},"text_color":"#50304F","type":"static_content"}},
        {"overlay_id":"caption:locket_time","source":"remote","caption":{"background":{"colors":["#D6F0FF","#EAD6FF","#FFE3C2"]},"icon":{"data":"📷","type":"emoji"},"max_lines":1,"text":"Locket Time!","text_color":"#2F4060","type":"static_content"}},
        {"overlay_id":"caption:cinema_time","source":"remote","caption":{"background":{"colors":["#F9D8E5","#FFF0B2","#C7EED8"]},"icon":{"data":"🎬","type":"emoji"},"max_lines":1,"text":"Cinema Time!","text_color":"#5A3457","type":"static_content"}},
        {"overlay_id":"caption:dating_time","source":"remote","caption":{"background":{"colors":["#B8E7FF","#FFD6E7","#DCCBFF"]},"icon":{"data":"💕","type":"emoji"},"max_lines":1,"text":"Dating Time!","text_color":"#24324A","type":"static_content"}},
        {"overlay_id":"caption:graduation_day","source":"remote","caption":{"background":{"colors":["#C7F0DB","#FFE0B5","#D6CCFF"]},"icon":{"data":"🎓","type":"emoji"},"max_lines":1,"text":"Happy Graduation Day!","localized_text":{"en":"Happy Graduation Day!","vn":"Chúc mừng tốt nghiệp!"},"text_color":"#31435C","type":"static_content"}},
        {"overlay_id":"caption:shopping_time","source":"remote","caption":{"background":{"colors":["#F8D4E6","#C9E7FF","#FFF1B8"]},"icon":{"data":"🛍️","type":"emoji"},"max_lines":1,"text":"Shopping Time!","localized_text":{"en":"Shopping Time!","vn":"Giờ mua sắm!"},"text_color":"#50304F","type":"static_content"}},
        {"overlay_id":"caption:dinner_time","source":"remote","caption":{"background":{"colors":["#D6F0FF","#EAD6FF","#FFE3C2"]},"icon":{"data":"🍽️","type":"emoji"},"max_lines":1,"text":"Dinner Time!","localized_text":{"en":"Dinner Time!","vn":"Giờ ăn tối!"},"text_color":"#2F4060","type":"static_content"}},
        {"overlay_id":"caption:chilling_time","source":"remote","caption":{"background":{"colors":["#F9D8E5","#FFF0B2","#C7EED8"]},"icon":{"data":"🌴","type":"emoji"},"max_lines":1,"text":"Chilling Time!","localized_text":{"en":"Chilling Time!","vn":"Giờ thư giãn!"},"text_color":"#5A3457","type":"static_content"}}
      ] },
      { section: "🔥 Hot Trend TikTok & Threads", items: [
        {"overlay_id":"caption:hoi_chieu_troi_mua","source":"remote","caption":{"background":{"colors":["#546E7A","#263238"]},"icon":{"data":"🌧️","type":"emoji"},"max_lines":1,"text":"Hồi chiều trời mưa...","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:du_an_ma","source":"remote","caption":{"background":{"colors":["#6DD5ED","#C471ED","#F7797D"]},"icon":{"data":"👻","type":"emoji"},"max_lines":1,"text":"Dự án ma","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:farm_aura","source":"remote","caption":{"background":{"colors":["#12C2E9","#C471ED","#F64F59"]},"icon":{"data":"✨","type":"emoji"},"max_lines":1,"text":"Farm aura","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:tru_1_000_diem_aura","source":"remote","caption":{"background":{"colors":["#43E97B","#38F9D7","#FFE082"]},"icon":{"data":"💀","type":"emoji"},"max_lines":1,"text":"Trừ 1.000 điểm aura","text_color":"#173B38","type":"static_content"}},
        {"overlay_id":"caption:ba_khi","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C779D0"]},"max_lines":1,"text":"Bá khí","text_color":"#4A2C1F","type":"static_content"}},
        {"overlay_id":"caption:cong_chua_phong_tro","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#FECFEF"]},"icon":{"data":"👑","type":"emoji"},"max_lines":1,"text":"Công chúa phòng trọ","text_color":"#204254","type":"static_content"}},
        {"overlay_id":"caption:hoang_tu_ky_tuc_xa","source":"remote","caption":{"background":{"colors":["#A18CD1","#FBC2EB","#FDE68A"]},"icon":{"data":"👑","type":"emoji"},"max_lines":1,"text":"Hoàng tử ký túc xá","text_color":"#3B2458","type":"static_content"}},
        {"overlay_id":"caption:ngheo_cho_sach_rach_cho_slay","source":"remote","caption":{"background":{"colors":["#6DD5ED","#C471ED","#F7797D"]},"max_lines":1,"text":"Nghèo cho sạch, rách cho slay","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:e_e_xa_ca_dung_ca_dinh","source":"remote","caption":{"background":{"colors":["#12C2E9","#C471ED","#F64F59"]},"max_lines":1,"text":"Ê ề xà cà đúng cà đinh","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:anh_thich_huong_thom","source":"remote","caption":{"background":{"colors":["#43E97B","#38F9D7","#FFE082"]},"max_lines":1,"text":"Anh thích hương thơm","text_color":"#173B38","type":"static_content"}},
        {"overlay_id":"caption:tuyet_doi_dien_anh","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C779D0"]},"icon":{"data":"🎬","type":"emoji"},"max_lines":1,"text":"Tuyệt đối điện ảnh","text_color":"#4A2C1F","type":"static_content"}},
        {"overlay_id":"caption:chua_du_wow","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#FECFEF"]},"max_lines":1,"text":"Chưa đủ wow","text_color":"#204254","type":"static_content"}},
        {"overlay_id":"caption:boc_trung_sit_rit","source":"remote","caption":{"background":{"colors":["#A18CD1","#FBC2EB","#FDE68A"]},"max_lines":1,"text":"Bóc trúng sít rịt","text_color":"#3B2458","type":"static_content"}},
        {"overlay_id":"caption:hen_lam_moi_xui_duoc_vay_a","source":"remote","caption":{"background":{"colors":["#6DD5ED","#C471ED","#F7797D"]},"max_lines":1,"text":"Hên lắm mới xui được vậy á","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:dung_xe_di","source":"remote","caption":{"background":{"colors":["#12C2E9","#C471ED","#F64F59"]},"icon":{"data":"🛑","type":"emoji"},"max_lines":1,"text":"Dừng xe đi!","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:canh_bao_co_hat","source":"remote","caption":{"background":{"colors":["#43E97B","#38F9D7","#FFE082"]},"icon":{"data":"🎤","type":"emoji"},"max_lines":1,"text":"Cảnh báo có hát","text_color":"#173B38","type":"static_content"}},
        {"overlay_id":"caption:doi_bo_bo_quan","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C779D0"]},"icon":{"data":"😎","type":"emoji"},"max_lines":1,"text":"Đời bố, bố quản","text_color":"#4A2C1F","type":"static_content"}},
        {"overlay_id":"caption:con_vien_la_lan","source":"remote","caption":{"background":{"colors":["#12C2E9","#C471ED","#F64F59"]},"icon":{"data":"🎡","type":"emoji"},"max_lines":1,"text":"Côn viên lá làn","text_color":"#FFFFFFE6","type":"static_content"}}
      ] },
      { section: "🤡 Meme vô tri & Độc lạ", items: [
        {"overlay_id":"caption:doc_so_tai_khoan","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"icon":{"data":"💳","type":"emoji"},"max_lines":1,"text":"Đọc số tài khoản","text_color":"#2A2850","type":"static_content"}},
        {"overlay_id":"caption:giam_suc_manh_con_tuong","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#A1C4FD"]},"icon":{"data":"🎮","type":"emoji"},"max_lines":1,"text":"Giảm sức mạnh con tướng","text_color":"#472B20","type":"static_content"}},
        {"overlay_id":"caption:mong_ton_hoa_sen_thay_canh_nay","source":"remote","caption":{"background":{"colors":["#84FAB0","#A6C0FE","#FFD3A5"]},"max_lines":1,"text":"Mong Tôn Hoa Sen thấy cảnh này","text_color":"#1E3F47","type":"static_content"}},
        {"overlay_id":"caption:hao_han","source":"remote","caption":{"background":{"colors":["#C2FFD8","#465EFB","#FDEB71"]},"icon":{"data":"⚔️","type":"emoji"},"max_lines":1,"text":"Hảo hán","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:tinh_queo","source":"remote","caption":{"background":{"colors":["#FFAFBD","#FFC3A0","#B5EAEA"]},"icon":{"data":"🫧","type":"emoji"},"max_lines":1,"text":"Tỉnh queo","text_color":"#5A2A38","type":"static_content"}},
        {"overlay_id":"caption:trung_sinh_luon","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"max_lines":1,"text":"Trùng sinh luôn","text_color":"#2A2850","type":"static_content"}},
        {"overlay_id":"caption:bao_qua_bao","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#A1C4FD"]},"max_lines":1,"text":"Báo quá báo","text_color":"#472B20","type":"static_content"}},
        {"overlay_id":"caption:cu_soc_ngang","source":"remote","caption":{"background":{"colors":["#84FAB0","#A6C0FE","#FFD3A5"]},"icon":{"data":"⚡","type":"emoji"},"max_lines":1,"text":"Cú sốc ngang","text_color":"#1E3F47","type":"static_content"}},
        {"overlay_id":"caption:xit_keo_cung_ngac","source":"remote","caption":{"background":{"colors":["#C2FFD8","#465EFB","#FDEB71"]},"icon":{"data":"🧊","type":"emoji"},"max_lines":1,"text":"Xịt keo cứng ngắc","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:kiep_nan_thu_82","source":"remote","caption":{"background":{"colors":["#FFAFBD","#FFC3A0","#B5EAEA"]},"icon":{"data":"🪷","type":"emoji"},"max_lines":1,"text":"Kiếp nạn thứ 82","text_color":"#5A2A38","type":"static_content"}},
        {"overlay_id":"caption:thua_gia_cat_luong_moi_cay_quat","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"max_lines":1,"text":"Thua Gia Cát Lượng mỗi cây quạt","text_color":"#2A2850","type":"static_content"}},
        {"overlay_id":"caption:chan_dong_dia_cau","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#A1C4FD"]},"icon":{"data":"🌎","type":"emoji"},"max_lines":1,"text":"Chấn động địa cầu","text_color":"#472B20","type":"static_content"}},
        {"overlay_id":"caption:da_cai_nu","source":"remote","caption":{"background":{"colors":["#84FAB0","#A6C0FE","#FFD3A5"]},"icon":{"data":"😌","type":"emoji"},"max_lines":1,"text":"Đã cái nư","text_color":"#1E3F47","type":"static_content"}},
        {"overlay_id":"caption:cuu_toi_cuu_toi","source":"remote","caption":{"background":{"colors":["#C2FFD8","#465EFB","#FDEB71"]},"max_lines":1,"text":"Cứu tôi cứu tôi","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:can_phuoc","source":"remote","caption":{"background":{"colors":["#FFAFBD","#FFC3A0","#B5EAEA"]},"icon":{"data":"🥲","type":"emoji"},"max_lines":1,"text":"Cạn phước","text_color":"#5A2A38","type":"static_content"}},
        {"overlay_id":"caption:1_may","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"max_lines":1,"text":"+1 máy","text_color":"#2A2850","type":"static_content"}}
      ] },
      { section: "😏 Cà khịa & Khó đỡ", items: [
        {"overlay_id":"caption:ai_muon","source":"remote","caption":{"background":{"colors":["#667EEA","#764BA2","#F6D365"]},"icon":{"data":"🤨","type":"emoji"},"max_lines":1,"text":"Ai mượn?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:hay_ra_de_qua_a","source":"remote","caption":{"background":{"colors":["#4E54C8","#8F94FB","#FBD786"]},"max_lines":1,"text":"Hay ra dẻ quá à!","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ai_so_thi_di_ve","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#F8B195"]},"max_lines":1,"text":"Ai sợ thì đi về","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:than_chua_ma_gion","source":"remote","caption":{"background":{"colors":["#434343","#6D83F2","#FCE38A"]},"max_lines":1,"text":"Thân chưa mà giỡn?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:mac_co_qua_hai_oi","source":"remote","caption":{"background":{"colors":["#536976","#292E49","#F6D365"]},"icon":{"data":"🫣","type":"emoji"},"max_lines":1,"text":"Mắc cỡ quá hai ơi","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:mo_hon_nhung_tam_hien","source":"remote","caption":{"background":{"colors":["#667EEA","#764BA2","#F6D365"]},"icon":{"data":"😇","type":"emoji"},"max_lines":1,"text":"Mỏ hỗn nhưng tâm hiền","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:che_manh","source":"remote","caption":{"background":{"colors":["#4E54C8","#8F94FB","#FBD786"]},"max_lines":1,"text":"Chê mạnh","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:du_ba_khi_chua","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#F8B195"]},"max_lines":1,"text":"Đủ bá khí chưa?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ra_duong_ne_moi_anh","source":"remote","caption":{"background":{"colors":["#434343","#6D83F2","#FCE38A"]},"max_lines":1,"text":"Ra đường nể mỗi anh","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:nhin_la_biet_uy_tin","source":"remote","caption":{"background":{"colors":["#536976","#292E49","#F6D365"]},"max_lines":1,"text":"Nhìn là biết uy tín","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:cai_net_danh_chet_cai_dep","source":"remote","caption":{"background":{"colors":["#667EEA","#764BA2","#F6D365"]},"max_lines":1,"text":"Cái nết đánh chết cái đẹp","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ua_ai_hoi","source":"remote","caption":{"background":{"colors":["#4E54C8","#8F94FB","#FBD786"]},"max_lines":1,"text":"Ủa ai hỏi?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:hai_huoc_tuong_minh_vo_duyen","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#F8B195"]},"max_lines":1,"text":"Hài hước tưởng mình vô duyên","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:chiu_roi_do","source":"remote","caption":{"background":{"colors":["#434343","#6D83F2","#FCE38A"]},"max_lines":1,"text":"Chịu rồi đó","text_color":"#FFFFFFE6","type":"static_content"}}
      ] },
      { section: "😱 Reaction & Cảm thán", items: [
        {"overlay_id":"caption:ua_alo","source":"remote","caption":{"background":{"colors":["#FF9A9E","#FAD0C4","#FBC2EB"]},"max_lines":1,"text":"Ủa alo?","text_color":"#6A2143","type":"static_content"}},
        {"overlay_id":"caption:cuoi_xiu","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#FF9AA2"]},"icon":{"data":"🤣","type":"emoji"},"max_lines":1,"text":"Cười xỉu","text_color":"#5B301C","type":"static_content"}},
        {"overlay_id":"caption:toi_roi_toi_roi","source":"remote","caption":{"background":{"colors":["#A1C4FD","#C2E9FB","#FEC8D8"]},"icon":{"data":"🏃","type":"emoji"},"max_lines":1,"text":"Tới rồi tới rồi","text_color":"#26466D","type":"static_content"}},
        {"overlay_id":"caption:oi_tieu_roi","source":"remote","caption":{"background":{"colors":["#FFC371","#FF5F6D","#C471ED"]},"max_lines":1,"text":"Ôi tiêu rồi","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:chay_qua","source":"remote","caption":{"background":{"colors":["#8FD3F4","#84FAB0","#FFF1A8"]},"icon":{"data":"🔥","type":"emoji"},"max_lines":1,"text":"Cháy quá","text_color":"#1D4A51","type":"static_content"}},
        {"overlay_id":"caption:qua_keo","source":"remote","caption":{"background":{"colors":["#FF9A9E","#FAD0C4","#FBC2EB"]},"icon":{"data":"💅","type":"emoji"},"max_lines":1,"text":"Quá keo","text_color":"#6A2143","type":"static_content"}},
        {"overlay_id":"caption:du_chua","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#FF9AA2"]},"max_lines":1,"text":"Dữ chưa?","text_color":"#5B301C","type":"static_content"}},
        {"overlay_id":"caption:ua_thiet_luon_a","source":"remote","caption":{"background":{"colors":["#A1C4FD","#C2E9FB","#FEC8D8"]},"max_lines":1,"text":"Ủa thiệt luôn á?","text_color":"#26466D","type":"static_content"}},
        {"overlay_id":"caption:het_cuu_that_roi","source":"remote","caption":{"background":{"colors":["#FFC371","#FF5F6D","#C471ED"]},"max_lines":1,"text":"Hết cứu thật rồi","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ngo_ngac_bat_ngua","source":"remote","caption":{"background":{"colors":["#8FD3F4","#84FAB0","#FFF1A8"]},"icon":{"data":"😵‍💫","type":"emoji"},"max_lines":1,"text":"Ngơ ngác bật ngửa","text_color":"#1D4A51","type":"static_content"}},
        {"overlay_id":"caption:toi_cong_chuyen","source":"remote","caption":{"background":{"colors":["#FF9A9E","#FAD0C4","#FBC2EB"]},"icon":{"data":"💥","type":"emoji"},"max_lines":1,"text":"Tới công chuyện","text_color":"#6A2143","type":"static_content"}},
        {"overlay_id":"caption:tat_mic_gium","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#FF9AA2"]},"icon":{"data":"🎙️","type":"emoji"},"max_lines":1,"text":"Tắt mic giùm","text_color":"#5B301C","type":"static_content"}}
      ] },
      { section: "💘 Tình cảm & Thả thính", items: [
        {"overlay_id":"caption:doi_roi","source":"remote","caption":{"background":{"colors":["#FDCBDF","#C2E9FB","#FEE2B3"]},"icon":{"data":"🥺","type":"emoji"},"max_lines":1,"text":"Dỗi rồi","text_color":"#6A2952","type":"static_content"}},
        {"overlay_id":"caption:dang_ban_tuong_tu","source":"remote","caption":{"background":{"colors":["#FAD0C4","#FFD1FF","#C4F1F9"]},"icon":{"data":"💭","type":"emoji"},"max_lines":1,"text":"Đang bận tương tư","text_color":"#6A3553","type":"static_content"}},
        {"overlay_id":"caption:muon_duoc_om","source":"remote","caption":{"background":{"colors":["#FFDEE9","#B5FFFC","#E2D1F9"]},"icon":{"data":"🫂","type":"emoji"},"max_lines":1,"text":"Muốn được ôm","text_color":"#5B2C5D","type":"static_content"}},
        {"overlay_id":"caption:mac_bay_tinh_yeu","source":"remote","caption":{"background":{"colors":["#FECFEF","#E0C3FC","#FFF6B7"]},"icon":{"data":"💘","type":"emoji"},"max_lines":1,"text":"Mắc bẫy tình yêu","text_color":"#5A315E","type":"static_content"}},
        {"overlay_id":"caption:ngoan_xinh_yeu_cua_ai","source":"remote","caption":{"background":{"colors":["#F9C5D1","#FEE1E8","#D0F4DE"]},"max_lines":1,"text":"Ngoan xinh yêu của ai?","text_color":"#6C2848","type":"static_content"}},
        {"overlay_id":"caption:dinh_nhu_sam","source":"remote","caption":{"background":{"colors":["#FDCBDF","#C2E9FB","#FEE2B3"]},"max_lines":1,"text":"Dính như sam","text_color":"#6A2952","type":"static_content"}},
        {"overlay_id":"caption:nho_ai_do","source":"remote","caption":{"background":{"colors":["#FAD0C4","#FFD1FF","#C4F1F9"]},"max_lines":1,"text":"Nhớ ai đó","text_color":"#6A3553","type":"static_content"}},
        {"overlay_id":"caption:hom_nay_can_mot_cai_om","source":"remote","caption":{"background":{"colors":["#FFDEE9","#B5FFFC","#E2D1F9"]},"max_lines":1,"text":"Hôm nay cần một cái ôm","text_color":"#5B2C5D","type":"static_content"}},
        {"overlay_id":"caption:thich_thi_noi_di","source":"remote","caption":{"background":{"colors":["#FECFEF","#E0C3FC","#FFF6B7"]},"icon":{"data":"💌","type":"emoji"},"max_lines":1,"text":"Thích thì nói đi","text_color":"#5A315E","type":"static_content"}},
        {"overlay_id":"caption:dang_o_che_do_yeu","source":"remote","caption":{"background":{"colors":["#F9C5D1","#FEE1E8","#D0F4DE"]},"max_lines":1,"text":"Đang ở chế độ yêu","text_color":"#6C2848","type":"static_content"}},
        {"overlay_id":"caption:tinh_yeu_nay_co_that_khong","source":"remote","caption":{"background":{"colors":["#FDCBDF","#C2E9FB","#FEE2B3"]},"max_lines":1,"text":"Tình yêu này có thật không?","text_color":"#6A2952","type":"static_content"}},
        {"overlay_id":"caption:com_nuoc_gi_chua_nguoi_dep","source":"remote","caption":{"background":{"colors":["#FAD0C4","#FFD1FF","#C4F1F9"]},"icon":{"data":"🍚","type":"emoji"},"max_lines":1,"text":"Cơm nước gì chưa người đẹp?","text_color":"#6A3553","type":"static_content"}},
        {"overlay_id":"caption:crush_seen_chua","source":"remote","caption":{"background":{"colors":["#FFDEE9","#B5FFFC","#E2D1F9"]},"icon":{"data":"👀","type":"emoji"},"max_lines":1,"text":"Crush seen chưa?","text_color":"#5B2C5D","type":"static_content"}},
        {"overlay_id":"caption:luy_nhe_thoi","source":"remote","caption":{"background":{"colors":["#FECFEF","#E0C3FC","#FFF6B7"]},"icon":{"data":"🥀","type":"emoji"},"max_lines":1,"text":"Lụy nhẹ thôi","text_color":"#5A315E","type":"static_content"}},
        {"overlay_id":"caption:thoi_nhe_khong_yeu_nua","source":"remote","caption":{"background":{"colors":["#F9C5D1","#FEE1E8","#D0F4DE"]},"max_lines":1,"text":"Thôi nhé, không yêu nữa","text_color":"#6C2848","type":"static_content"}}
      ] },
      { section: "👑 Gen Z Slay & Flex", items: [
        {"overlay_id":"caption:tinh_hoa_hoi_tu","source":"remote","caption":{"background":{"colors":["#FA709A","#FEE140","#7DE2FC"]},"max_lines":1,"text":"Tinh hoa hội tụ","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:flex_den_hoi_tho_cuoi","source":"remote","caption":{"background":{"colors":["#C471F5","#FA71CD","#FDCB6E"]},"max_lines":1,"text":"Flex đến hơi thở cuối","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:xinh_dep_tuyet_voi","source":"remote","caption":{"background":{"colors":["#A18CD1","#FBC2EB","#84FAB0"]},"icon":{"data":"✨","type":"emoji"},"max_lines":1,"text":"Xinh đẹp tuyệt vời","text_color":"#43215A","type":"static_content"}},
        {"overlay_id":"caption:xinh_gai_an_phim_1","source":"remote","caption":{"background":{"colors":["#12C2E9","#F64F59","#F9F871"]},"max_lines":1,"text":"Xinh gái ấn phím 1","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:phu_tinh_khong_phu_ban","source":"remote","caption":{"background":{"colors":["#FF758C","#FFB199","#A6FFCB"]},"max_lines":1,"text":"Phụ tình không phụ bản","text_color":"#6C2140","type":"static_content"}},
        {"overlay_id":"caption:slay","source":"remote","caption":{"background":{"colors":["#FA709A","#FEE140","#7DE2FC"]},"icon":{"data":"💅","type":"emoji"},"max_lines":1,"text":"Slay","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:no_cap","source":"remote","caption":{"background":{"colors":["#C471F5","#FA71CD","#FDCB6E"]},"icon":{"data":"🧢","type":"emoji"},"max_lines":1,"text":"No cap","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:chay_pho","source":"remote","caption":{"background":{"colors":["#A18CD1","#FBC2EB","#84FAB0"]},"icon":{"data":"🔥","type":"emoji"},"max_lines":1,"text":"Cháy phố","text_color":"#43215A","type":"static_content"}},
        {"overlay_id":"caption:dinh_noc_kich_tran","source":"remote","caption":{"background":{"colors":["#12C2E9","#F64F59","#F9F871"]},"max_lines":1,"text":"Đỉnh nóc kịch trần","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:than_thai_10_diem","source":"remote","caption":{"background":{"colors":["#FF758C","#FFB199","#A6FFCB"]},"max_lines":1,"text":"Thần thái 10 điểm","text_color":"#6C2140","type":"static_content"}},
        {"overlay_id":"caption:nhan_sac_tu_len_tieng","source":"remote","caption":{"background":{"colors":["#FA709A","#FEE140","#7DE2FC"]},"max_lines":1,"text":"Nhan sắc tự lên tiếng","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:dep_khong_can_giai_thich","source":"remote","caption":{"background":{"colors":["#C471F5","#FA71CD","#FDCB6E"]},"max_lines":1,"text":"Đẹp không cần giải thích","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:hao_quang_nhan_vat_chinh","source":"remote","caption":{"background":{"colors":["#A18CD1","#FBC2EB","#84FAB0"]},"icon":{"data":"🌟","type":"emoji"},"max_lines":1,"text":"Hào quang nhân vật chính","text_color":"#43215A","type":"static_content"}},
        {"overlay_id":"caption:keo_li_luon","source":"remote","caption":{"background":{"colors":["#12C2E9","#F64F59","#F9F871"]},"max_lines":1,"text":"Keo lì luôn","text_color":"#FFFFFFE6","type":"static_content"}}
      ] },
      { section: "🫠 Bất ổn & Mood", items: [
        {"overlay_id":"caption:overthinking_vai_chuong","source":"remote","caption":{"background":{"colors":["#89A7C2","#6E7F99","#4F6272"]},"icon":{"data":"🌀","type":"emoji"},"max_lines":1,"text":"Overthinking vai chưởng","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:hom_nay_toi_buon","source":"remote","caption":{"background":{"colors":["#8E9AAF","#CBC0D3","#EFD3D7"]},"icon":{"data":"🌧️","type":"emoji"},"max_lines":1,"text":"Hôm nay tôi buồn","text_color":"#2D3748","type":"static_content"}},
        {"overlay_id":"caption:cam_lanh","source":"remote","caption":{"background":{"colors":["#7F7FD5","#86A8E7","#91EAE4"]},"max_lines":1,"text":"Cảm lạnh","text_color":"#1F2E4C","type":"static_content"}},
        {"overlay_id":"caption:bat_luc","source":"remote","caption":{"background":{"colors":["#556270","#4ECDC4","#C7F464"]},"max_lines":1,"text":"Bất lực","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:rot_nuoc_mat","source":"remote","caption":{"background":{"colors":["#6C7A89","#95A5A6","#BDC3C7"]},"max_lines":1,"text":"Rớt nước mắt","text_color":"#1E2530","type":"static_content"}},
        {"overlay_id":"caption:guc_nga","source":"remote","caption":{"background":{"colors":["#89A7C2","#6E7F99","#4F6272"]},"max_lines":1,"text":"Gục ngã","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:tien_dinh","source":"remote","caption":{"background":{"colors":["#8E9AAF","#CBC0D3","#EFD3D7"]},"max_lines":1,"text":"Tiền đình","text_color":"#2D3748","type":"static_content"}},
        {"overlay_id":"caption:bat_on_that_su","source":"remote","caption":{"background":{"colors":["#7F7FD5","#86A8E7","#91EAE4"]},"max_lines":1,"text":"Bất ổn thật sự","text_color":"#1F2E4C","type":"static_content"}},
        {"overlay_id":"caption:khong_cam_xuc","source":"remote","caption":{"background":{"colors":["#556270","#4ECDC4","#C7F464"]},"max_lines":1,"text":"Không cảm xúc","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:suy_ngang","source":"remote","caption":{"background":{"colors":["#6C7A89","#95A5A6","#BDC3C7"]},"max_lines":1,"text":"Suy ngang","text_color":"#1E2530","type":"static_content"}},
        {"overlay_id":"caption:dang_healing","source":"remote","caption":{"background":{"colors":["#89A7C2","#6E7F99","#4F6272"]},"icon":{"data":"🍃","type":"emoji"},"max_lines":1,"text":"Đang healing","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:huong_noi_bat_thinh_linh","source":"remote","caption":{"background":{"colors":["#8E9AAF","#CBC0D3","#EFD3D7"]},"max_lines":1,"text":"Hướng nội bất thình lình","text_color":"#2D3748","type":"static_content"}},
        {"overlay_id":"caption:nao_dang_offline","source":"remote","caption":{"background":{"colors":["#7F7FD5","#86A8E7","#91EAE4"]},"icon":{"data":"🔋","type":"emoji"},"max_lines":1,"text":"Não đang offline","text_color":"#1F2E4C","type":"static_content"}},
        {"overlay_id":"caption:chill_mot_xiu","source":"remote","caption":{"background":{"colors":["#556270","#4ECDC4","#C7F464"]},"icon":{"data":"☁️","type":"emoji"},"max_lines":1,"text":"Chill một xíu","text_color":"#FFFFFFE6","type":"static_content"}}
      ] },
      { section: "👀 Check VAR & Hóng hớt", items: [
        {"overlay_id":"caption:check_var_lien","source":"remote","caption":{"background":{"colors":["#4FACFE","#00F2FE","#43E97B"]},"icon":{"data":"📹","type":"emoji"},"max_lines":1,"text":"Check VAR liền","text_color":"#133B4A","type":"static_content"}},
        {"overlay_id":"caption:co_bien_roi","source":"remote","caption":{"background":{"colors":["#43CEA2","#185A9D","#F9F871"]},"icon":{"data":"🚨","type":"emoji"},"max_lines":1,"text":"Có biến rồi","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:hong_tu_dau_den_cuoi","source":"remote","caption":{"background":{"colors":["#30CFD0","#330867","#FDE68A"]},"max_lines":1,"text":"Hóng từ đầu đến cuối","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:xin_mieng_context","source":"remote","caption":{"background":{"colors":["#A1FFCE","#FAFFD1","#A0C4FF"]},"icon":{"data":"👀","type":"emoji"},"max_lines":1,"text":"Xin miếng context","text_color":"#274257","type":"static_content"}},
        {"overlay_id":"caption:tin_chuan_chua","source":"remote","caption":{"background":{"colors":["#76E4F7","#6F86D6","#FEC8D8"]},"max_lines":1,"text":"Tin chuẩn chưa?","text_color":"#1A2D52","type":"static_content"}},
        {"overlay_id":"caption:de_tui_hong_voi","source":"remote","caption":{"background":{"colors":["#4FACFE","#00F2FE","#43E97B"]},"max_lines":1,"text":"Để tui hóng với","text_color":"#133B4A","type":"static_content"}},
        {"overlay_id":"caption:plot_twist_nua_ha","source":"remote","caption":{"background":{"colors":["#43CEA2","#185A9D","#F9F871"]},"icon":{"data":"🎭","type":"emoji"},"max_lines":1,"text":"Plot twist nữa hả?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ai_co_full_clip","source":"remote","caption":{"background":{"colors":["#30CFD0","#330867","#FDE68A"]},"icon":{"data":"🎞️","type":"emoji"},"max_lines":1,"text":"Ai có full clip?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ua_chuyen_gi_vay","source":"remote","caption":{"background":{"colors":["#A1FFCE","#FAFFD1","#A0C4FF"]},"max_lines":1,"text":"Ủa chuyện gì vậy?","text_color":"#274257","type":"static_content"}},
        {"overlay_id":"caption:hong_drama","source":"remote","caption":{"background":{"colors":["#76E4F7","#6F86D6","#FEC8D8"]},"icon":{"data":"🍿","type":"emoji"},"max_lines":1,"text":"Hóng drama","text_color":"#1A2D52","type":"static_content"}},
        {"overlay_id":"caption:doi_nguoi_trong_cuoc","source":"remote","caption":{"background":{"colors":["#4FACFE","#00F2FE","#43E97B"]},"max_lines":1,"text":"Đợi người trong cuộc","text_color":"#133B4A","type":"static_content"}},
        {"overlay_id":"caption:kiem_tra_nhan_pham","source":"remote","caption":{"background":{"colors":["#43CEA2","#185A9D","#F9F871"]},"max_lines":1,"text":"Kiểm tra nhân phẩm","text_color":"#FFFFFFE6","type":"static_content"}}
      ] },
      { section: "💻 Deadline, Học tập & Đi làm", items: [
        {"overlay_id":"caption:deadline_di_tut_quan","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#C06C84"]},"icon":{"data":"⏰","type":"emoji"},"max_lines":1,"text":"Deadline dí tụt quần","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:di_lam_vi_dam_me","source":"remote","caption":{"background":{"colors":["#5C5470","#8892B0","#FFD89B"]},"max_lines":1,"text":"Đi làm vì đam mê","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:can_nap_caffeine_gap","source":"remote","caption":{"background":{"colors":["#4B6CB7","#182848","#F7B267"]},"icon":{"data":"☕","type":"emoji"},"max_lines":1,"text":"Cần nạp caffeine gấp","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:tien_dau_ma_tieu","source":"remote","caption":{"background":{"colors":["#614385","#516395","#FCE38A"]},"max_lines":1,"text":"Tiền đâu mà tiêu","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:mai_nop_roi","source":"remote","caption":{"background":{"colors":["#3E5151","#DECBA4","#9BE15D"]},"icon":{"data":"🚨","type":"emoji"},"max_lines":1,"text":"Mai nộp rồi!","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:bai_tap_chua_lam","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#C06C84"]},"icon":{"data":"📚","type":"emoji"},"max_lines":1,"text":"Bài tập chưa làm","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:hoc_tai_thi_phan","source":"remote","caption":{"background":{"colors":["#5C5470","#8892B0","#FFD89B"]},"max_lines":1,"text":"Học tài thi phận","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ganh_team_bat_dac_di","source":"remote","caption":{"background":{"colors":["#4B6CB7","#182848","#F7B267"]},"max_lines":1,"text":"Gánh team bất đắc dĩ","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ran_kpi","source":"remote","caption":{"background":{"colors":["#614385","#516395","#FCE38A"]},"icon":{"data":"🐍","type":"emoji"},"max_lines":1,"text":"Rắn KPI","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:tran_om_viec","source":"remote","caption":{"background":{"colors":["#3E5151","#DECBA4","#9BE15D"]},"icon":{"data":"🐍","type":"emoji"},"max_lines":1,"text":"Trăn ôm việc","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:vua_mo_laptop_da_met","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#C06C84"]},"icon":{"data":"💻","type":"emoji"},"max_lines":1,"text":"Vừa mở laptop đã mệt","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:du_an_con_tren_giay","source":"remote","caption":{"background":{"colors":["#5C5470","#8892B0","#FFD89B"]},"max_lines":1,"text":"Dự án còn trên giấy","text_color":"#FFFFFFE6","type":"static_content"}}
      ] },
      { section: "☕ Đời sống & Ăn chơi", items: [
        {"overlay_id":"caption:hom_nay_phai_co_aura","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#FECFEF"]},"max_lines":1,"text":"Hôm nay phải có aura","text_color":"#5A321F","type":"static_content"}},
        {"overlay_id":"caption:ngu_ngon","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#FFF1A8"]},"icon":{"data":"🌙","type":"emoji"},"max_lines":1,"text":"Ngủ ngon","text_color":"#214650","type":"static_content"}},
        {"overlay_id":"caption:an_com_chua","source":"remote","caption":{"background":{"colors":["#FFD3A5","#FD6585","#A6C1EE"]},"icon":{"data":"🍚","type":"emoji"},"max_lines":1,"text":"Ăn cơm chưa?","text_color":"#5A2735","type":"static_content"}},
        {"overlay_id":"caption:di_choi_khong","source":"remote","caption":{"background":{"colors":["#FEC163","#DE4313","#F9D423"]},"icon":{"data":"🛵","type":"emoji"},"max_lines":1,"text":"Đi chơi không?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ke_chuyen_nghe_choi","source":"remote","caption":{"background":{"colors":["#A1C4FD","#C2E9FB","#FBE7C6"]},"max_lines":1,"text":"Kể chuyện nghe chơi","text_color":"#27456A","type":"static_content"}},
        {"overlay_id":"caption:di_an_thoi","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#FECFEF"]},"icon":{"data":"🍜","type":"emoji"},"max_lines":1,"text":"Đi ăn thôi","text_color":"#5A321F","type":"static_content"}},
        {"overlay_id":"caption:hom_nay_co_keo","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#FFF1A8"]},"max_lines":1,"text":"Hôm nay có kèo","text_color":"#214650","type":"static_content"}},
        {"overlay_id":"caption:doi_ngang","source":"remote","caption":{"background":{"colors":["#FFD3A5","#FD6585","#A6C1EE"]},"icon":{"data":"🍱","type":"emoji"},"max_lines":1,"text":"Đói ngang","text_color":"#5A2735","type":"static_content"}},
        {"overlay_id":"caption:tai_khoan_con_hoi_tho","source":"remote","caption":{"background":{"colors":["#FEC163","#DE4313","#F9D423"]},"max_lines":1,"text":"Tài khoản còn hơi thở","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:tra_sua_giai_cuu","source":"remote","caption":{"background":{"colors":["#A1C4FD","#C2E9FB","#FBE7C6"]},"icon":{"data":"🧋","type":"emoji"},"max_lines":1,"text":"Trà sữa giải cứu","text_color":"#27456A","type":"static_content"}},
        {"overlay_id":"caption:di_tron_mot_hom","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#FECFEF"]},"icon":{"data":"🏖️","type":"emoji"},"max_lines":1,"text":"Đi trốn một hôm","text_color":"#5A321F","type":"static_content"}},
        {"overlay_id":"caption:mot_ngay_binh_thuong","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#FFF1A8"]},"max_lines":1,"text":"Một ngày bình thường","text_color":"#214650","type":"static_content"}}
      ] },
      { section: "✨ ifywnx Exclusive", items: [
        {"overlay_id":"caption:mot_chiec_anh_co_aura","source":"remote","caption":{"background":{"colors":["#B993D6","#8CA6DB","#FEC8D8"]},"icon":{"data":"✨","type":"emoji"},"max_lines":1,"text":"Một chiếc ảnh có aura","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:locket_ghi_nhan_nhan_sac","source":"remote","caption":{"background":{"colors":["#C471ED","#F64F59","#FBD786"]},"icon":{"data":"📸","type":"emoji"},"max_lines":1,"text":"Locket ghi nhận nhan sắc","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:dep_ngang_mot_loi_xin_loi","source":"remote","caption":{"background":{"colors":["#74EBD5","#ACB6E5","#FEE1E8"]},"icon":{"data":"💗","type":"emoji"},"max_lines":1,"text":"Đẹp ngang một lời xin lỗi","text_color":"#1E3854","type":"static_content"}},
        {"overlay_id":"caption:mood_nay_khong_ban","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#B5FFFC"]},"max_lines":1,"text":"Mood này không bán","text_color":"#55311F","type":"static_content"}},
        {"overlay_id":"caption:mo_hon_nhung_co_gu","source":"remote","caption":{"background":{"colors":["#A18CD1","#84FAB0","#FBC2EB"]},"icon":{"data":"😎","type":"emoji"},"max_lines":1,"text":"Mỏ hỗn nhưng có gu","text_color":"#3B2658","type":"static_content"}},
        {"overlay_id":"caption:nhe_nhang_nhung_ba_khi","source":"remote","caption":{"background":{"colors":["#B993D6","#8CA6DB","#FEC8D8"]},"max_lines":1,"text":"Nhẹ nhàng nhưng bá khí","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:buc_anh_nay_hoi_keo","source":"remote","caption":{"background":{"colors":["#C471ED","#F64F59","#FBD786"]},"max_lines":1,"text":"Bức ảnh này hơi keo","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:hom_nay_minh_du_wow","source":"remote","caption":{"background":{"colors":["#74EBD5","#ACB6E5","#FEE1E8"]},"icon":{"data":"⭐","type":"emoji"},"max_lines":1,"text":"Hôm nay mình đủ wow","text_color":"#1E3854","type":"static_content"}},
        {"overlay_id":"caption:xin_phep_xinh_mot_chut","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#B5FFFC"]},"max_lines":1,"text":"Xin phép xinh một chút","text_color":"#55311F","type":"static_content"}},
        {"overlay_id":"caption:cu_soc_mang_ten_visual","source":"remote","caption":{"background":{"colors":["#A18CD1","#84FAB0","#FBC2EB"]},"max_lines":1,"text":"Cú sốc mang tên visual","text_color":"#3B2658","type":"static_content"}},
        {"overlay_id":"caption:khong_can_filter_van_chay","source":"remote","caption":{"background":{"colors":["#B993D6","#8CA6DB","#FEC8D8"]},"max_lines":1,"text":"Không cần filter vẫn cháy","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:luu_lai_chiec_mood_nay","source":"remote","caption":{"background":{"colors":["#C471ED","#F64F59","#FBD786"]},"max_lines":1,"text":"Lưu lại chiếc mood này","text_color":"#FFFFFFE6","type":"static_content"}}
      ] },
      { section: "🔥 Trend mở rộng · 1", items: [
        {"overlay_id":"caption:nhiem_vu_he_thong","source":"remote","caption":{"background":{"colors":["#6DD5ED","#C471ED","#F7797D"]},"icon":{"data":"🕹️","type":"emoji"},"max_lines":1,"text":"Nhiệm vụ hệ thống","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:di_lam_cong_ty_khong_em_xin_cho","source":"remote","caption":{"background":{"colors":["#12C2E9","#C471ED","#F64F59"]},"max_lines":1,"text":"Đi làm công ty không em xin cho?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:dich_cabin","source":"remote","caption":{"background":{"colors":["#43E97B","#38F9D7","#FFE082"]},"max_lines":1,"text":"Dịch cabin","text_color":"#173B38","type":"static_content"}},
        {"overlay_id":"caption:kha_niche","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C779D0"]},"max_lines":1,"text":"Khá niche","text_color":"#4A2C1F","type":"static_content"}},
        {"overlay_id":"caption:neu_ca_doi_khong_ruc_ro_thi_sao","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#FECFEF"]},"max_lines":1,"text":"Nếu cả đời không rực rỡ thì sao?","text_color":"#204254","type":"static_content"}},
        {"overlay_id":"caption:chiec_xe_rolls_royce_phantom_luot_di_nhu_mot_bong_ma","source":"remote","caption":{"background":{"colors":["#A18CD1","#FBC2EB","#FDE68A"]},"max_lines":1,"text":"Chiếc xe Rolls-Royce Phantom lướt đi như một bóng ma","text_color":"#3B2458","type":"static_content"}},
        {"overlay_id":"caption:moi_thu_hoa_dien_voi_chong_ngay_hom_nay","source":"remote","caption":{"background":{"colors":["#6DD5ED","#C471ED","#F7797D"]},"max_lines":1,"text":"Mọi thứ hóa điên với chồng ngày hôm nay","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:cai_quai_dan_gi_the","source":"remote","caption":{"background":{"colors":["#12C2E9","#C471ED","#F64F59"]},"max_lines":1,"text":"Cái quái đản gì thế?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:giam_suc_manh_con_tuong_nay_giup_em","source":"remote","caption":{"background":{"colors":["#43E97B","#38F9D7","#FFE082"]},"max_lines":1,"text":"Giảm sức mạnh con tướng này giúp em","text_color":"#173B38","type":"static_content"}},
        {"overlay_id":"caption:doc_so_tai_khoan_day","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C779D0"]},"max_lines":1,"text":"Đọc số tài khoản đây","text_color":"#4A2C1F","type":"static_content"}},
        {"overlay_id":"caption:vuyp","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#FECFEF"]},"max_lines":1,"text":"Vuýp","text_color":"#204254","type":"static_content"}},
        {"overlay_id":"caption:e_kho_nha_bro","source":"remote","caption":{"background":{"colors":["#A18CD1","#FBC2EB","#FDE68A"]},"max_lines":1,"text":"Ê khó nha bro","text_color":"#3B2458","type":"static_content"}},
        {"overlay_id":"caption:thuyet_hom_ba","source":"remote","caption":{"background":{"colors":["#6DD5ED","#C471ED","#F7797D"]},"max_lines":1,"text":"Thuyệt hơm bà?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:hen_lam_moi_xui_duoc_nhu_vay","source":"remote","caption":{"background":{"colors":["#12C2E9","#C471ED","#F64F59"]},"max_lines":1,"text":"Hên lắm mới xui được như vậy","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:luot_tiktok_hoai_vay","source":"remote","caption":{"background":{"colors":["#43E97B","#38F9D7","#FFE082"]},"max_lines":1,"text":"Lướt TikTok hoài vậy?","text_color":"#173B38","type":"static_content"}},
        {"overlay_id":"caption:sap_vuot_muc_pickleball","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C779D0"]},"max_lines":1,"text":"Sắp vượt mức pickleball","text_color":"#4A2C1F","type":"static_content"}},
        {"overlay_id":"caption:xin_loi_ba_nha_cai_mieng_tui_hoi_gian","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#FECFEF"]},"max_lines":1,"text":"Xin lỗi bà nha, cái miệng tui hơi giãn","text_color":"#204254","type":"static_content"}}
      ] },
      { section: "🔥 Trend mở rộng · 2", items: [
        {"overlay_id":"caption:im_lang_di_gopi","source":"remote","caption":{"background":{"colors":["#6DD5ED","#C471ED","#F7797D"]},"max_lines":1,"text":"Im lặng đi Gopi","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:cap_long_may_skinship","source":"remote","caption":{"background":{"colors":["#12C2E9","#C471ED","#F64F59"]},"max_lines":1,"text":"Cặp lông mày skinship","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:nghe_bai_trinh_chua","source":"remote","caption":{"background":{"colors":["#43E97B","#38F9D7","#FFE082"]},"max_lines":1,"text":"Nghe bài Trình chưa?","text_color":"#173B38","type":"static_content"}},
        {"overlay_id":"caption:o_ngay_trung_tam_quan_1","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C779D0"]},"max_lines":1,"text":"Ở ngay trung tâm quận 1","text_color":"#4A2C1F","type":"static_content"}},
        {"overlay_id":"caption:vo_chua_khong_biet_lay_ai","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#FECFEF"]},"max_lines":1,"text":"Vô chùa không biết lạy ai","text_color":"#204254","type":"static_content"}},
        {"overlay_id":"caption:hon_ca_khu_tu_tri","source":"remote","caption":{"background":{"colors":["#A18CD1","#FBC2EB","#FDE68A"]},"max_lines":1,"text":"Hơn cả khu tự trị","text_color":"#3B2458","type":"static_content"}},
        {"overlay_id":"caption:flex_chi_la_vo_tinh","source":"remote","caption":{"background":{"colors":["#6DD5ED","#C471ED","#F7797D"]},"max_lines":1,"text":"Flex chỉ là vô tình","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:thua_doi_1_0","source":"remote","caption":{"background":{"colors":["#12C2E9","#C471ED","#F64F59"]},"max_lines":1,"text":"Thua đời 1-0","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:thang_doi_1_0","source":"remote","caption":{"background":{"colors":["#43E97B","#38F9D7","#FFE082"]},"max_lines":1,"text":"Thắng đời 1-0","text_color":"#173B38","type":"static_content"}},
        {"overlay_id":"caption:ten_ten_mat_mat","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C779D0"]},"max_lines":1,"text":"Tẻn tẻn, mát mát","text_color":"#4A2C1F","type":"static_content"}},
        {"overlay_id":"caption:cau_be_do_tin_tuong_chau_qua_ha","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#FECFEF"]},"max_lines":1,"text":"Cậu bé đó tin tưởng cháu quá ha","text_color":"#204254","type":"static_content"}},
        {"overlay_id":"caption:mua_thu_ha_noi","source":"remote","caption":{"background":{"colors":["#A18CD1","#FBC2EB","#FDE68A"]},"max_lines":1,"text":"Mùa thu Hà Nội","text_color":"#3B2458","type":"static_content"}},
        {"overlay_id":"caption:dinh_chieu_2_dieu_thuyen","source":"remote","caption":{"background":{"colors":["#6DD5ED","#C471ED","#F7797D"]},"max_lines":1,"text":"Dính chiêu 2 Điêu Thuyền","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:fen_oi","source":"remote","caption":{"background":{"colors":["#12C2E9","#C471ED","#F64F59"]},"max_lines":1,"text":"Fen ơi","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:the_he_cot_nha","source":"remote","caption":{"background":{"colors":["#43E97B","#38F9D7","#FFE082"]},"max_lines":1,"text":"Thế hệ cợt nhả","text_color":"#173B38","type":"static_content"}},
        {"overlay_id":"caption:dai_dai_di","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C779D0"]},"max_lines":1,"text":"Đại đại đi","text_color":"#4A2C1F","type":"static_content"}},
        {"overlay_id":"caption:e_nha","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#FECFEF"]},"max_lines":1,"text":"Ê nha","text_color":"#204254","type":"static_content"}}
      ] },
      { section: "😏 Cà khịa mở rộng · 1", items: [
        {"overlay_id":"caption:bot_ao_tuong_di_ma","source":"remote","caption":{"background":{"colors":["#667EEA","#764BA2","#F6D365"]},"max_lines":1,"text":"Bớt ảo tưởng đi má","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:chua_bao_gio_may_hoi_tao_co_muon_hay_khong","source":"remote","caption":{"background":{"colors":["#4E54C8","#8F94FB","#FBD786"]},"max_lines":1,"text":"Chưa bao giờ mày hỏi tao có muốn hay không","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:tat_mic_no_gium_em","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#F8B195"]},"max_lines":1,"text":"Tắt mic nó giùm em","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:khong_khi_tren_do_co_loang_khong","source":"remote","caption":{"background":{"colors":["#434343","#6D83F2","#FCE38A"]},"max_lines":1,"text":"Không khí trên đó có loãng không?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:xin_moi_doan_minh_di_chuyen_len_nui","source":"remote","caption":{"background":{"colors":["#536976","#292E49","#F6D365"]},"max_lines":1,"text":"Xin mời đoàn mình di chuyển lên núi","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:chuyen_qua_thuoc_nam_coi_thu_do_khong","source":"remote","caption":{"background":{"colors":["#667EEA","#764BA2","#F6D365"]},"max_lines":1,"text":"Chuyển qua thuốc nam coi thử đỡ không","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:may_la_nhat_nhat_may_roi","source":"remote","caption":{"background":{"colors":["#4E54C8","#8F94FB","#FBD786"]},"max_lines":1,"text":"Mày là nhất, nhất mày rồi","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ai_roi_cung_khac","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#F8B195"]},"max_lines":1,"text":"Ai rồi cũng khác","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:chuyen_gi_dang_xay_ra_vay","source":"remote","caption":{"background":{"colors":["#434343","#6D83F2","#FCE38A"]},"max_lines":1,"text":"Chuyện gì đang xảy ra vậy?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:co_ai_ep_dau_ma_lam","source":"remote","caption":{"background":{"colors":["#536976","#292E49","#F6D365"]},"max_lines":1,"text":"Có ai ép đâu mà làm?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:khong_ai_hoi_nhung_van_ke","source":"remote","caption":{"background":{"colors":["#667EEA","#764BA2","#F6D365"]},"max_lines":1,"text":"Không ai hỏi nhưng vẫn kể","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:khong_ai_hoi_nhung_toi_van_tra_loi","source":"remote","caption":{"background":{"colors":["#4E54C8","#8F94FB","#FBD786"]},"max_lines":1,"text":"Không ai hỏi nhưng tôi vẫn trả lời","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:mac_gi_coc","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#F8B195"]},"max_lines":1,"text":"Mắc gì cọc?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:choc_thoi_ma_cang","source":"remote","caption":{"background":{"colors":["#434343","#6D83F2","#FCE38A"]},"max_lines":1,"text":"Chọc thôi mà căng","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:e_cai_nay_hoi_qua_roi_nha","source":"remote","caption":{"background":{"colors":["#536976","#292E49","#F6D365"]},"max_lines":1,"text":"Ê cái này hơi quá rồi nha","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:mac_gi_mac_cuoi","source":"remote","caption":{"background":{"colors":["#667EEA","#764BA2","#F6D365"]},"max_lines":1,"text":"Mắc gì mắc cười?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:sao_khong_ai_can_no_lai","source":"remote","caption":{"background":{"colors":["#4E54C8","#8F94FB","#FBD786"]},"max_lines":1,"text":"Sao không ai cản nó lại?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:sao_khong_ai_noi_toi_biet_chuyen_nay","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#F8B195"]},"max_lines":1,"text":"Sao không ai nói tôi biết chuyện này?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:cai_nay_chac_do_huong_noi","source":"remote","caption":{"background":{"colors":["#434343","#6D83F2","#FCE38A"]},"max_lines":1,"text":"Cái này chắc do hướng nội","text_color":"#FFFFFFE6","type":"static_content"}}
      ] },
      { section: "😏 Cà khịa mở rộng · 2", items: [
        {"overlay_id":"caption:tuong_the_nao","source":"remote","caption":{"background":{"colors":["#667EEA","#764BA2","#F6D365"]},"max_lines":1,"text":"Tưởng thế nào","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:chua_du_tuoi_de_hieu","source":"remote","caption":{"background":{"colors":["#4E54C8","#8F94FB","#FBD786"]},"max_lines":1,"text":"Chưa đủ tuổi để hiểu","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:co_vay_cung_khoe","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#F8B195"]},"max_lines":1,"text":"Có vậy cũng khoe","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:roi_mac_gi_ke","source":"remote","caption":{"background":{"colors":["#434343","#6D83F2","#FCE38A"]},"max_lines":1,"text":"Rồi mắc gì kể?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:bot_dien_gium","source":"remote","caption":{"background":{"colors":["#536976","#292E49","#F6D365"]},"max_lines":1,"text":"Bớt diễn giùm","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:hay_qua_ha_hay_du_ha","source":"remote","caption":{"background":{"colors":["#667EEA","#764BA2","#F6D365"]},"max_lines":1,"text":"Hay quá ha, hay dữ ha","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:roi_ai_chiu_noi","source":"remote","caption":{"background":{"colors":["#4E54C8","#8F94FB","#FBD786"]},"max_lines":1,"text":"Rồi ai chịu nổi?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:cung_ra_gi_day_chu","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#F8B195"]},"max_lines":1,"text":"Cũng ra gì đấy chứ","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:nghe_co_ve_uy_tin","source":"remote","caption":{"background":{"colors":["#434343","#6D83F2","#FCE38A"]},"max_lines":1,"text":"Nghe có vẻ uy tín","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:uy_tin_nhu_loi_don","source":"remote","caption":{"background":{"colors":["#536976","#292E49","#F6D365"]},"max_lines":1,"text":"Uy tín như lời đồn","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:bang_mot_cach_than_ky_nao_do","source":"remote","caption":{"background":{"colors":["#667EEA","#764BA2","#F6D365"]},"max_lines":1,"text":"Bằng một cách thần kỳ nào đó","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:mac_cai_gi_ma_hay_du_vay","source":"remote","caption":{"background":{"colors":["#4E54C8","#8F94FB","#FBD786"]},"max_lines":1,"text":"Mắc cái gì mà hay dữ vậy?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:goi_xong_luon","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#F8B195"]},"max_lines":1,"text":"Gòi xong luôn","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:noi_vay_ma_nghe_duoc_ha","source":"remote","caption":{"background":{"colors":["#434343","#6D83F2","#FCE38A"]},"max_lines":1,"text":"Nói vậy mà nghe được hả?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:tuong_minh_hai_huoc","source":"remote","caption":{"background":{"colors":["#536976","#292E49","#F6D365"]},"max_lines":1,"text":"Tưởng mình hài hước","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:noi_chuyen_co_duyen_ghe","source":"remote","caption":{"background":{"colors":["#667EEA","#764BA2","#F6D365"]},"max_lines":1,"text":"Nói chuyện có duyên ghê","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:duyen_am_hay_gi","source":"remote","caption":{"background":{"colors":["#4E54C8","#8F94FB","#FBD786"]},"max_lines":1,"text":"Duyên âm hay gì?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ai_cuu_noi_ca_nay","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#F8B195"]},"max_lines":1,"text":"Ai cứu nổi ca này?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:co_can_thiet_phai_vay_khong","source":"remote","caption":{"background":{"colors":["#434343","#6D83F2","#FCE38A"]},"max_lines":1,"text":"Có cần thiết phải vậy không?","text_color":"#FFFFFFE6","type":"static_content"}}
      ] },
      { section: "🤡 Meme kinh điển · 1", items: [
        {"overlay_id":"caption:nay_thang_chong_cai_quai_dan_gi_the","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"max_lines":1,"text":"Này thằng chồng, cái quái đản gì thế?","text_color":"#2A2850","type":"static_content"}},
        {"overlay_id":"caption:huy_st5k","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#A1C4FD"]},"max_lines":1,"text":"HUY ST5K","text_color":"#472B20","type":"static_content"}},
        {"overlay_id":"caption:do_mo_ho","source":"remote","caption":{"background":{"colors":["#84FAB0","#A6C0FE","#FFD3A5"]},"max_lines":1,"text":"Đờ Mờ Hờ","text_color":"#1E3F47","type":"static_content"}},
        {"overlay_id":"caption:trinh_ai_cham","source":"remote","caption":{"background":{"colors":["#C2FFD8","#465EFB","#FDEB71"]},"max_lines":1,"text":"Trình ai chấm?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:cot","source":"remote","caption":{"background":{"colors":["#FFAFBD","#FFC3A0","#B5EAEA"]},"max_lines":1,"text":"Cốt","text_color":"#5A2A38","type":"static_content"}},
        {"overlay_id":"caption:ai_hoai","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"max_lines":1,"text":"Ai hoải?","text_color":"#2A2850","type":"static_content"}},
        {"overlay_id":"caption:tui_tuong_ai_cung_co_chu_tar","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#A1C4FD"]},"max_lines":1,"text":"Tui tưởng ai cũng có chứ tar","text_color":"#472B20","type":"static_content"}},
        {"overlay_id":"caption:chan_di","source":"remote","caption":{"background":{"colors":["#84FAB0","#A6C0FE","#FFD3A5"]},"max_lines":1,"text":"Chan đi","text_color":"#1E3F47","type":"static_content"}},
        {"overlay_id":"caption:len_phim","source":"remote","caption":{"background":{"colors":["#C2FFD8","#465EFB","#FDEB71"]},"max_lines":1,"text":"Lên phím","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:nua_doi_sau_len_nui_o","source":"remote","caption":{"background":{"colors":["#FFAFBD","#FFC3A0","#B5EAEA"]},"max_lines":1,"text":"Nửa đời sau lên núi ở","text_color":"#5A2A38","type":"static_content"}},
        {"overlay_id":"caption:tren_nui_het_cho_roi_moi_doan_minh_xuong_bien","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"max_lines":1,"text":"Trên núi hết chỗ rồi, mời đoàn mình xuống biển","text_color":"#2A2850","type":"static_content"}},
        {"overlay_id":"caption:ra_duong_em_ne_moi_anh","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#A1C4FD"]},"max_lines":1,"text":"Ra đường em nể mỗi anh","text_color":"#472B20","type":"static_content"}},
        {"overlay_id":"caption:ca_the_vuot_troi","source":"remote","caption":{"background":{"colors":["#84FAB0","#A6C0FE","#FFD3A5"]},"max_lines":1,"text":"Cá thể vượt trội","text_color":"#1E3F47","type":"static_content"}},
        {"overlay_id":"caption:oi_gi_the","source":"remote","caption":{"background":{"colors":["#C2FFD8","#465EFB","#FDEB71"]},"max_lines":1,"text":"Oi gì thé?","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:da_con_ten_mai_con_mat_xa","source":"remote","caption":{"background":{"colors":["#FFAFBD","#FFC3A0","#B5EAEA"]},"max_lines":1,"text":"Dạ con tên Mai, con mát-xa","text_color":"#5A2A38","type":"static_content"}},
        {"overlay_id":"caption:nay_chi_lam_khach_em_ngo_gi_chi_do_mai","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"max_lines":1,"text":"Nãy chị làm khách em ngó gì chị đó Mai?","text_color":"#2A2850","type":"static_content"}}
      ] },
      { section: "🤡 Meme kinh điển · 2", items: [
        {"overlay_id":"caption:dang_an_gung","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"max_lines":1,"text":"Đang ăn gừng","text_color":"#2A2850","type":"static_content"}},
        {"overlay_id":"caption:you_only_live_once_thi_moi_phai_can_than","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#A1C4FD"]},"max_lines":1,"text":"You only live once thì mới phải cẩn thận","text_color":"#472B20","type":"static_content"}},
        {"overlay_id":"caption:khe_lam","source":"remote","caption":{"background":{"colors":["#84FAB0","#A6C0FE","#FFD3A5"]},"max_lines":1,"text":"Khê lắm","text_color":"#1E3F47","type":"static_content"}},
        {"overlay_id":"caption:flop_qua_thi_ghi_ten_anh_vao","source":"remote","caption":{"background":{"colors":["#C2FFD8","#465EFB","#FDEB71"]},"max_lines":1,"text":"Flop quá thì ghi tên anh vào","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:oi_thoi_chet","source":"remote","caption":{"background":{"colors":["#FFAFBD","#FFC3A0","#B5EAEA"]},"max_lines":1,"text":"Oi thoi chet","text_color":"#5A2A38","type":"static_content"}},
        {"overlay_id":"caption:phai_gi_phai_gi_phai_chiu","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"max_lines":1,"text":"Phải gì, phải gì… phải chịu","text_color":"#2A2850","type":"static_content"}},
        {"overlay_id":"caption:cac_con_vo","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#A1C4FD"]},"max_lines":1,"text":"Các con vợ","text_color":"#472B20","type":"static_content"}},
        {"overlay_id":"caption:ngai_het_ca_meo","source":"remote","caption":{"background":{"colors":["#84FAB0","#A6C0FE","#FFD3A5"]},"max_lines":1,"text":"Ngại hết cả mèo","text_color":"#1E3F47","type":"static_content"}},
        {"overlay_id":"caption:choi_cha_choi_cha","source":"remote","caption":{"background":{"colors":["#C2FFD8","#465EFB","#FDEB71"]},"max_lines":1,"text":"Chổi chà chổi chà","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:du_wow_roi_do","source":"remote","caption":{"background":{"colors":["#FFAFBD","#FFC3A0","#B5EAEA"]},"max_lines":1,"text":"Đủ wow rồi đó","text_color":"#5A2A38","type":"static_content"}},
        {"overlay_id":"caption:gio_tao_dua_may_4_ty_may_bien_khong","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"max_lines":1,"text":"Giờ tao đưa mày 4 tỷ, mày biến không?","text_color":"#2A2850","type":"static_content"}},
        {"overlay_id":"caption:minh_xin_phep_an_mieng_to_nhe","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#A1C4FD"]},"max_lines":1,"text":"Mình xin phép ăn miếng to nhé","text_color":"#472B20","type":"static_content"}},
        {"overlay_id":"caption:em_trai_thich_gi_nhan_chi","source":"remote","caption":{"background":{"colors":["#84FAB0","#A6C0FE","#FFD3A5"]},"max_lines":1,"text":"Em trai thích gì nhắn chị","text_color":"#1E3F47","type":"static_content"}},
        {"overlay_id":"caption:vua_chua_ngay_xua_cung_chi_den_the_la_cung","source":"remote","caption":{"background":{"colors":["#C2FFD8","#465EFB","#FDEB71"]},"max_lines":1,"text":"Vua chúa ngày xưa cũng chỉ đến thế là cùng","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:nung_niu_dam_le","source":"remote","caption":{"background":{"colors":["#FFAFBD","#FFC3A0","#B5EAEA"]},"max_lines":1,"text":"Nũng nịu, đẫm lệ","text_color":"#5A2A38","type":"static_content"}},
        {"overlay_id":"caption:toi_la_nan_nhan_cua","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"max_lines":1,"text":"Tôi là nạn nhân của…","text_color":"#2A2850","type":"static_content"}}
      ] },
      { section: "🤡 Meme kinh điển · 3", items: [
        {"overlay_id":"caption:day_moi_la_chan_chan_tao_chi_la_phuong_tien_di_chuyen","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"max_lines":1,"text":"Đây mới là chân, chân tao chỉ là phương tiện di chuyển","text_color":"#2A2850","type":"static_content"}},
        {"overlay_id":"caption:mong_ton_hoa_sen_thay_va_lam_ngo","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#A1C4FD"]},"max_lines":1,"text":"Mong Tôn Hoa Sen thấy và làm ngơ","text_color":"#472B20","type":"static_content"}},
        {"overlay_id":"caption:kho_nhat_the_gioi","source":"remote","caption":{"background":{"colors":["#84FAB0","#A6C0FE","#FFD3A5"]},"max_lines":1,"text":"Khổ nhất thế giới","text_color":"#1E3F47","type":"static_content"}},
        {"overlay_id":"caption:chao_sep_a","source":"remote","caption":{"background":{"colors":["#C2FFD8","#465EFB","#FDEB71"]},"icon":{"data":"💼","type":"emoji"},"max_lines":1,"text":"Chào sếp ạ","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:day_la_trach_nhiem_cua_em","source":"remote","caption":{"background":{"colors":["#FFAFBD","#FFC3A0","#B5EAEA"]},"max_lines":1,"text":"Đây là trách nhiệm của em","text_color":"#5A2A38","type":"static_content"}},
        {"overlay_id":"caption:cam_on_sep","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"icon":{"data":"🙏","type":"emoji"},"max_lines":1,"text":"Cảm ơn sếp","text_color":"#2A2850","type":"static_content"}},
        {"overlay_id":"caption:ua_tui_tuong_ai_cung_biet_chu_tar","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#A1C4FD"]},"max_lines":1,"text":"Ủa tui tưởng ai cũng biết chữ tar","text_color":"#472B20","type":"static_content"}},
        {"overlay_id":"caption:be_ba","source":"remote","caption":{"background":{"colors":["#84FAB0","#A6C0FE","#FFD3A5"]},"max_lines":1,"text":"Bé ba","text_color":"#1E3F47","type":"static_content"}},
        {"overlay_id":"caption:lop_truong","source":"remote","caption":{"background":{"colors":["#C2FFD8","#465EFB","#FDEB71"]},"max_lines":1,"text":"Lốp trưởng","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:pressing","source":"remote","caption":{"background":{"colors":["#FFAFBD","#FFC3A0","#B5EAEA"]},"max_lines":1,"text":"Pressing","text_color":"#5A2A38","type":"static_content"}},
        {"overlay_id":"caption:pressing_nguoc","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"max_lines":1,"text":"Pressing ngược","text_color":"#2A2850","type":"static_content"}},
        {"overlay_id":"caption:ai_roi_cung_phai_pressing_thoi","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#A1C4FD"]},"max_lines":1,"text":"Ai rồi cũng phải pressing thôi","text_color":"#472B20","type":"static_content"}},
        {"overlay_id":"caption:co_qua_thanh_qua_co","source":"remote","caption":{"background":{"colors":["#84FAB0","#A6C0FE","#FFD3A5"]},"max_lines":1,"text":"Cố quá thành quá cố","text_color":"#1E3F47","type":"static_content"}},
        {"overlay_id":"caption:nguoi_choi_he","source":"remote","caption":{"background":{"colors":["#C2FFD8","#465EFB","#FDEB71"]},"max_lines":1,"text":"Người chơi hệ…","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:dinh_noc_cua_dinh_noc","source":"remote","caption":{"background":{"colors":["#FFAFBD","#FFC3A0","#B5EAEA"]},"max_lines":1,"text":"Đỉnh nóc của đỉnh nóc","text_color":"#5A2A38","type":"static_content"}},
        {"overlay_id":"caption:a_a_bat_duoc_roi_nha","source":"remote","caption":{"background":{"colors":["#8EC5FC","#E0C3FC","#F9F586"]},"max_lines":1,"text":"Á à, bắt được rồi nha","text_color":"#2A2850","type":"static_content"}},
        {"overlay_id":"caption:da_the_con","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#A1C4FD"]},"max_lines":1,"text":"Đã thế còn…","text_color":"#472B20","type":"static_content"}}
      ] },
      { section: "💬 Comment dạo · 1", items: [
        {"overlay_id":"caption:tui_cuoi_tui_chet","source":"remote","caption":{"background":{"colors":["#A1C4FD","#C2E9FB","#FEC8D8"]},"max_lines":1,"text":"Tui cười tui chết","text_color":"#27466C","type":"static_content"}},
        {"overlay_id":"caption:di_cung_duoc_nua_ha","source":"remote","caption":{"background":{"colors":["#FBC2EB","#A6C1EE","#FFF1A8"]},"max_lines":1,"text":"Dị cũng được nữa hả?","text_color":"#4B2B57","type":"static_content"}},
        {"overlay_id":"caption:ua_roi_sao_nua","source":"remote","caption":{"background":{"colors":["#FF9A9E","#FAD0C4","#A1C4FD"]},"max_lines":1,"text":"Ủa rồi sao nữa?","text_color":"#5B2F2A","type":"static_content"}},
        {"overlay_id":"caption:roi_sao_ma","source":"remote","caption":{"background":{"colors":["#D4FC79","#96E6A1","#8FD3F4"]},"max_lines":1,"text":"Rồi sao má?","text_color":"#27463E","type":"static_content"}},
        {"overlay_id":"caption:roi_la_vui_du_chua","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#B5EAEA"]},"max_lines":1,"text":"Rồi là vui dữ chưa?","text_color":"#214452","type":"static_content"}},
        {"overlay_id":"caption:co_ai_giong_tui_khong","source":"remote","caption":{"background":{"colors":["#A1C4FD","#C2E9FB","#FEC8D8"]},"max_lines":1,"text":"Có ai giống tui không?","text_color":"#27466C","type":"static_content"}},
        {"overlay_id":"caption:noi_nghe_cung_hop_ly","source":"remote","caption":{"background":{"colors":["#FBC2EB","#A6C1EE","#FFF1A8"]},"max_lines":1,"text":"Nói nghe cũng hợp lý","text_color":"#4B2B57","type":"static_content"}},
        {"overlay_id":"caption:nhung_ma_no_la_lam","source":"remote","caption":{"background":{"colors":["#FF9A9E","#FAD0C4","#A1C4FD"]},"max_lines":1,"text":"Nhưng mà nó lạ lắm","text_color":"#5B2F2A","type":"static_content"}},
        {"overlay_id":"caption:sao_giong_cuoc_doi_toi_vay","source":"remote","caption":{"background":{"colors":["#D4FC79","#96E6A1","#8FD3F4"]},"max_lines":1,"text":"Sao giống cuộc đời tôi vậy?","text_color":"#27463E","type":"static_content"}},
        {"overlay_id":"caption:ua_mac_gi_dung","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#B5EAEA"]},"max_lines":1,"text":"Ủa mắc gì đúng?","text_color":"#214452","type":"static_content"}},
        {"overlay_id":"caption:ba_on_khong_ba","source":"remote","caption":{"background":{"colors":["#A1C4FD","#C2E9FB","#FEC8D8"]},"max_lines":1,"text":"Bà ổn không bà?","text_color":"#27466C","type":"static_content"}},
        {"overlay_id":"caption:roi_ai_cung_phai_lon","source":"remote","caption":{"background":{"colors":["#FBC2EB","#A6C1EE","#FFF1A8"]},"max_lines":1,"text":"Rồi ai cũng phải lớn","text_color":"#4B2B57","type":"static_content"}},
        {"overlay_id":"caption:toi_day_la_het_cuu","source":"remote","caption":{"background":{"colors":["#FF9A9E","#FAD0C4","#A1C4FD"]},"max_lines":1,"text":"Tới đây là hết cứu","text_color":"#5B2F2A","type":"static_content"}},
        {"overlay_id":"caption:khong_con_gi_de_mat","source":"remote","caption":{"background":{"colors":["#D4FC79","#96E6A1","#8FD3F4"]},"max_lines":1,"text":"Không còn gì để mất","text_color":"#27463E","type":"static_content"}},
        {"overlay_id":"caption:het_noi_noi","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#B5EAEA"]},"max_lines":1,"text":"Hết nói nổi","text_color":"#214452","type":"static_content"}},
        {"overlay_id":"caption:coi_ma_tuc_a","source":"remote","caption":{"background":{"colors":["#A1C4FD","#C2E9FB","#FEC8D8"]},"max_lines":1,"text":"Coi mà tức á","text_color":"#27466C","type":"static_content"}},
        {"overlay_id":"caption:troi_dat_quy_than_oi","source":"remote","caption":{"background":{"colors":["#FBC2EB","#A6C1EE","#FFF1A8"]},"max_lines":1,"text":"Trời đất quỷ thần ơi","text_color":"#4B2B57","type":"static_content"}},
        {"overlay_id":"caption:het_nuoc_cham","source":"remote","caption":{"background":{"colors":["#FF9A9E","#FAD0C4","#A1C4FD"]},"max_lines":1,"text":"Hết nước chấm","text_color":"#5B2F2A","type":"static_content"}},
        {"overlay_id":"caption:dinh_cua_chop_cua_chop","source":"remote","caption":{"background":{"colors":["#D4FC79","#96E6A1","#8FD3F4"]},"max_lines":1,"text":"Đỉnh của chóp của chóp","text_color":"#27463E","type":"static_content"}},
        {"overlay_id":"caption:qua_troi_qua_dat","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#B5EAEA"]},"max_lines":1,"text":"Quá trời quá đất","text_color":"#214452","type":"static_content"}}
      ] },
      { section: "💬 Comment dạo · 2", items: [
        {"overlay_id":"caption:cuoi_xiu_ngang","source":"remote","caption":{"background":{"colors":["#A1C4FD","#C2E9FB","#FEC8D8"]},"max_lines":1,"text":"Cười xỉu ngang","text_color":"#27466C","type":"static_content"}},
        {"overlay_id":"caption:cuoi_khong_nhat_duoc_mom","source":"remote","caption":{"background":{"colors":["#FBC2EB","#A6C1EE","#FFF1A8"]},"max_lines":1,"text":"Cười không nhặt được mồm","text_color":"#4B2B57","type":"static_content"}},
        {"overlay_id":"caption:nghe_ma_muon_doi_quan","source":"remote","caption":{"background":{"colors":["#FF9A9E","#FAD0C4","#A1C4FD"]},"max_lines":1,"text":"Nghe mà muốn đội quần","text_color":"#5B2F2A","type":"static_content"}},
        {"overlay_id":"caption:xin_mot_ve_ve_tuoi_tho","source":"remote","caption":{"background":{"colors":["#D4FC79","#96E6A1","#8FD3F4"]},"max_lines":1,"text":"Xin một vé về tuổi thơ","text_color":"#27463E","type":"static_content"}},
        {"overlay_id":"caption:dung_la_doi","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#B5EAEA"]},"max_lines":1,"text":"Đúng là đời","text_color":"#214452","type":"static_content"}},
        {"overlay_id":"caption:dung_la_cai_net","source":"remote","caption":{"background":{"colors":["#A1C4FD","#C2E9FB","#FEC8D8"]},"max_lines":1,"text":"Đúng là cái nết","text_color":"#27466C","type":"static_content"}},
        {"overlay_id":"caption:khong_biet_noi_gi_luon","source":"remote","caption":{"background":{"colors":["#FBC2EB","#A6C1EE","#FFF1A8"]},"max_lines":1,"text":"Không biết nói gì luôn","text_color":"#4B2B57","type":"static_content"}},
        {"overlay_id":"caption:troi_oi_tin_duoc_khong","source":"remote","caption":{"background":{"colors":["#FF9A9E","#FAD0C4","#A1C4FD"]},"max_lines":1,"text":"Trời ơi tin được không?","text_color":"#5B2F2A","type":"static_content"}},
        {"overlay_id":"caption:vay_ma_cung_nghi_ra_duoc","source":"remote","caption":{"background":{"colors":["#D4FC79","#96E6A1","#8FD3F4"]},"max_lines":1,"text":"Vậy mà cũng nghĩ ra được","text_color":"#27463E","type":"static_content"}},
        {"overlay_id":"caption:tri_tuong_tuong_phong_phu_ghe","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#B5EAEA"]},"max_lines":1,"text":"Trí tưởng tượng phong phú ghê","text_color":"#214452","type":"static_content"}},
        {"overlay_id":"caption:mac_cuoi_muon_xiu","source":"remote","caption":{"background":{"colors":["#A1C4FD","#C2E9FB","#FEC8D8"]},"max_lines":1,"text":"Mắc cười muốn xỉu","text_color":"#27466C","type":"static_content"}},
        {"overlay_id":"caption:e_hoi_bi_duoc","source":"remote","caption":{"background":{"colors":["#FBC2EB","#A6C1EE","#FFF1A8"]},"max_lines":1,"text":"Ê hơi bị được","text_color":"#4B2B57","type":"static_content"}},
        {"overlay_id":"caption:xin_xo_con_bo","source":"remote","caption":{"background":{"colors":["#FF9A9E","#FAD0C4","#A1C4FD"]},"max_lines":1,"text":"Xịn xò con bò","text_color":"#5B2F2A","type":"static_content"}},
        {"overlay_id":"caption:chay_het_minh","source":"remote","caption":{"background":{"colors":["#D4FC79","#96E6A1","#8FD3F4"]},"max_lines":1,"text":"Cháy hết mình","text_color":"#27463E","type":"static_content"}},
        {"overlay_id":"caption:toi_ben_luon","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#B5EAEA"]},"max_lines":1,"text":"Tới bến luôn","text_color":"#214452","type":"static_content"}},
        {"overlay_id":"caption:dinh_cao_nhan_loai","source":"remote","caption":{"background":{"colors":["#A1C4FD","#C2E9FB","#FEC8D8"]},"max_lines":1,"text":"Đỉnh cao nhân loại","text_color":"#27466C","type":"static_content"}},
        {"overlay_id":"caption:khong_phai_dang_vua_dau","source":"remote","caption":{"background":{"colors":["#FBC2EB","#A6C1EE","#FFF1A8"]},"max_lines":1,"text":"Không phải dạng vừa đâu","text_color":"#4B2B57","type":"static_content"}},
        {"overlay_id":"caption:soc_van_hoa","source":"remote","caption":{"background":{"colors":["#FF9A9E","#FAD0C4","#A1C4FD"]},"max_lines":1,"text":"Sốc văn hóa","text_color":"#5B2F2A","type":"static_content"}},
        {"overlay_id":"caption:thay_ghe_chua","source":"remote","caption":{"background":{"colors":["#D4FC79","#96E6A1","#8FD3F4"]},"max_lines":1,"text":"Thấy ghê chưa","text_color":"#27463E","type":"static_content"}},
        {"overlay_id":"caption:chua_thay_ai_nhu_vay_luon","source":"remote","caption":{"background":{"colors":["#84FAB0","#8FD3F4","#B5EAEA"]},"max_lines":1,"text":"Chưa thấy ai như vậy luôn","text_color":"#214452","type":"static_content"}}
      ] },
      { section: "🧠 Vô tri & Brainrot · 1", items: [
        {"overlay_id":"caption:hat_dua_trong_banh_trung_thu_la_do_ai_can","source":"remote","caption":{"background":{"colors":["#00C9FF","#92FE9D","#F9F871"]},"icon":{"data":"🥮","type":"emoji"},"max_lines":1,"text":"Hạt dưa trong bánh trung thu là do ai cắn?","text_color":"#12414A","type":"static_content"}},
        {"overlay_id":"caption:training_season_s_over","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C471ED"]},"max_lines":1,"text":"Training season's over","text_color":"#542F1E","type":"static_content"}},
        {"overlay_id":"caption:toi_thay_ban_dep_neu_nhu","source":"remote","caption":{"background":{"colors":["#5EE7DF","#B490CA","#FEC8D8"]},"max_lines":1,"text":"Tôi thấy bạn đẹp nếu như…","text_color":"#2B2C5A","type":"static_content"}},
        {"overlay_id":"caption:gap_lai_minh_10_nam_truoc","source":"remote","caption":{"background":{"colors":["#FC5C7D","#6A82FB","#F9F871"]},"max_lines":1,"text":"Gặp lại mình 10 năm trước","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:he_thong_giao_nhiem_vu","source":"remote","caption":{"background":{"colors":["#43E97B","#38F9D7","#A6C0FE"]},"icon":{"data":"🕹️","type":"emoji"},"max_lines":1,"text":"Hệ thống giao nhiệm vụ","text_color":"#1B4446","type":"static_content"}},
        {"overlay_id":"caption:chuc_mung_hoan_thanh_nhiem_vu","source":"remote","caption":{"background":{"colors":["#00C9FF","#92FE9D","#F9F871"]},"max_lines":1,"text":"Chúc mừng, hoàn thành nhiệm vụ","text_color":"#12414A","type":"static_content"}},
        {"overlay_id":"caption:6_7_six_seven","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C471ED"]},"icon":{"data":"🤷","type":"emoji"},"max_lines":1,"text":"6-7 (Six Seven)","text_color":"#542F1E","type":"static_content"}},
        {"overlay_id":"caption:tru_diem_nhan_pham","source":"remote","caption":{"background":{"colors":["#5EE7DF","#B490CA","#FEC8D8"]},"icon":{"data":"🎲","type":"emoji"},"max_lines":1,"text":"Trừ điểm nhân phẩm","text_color":"#2B2C5A","type":"static_content"}},
        {"overlay_id":"caption:ao_ma_canada","source":"remote","caption":{"background":{"colors":["#FC5C7D","#6A82FB","#F9F871"]},"icon":{"data":"👻","type":"emoji"},"max_lines":1,"text":"Ảo ma Canada","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ao_that_day","source":"remote","caption":{"background":{"colors":["#43E97B","#38F9D7","#A6C0FE"]},"max_lines":1,"text":"Ảo thật đấy","text_color":"#1B4446","type":"static_content"}},
        {"overlay_id":"caption:mlem_mlem","source":"remote","caption":{"background":{"colors":["#00C9FF","#92FE9D","#F9F871"]},"max_lines":1,"text":"Mlem mlem","text_color":"#12414A","type":"static_content"}},
        {"overlay_id":"caption:lemon","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C471ED"]},"max_lines":1,"text":"Lemỏn","text_color":"#542F1E","type":"static_content"}}
      ] },
      { section: "🧠 Vô tri & Brainrot · 2", items: [
        {"overlay_id":"caption:khum","source":"remote","caption":{"background":{"colors":["#00C9FF","#92FE9D","#F9F871"]},"icon":{"data":"🙅","type":"emoji"},"max_lines":1,"text":"Khum","text_color":"#12414A","type":"static_content"}},
        {"overlay_id":"caption:co_cai_nit","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C471ED"]},"icon":{"data":"🩳","type":"emoji"},"max_lines":1,"text":"Có cái nịt","text_color":"#542F1E","type":"static_content"}},
        {"overlay_id":"caption:con_cai_nit","source":"remote","caption":{"background":{"colors":["#5EE7DF","#B490CA","#FEC8D8"]},"icon":{"data":"🩳","type":"emoji"},"max_lines":1,"text":"Còn cái nịt","text_color":"#2B2C5A","type":"static_content"}},
        {"overlay_id":"caption:get_go","source":"remote","caption":{"background":{"colors":["#FC5C7D","#6A82FB","#F9F871"]},"max_lines":1,"text":"Gét gô","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:cham_zn","source":"remote","caption":{"background":{"colors":["#43E97B","#38F9D7","#A6C0FE"]},"max_lines":1,"text":"Chầm zn","text_color":"#1B4446","type":"static_content"}},
        {"overlay_id":"caption:mai_man","source":"remote","caption":{"background":{"colors":["#00C9FF","#92FE9D","#F9F871"]},"max_lines":1,"text":"Mãi mận","text_color":"#12414A","type":"static_content"}},
        {"overlay_id":"caption:chan_be_du","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C471ED"]},"max_lines":1,"text":"Chấn bé đù","text_color":"#542F1E","type":"static_content"}},
        {"overlay_id":"caption:di_vao_long_dat","source":"remote","caption":{"background":{"colors":["#5EE7DF","#B490CA","#FEC8D8"]},"icon":{"data":"🕳️","type":"emoji"},"max_lines":1,"text":"Đi vào lòng đất","text_color":"#2B2C5A","type":"static_content"}},
        {"overlay_id":"caption:toang_roi_ong_giao_a","source":"remote","caption":{"background":{"colors":["#FC5C7D","#6A82FB","#F9F871"]},"max_lines":1,"text":"Toang rồi ông giáo ạ","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:o_de","source":"remote","caption":{"background":{"colors":["#43E97B","#38F9D7","#A6C0FE"]},"max_lines":1,"text":"Ô dề","text_color":"#1B4446","type":"static_content"}},
        {"overlay_id":"caption:bat_ngua","source":"remote","caption":{"background":{"colors":["#00C9FF","#92FE9D","#F9F871"]},"max_lines":1,"text":"Bật ngửa","text_color":"#12414A","type":"static_content"}},
        {"overlay_id":"caption:xiu_up_xiu_down","source":"remote","caption":{"background":{"colors":["#F6D365","#FDA085","#C471ED"]},"max_lines":1,"text":"Xỉu up xỉu down","text_color":"#542F1E","type":"static_content"}},
        {"overlay_id":"caption:he_chua","source":"remote","caption":{"background":{"colors":["#5EE7DF","#B490CA","#FEC8D8"]},"max_lines":1,"text":"Hề chúa","text_color":"#2B2C5A","type":"static_content"}}
      ] },
      { section: "💘 Tình cảm mở rộng · 1", items: [
        {"overlay_id":"caption:tren_tinh_ban_duoi_tinh_yeu","source":"remote","caption":{"background":{"colors":["#FDCBDF","#C2E9FB","#FEE2B3"]},"max_lines":1,"text":"Trên tình bạn dưới tình yêu","text_color":"#6A2952","type":"static_content"}},
        {"overlay_id":"caption:map_mo","source":"remote","caption":{"background":{"colors":["#FAD0C4","#FFD1FF","#C4F1F9"]},"icon":{"data":"🫧","type":"emoji"},"max_lines":1,"text":"Mập mờ","text_color":"#6A3553","type":"static_content"}},
        {"overlay_id":"caption:tren_muc_ban_be","source":"remote","caption":{"background":{"colors":["#FFDEE9","#B5FFFC","#E2D1F9"]},"max_lines":1,"text":"Trên mức bạn bè","text_color":"#5B2C5D","type":"static_content"}},
        {"overlay_id":"caption:ban_than_khac_gioi","source":"remote","caption":{"background":{"colors":["#FECFEF","#E0C3FC","#FFF6B7"]},"icon":{"data":"🤝","type":"emoji"},"max_lines":1,"text":"Bạn thân khác giới","text_color":"#5A315E","type":"static_content"}},
        {"overlay_id":"caption:moi_quan_he_khong_ten","source":"remote","caption":{"background":{"colors":["#F9C5D1","#FEE1E8","#D0F4DE"]},"max_lines":1,"text":"Mối quan hệ không tên","text_color":"#6C2848","type":"static_content"}},
        {"overlay_id":"caption:friendzone","source":"remote","caption":{"background":{"colors":["#FDCBDF","#C2E9FB","#FEE2B3"]},"max_lines":1,"text":"Friendzone","text_color":"#6A2952","type":"static_content"}},
        {"overlay_id":"caption:talking_stage","source":"remote","caption":{"background":{"colors":["#FAD0C4","#FFD1FF","#C4F1F9"]},"max_lines":1,"text":"Talking stage","text_color":"#6A3553","type":"static_content"}},
        {"overlay_id":"caption:soft_launch","source":"remote","caption":{"background":{"colors":["#FFDEE9","#B5FFFC","#E2D1F9"]},"max_lines":1,"text":"Soft launch","text_color":"#5B2C5D","type":"static_content"}},
        {"overlay_id":"caption:hard_launch","source":"remote","caption":{"background":{"colors":["#FECFEF","#E0C3FC","#FFF6B7"]},"max_lines":1,"text":"Hard launch","text_color":"#5A315E","type":"static_content"}},
        {"overlay_id":"caption:public_relationship","source":"remote","caption":{"background":{"colors":["#F9C5D1","#FEE1E8","#D0F4DE"]},"max_lines":1,"text":"Public relationship","text_color":"#6C2848","type":"static_content"}},
        {"overlay_id":"caption:private_but_not_secret","source":"remote","caption":{"background":{"colors":["#FDCBDF","#C2E9FB","#FEE2B3"]},"max_lines":1,"text":"Private but not secret","text_color":"#6A2952","type":"static_content"}},
        {"overlay_id":"caption:single_but_not_available","source":"remote","caption":{"background":{"colors":["#FAD0C4","#FFD1FF","#C4F1F9"]},"max_lines":1,"text":"Single but not available","text_color":"#6A3553","type":"static_content"}},
        {"overlay_id":"caption:doc_than_vui_tinh","source":"remote","caption":{"background":{"colors":["#FFDEE9","#B5FFFC","#E2D1F9"]},"icon":{"data":"😎","type":"emoji"},"max_lines":1,"text":"Độc thân vui tính","text_color":"#5B2C5D","type":"static_content"}},
        {"overlay_id":"caption:doc_than_co_chon_loc","source":"remote","caption":{"background":{"colors":["#FECFEF","#E0C3FC","#FFF6B7"]},"max_lines":1,"text":"Độc thân có chọn lọc","text_color":"#5A315E","type":"static_content"}},
        {"overlay_id":"caption:yeu_duong_gi_tam_nay","source":"remote","caption":{"background":{"colors":["#F9C5D1","#FEE1E8","#D0F4DE"]},"max_lines":1,"text":"Yêu đương gì tầm này","text_color":"#6C2848","type":"static_content"}},
        {"overlay_id":"caption:tinh_yeu_khong_co_loi","source":"remote","caption":{"background":{"colors":["#FDCBDF","#C2E9FB","#FEE2B3"]},"max_lines":1,"text":"Tình yêu không có lỗi","text_color":"#6A2952","type":"static_content"}},
        {"overlay_id":"caption:sai_nguoi_sai_thoi_diem","source":"remote","caption":{"background":{"colors":["#FAD0C4","#FFD1FF","#C4F1F9"]},"max_lines":1,"text":"Sai người sai thời điểm","text_color":"#6A3553","type":"static_content"}},
        {"overlay_id":"caption:em_on_nhung_em_buon","source":"remote","caption":{"background":{"colors":["#FFDEE9","#B5FFFC","#E2D1F9"]},"max_lines":1,"text":"Em ổn nhưng em buồn","text_color":"#5B2C5D","type":"static_content"}},
        {"overlay_id":"caption:bat_den_xanh","source":"remote","caption":{"background":{"colors":["#FECFEF","#E0C3FC","#FFF6B7"]},"icon":{"data":"🟢","type":"emoji"},"max_lines":1,"text":"Bật đèn xanh","text_color":"#5A315E","type":"static_content"}}
      ] },
      { section: "💘 Tình cảm mở rộng · 2", items: [
        {"overlay_id":"caption:bat_den_do","source":"remote","caption":{"background":{"colors":["#FDCBDF","#C2E9FB","#FEE2B3"]},"icon":{"data":"🔴","type":"emoji"},"max_lines":1,"text":"Bật đèn đỏ","text_color":"#6A2952","type":"static_content"}},
        {"overlay_id":"caption:bat_che_do_yeu_duong","source":"remote","caption":{"background":{"colors":["#FAD0C4","#FFD1FF","#C4F1F9"]},"max_lines":1,"text":"Bật chế độ yêu đương","text_color":"#6A3553","type":"static_content"}},
        {"overlay_id":"caption:nguoi_cu_con_thuong","source":"remote","caption":{"background":{"colors":["#FFDEE9","#B5FFFC","#E2D1F9"]},"max_lines":1,"text":"Người cũ còn thương","text_color":"#5B2C5D","type":"static_content"}},
        {"overlay_id":"caption:nguoi_yeu_cu_quoc_dan","source":"remote","caption":{"background":{"colors":["#FECFEF","#E0C3FC","#FFF6B7"]},"max_lines":1,"text":"Người yêu cũ quốc dân","text_color":"#5A315E","type":"static_content"}},
        {"overlay_id":"caption:chua_yeu_da_luy","source":"remote","caption":{"background":{"colors":["#F9C5D1","#FEE1E8","#D0F4DE"]},"max_lines":1,"text":"Chưa yêu đã lụy","text_color":"#6C2848","type":"static_content"}},
        {"overlay_id":"caption:luy_tinh_khong_loi_thoat","source":"remote","caption":{"background":{"colors":["#FDCBDF","#C2E9FB","#FEE2B3"]},"icon":{"data":"🥀","type":"emoji"},"max_lines":1,"text":"Lụy tình không lối thoát","text_color":"#6A2952","type":"static_content"}},
        {"overlay_id":"caption:thich_tham","source":"remote","caption":{"background":{"colors":["#FAD0C4","#FFD1FF","#C4F1F9"]},"max_lines":1,"text":"Thích thầm","text_color":"#6A3553","type":"static_content"}},
        {"overlay_id":"caption:don_phuong_la_tu_nguyen","source":"remote","caption":{"background":{"colors":["#FFDEE9","#B5FFFC","#E2D1F9"]},"icon":{"data":"💔","type":"emoji"},"max_lines":1,"text":"Đơn phương là tự nguyện","text_color":"#5B2C5D","type":"static_content"}},
        {"overlay_id":"caption:do_cai_ram","source":"remote","caption":{"background":{"colors":["#FECFEF","#E0C3FC","#FFF6B7"]},"max_lines":1,"text":"Đổ cái rầm","text_color":"#5A315E","type":"static_content"}},
        {"overlay_id":"caption:rung_dong_dau_doi","source":"remote","caption":{"background":{"colors":["#F9C5D1","#FEE1E8","#D0F4DE"]},"icon":{"data":"💓","type":"emoji"},"max_lines":1,"text":"Rung động đầu đời","text_color":"#6C2848","type":"static_content"}},
        {"overlay_id":"caption:tha_thinh_khong_truot_phat_nao","source":"remote","caption":{"background":{"colors":["#FDCBDF","#C2E9FB","#FEE2B3"]},"max_lines":1,"text":"Thả thính không trượt phát nào","text_color":"#6A2952","type":"static_content"}},
        {"overlay_id":"caption:khong_yeu_xin_dung_tha_thinh","source":"remote","caption":{"background":{"colors":["#FAD0C4","#FFD1FF","#C4F1F9"]},"max_lines":1,"text":"Không yêu xin đừng thả thính","text_color":"#6A3553","type":"static_content"}},
        {"overlay_id":"caption:tinh_yeu_mau_hong","source":"remote","caption":{"background":{"colors":["#FFDEE9","#B5FFFC","#E2D1F9"]},"max_lines":1,"text":"Tình yêu màu hồng","text_color":"#5B2C5D","type":"static_content"}},
        {"overlay_id":"caption:yeu_bang_ca_tinh_mang","source":"remote","caption":{"background":{"colors":["#FECFEF","#E0C3FC","#FFF6B7"]},"max_lines":1,"text":"Yêu bằng cả tính mạng","text_color":"#5A315E","type":"static_content"}},
        {"overlay_id":"caption:em_be_ngoan_xinh_yeu","source":"remote","caption":{"background":{"colors":["#F9C5D1","#FEE1E8","#D0F4DE"]},"max_lines":1,"text":"Em bé ngoan xinh yêu","text_color":"#6C2848","type":"static_content"}},
        {"overlay_id":"caption:cung_xiu","source":"remote","caption":{"background":{"colors":["#FDCBDF","#C2E9FB","#FEE2B3"]},"max_lines":1,"text":"Cưng xỉu","text_color":"#6A2952","type":"static_content"}},
        {"overlay_id":"caption:dinh_nhu_keo_502","source":"remote","caption":{"background":{"colors":["#FAD0C4","#FFD1FF","#C4F1F9"]},"icon":{"data":"🩹","type":"emoji"},"max_lines":1,"text":"Dính như keo 502","text_color":"#6A3553","type":"static_content"}},
        {"overlay_id":"caption:het_yeu_thi_noi","source":"remote","caption":{"background":{"colors":["#FFDEE9","#B5FFFC","#E2D1F9"]},"max_lines":1,"text":"Hết yêu thì nói","text_color":"#5B2C5D","type":"static_content"}},
        {"overlay_id":"caption:nguoi_thuong_cua_nguoi_ta","source":"remote","caption":{"background":{"colors":["#FECFEF","#E0C3FC","#FFF6B7"]},"max_lines":1,"text":"Người thương của người ta","text_color":"#5A315E","type":"static_content"}},
        {"overlay_id":"caption:chua_co_bo_nhung_co_tieu_chuan","source":"remote","caption":{"background":{"colors":["#F9C5D1","#FEE1E8","#D0F4DE"]},"max_lines":1,"text":"Chưa có bồ nhưng có tiêu chuẩn","text_color":"#6C2848","type":"static_content"}}
      ] },
      { section: "🎒 Sinh viên & Đi làm · 1", items: [
        {"overlay_id":"caption:deadline_di","source":"remote","caption":{"background":{"colors":["#4B79A1","#283E51","#A8FF78"]},"icon":{"data":"⏳","type":"emoji"},"max_lines":1,"text":"Deadline dí","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:chay_deadline_bang_com","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#99B898"]},"max_lines":1,"text":"Chạy deadline bằng cơm","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:deadline_la_dong_luc","source":"remote","caption":{"background":{"colors":["#4568DC","#B06AB3","#FCE38A"]},"max_lines":1,"text":"Deadline là động lực","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:qua_mon_la_duoc","source":"remote","caption":{"background":{"colors":["#536976","#292E49","#84FAB0"]},"max_lines":1,"text":"Qua môn là được","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:thi_xong_la_quen","source":"remote","caption":{"background":{"colors":["#3A6073","#16222A","#FFD194"]},"icon":{"data":"📚","type":"emoji"},"max_lines":1,"text":"Thi xong là quên","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:hoc_lai_de_gap_nhau","source":"remote","caption":{"background":{"colors":["#4B79A1","#283E51","#A8FF78"]},"icon":{"data":"📚","type":"emoji"},"max_lines":1,"text":"Học lại để gặp nhau","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:qua_mon_trong_nuoc_mat","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#99B898"]},"max_lines":1,"text":"Qua môn trong nước mắt","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ganh_team","source":"remote","caption":{"background":{"colors":["#4568DC","#B06AB3","#FCE38A"]},"max_lines":1,"text":"Gánh team","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:teamwork_makes_the_dream_work","source":"remote","caption":{"background":{"colors":["#536976","#292E49","#84FAB0"]},"max_lines":1,"text":"Teamwork makes the dream work","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:chay_kpi_bang_niem_tin","source":"remote","caption":{"background":{"colors":["#3A6073","#16222A","#FFD194"]},"icon":{"data":"📊","type":"emoji"},"max_lines":1,"text":"Chạy KPI bằng niềm tin","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:luong_chua_ve_da_het","source":"remote","caption":{"background":{"colors":["#4B79A1","#283E51","#A8FF78"]},"icon":{"data":"💸","type":"emoji"},"max_lines":1,"text":"Lương chưa về đã hết","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:cuoi_thang_an_mi","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#99B898"]},"icon":{"data":"🍜","type":"emoji"},"max_lines":1,"text":"Cuối tháng ăn mì","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:dau_thang_tong_tai_cuoi_thang_an_xin","source":"remote","caption":{"background":{"colors":["#4568DC","#B06AB3","#FCE38A"]},"max_lines":1,"text":"Đầu tháng tổng tài, cuối tháng ăn xin","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:vi_con_cai_nit","source":"remote","caption":{"background":{"colors":["#536976","#292E49","#84FAB0"]},"max_lines":1,"text":"Ví còn cái nịt","text_color":"#FFFFFFE6","type":"static_content"}}
      ] },
      { section: "🎒 Sinh viên & Đi làm · 2", items: [
        {"overlay_id":"caption:ap_luc_dong_trang_lua","source":"remote","caption":{"background":{"colors":["#4B79A1","#283E51","#A8FF78"]},"max_lines":1,"text":"Áp lực đồng trang lứa","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:peer_pressure","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#99B898"]},"max_lines":1,"text":"Peer pressure","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:bao_deadline","source":"remote","caption":{"background":{"colors":["#4568DC","#B06AB3","#FCE38A"]},"max_lines":1,"text":"Bào deadline","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ngu_bu_ca_the_gioi","source":"remote","caption":{"background":{"colors":["#536976","#292E49","#84FAB0"]},"max_lines":1,"text":"Ngủ bù cả thế giới","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:di_lam_chua_lanh_vi_tien","source":"remote","caption":{"background":{"colors":["#3A6073","#16222A","#FFD194"]},"icon":{"data":"💸","type":"emoji"},"max_lines":1,"text":"Đi làm chữa lành ví tiền","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:kiem_tien_nuoi_dam_me","source":"remote","caption":{"background":{"colors":["#4B79A1","#283E51","#A8FF78"]},"max_lines":1,"text":"Kiếm tiền nuôi đam mê","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:cong_viec_chon_nguoi","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#99B898"]},"max_lines":1,"text":"Công việc chọn người","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:tu_nhien_muon_nghi_viec","source":"remote","caption":{"background":{"colors":["#4568DC","#B06AB3","#FCE38A"]},"max_lines":1,"text":"Tự nhiên muốn nghỉ việc","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:lam_vi_dam_me_luong_la_phu","source":"remote","caption":{"background":{"colors":["#536976","#292E49","#84FAB0"]},"max_lines":1,"text":"Làm vì đam mê, lương là phụ","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:di_hoc_nhu_di_danh_tran","source":"remote","caption":{"background":{"colors":["#3A6073","#16222A","#FFD194"]},"max_lines":1,"text":"Đi học như đi đánh trận","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:khong_co_gi_ngoai_thoi_gian_va_bai_tap","source":"remote","caption":{"background":{"colors":["#4B79A1","#283E51","#A8FF78"]},"max_lines":1,"text":"Không có gì ngoài thời gian và bài tập","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:thuc_khuya_day_muon","source":"remote","caption":{"background":{"colors":["#355C7D","#6C5B7B","#99B898"]},"max_lines":1,"text":"Thức khuya dậy muộn","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:hoc_ngay_hoc_dem_vao_thi_quen_het","source":"remote","caption":{"background":{"colors":["#4568DC","#B06AB3","#FCE38A"]},"max_lines":1,"text":"Học ngày học đêm, vào thi quên hết","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:sinh_vien_ngheo_vuot_kho","source":"remote","caption":{"background":{"colors":["#536976","#292E49","#84FAB0"]},"max_lines":1,"text":"Sinh viên nghèo vượt khó","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:tam_chieu_chua_tung_trai","source":"remote","caption":{"background":{"colors":["#3A6073","#16222A","#FFD194"]},"max_lines":1,"text":"Tấm chiếu chưa từng trải","text_color":"#FFFFFFE6","type":"static_content"}}
      ] },
      { section: "🌐 English Slang & Internet · 1", items: [
        {"overlay_id":"caption:sigma","source":"remote","caption":{"background":{"colors":["#00C6FF","#0072FF","#9CECFB"]},"icon":{"data":"🐺","type":"emoji"},"max_lines":1,"text":"Sigma","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:skibidi","source":"remote","caption":{"background":{"colors":["#7F7FD5","#86A8E7","#91EAE4"]},"icon":{"data":"🌀","type":"emoji"},"max_lines":1,"text":"Skibidi","text_color":"#1F2D4E","type":"static_content"}},
        {"overlay_id":"caption:goat","source":"remote","caption":{"background":{"colors":["#43CEA2","#185A9D","#A8FF78"]},"icon":{"data":"🐐","type":"emoji"},"max_lines":1,"text":"GOAT","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:w_rizz","source":"remote","caption":{"background":{"colors":["#667DB6","#0082C8","#6DD5FA"]},"icon":{"data":"😏","type":"emoji"},"max_lines":1,"text":"W rizz","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:l_take","source":"remote","caption":{"background":{"colors":["#30CFD0","#330867","#C2FFD8"]},"max_lines":1,"text":"L take","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:based","source":"remote","caption":{"background":{"colors":["#00C6FF","#0072FF","#9CECFB"]},"max_lines":1,"text":"Based","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:mid","source":"remote","caption":{"background":{"colors":["#7F7FD5","#86A8E7","#91EAE4"]},"max_lines":1,"text":"Mid","text_color":"#1F2D4E","type":"static_content"}},
        {"overlay_id":"caption:peak","source":"remote","caption":{"background":{"colors":["#43CEA2","#185A9D","#A8FF78"]},"max_lines":1,"text":"Peak","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:ick","source":"remote","caption":{"background":{"colors":["#667DB6","#0082C8","#6DD5FA"]},"max_lines":1,"text":"Ick","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:iykyk","source":"remote","caption":{"background":{"colors":["#30CFD0","#330867","#C2FFD8"]},"max_lines":1,"text":"IYKYK","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:pov","source":"remote","caption":{"background":{"colors":["#00C6FF","#0072FF","#9CECFB"]},"max_lines":1,"text":"POV","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:fomo","source":"remote","caption":{"background":{"colors":["#7F7FD5","#86A8E7","#91EAE4"]},"max_lines":1,"text":"FOMO","text_color":"#1F2D4E","type":"static_content"}},
        {"overlay_id":"caption:jomo","source":"remote","caption":{"background":{"colors":["#43CEA2","#185A9D","#A8FF78"]},"max_lines":1,"text":"JOMO","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:yolo","source":"remote","caption":{"background":{"colors":["#667DB6","#0082C8","#6DD5FA"]},"max_lines":1,"text":"YOLO","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:irl","source":"remote","caption":{"background":{"colors":["#30CFD0","#330867","#C2FFD8"]},"max_lines":1,"text":"IRL","text_color":"#FFFFFFE6","type":"static_content"}}
      ] },
      { section: "🌐 English Slang & Internet · 2", items: [
        {"overlay_id":"caption:npc_energy","source":"remote","caption":{"background":{"colors":["#00C6FF","#0072FF","#9CECFB"]},"icon":{"data":"🤖","type":"emoji"},"max_lines":1,"text":"NPC energy","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:main_character_energy","source":"remote","caption":{"background":{"colors":["#7F7FD5","#86A8E7","#91EAE4"]},"icon":{"data":"🌟","type":"emoji"},"max_lines":1,"text":"Main character energy","text_color":"#1F2D4E","type":"static_content"}},
        {"overlay_id":"caption:side_quest","source":"remote","caption":{"background":{"colors":["#43CEA2","#185A9D","#A8FF78"]},"icon":{"data":"🎮","type":"emoji"},"max_lines":1,"text":"Side quest","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:canon_event","source":"remote","caption":{"background":{"colors":["#667DB6","#0082C8","#6DD5FA"]},"max_lines":1,"text":"Canon event","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:plot_twist","source":"remote","caption":{"background":{"colors":["#30CFD0","#330867","#C2FFD8"]},"icon":{"data":"🎭","type":"emoji"},"max_lines":1,"text":"Plot twist","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:glow_up","source":"remote","caption":{"background":{"colors":["#00C6FF","#0072FF","#9CECFB"]},"icon":{"data":"✨","type":"emoji"},"max_lines":1,"text":"Glow up","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:glow_down","source":"remote","caption":{"background":{"colors":["#7F7FD5","#86A8E7","#91EAE4"]},"icon":{"data":"🥀","type":"emoji"},"max_lines":1,"text":"Glow down","text_color":"#1F2D4E","type":"static_content"}},
        {"overlay_id":"caption:looksmaxxing","source":"remote","caption":{"background":{"colors":["#43CEA2","#185A9D","#A8FF78"]},"max_lines":1,"text":"Looksmaxxing","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:meowmaxxing","source":"remote","caption":{"background":{"colors":["#667DB6","#0082C8","#6DD5FA"]},"max_lines":1,"text":"Meowmaxxing","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:glazing","source":"remote","caption":{"background":{"colors":["#30CFD0","#330867","#C2FFD8"]},"max_lines":1,"text":"Glazing","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:cooked","source":"remote","caption":{"background":{"colors":["#00C6FF","#0072FF","#9CECFB"]},"max_lines":1,"text":"Cooked","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:let_him_cook","source":"remote","caption":{"background":{"colors":["#7F7FD5","#86A8E7","#91EAE4"]},"max_lines":1,"text":"Let him cook","text_color":"#1F2D4E","type":"static_content"}},
        {"overlay_id":"caption:touch_grass","source":"remote","caption":{"background":{"colors":["#43CEA2","#185A9D","#A8FF78"]},"icon":{"data":"🌱","type":"emoji"},"max_lines":1,"text":"Touch grass","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:skill_issue","source":"remote","caption":{"background":{"colors":["#667DB6","#0082C8","#6DD5FA"]},"max_lines":1,"text":"Skill issue","text_color":"#FFFFFFE6","type":"static_content"}},
        {"overlay_id":"caption:built_different","source":"remote","caption":{"background":{"colors":["#30CFD0","#330867","#C2FFD8"]},"max_lines":1,"text":"Built different","text_color":"#FFFFFFE6","type":"static_content"}}
      ] }
    ];

    // Refresh colors for known captions already present in the response.
    var captionStyles = {};
    catalog.forEach(function (group) { group.items.forEach(function (item) {
      if (item.caption && item.caption.background) captionStyles[item.overlay_id] = item.caption;
    }); });
    existing.forEach(function (group) {
      if (!group || !Array.isArray(group.items)) return;
      group.items.forEach(function (item) {
        var style = item && captionStyles[item.overlay_id];
        if (!style || !item.caption) return;
        item.caption.background = Object.assign({}, item.caption.background || {}, { colors: style.background.colors });
        item.caption.text_color = style.text_color;
      });
    });

    // ==== MERGE CATALOG (không trùng lặp) ====
    catalog.forEach(function (grp) {
      var missing = grp.items.filter(function (item) {
        return !seen.has(item.overlay_id);
      });
      if (missing.length > 0) {
        var existingGrp = null;
        for (var k = 0; k < existing.length; k++) {
          if (existing[k] && existing[k].section === grp.section && Array.isArray(existing[k].items)) {
            existingGrp = existing[k];
            break;
          }
        }
        if (existingGrp) {
          existingGrp.items = existingGrp.items.concat(missing);
        } else {
          existing.push({ section: grp.section, items: missing });
        }
        missing.forEach(function (m) { seen.add(m.overlay_id); });
      }
    });

    entries.overlay_items = JSON.stringify(existing);

    result = { body: JSON.stringify(data) };
  } catch (error) {
    result = { body: rawBody };
  }

  $done(result);
})();
