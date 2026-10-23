# FreeUp Content Agent

Khách nêu chủ đề trong **9BizClaw/OpenClaw** → agent trả kết quả ngay trong chat → cập nhật cùng nội dung lên **Google Sheets mẫu FreeUp**. Viết bài, tạo ảnh/carousel/infographic/video, chỉnh sửa, duyệt và quản lý đăng fanpage.

## Cài bằng cách gửi link cho agent

Gửi https://github.com/phuongnguyendhtm/freeup-social-content-agent kèm câu:

> Cài FreeUp Content Agent trên môi trường tôi đang dùng, xác minh skill hoạt động rồi thiết lập Sheet riêng từ mẫu trong references/sheet-mau.md. Giữ nguyên các skill và dữ liệu hiện có.

Agent đọc [INSTALL.md](INSTALL.md), nhận diện host và chạy bộ cài. Hỗ trợ bộ cài OpenClaw, 9BizClaw, Codex và Claude Code; cần agent có quyền đọc repo, ghi file và chạy lệnh trên máy. Claude web/Cowork không mặc nhiên dùng được bộ cài local này.

## Sử dụng

- “Đề xuất 5 ý tưởng về ủy quyền cho đội ngũ.”
- “Viết bài từ ý tưởng thứ hai và tạo ảnh đi kèm.”
- “Sửa đoạn mở đầu, giữ phần còn lại.”
- “Duyệt đăng bản vừa xem lên fanpage đã chọn.”

Trả kết quả trong chat, Sheet được cập nhật cùng bản. Duyệt làm và duyệt đăng tách riêng. Sửa nội dung sẽ hủy duyệt cũ. Mất mạng thì giữ việc chờ đồng bộ; chưa có readback không báo đã đăng/đã lưu.

## Tệp của khách

- **Tài nguyên đầu vào**: ảnh mẫu, video mẫu, nhạc nền và thư mục thương hiệu của khách.
- **Nội dung đã tạo**: thành phẩm theo ngày/kênh/mã bài.
- **Dữ liệu vận hành**: phiên bản, hàng đợi, receipt xác minh; không đưa lên GitHub.

Tài nguyên mẫu trong gói được tạo mới cho FreeUp. Cập nhật từ GitHub FreeUp theo phiên bản, giữ file khách đã sửa. [Danh mục và nguồn gốc](assets/manifest.json).

## Sheet chuẩn

[Mẫu FreeUp](https://docs.google.com/spreadsheets/d/1N2vWZTWNfrXVtVJXM2MUlFf5nQ0EHw3a1LS7cw7-IUc/edit) được sao chép từ mẫu người dùng cung cấp. Mỗi khách dùng bản sao riêng. Agent phải đọc [reference cố định](skills/freeup-social-content/references/sheet-mau.md); thiếu quyền thì báo cần cấp quyền, không tự tạo workbook khác.

## Phạm vi bản đầu

Đã có bộ máy quản lý phiên bản/duyệt/đối soát và engine ảnh, carousel, infographic, video nền chữ có nhạc. Video B-roll người thật, giọng AI và đăng fanpage phụ thuộc nguồn media/công cụ/kết nối thực tế của host; không cam kết chỉ cài skill là đã cấp quyền các dịch vụ này. Tác vụ theo dõi/hẹn đăng phải được tạo và xác minh qua scheduler native của chủ tài khoản; máy cần bật.

Kết quả kiểm tra và môi trường đã thử được ghi trong [KIEM-THU.md](KIEM-THU.md).

Mã triển khai và media mẫu trong repo được tạo riêng cho FreeUp theo quy trình tham khảo; không sao chép media của tác giả. Repo tham khảo: [FreeUp-Content-Agent](https://github.com/phuongnguyendhtm/FreeUp-Content-Agent), [100X-Social-Content-Agent](https://github.com/tauhb/100X-Social-Content-Agent).
