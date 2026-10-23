# Sản xuất media local

Mẫu mặc định được tạo riêng cho FreeUp, trong **Tài nguyên đầu vào**. Không tải ảnh/video/nhạc tác giả. Khách có thể thêm nguồn riêng. Chọn đúng nội dung đã viết; không nhét nguyên bài dài vào ảnh.

Cập nhật mẫu: chạy `assets-update --version v1.0.0-beta.1` trong giai đoạn thử nghiệm. Lệnh chỉ lấy manifest/file có checksum từ GitHub FreeUp và giữ file khách đã sửa. Sau khi có release ổn định mới dùng `assets-update` không chỉ định phiên bản. Không dùng nhánh đang phát triển thay cho bản phát hành.

Ghi brief JSON (dữ liệu, không phải shell):

```json
{"id":"bai-001","format":"image","channel":"123456789","brand":"Tên thương hiệu khách","title":"Thêm công cụ, vẫn tắc ở người chủ.","body":"Điểm nghẽn nằm ở cách ra quyết định.","points":["Việc nào được tự quyết?","Trong giới hạn nào?"],"footer":"Tên thương hiệu · lời kết ngắn"}
```

- Ảnh: `format:image`, 1080×1350.
- Carousel: `format:carousel`, thêm `slides:[{title,body,points},...]`, 2–20 slide theo yêu cầu, mỗi slide 1080×1350.
- Infographic: `format:infographic`, 1080×1920; chia ý ngắn, có thứ tự.
- Video nền chữ: `format:video`, 1080×1920, `duration:8`, `music:"Tài nguyên đầu vào/Nhạc nền/freeup-focus.wav"`. Engine cơ bản tạo video chữ/chuyển động từ brief và nhạc, không tự giả có B-roll người thật/giọng AI. Khách yêu cầu video người nói hoặc B-roll thực tế thì cần footage/ảnh và công cụ media được host hỗ trợ; kiểm tra khả năng rồi mới cam kết.

Chạy `render --input brief.json`. Nếu lỗi TEXT_OVERFLOW, rút ngắn chữ hoặc tách slide; không bỏ qua. Lưu danh sách media thật vào Ticket bằng save và expectedRevision vừa đọc. Trả ảnh/video trong chat. Muốn xem từ Sheet/điện thoại, upload đúng thành phẩm vào Drive khách qua native connected apps và kiểm tra link chia sẻ trước khi ghi ghi chú D.

Logo/ảnh khách có thể dùng công cụ media native của host để tạo bản riêng khi yêu cầu; không tự thay mặt người thật bằng hình mẫu. Runtime không sinh giọng nói/B-roll có sẵn nếu chưa có nguồn.
