# IFYWNX V10.2 — Luồng Caption độc lập, không dùng Sites

**Repository công khai:** `ifywnx/test`. Không thay đổi site hiện tại, cấu hình Gold V3 hoặc hồ sơ DNS đang sử dụng.

## Ba file trong luồng mới

1. [ifywnx-V10-Independent.conf](./ifywnx-V10-Independent.conf) — cấu hình Shadowrocket độc lập, thay thế cấu hình V3 khi kiểm thử.
2. [ifywnx-V10-Independent.sgmodule](./ifywnx-V10-Independent.sgmodule) — dùng thay cho Config nếu cần; **không bật cùng Config V10 hoặc module V3**.
3. [Locket_V10_Captions.js](./Locket_V10_Captions.js) — script công khai; Config và Module sẽ tự tải bằng URL GitHub Raw, không cần chép JS thủ công.

**DNS:** tiếp tục dùng DNS uBlock đã cài nếu cần. Không tạo hồ sơ DNS mới trong luồng thử để hạn chế thay đổi.

## Sửa Caption trong tương lai

Chỉnh file `Locket_V10_Captions.js` tại cùng đường dẫn trong repo, commit lên nhánh `main`, sau đó làm mới **URL Script** trong Shadowrocket. **Không phải deploy Sites**, không đổi Config/Module nếu URL không đổi. Khi gỡ cấu hình thử, bật lại V3.

## Bản V10.2 khác V10.1

V10.1 chỉ chạy khi User-Agent chứa `Locket`. Firebase SDK có thể dùng User-Agent riêng, nên V10.2 kiểm tra URL phản hồi đúng dự án `locket-4252a` thay vì đòi User-Agent Locket. Đây là sửa lỗi giả định, **chưa được xác minh trên iPhone**.

## Kiểm tra từng bước

- Dấu ✓ ở URL Script = tải được JavaScript, **chưa phải đã chạy**.
- Dòng `[IFYWNX V10.2 CAPTIONS] script executed` trong nhật ký Script = đã có thực thi.
- Dòng `groups=... added=...` = đã thêm mục vào bản JSON tại thiết bị.
- Caption xuất hiện, chọn được, gửi và hiện trên máy nhận = kiểm thử thành công.

Nếu không có nhật ký hoặc giao diện không đổi, kiểm tra quy tắc URL, chứng chỉ giải mã HTTPS và thời điểm ứng dụng tải lại Remote Config. Đừng kết luận là Gold, Filter, AI, micro hoặc huy hiệu Gold đã được mở khóa chỉ vì dữ liệu cấu hình được thay đổi.

**V10.2 không sửa entitlement/RevenueCat, đăng ký Gold, filter engine, audio upload hoặc dữ liệu hồ sơ phía máy chủ.** Không sao chép script Gold V3 từ kho riêng tư sang GitHub công khai. Không đăng mã kích hoạt, token, header cá nhân hoặc log chứa dữ liệu riêng lên repo.
