# FreeUp Content Agent

**Nêu chủ đề trong 9BizClaw → nhận bài và ảnh/video trong chat → sửa theo ý muốn → tải thành phẩm để tự đăng.**

Bản thử nghiệm **1.1.0-beta.1** tập trung vào sản xuất nội dung trên máy. Đã bỏ Google Sheets, duyệt đăng, lịch tự động và chức năng xuất bản Facebook.

## Khách cài như thế nào?

Gửi link này cho agent trong 9BizClaw/OpenClaw, Codex hoặc Claude Code local:

> https://github.com/phuongnguyendhtm/freeup-social-content-agent
>
> Cài FreeUp Content Agent vào hệ thống tôi đang dùng, kiểm tra hoạt động rồi hướng dẫn tôi tạo bài đầu tiên.

Agent đọc [INSTALL.md](INSTALL.md), nhận diện môi trường và cài skill. Cần quyền đọc GitHub, chạy lệnh và ghi file trên máy. Dùng AI đang có của host; viết bài không cần tài khoản Google/Facebook. Engine ảnh/video được cài riêng khi cần. Claude web/Cowork cần cách nhập gói phù hợp với khả năng host, không dùng mặc định bộ cài local này.

## Khách dùng hằng ngày

1. **Nêu nhu cầu:** “Tôi bán mỹ phẩm cho phụ nữ 30–45 tuổi. Gợi ý 5 chủ đề chăm sóc da.”
2. **Tạo bài:** “Viết chủ đề số 2 thành bài Facebook khoảng 250 chữ, giọng gần gũi.”
3. **Tạo hình:** “Tạo một ảnh minh họa đi kèm bài này.” Hoặc: “Chuyển bài thành carousel 5 trang.”
4. **Chỉnh sửa:** “Rút ngắn mở bài, bỏ từ chuyên môn và đổi lời kêu gọi cuối bài.”
5. **Lấy thành phẩm:** “Gửi lại bài và các file ảnh để tôi tải về đăng.”

Agent trả nội dung trực tiếp trong chat, gửi media bằng khả năng đính kèm của host và lưu bản đã tạo trên máy. Nếu kênh chat chưa gửi được file, agent báo rõ và đưa vị trí mở file trên máy; không coi đường dẫn Windows là link tải trên điện thoại. Khách tự sao chép caption và đăng file bằng tài khoản của mình.

Các lệnh khác: “Cho tôi xem các bài đã lưu”, “Lấy lại bài về chăm sóc da”, “Tạo infographic từ bài này”, “Tạo video nền chữ có nhạc 8 giây”, “Cập nhật tài nguyên mẫu FreeUp”.

## Tệp của khách

- **Tài nguyên đầu vào**: mẫu FreeUp và thư mục **Thương hiệu của tôi** để đặt logo, ảnh, video, chất liệu riêng.
- **Nội dung đã tạo**: caption `.txt`, bài `.md` và ảnh/video theo ngày, kênh, mã bài, định dạng.
- **Dữ liệu vận hành**: danh mục bài và phiên bản để lấy lại/chỉnh sửa; agent tự quản lý.

Mỗi lần sửa giữ cùng mã bài và tăng phiên bản. Khi nâng cấp từ 1.0, nội dung được giữ lại; trạng thái duyệt, đăng và việc chờ đồng bộ của luồng cũ được loại khỏi dữ liệu đang dùng, bản gốc nằm trong `Dữ liệu vận hành/archive-v1`.

## Media và phạm vi

Ảnh, carousel, infographic, video nền chữ/chuyển động có nhạc được kết xuất local. Bộ mẫu gồm 7 file tạo riêng cho FreeUp, cập nhật từ chính GitHub FreeUp và kiểm tra SHA-256; giữ file khách đã tự sửa. Video người thật/giọng AI cần nguồn và công cụ tương ứng của host. [Danh mục mẫu](assets/manifest.json).

[Bằng chứng kiểm tra](KIEM-THU.md). Bộ cài có bốn adapter; thử bằng fixture không đồng nghĩa đã nghiệm thu bốn phiên agent thật.

Mã và media trong repo được tạo riêng cho FreeUp theo quy trình tham khảo từ [FreeUp-Content-Agent](https://github.com/phuongnguyendhtm/FreeUp-Content-Agent) và [100X-Social-Content-Agent](https://github.com/tauhb/100X-Social-Content-Agent).
