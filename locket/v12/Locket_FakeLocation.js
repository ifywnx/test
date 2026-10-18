// ============================================================
// IFYWNX V13 - VỊ TRÍ & THỜI TIẾT ẢO (SPOOF LOCATION)
// ============================================================
(function () {
  var body = $response.body;
  try {
    var obj = JSON.parse(body);

    // 1. Cấu hình Vị trí ảo (Flex địa điểm)
    var fakePlace = "Tháp Eiffel, Paris 🇫🇷";
    var fakeCity = "Paris";
    var fakeCountry = "France";

    // 2. Cấu hình Thời tiết ảo
    var fakeTempC = -5; // Âm 5 độ C
    var fakeCondition = "snowing"; // Tuyết rơi

    // Tráo ruột dữ liệu JSON khi server trả về
    // (Bắt mọi key định dạng vị trí phổ biến mà API thường dùng)
    if (obj) {
      if (obj.place_name !== undefined) obj.place_name = fakePlace;
      if (obj.city !== undefined) obj.city = fakeCity;
      if (obj.country !== undefined) obj.country = fakeCountry;
      if (obj.location !== undefined) obj.location = fakePlace;
      if (obj.address !== undefined) obj.address = fakePlace;

      // Tráo ruột nhiệt độ
      if (obj.temperature !== undefined) obj.temperature = fakeTempC;
      if (obj.temp_c !== undefined) obj.temp_c = fakeTempC;
      if (obj.condition !== undefined) obj.condition = fakeCondition;
    }

    body = JSON.stringify(obj);
  } catch (error) {
    // Nếu API trả về không phải JSON thì bỏ qua, trả lại data gốc để không sập app
  }
  $done({ body: body });
})();
