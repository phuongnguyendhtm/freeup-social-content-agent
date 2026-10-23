# FreeUp Content Agent — quà tặng 9BizClaw

Bộ trợ lý cho học viên mua 9BizClaw: từ chủ đề đến bài, ảnh và video, lưu tại máy để tải về tự đăng. Không cần Google Sheets hoặc quyền đăng Facebook.

Gửi link GitHub này cho agent trong 9BizClaw và nói: **“Cài bộ quà tặng FreeUp cho tôi.”** Agent đọc INSTALL.md, cài skill chính cùng tám chuyên môn và tài nguyên FreeUp. Cần Node 22+ (9BizClaw có sẵn), mạng lúc tải gói và engine media. Không tự thay model/persona của khách.

Lần đầu agent kiểm tra thông tin đang có, trình xác nhận và chỉ hỏi phần còn thiếu. Đủ hồ sơ và được khách xác nhận, agent gửi ảnh ngang có logo FreeUp, Foxy và menu số:

![Hướng dẫn FreeUp](assets/guide/freeup-huong-dan-ngang.png)

| Số | Chức năng | Ví dụ |
|---|---|---|
| 1 | Nghiên cứu | Tìm ý tưởng về giao việc |
| 2 | Viết bài | Viết bài về giao quyền cho đội ngũ |
| 3 | Ảnh đơn | Tạo ảnh cho bài này |
| 4 | Carousel | Tạo carousel 5 trang |
| 5 | Infographic | Tóm tắt bài thành infographic |
| 6 | Chuỗi bình luận | Tạo chuỗi 7 bình luận |
| 7 | B-roll | Làm video nền chữ cho bài này |
| 8 | Reels | Tạo Reels 60 giây, nhiều cảnh |

Có thể trả lời số hoặc nói tự nhiên. Nếu chọn số mà chưa có chủ đề, agent hỏi chủ đề. Sửa trực tiếp: “Rút gọn”, “Đổi giọng thân thiện”, “Sửa trang 3”. Lấy lại: “Gửi lại bài vừa tạo”. Tải caption và thành phẩm rồi tự đăng bằng tài khoản của mình.

**Tài nguyên đầu vào** chứa ảnh/video/nhạc và thương hiệu khách; **Nội dung đã tạo** chứa thành phẩm; **Dữ liệu vận hành** chứa hồ sơ và phiên bản. Mẫu FreeUp lấy từ repo quà tặng này, có checksum và giữ file khách đã sửa khi cập nhật. Ảnh hướng dẫn dùng nhận diện FreeUp; sản phẩm cho khách dùng thương hiệu khách.

Giữ tám chuyên môn và tiêu chuẩn sản xuất từ FreeUp-Content-Agent commit 65ebff0. Xem DOI-CHIEU-REPO-GOC.md để biết phạm vi chuyển đổi. Reels có tám layout Remotion nguồn; giọng đọc cần audio thật hoặc TTS có sẵn được cấp quyền. Bản beta cần xem thành phẩm trước khi tự đăng.

Kiểm tra: npm test và npm run verify:release. Chi tiết cài: INSTALL.md. Phiên bản: **2.0.0-beta.1**.
