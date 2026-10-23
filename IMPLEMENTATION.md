# Bản rút gọn 1.1

Yêu cầu ngày 23/10/2026 thay thế luồng 1.0: bỏ Google Sheets và tự đăng Facebook, tập trung tạo nội dung/media để khách tự đăng.

- Giữ bộ cài bốn host, kho mẫu FreeUp, renderer local và thư mục tiếng Việt.
- Xóa adapter Sheet, schema/mẫu XLSX, references đồng bộ/đăng, scheduler và các lệnh duyệt/xuất bản.
- Lưu caption.txt/noi-dung.md và danh mục local; chỉnh sửa cùng mã/phiên bản, không cần Page hoặc cổng duyệt.
- Nâng dữ liệu 1.0: sao lưu state/binding cũ, giữ nội dung/media, bỏ hàng đợi/khóa nghiệp vụ đăng khỏi state hiện hành.
- Cài lại dọn đúng các tệp tích hợp đã nghỉ dùng trong skill FreeUp; giữ dữ liệu khách và skill khác.
- Đã tái hiện 5 lỗi hợp đồng luồng mới trước khi sửa. Bằng chứng cuối ghi trong KIEM-THU.md.
- 20/20 test đạt trên gói sạch; quick_validate hợp lệ; GitHub Actions đạt cả ba hệ điều hành. Lượt agent 9BizClaw thật tạo bài/ảnh local, caption khớp file, PNG 1080×1350; không gọi dịch vụ tích hợp đã bỏ.
