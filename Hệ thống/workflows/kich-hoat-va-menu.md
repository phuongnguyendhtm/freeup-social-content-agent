# Kích hoạt và menu FreeUp

Đọc runtime.json trong skill được 9BizClaw nạp. Xác nhận project còn tồn tại, engineSkill trỏ tới Hệ thống và skillRoot là nơi host đã đăng ký skill. Nếu thư mục mất/quyền đọc bị chặn, báo đường dẫn cần xử lý; không tự tạo một kho dữ liệu thay thế.

1. Dùng workflow kích hoạt trong skills/freeup-social-content/SKILL.md: profile-discover chỉ đọc workspace của agent đang dùng; profile-status lấy hồ sơ đã lưu. Không yêu cầu khách nhập lại thông tin đã xác nhận.
2. Hỏi phần thiếu, trình thông tin và nguồn để xác nhận. profile-confirm chỉ sau xác nhận rõ phiên bản hồ sơ. Không lấy hồ sơ QA làm hồ sơ học viên.
3. ready=true: gọi guide; gửi ảnh ngang logo FreeUp/Foxy/menu 1–8 vào chính chat đang yêu cầu. Nếu kênh không gửi ảnh được, báo đúng lỗi và hiển thị bảng số.
4. “Hiện menu FreeUp”, “Xem danh sách” hoặc “Hướng dẫn”: gửi lại guide khi hồ sơ đã sẵn sàng. Yêu cầu trực tiếp có đủ ngữ cảnh được chuyển sang tao-noi-dung.md, không bắt chọn lại menu.
5. Chọn số thiếu chủ đề: hỏi chủ đề. Chọn số đã có bài: dùng bài trong ngữ cảnh hoặc get theo mã bài. Mỗi chuyên môn đọc TIEU-CHUAN.md tương ứng.

Các số 1–8 lần lượt: nghiên cứu, viết bài, ảnh đơn, ảnh trượt, infographic, chuỗi bình luận, video nền chữ, video nhiều cảnh.
