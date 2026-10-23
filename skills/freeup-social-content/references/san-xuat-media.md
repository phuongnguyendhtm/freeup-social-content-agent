# Sản xuất media

Dùng nội dung đã viết và tài nguyên FreeUp trong **Tài nguyên đầu vào**, hoặc chất liệu khách cung cấp. Chọn ý chính vừa với hình; không nhét cả bài dài vào ảnh.

```json
{"id":"bai-001","format":"image","channel":"Facebook","brand":"Thương hiệu khách","title":"Rõ quyền. Rõ việc.","body":"Đội ngũ tự chủ khi biết giới hạn quyết định.","points":["Chốt kết quả cần đạt.","Thống nhất lúc cần báo lại."],"footer":"Thương hiệu khách"}
```

Chạy `render --input brief.json`:

- image: 1080×1350.
- carousel: thêm `slides:[{title,body,points},...]`, 2–20 trang 1080×1350.
- infographic: 1080×1920, chia ý ngắn.
- video: 1080×1920, `duration:8`, `music:"Tài nguyên đầu vào/Nhạc nền/freeup-focus.wav"`; video nền chữ/chuyển động có nhạc. Video người thật/giọng AI cần nguồn và công cụ tương ứng; kiểm tra khả năng host trước khi cam kết.

Nếu TEXT_OVERFLOW, rút gọn hoặc tách trang. Render trả danh sách file thật; lưu chúng bằng save vào đúng id/format/channel, dùng expectedRevision nếu đã có. Khi sửa bài cũ, truyền createdAt của bản đã lưu vào brief để giữ thư mục cùng ngày.

Đính kèm ảnh/video trong câu trả lời bằng khả năng host. Nếu bị giới hạn gửi file, báo rõ và cho khách vị trí mở file trên máy; không tìm đường vượt quyền. Khách lấy caption.txt và thành phẩm để tự đăng.

Cập nhật mẫu qua `assets-update` (mặc định tag đúng phiên bản đã cài), hoặc `assets-update --version v1.1.0-beta.1`. Chỉ tải GitHub FreeUp và kiểm SHA-256, giữ file khách đã sửa. Không cần kết nối Google/Facebook.
