# Cài FreeUp Content Agent

Đọc trước: Node.js 22+, quyền chạy local và kết nối mạng để tải repo/engine. Nếu đang ở môi trường cloud không thể chạm máy khách, báo cần mở agent local; không báo đã cài vào máy khách.

1. Tải/clone repo này vào thư mục riêng. Nếu không có Git, dùng ZIP từ GitHub và giải nén; không cần tài khoản lập trình của người tạo.
2. Xác định host của cuộc trò chuyện hiện tại. Dùng `--host auto` khi có tín hiệu host rõ; nhiều môi trường mơ hồ thì hỏi chọn một, không cài tất cả.
3. Cài:

```text
node install.cjs --host auto --workspace <workspace của khách>
node install.cjs --host codex --workspace <workspace của khách>
node install.cjs --host claude --workspace <workspace của khách>
node install.cjs --host 9bizclaw --root <thư mục cài 9BizClaw> --agent main
node install.cjs --host openclaw --root <root có openclaw-state và vendor> --agent main
```

OpenClaw bố cục chuẩn khác bố cục vendor của 9BizClaw: dùng `--state-dir <state>` và `--cli <openclaw.mjs>` theo mục hỗ trợ CLI, không tự đoán vị trí. Bộ cài cần root runtime thật; không cố định ổ D hoặc tên Admin. 9BizClaw thử đọc install-root.json của app để tự tìm root. Có thể thêm `--plan` để xem đường dẫn trước khi cài. Native install bị từ chối thì dừng bước đó, không chuyển sang copy để vượt quyền.

4. Lấy skillRoot/project từ receipt, chạy `node <skillRoot>/freeup-social-content/runtime/setup.cjs` để cài engine và Chromium bằng lockfile. Chạy `node <skillRoot>/freeup-social-content/runtime/cli.cjs doctor --project <project>`.
5. 9BizClaw/OpenClaw: kiểm tra native inventory xác nhận skill eligible. Codex/Claude Code: mở lượt/chat mới nếu host cần refresh rồi gọi skill bằng tên; phải thử nhận một yêu cầu thật trước khi nói đã nhận diện thành công.
6. Đọc `references/thiet-lap.md` và `references/sheet-mau.md` của skill vừa cài; sao chép Sheet bằng kết nối khách và bind bản riêng. Chỉ tạo lịch/đăng bài khi chủ đã duyệt phạm vi tương ứng.

Mỗi lần cài lưu backup phần skill trước đó dưới `.freeup-backups` trong workspace. Dữ liệu trong `freeup-social-content-data` giữ nguyên. Muốn khôi phục: dừng tác vụ FreeUp, dùng cơ chế quản lý skill của host để cài lại bản backup, giữ dữ liệu và xác minh inventory. Không khôi phục toàn bộ config bằng bản cũ.
