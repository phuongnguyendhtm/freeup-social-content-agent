# Cài bộ quà tặng FreeUp trên 9BizClaw

Gửi link repo cho agent và yêu cầu cài. Agent cần quyền đọc/ghi tệp, chạy Node và tải gói trên máy đang chạy 9BizClaw. Cài mới và nâng cấp dùng cùng một lệnh.

1. Tải bản phát hành mới vào một thư mục riêng; đọc AGENTS.md và SKILL.md. Dùng Node 22+ của 9BizClaw. Xác định root từ `%APPDATA%/9BizClaw-v3/install-root.json` và agent đang sử dụng từ ngữ cảnh/cấu hình. Không đoán đường dẫn, đổi workspace hoặc sửa model/persona.
2. Chạy bộ cài đầy đủ, đặt đường dẫn trong dấu nháy khi có khoảng trắng:

    node install.cjs --host 9bizclaw --root "<thư mục cài 9BizClaw>" --agent "<id agent đang dùng>" --with-media

Có thể bỏ `--root` khi pointer tồn tại. `--plan` chỉ xem đích cài. `--with-media` cài chín skill, tài nguyên, công cụ ảnh/video và tự xuất thử ảnh đơn, carousel, infographic, B-roll, Reels trong dữ liệu QA riêng. Không xác nhận hồ sơ thật thay học viên.

Quá trình có thể mất nhiều phút. Nếu công cụ exec trả session/process đang chạy, tiếp tục chờ/đọc tiến độ đến exit code; không coi việc chưa có JSON cuối là thất bại. Bộ cài in `FreeUp: <bước>` và ghi báo cáo liên tục.

3. Chỉ báo cài đầy đủ khi lệnh exit 0 và receipt có `verified: true`, `mediaReady: true`, cùng `selfTestReport` có `passed: true`. Receipt nằm ở `<project>/Dữ liệu vận hành/install-receipt.json`. Đọc SKILL.md từ thư mục đã cài. Nếu chỉ cài skill không có `--with-media`, phải nói rõ công cụ media chưa được kiểm tra.
4. Kích hoạt trong chat: kiểm tra thông tin có sẵn, trình xác nhận, chỉ hỏi thiếu; đủ và được khách xác nhận thì đính kèm ảnh hướng dẫn ngang logo/Foxy/menu 1–8. Mở chat/lượt mới nếu host cần làm mới danh sách skill.

## Khi lỗi

Báo cáo nằm ở `<workspace>/.freeup-install-reports/<mã lần cài>.json`. Đọc `failedStep`, `runtime.version` và lệnh lỗi trong `commands` (exitCode/stdout/stderr). Trích đúng dòng lỗi và đường dẫn báo cáo; không chỉ nói “lỗi native”. Báo cáo công cụ riêng nằm ở `<skillRoot>/freeup-social-content/media-setup-report.json`.

- `NATIVE_CLI_INCOMPATIBLE`, unknown command/option: phiên bản 9BizClaw chưa hỗ trợ lệnh cần dùng; cập nhật qua cách chính thức của 9BizClaw rồi chạy lại. Đã thử native OpenClaw 2026.9.9 trên Windows; không suy diễn mọi bản cũ đều tương thích.
- `NATIVE_NODE_NOT_FOUND` / `NATIVE_CLI_NOT_FOUND`: kiểm tra root, `--node`, `--cli`; không tải runtime lạ để lách lỗi.
- Native `EPERM`/`EBUSY` khi rename: bộ cài chỉ phục hồi thư mục FreeUp đã xác định sở hữu sau backup, kể cả lần cài mới bị dở; sau đó vẫn kiểm inventory đủ chín skill. Thư mục lạ, lỗi chính sách/quyền/scan hoặc không còn đích cài thì dừng và giữ lỗi gốc.
- `MEDIA_SETUP_FAILED` / `ENGINE_NOT_READY`: xem lỗi tải npm/Chromium hoặc binary trong báo cáo. Sửa nguyên nhân mạng/quyền rồi chạy lại cùng lệnh. `runtime/setup.cjs` dùng để cài lại công cụ; `runtime/selftest.cjs` để xuất thử lại. Không báo thành công khi thiếu file.

Cài lại giữ hồ sơ, bài, file khách sửa, dependencies và skill/kết nối chung. Backup tệp gói nằm ở `.freeup-backups`; chỉ cập nhật allowlist của agent đã chọn. Không gỡ Google/Facebook dùng chung. Dữ liệu v1 được lưu archive-v1 trước chuyển đổi.

Adapter kỹ thuật khác: `--host openclaw --state-dir "<state>" --cli "<openclaw.mjs>"`; `--host codex/claude --workspace "<workspace>"`. Đây là các adapter tùy chọn; học viên sử dụng 9BizClaw. Auto mặc định là 9bizclaw.
