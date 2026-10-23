# Triển khai 2.0 — đặc tả theo yêu cầu ngày 23/10/2026

1. Giữ đủ tám chuyên môn nguồn: nghiên cứu, copywriter, ảnh đơn, carousel, infographic, chuỗi bình luận, B-roll và Reels; đóng thành skill 9BizClaw và kèm tiêu chuẩn đầy đủ được chuyển từ commit 65ebff0. Chỉ loại tích hợp Sheets/đăng và các chỉ dẫn gắn môi trường cũ.
2. Dùng HTML động để giữ các bố cục, không ép tất cả vào mẫu 1.1. Khung ảnh 1080×1350, carousel 1080×1080, infographic 1080×1350; asset local FreeUp/khách; theme khách; kiểm tràn và chữ. Video B-roll thật, Reels nhiều cảnh, âm thanh/phụ đề theo dữ liệu khách.
3. Hồ sơ: thu thập từ nguồn hồ sơ mà agent được phép đọc, hợp nhất theo trường và ghi nguồn, trình xác nhận; chỉ hỏi thiếu. Không tự đánh dấu đủ/đã xác nhận. Đủ và được khách xác nhận mới cấp ảnh hướng dẫn ngang.
4. Bộ cài native 9BizClaw, tài nguyên và thư mục tiếng Việt; nâng cấp giữ nội dung/kết nối/skill khác. Tất cả kết quả lưu trên máy và trả trong chat.
5. Kiểm thử unit, render mẫu/bố cục, hồ sơ thiếu/đủ/sửa, bộ cài và agent 9BizClaw thật; review toàn bộ rồi phát hành ZIP/release.

Ruling: giữ nguyên nội dung tiêu chuẩn nguồn dưới mỗi chuyên môn, ghi rõ các mâu thuẫn được chuẩn hóa (ảnh tối đa 50 từ; carousel theo yêu cầu; Reels mặc định 45–60 giây, khách được chọn ngắn hơn). Thay engine lỗi/phụ thuộc mạng bằng renderer local tương thích HTML để thực hiện cùng tiêu chuẩn; không mang ảnh/nhạc cá nhân hoặc config tài khoản nguồn vào gói.

Tiến độ 23/10: đủ tám specialist và reference nguồn; hồ sơ/menu số đã có test RED→GREEN; 33 unit dự kiến (chạy suite khi bàn giao). Đã render 6 ảnh, 10 bố cục carousel, 3 infographic, 6 B-roll và Reels tám layout. Guide dùng logo FreeUp + Foxy ôm trái tim từ link Drive chị cung cấp, số 1–8.
Ruling: native Windows rename EPERM có thể để lại thư mục bộ FreeUp thiếu SKILL.md. Chỉ cho phép sửa tại chỗ nếu receipt host/workspace/project và package.name đều khớp gói FreeUp, đã backup, sau đó kiểm inventory; không áp dụng với thư mục lạ hoặc lỗi chính sách. Native inventory có thể cần tối đa ba lượt refresh sau đổi allowlist.

Final: fixed P1 media clobber — immutable per-render directories + rejected optimistic save regression RED→GREEN; real Chromium demonstrated old bytes changed before fix, unchanged after. Fixed P2 karaoke interval masking, source visual_content.list normalization and off-canvas custom HTML QA: four regression tests RED→GREEN. Full suite pending final run. No deferred minor findings. Explicit modelVisible=false is rejected by native verification.

Task 1–4 complete: đủ chuyên môn/tiêu chuẩn/engine, hồ sơ/menu/guide, installer9Biz nâng cấp và bảo toàn dữ liệu; kiểm thực tế 9 skill eligible/modelVisible. Final suite 37/37 + verify:release xanh; Chromium regression về bất biến media và canvas xanh. Native agent tạo carousel3trang, guide có payload.mediaUrl đúng. Task5 đang đóng gói/phát hành.
Rủi ro của lựa chọn chuẩn hóa: HTML riêng vẫn cần agent xem ảnh thật; TTS tiếng Việt và gửi ra từng kênh phụ thuộc host. Phục hồi EPERM chỉ có phạm vi gói đã xác định sở hữu; nếu metadata sai có thể cập nhật nhầm tệp gói, nên bộ cài kiểm nhiều trường và giữ backup.
