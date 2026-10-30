# Sửa, chuyển định dạng, lấy lại

- “Gửi lại bài vừa tạo”: list/get và trả file đang lưu; không tự viết lại.
- “Sửa trang 2”, “rút ngắn”, “đổi ảnh”: get bản hiện tại, giữ mã bài, sửa đúng phần được yêu cầu; render ra thư mục Bản dựng mới rồi save với expectedRevision. Nếu xung đột phiên bản, đọc lại và hỏi khi ý định không còn rõ.
- Chuyển bài sang ảnh/video: giữ cùng id, đọc tiêu chuẩn định dạng mới, giữ ý chính; bài gốc vẫn có thể lấy lại bằng get ở định dạng text.
- Nội dung đã tạo dùng thư mục tiếng Việt. Lấy đường dẫn từ kết quả CLI, không tự ghép theo tên cũ như image/carousel/caption.txt. Bài cũ vẫn đọc qua đường dẫn đã lưu; không xóa bản cũ khi đổi tên đầu ra.
- Khách thêm tư liệu: đọc lại thư mục phù hợp trong lần yêu cầu tiếp theo; không tạo lịch theo dõi nền.
