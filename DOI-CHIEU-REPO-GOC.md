# Đối chiếu nguồn cho quà tặng học viên 9BizClaw

Kiểm tra ngày 23/10/2026: repo `phuongnguyendhtm/FreeUp-Content-Agent`, commit `65ebff0eb4cc2510b47ab7900aef81080c3d91b2`. Đây là kết quả đọc mã/hướng dẫn, không phải xác nhận đã chạy các engine nguồn.

## Kết luận

Repo nguồn có tiêu chuẩn sản xuất chi tiết. Bản quà tặng 1.1 hiện tại đã bỏ tích hợp nhưng dùng một renderer mẫu đơn giản, chưa giữ đầy đủ logic thiết kế nguồn. Không được coi bản 1.1 là bản chuyển đổi đầy đủ của repo nguồn.

Đối tượng bàn giao là học viên đã mua 9BizClaw. Họ ra lệnh trong chat 9BizClaw; model và công cụ của 9BizClaw điều phối sản xuất, lưu local, trả nội dung và file để khách tự đăng. Google Sheets và tự đăng Facebook không thuộc phạm vi theo yêu cầu hiện tại.

## Phần cần giữ khi chuyển đổi

| Năng lực nguồn | Tiêu chuẩn đã tìm thấy |
|---|---|
| Researcher | Tách dữ liệu nghiên cứu khỏi bài sáng tạo; thu hook, insight, cảm xúc, dàn ý và nguồn thật. |
| Copywriter | Đọc hồ sơ thương hiệu, đại từ, giọng văn, từ tránh dùng; bài dài có mạch mở đầu, kết nối, câu chuyện, bước ngoặt, giá trị, đúc kết, CTA. Không biến yêu cầu kể chuyện thành việc bịa trải nghiệm. |
| Image Specialist | Caption giữ toàn bộ bài; ảnh chỉ lấy thông điệp chính. Sáu hướng bố cục theo nội dung: chân dung, so sánh, thẻ giữa, số liệu, thẻ trích dẫn và giao thoa. Kiểm tra ảnh thực có trước khi chọn chân dung. |
| Carousel Specialist | Khung 1080×1080, khoảng 30–50 từ/trang; bìa theo nguồn ảnh; trang nội dung có thể là danh sách, so sánh, checklist, trích dẫn. Giữ toàn bài trong caption. |
| Infographic Specialist | Khung 1080×1350, chọn bố cục so sánh/lộ trình/lưới kiến thức; tối đa 4–5 luận điểm chính. |
| Comment Chain | Soạn bài dẫn ngắn và 5–10 bình luận có thứ tự để khách tự sao chép; bỏ phần xuất bản tự động. |
| Reels B-roll | Một hook trên nền video, chọn bố cục theo nội dung, màu thương hiệu, vùng tránh watermark; giữ caption đầy đủ. Cần footage và engine thật, không thay bằng ảnh tĩnh rồi gọi là đã tương đương. |

## Điểm cần sửa, không bê nguyên

- Workflow ảnh cho 50–80 từ, specialist lại hướng 20–40 từ và chặn trên 50: cần thống nhất. Đề xuất áp dụng hướng dẫn specialist: mục tiêu 20–40, tối đa 50 từ hiển thị cho ảnh đơn.
- Mô tả workflow carousel nói 10 trang nhưng specialist không giới hạn. Số trang phải theo nội dung/yêu cầu; không mặc định mọi bài đều 10 trang. Giới hạn batch kỹ thuật phải công bố riêng.
- Workflow gọi `skills/brain/vietbai.md` nhưng cây repo không có đường dẫn đó; hướng dẫn viết thật nằm ở `skills/copywriter.md`.
- Setup vẫn nhắc 100X/Antigravity và thiết lập tài khoản đăng. Phải thay bằng onboarding FreeUp trong 9BizClaw, dùng hồ sơ khách sẵn có; chỉ hỏi thông tin còn thiếu.
- Nhiều bước cuối gọi google_sync_engine trong workflow và specialist, không chỉ README. Phải gỡ mọi điểm gọi cùng Sheet action/Apps Script/config liên quan trong gói bàn giao.
- Các file specialist Markdown và workflow `.agents/workflows` không tự chứng minh được 9BizClaw đã nhận skill. Cần đóng gói theo SKILL.md native, cài vào workspace đúng agent và kiểm tra inventory/lượt chat thật.
- Giữ logic và viết lại hướng dẫn phù hợp; tài nguyên mặc định chỉ từ GitHub FreeUp hoặc do học viên cung cấp, không đóng gói ảnh cá nhân/danh nhân/nhạc của nguồn tham khảo làm dữ liệu khách.

## Nghiệm thu chuyển đổi còn thiếu

Từng bố cục ảnh/carousel/infographic cần render thật, kiểm chữ, ảnh và thương hiệu; B-roll cần kiểm footage/âm thanh thực. Kiểm một bài từ chat đến thành phẩm trên 9BizClaw. Việc đọc đủ tiêu chuẩn nguồn hoặc test renderer mẫu 1.1 không thay thế các bằng chứng này.
