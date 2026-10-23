# Cài trên 9BizClaw

1. Tải/clone repo này vào thư mục riêng. Đọc AGENTS.md và SKILL.md; không chạy bộ cài repo tham khảo. Đích mặc định luôn là 9BizClaw, dù Codex/Claude hỗ trợ cài hộ.
2. Chạy Node 22+ của máy/9BizClaw:

    node install.cjs --host 9bizclaw --root <thư mục cài 9BizClaw> --agent main

Nếu không truyền root, bộ cài đọc %APPDATA%/9BizClaw-v3/install-root.json. Không đoán đường dẫn cài; thiếu pointer thì hỏi vị trí app. --plan chỉ xem đường dẫn. Đọc workspace/agent từ cấu hình app, không sửa bằng tay hoặc đổi workspace. Bộ cài dùng native skills install cho skill mới; skill FreeUp đã đăng ký được sao lưu rồi cập nhật tại chỗ, tránh lỗi khóa thư mục trên Windows. Kiểm tra inventory chín skill eligible. Nếu native từ chối/không có quyền thì báo lỗi, không lách chính sách.
3. Receipt trả skillRoot/project; chín skill gồm freeup-social-content và tám chuyên môn. Chạy node <skillRoot>/freeup-social-content/runtime/cli.cjs doctor. Khi cần media, chạy node <skillRoot>/freeup-social-content/runtime/setup.cjs để cài dependencies bằng lockfile và Chromium; doctor lại. Không tự thêm API key.
4. Mở lượt/chat mới nếu host cần refresh. Đọc SKILL.md đã cài; thử profile-status và hỏi khách kích hoạt. Kiểm tra thông tin sẵn có, xác nhận, hỏi thiếu; đủ+confirmed thì gửi ảnh hướng dẫn menu 1–8 trong chat.

Cài lại giữ nội dung/hồ sơ/tài nguyên khách và skill/kết nối chung. Backup phần skill ở .freeup-backups. Dữ liệu v1 được lưu archive-v1 trước chuyển đổi; chỉ dọn tệp tích hợp FreeUp đã nghỉ dùng. Không gỡ Google/Facebook dùng chung của host.

Adapter kỹ thuật khác (không yêu cầu học viên cài thêm): --host openclaw --state-dir <state> --cli <openclaw.mjs>; --host codex/claude --workspace <workspace>. --node chỉ Node native riêng. Auto mặc định 9bizclaw.

Khôi phục Windows: nếu native gặp EPERM khi đổi tên và thư mục có receipt host/workspace/project cùng package.name đúng FreeUp, bộ cài có thể sửa lại tệp package của chính gói sau backup, rồi xác nhận inventory. Với thư mục không xác định sở hữu hoặc lỗi chính sách, dừng và báo lỗi. Không bỏ qua kiểm tra eligible/modelVisible.
