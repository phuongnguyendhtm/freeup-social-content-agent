---
name: freeup-content-install
description: Cài bộ quà tặng FreeUp Content Agent từ repo này vào OpenClaw, 9BizClaw, Codex hoặc Claude Code trên máy khách.
---

# Cài FreeUp Content Agent

Đọc `INSTALL.md` và chạy `install.cjs` theo host hiện tại. Đây là entrypoint phân phối; skill vận hành chính nằm ở `skills/freeup-social-content/`. Bộ cài lấy đúng thư mục skill đó cùng runtime/tài nguyên, không cài nguyên root như một skill vận hành.

Xác minh skill được host nhận diện; dùng reference Sheet trong gói để sao chép đúng mẫu FreeUp cho khách. Không báo dịch vụ đã kết nối nếu chưa được công cụ native xác nhận.
