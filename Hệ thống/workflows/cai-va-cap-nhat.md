# Cài và cập nhật thư mục FreeUp

Đọc INSTALL.md ở thư mục gốc gói tải. Xác định host/agent đang dùng và thư mục FreeUp khách chọn. Chạy install.cjs với --project và --with-media; không thay workspace, model hoặc persona của 9BizClaw.

Khi cập nhật, giải nén bản mới ở nơi riêng; chạy bộ cài mới trỏ --project tới thư mục FreeUp đang dùng. Không giải nén đè tư liệu học viên. Bộ cài giữ dữ liệu và phụ thuộc hiện có, cập nhật mã hệ thống và các skill đã xác định sở hữu.

Chuyển từ kho dữ liệu 2.0.x: bộ cài chép ba thư mục dữ liệu sang vị trí mới, kiểm tra xung đột trước khi đổi liên kết; giữ nguyên dữ liệu gốc. Xung đột phải được xử lý có chủ đích, không tự ghi đè. Tệp riêng nằm ngoài ba thư mục vẫn giữ tại chỗ cũ; báo cho khách nếu cần chuyển thêm.

Chỉ hoàn tất khi exit 0, biên nhận của lần cài hiện tại verified=true/mediaReady=true, selftest passed=true. Lỗi native EPERM dùng cơ chế phục hồi của bộ cài; đọc báo cáo khi vẫn thất bại. Không sửa ACL, tắt bảo vệ hoặc bỏ qua chính sách host.
