# Kiểm tra bản 1.1

Phạm vi hiện tại: tạo nội dung/media trong chat, lưu local, khách tự đăng. Google Sheets, duyệt đăng, lịch và xuất bản Facebook đã được gỡ khỏi gói; các bằng chứng đồng bộ/đăng của bản 1.0 không còn là tiêu chí bản này.

## Đã kiểm tra

- 20/20 bài kiểm tra tự động đạt: lưu file tiếng Việt, chỉnh sửa/phiên bản, nâng dữ liệu 1.0, loại lệnh tích hợp cũ, cài lại giữ dữ liệu, đường dẫn, tài nguyên và renderer.
- Bản sao gói sạch: npm ci với omit optional, 20/20 test và verify:release đạt; checksum đủ 7 media, không còn mẫu XLSX/adapter Sheet/scheduler.
- Công cụ quick_validate của skill-creator xác nhận hợp lệ cả skill vận hành và entrypoint cài đặt.
- 9BizClaw hiện có: đã cập nhật tệp của chính skill đăng ký sẵn, inventory xác nhận eligible/modelVisible, doctor xác nhận local-content và hai engine sẵn sàng; nội dung cũ vẫn được giữ.
- Ghi nhận môi trường: CLI native --force rollback vì EPERM khi đổi tên backup trên Windows. Đã sao lưu rồi cập nhật tệp của skill có sẵn, không thay quyền/config/skill khác. Đây không phải bằng chứng bộ cài nâng cấp native đã thành công trên mọi máy.

## Đang xác minh

- Một lượt agent 9BizClaw tạo bài và ảnh thật bằng engine local, đọc lại đúng file; không đăng hoặc kết nối dịch vụ ngoài.
- Gói tải lại từ GitHub và GitHub Actions cho phiên bản 1.1 trên Windows, macOS, Linux.

## Giới hạn

- Bộ cài có adapter bốn host; chưa xác nhận phiên agent thật từ URL trên đủ cả bốn. Agent cần mạng và quyền chạy local.
- Video engine là nền chữ/chuyển động có nhạc; chưa gồm footage người thật hoặc giọng AI.
- Khả năng đính kèm file phụ thuộc host/kênh chat. Đường dẫn máy tính không phải link tải từ điện thoại.

Nâng cấp lưu bản dữ liệu cũ trong archive-v1. Kết nối dùng chung và Sheet đã có trong tài khoản của khách được giữ nguyên; FreeUp không gọi chúng.
