# FreeUp — bộ quà tặng cho học viên 9BizClaw

Phiên bản **2.1.0**: một thư mục FreeUp cố định để thêm tư liệu, tạo nội dung và lấy thành phẩm. Học viên ra lệnh trong 9BizClaw, xem kết quả rồi tự đăng.

## Cài một lần

[Tải FreeUp 2.1.0 — ZIP](https://github.com/phuongnguyendhtm/freeup-social-content-agent/releases/download/v2.1.0/FreeUp-Content-Agent-2.1.0-9BizClaw.zip). Giải nén, lấy thư mục FreeUp bên trong đặt ở vị trí cố định như D:\FreeUp. Gửi cho 9BizClaw:

> Cài FreeUp từ thư mục D:\FreeUp theo INSTALL.md, gồm công cụ ảnh/video. Dùng thư mục này làm nơi làm việc, giữ dữ liệu hiện có và chạy đầy đủ kiểm tra trước khi báo xong.

9BizClaw cài chín skill vào nơi host nhận diện, ghi nhớ thư mục FreeUp và kiểm tra ảnh/video thực tế. Phần kỹ thuật nằm trong **Hệ thống**. Lần đầu cần mạng để tải công cụ; dùng Node đi kèm 9BizClaw tương thích native.

## Bắt đầu làm nội dung

Nói **“Kích hoạt FreeUp”**. AI kiểm tra hồ sơ có sẵn, chỉ hỏi phần thiếu và trình xác nhận. Sau đó gửi ảnh ngang logo FreeUp, Foxy và menu số:

![Menu FreeUp](Hệ%20thống/assets/guide/freeup-huong-dan-ngang.png)

| Số | Chức năng |
|---|---|
| 1 | Nghiên cứu ý tưởng |
| 2 | Viết bài |
| 3 | Ảnh đơn |
| 4 | Ảnh trượt — carousel |
| 5 | Infographic |
| 6 | Chuỗi bình luận |
| 7 | Video nền chữ — B-roll |
| 8 | Video nhiều cảnh — Reels |

Chọn số hoặc nói trực tiếp, ví dụ **“Làm carousel 5 trang về giao việc”**. Nói **“Hiện menu FreeUp”** để xem lại, **“Sửa trang 2”** để chỉnh hoặc **“Gửi lại bài vừa tạo”** để lấy file. Khách có thể yêu cầu duyệt nội dung trước khi dựng.

## Các thư mục

- **Tài nguyên đầu vào:** ảnh cá nhân, ảnh nhân vật, ảnh minh họa, video nền, nhạc, giọng đọc, thương hiệu và Mẫu FreeUp. Mỗi thư mục có hướng dẫn tiếng Việt; mẫu được thêm khi cài.
- **Nội dung đã tạo:** ngày / kênh / mã bài / định dạng tiếng Việt; Bài viết.txt, Bài gốc.md và các bản dựng ảnh/video.
- **Dữ liệu vận hành:** hồ sơ đã xác nhận, lịch sử và biên nhận kiểm tra. Giữ khi sao lưu.
- **Hệ thống:** skills, workflows, runtime, assets, bộ cài và kiểm thử. Các tên kỹ thuật cần cho tương thích vẫn giữ nguyên.

Giữ nguyên vị trí thư mục sau cài. Khi cập nhật, giải nén bản mới ở nơi riêng rồi yêu cầu cập nhật vào thư mục FreeUp đang dùng; không giải nén đè tư liệu.

Giữ tám chuyên môn và tiêu chuẩn sản xuất từ repo FreeUp-Content-Agent commit 65ebff0; xem DOI-CHIEU-REPO-GOC.md. Tài nguyên dùng FreeUp/file khách, không lấy media của tác giả. Không Google Sheets, không tự đăng Facebook. Chưa tích hợp Pexels/ElevenLabs; giọng đọc dùng audio thật hoặc TTS được phép trên host.

Chi tiết: [cài đặt](INSTALL.md), [hướng dẫn học viên](Hướng%20dẫn%20sử%20dụng.md), [kiểm thử](KIEM-THU.md). Phát triển: chạy npm test và npm run verify:release trong Hệ thống.
