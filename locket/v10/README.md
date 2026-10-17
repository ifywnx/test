# IFYWNX — Luồng Caption độc lập (không dùng Sites)

Bản thử V10.1: chỉ thêm dữ liệu Caption vào phản hồi Remote Config khi ứng dụng Locket thực sự gọi đúng endpoint. **Không cấp Gold, không sửa âm thanh, bộ lọc hay huy hiệu**. Chưa xác nhận danh sách Caption hiển thị trong ứng dụng.

## Các thành phần

- [Locket_V10_Captions.js](./Locket_V10_Captions.js) — script công khai; Shadowrocket có thể tải từ GitHub Raw
- Cấu hình Shadowrocket thử nghiệm: một `.conf` **hoặc** một `.sgmodule` tham chiếu URL Raw cố định
- Không cần gọi Sites, không cần sửa `lib/private-assets.ts`, không cần thay DNS V3

## Luồng cập nhật

Sửa **chính file JS** tại thư mục này trên GitHub (Edit → Commit), không đổi tên hoặc đường dẫn.

`GitHub main → raw.githubusercontent.com/ifywnx/test/main/locket/v10/Locket_V10_Captions.js → Shadowrocket cập nhật URL Script → Locket gọi Firebase Remote Config → kiểm tra Script Log → kiểm tra Caption trên iPhone`

Không cần build hay deploy website. Raw có thể bị cache; phải yêu cầu Shadowrocket làm mới Script, rồi khởi động lại Locket.

## Cách phân biệt lỗi

1. **Dấu ✓ xanh ở URL Script** = tải file thành công, chưa khẳng định file được chạy.
2. **Nhật ký `[IFYWNX V10.1 CAPTIONS] script executed`** = Shadowrocket thực sự chạy JS.
3. `skip: non-Locket or missing User-Agent` = script chạy nhưng bị chặn ở nhận diện UA.
4. `skip: no valid entries in JSON` = response không có `entries` phù hợp.
5. `groups=... added=...` = có xử lý JSON và bao nhiêu caption đã gộp.
6. **Xuất hiện và gửi nhận được trong Locket** mới chứng minh tính năng chạy thật.

Không gửi ảnh log chứa mã kích hoạt, Authorization header, URL tải có token hay dữ liệu cá nhân lên repository công khai.

## Phân biệt với V3

Bản thử công khai không chép mã nguồn quyền đăng ký từ kho private. Nếu chọn Config V10 thay cho V3, các trạng thái Gold chỉ có trong bản V3 **có thể không còn xuất hiện**. Giữ V3 làm bản khôi phục.

Nếu muốn bản nâng cấp có Caption và những thứ hoạt động trong V3, phải xác minh chức năng Caption trên ứng dụng rồi **hợp nhất phần tương thích** vào hệ thống phân phối do bạn quản lý. Không thể bảo đảm chức năng trả phí hoặc quyền từ máy chủ hoạt động bằng cách chỉnh Remote Config.
