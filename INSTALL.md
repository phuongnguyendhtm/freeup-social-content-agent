# Cài FreeUp Content Agent

Cần Node.js 22+, quyền chạy local và mạng để tải gói. Agent cài vào máy đang làm việc; môi trường cloud không có quyền vào máy khách phải báo rõ giới hạn.

1. Clone/tải ZIP repo này vào thư mục riêng. Xác định host của cuộc trò chuyện hiện tại; chỉ hỏi chọn khi có nhiều host mà không xác định được.
2. Chạy bộ cài tương ứng:

```text
node install.cjs --host auto --workspace <workspace của khách>
node install.cjs --host codex --workspace <workspace của khách>
node install.cjs --host claude --workspace <workspace của khách>
node install.cjs --host 9bizclaw --root <thư mục cài 9BizClaw> --agent main
node install.cjs --host openclaw --state-dir <state> --cli <openclaw.mjs> --agent main
```

9BizClaw tự tìm root từ install-root.json nếu có. OpenClaw theo bố cục vendor có thể dùng `--root`. Thêm `--node` nếu CLI native cần Node riêng; `--plan` để xem đường dẫn. Native install bị từ chối thì dừng tại bước đó.

3. Lấy skillRoot/project từ receipt. Đọc SKILL.md đã cài và chạy `node <skillRoot>/freeup-social-content/runtime/cli.cjs doctor`. Thử lưu một ý tưởng/bài và đọc lại đúng nội dung. 9BizClaw/OpenClaw cần inventory eligible; Codex/Claude Code có thể cần lượt/chat mới để refresh skill.
4. Chỉ khi cần ảnh/video, chạy `node <skillRoot>/freeup-social-content/runtime/setup.cjs` để cài Playwright/Chromium và FFmpeg bằng lockfile, sau đó chạy doctor lại. Viết bài và lấy lại bài không cần engine media.
5. Hướng dẫn khách nêu chủ đề, chỉnh sửa trong chat và tải thành phẩm để tự đăng. Xem cách dùng trong README.

Cài lại giữ `freeup-social-content-data`, sao lưu phần skill trước đó dưới `.freeup-backups`. Bản 1.1 dọn các tệp tích hợp cũ của chính FreeUp; không gỡ kết nối Google/Facebook dùng chung của host. Dữ liệu 1.0 được lưu bản gốc trong `Dữ liệu vận hành/archive-v1` rồi chuyển sang chế độ lưu nội dung local.
