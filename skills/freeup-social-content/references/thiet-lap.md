# Thiết lập cho khách

1. Đọc runtime.json; chạy doctor. Chỉ chạy `node <skill>/runtime/setup.cjs` khi engine chưa sẵn sàng. Bộ cài chỉ sửa gói FreeUp và allowlist skill, không thay model, persona hay quyền hệ thống.
2. Tận dụng hồ sơ thương hiệu/tri thức và kết nối có sẵn của host. Xác nhận thương hiệu, giọng văn, nhóm khách và Page muốn dùng nếu chưa có. Khách dùng model hiện tại để viết; dịch vụ ảnh/voice bổ sung chỉ cần nếu khách chọn chế độ đó.
3. Đọc `sheet-mau.md`; kiểm tra Google Drive/Sheets qua công cụ native của host. Không suy kết nối 9BizClaw từ trạng thái connector trong Codex/ChatGPT.
4. Sao chép toàn bộ workbook mẫu FreeUp sang Drive khách. Đọc metadata/header/dropdown bản sao; lưu snapshot theo `dong-bo-sheet.md`, chạy bind-sheet. Không gọi action tạo Sheet trống hay macro reset.
5. Cho khách thấy hai thư mục **Tài nguyên đầu vào**, **Nội dung đã tạo** và link Sheet riêng. Thư mục **Thương hiệu của tôi** để đặt logo/ảnh/chất liệu của khách.
6. Tự động theo dõi/hẹn đăng: khách chọn bật và phạm vi, sau đó dùng scheduler native theo `dang-bai.md`. Không báo bật thành công chỉ từ file cấu hình local.
