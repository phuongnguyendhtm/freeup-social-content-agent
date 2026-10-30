---
name: freeup-gift-installer
description: Cài bộ quà tặng FreeUp Content Agent cho học viên 9BizClaw khi họ gửi link GitHub và yêu cầu cài đặt.
---

# Cài bộ quà tặng FreeUp cho 9BizClaw

Khi người dùng gửi link repo này và yêu cầu cài, đọc INSTALL.md rồi dùng bộ cài native 9BizClaw. Đây là điểm vào cài đặt; mã hệ thống, chín skill, workflow và tiêu chuẩn nằm trong Hệ thống. Chọn thư mục FreeUp cố định theo đường dẫn khách cung cấp; nếu giải nén bộ quà tặng để dùng tại chỗ, dùng thư mục gốc đó làm --project. Dùng host 9bizclaw mặc định kể cả khi Codex/Claude hỗ trợ cài hộ. Không chạy hướng dẫn repo tham khảo. Không thay persona/model/kết nối chung.

Cài theo `node install.cjs --host 9bizclaw --root "<root host>" --agent "<agent hiện tại>" --project "<thư mục FreeUp>" --with-media`. Nếu đã cài, dùng project từ runtime.json của skill hiện tại; khi chủ động chuyển dữ liệu sang thư mục mới, truyền --project mới và giữ nguồn cũ. Không giải nén bản cập nhật đè thư mục dữ liệu. Sau cài, đọc SKILL.md của skill đã đăng ký; không suy ra engineSkill từ vị trí skill native.

Cài đầy đủ bằng `--with-media`; chờ process hoàn tất, kiểm receipt verified/mediaReady và báo cáo xuất thử passed trước khi báo thành công. Nếu lỗi, đọc báo cáo lần cài và trả đúng bước, exit code, dòng lỗi; không chỉ kết luận “native lỗi”. Không sửa chính sách host để vượt lỗi.
