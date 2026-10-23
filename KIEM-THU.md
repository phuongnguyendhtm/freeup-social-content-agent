# Kiểm thử 2.0.0-beta.1 — 23/10/2026

- 37/37 unit đạt: lưu/sửa/phiên bản, migration giữ dữ liệu, path/tài nguyên, bộ cài bốn adapter, đủ chín skill và runtime pointer, hồ sơ thiếu/đủ/xác nhận/sửa, discovery không ghi đè, menu 1–8, video/voice/timing/số liệu.
- verify:release đạt: version/lockfile, 11 tài nguyên có SHA-256, đủ tám specialist/reference, logo/Foxy/guide và engine; không còn adapter Sheet/scheduler/đăng bài.
- Render thật và xem contact sheet: sáu bố cục ảnh, mười bố cục carousel (mỗi ca hai trang), ba infographic: 29 PNG, kích thước chuẩn và không tràn. Sáu B-roll có footage chuyển động thật và nhạc. Reels 16 giây chạy đủ tám component nguồn.
- Bộ cài native 9BizClaw nâng cấp và inventory xác nhận đủ chín skill eligible/modelVisible. Cài đủ Playwright/Chromium, FFmpeg, Remotion. Không sửa model, persona hoặc gỡ skill/kết nối khác.
- Môi trường Windows có lỗi native EPERM khi đổi tên backup thư mục cũ thiếu SKILL.md. Bộ cài backup và chỉ sửa các tệp package FreeUp có receipt host/workspace/project và package.name khớp, rồi kiểm tra inventory. Không dùng cách này cho lỗi chính sách hoặc thư mục không xác định sở hữu. Sau phục hồi, chạy lại bộ cài native thành công.

- Agent 9BizClaw thật qua Gateway, hai lượt fixture: hỏi đúng bốn trường thiếu, chưa confirm/guide; sau thông tin và xác nhận rõ, ready=true, chọn số 4 đúng specialist, tạo/lưu ba PNG 1080×1080, caption.txt khớp state và có master_content.md. Đã xem ảnh thực. Không gửi kênh ngoài.
- Reels thật 48.04 giây, tám cảnh, H.264 1080×1920/30fps, AAC stereo có mức âm thanh khác 0; tám cảnh có audio giọng tổng hợp Windows tiếng Anh và karaoke theo timing fixture, nhạc nền trộn. Đây là thử pipeline audio/timing, không phải bằng chứng TTS tiếng Việt tự có trên mọi máy. Đã xem bảng khung hình tám cảnh.
- Skill-creator quick_validate (Python UTF-8) xác nhận hợp lệ entrypoint cài đặt và chín SKILL.md.

Giới hạn: fixture cài lại có đủ bốn host, nhưng đối tượng triển khai/thử agent thật là 9BizClaw Windows. Native TTS tiếng Việt và khả năng gửi media tới từng Telegram/Zalo phụ thuộc cấu hình/quyền host; thử CLI không xác nhận đã gửi ra kênh ngoài. Dùng audio thật/TTs được phép khi cần voice; không báo đã có giọng nếu thiếu. Nội dung tạo bằng model cần học viên xem trước khi tự đăng.

Review độc lập toàn bộ nhánh phát hiện bốn lỗi đã sửa và có test RED→GREEN: render ghi đè media cũ; karaoke chậm chuyển dòng; alias danh sách Reels mất ý; HTML riêng nằm ngoài canvas vẫn qua QA. Chromium thật tái hiện lỗi ghi đè và ảnh ngoài khung trước sửa, cả hai đạt sau sửa. Các lần render hiện có thư mục riêng, chỉ save thành công mới đổi media revision.

- Kiểm parser media native sau guide: kết quả Gateway có payload.mediaUrl/mediaUrls trỏ đúng PNG logo/Foxy/menu số; không chỉ là đường dẫn trong văn bản. Không dùng --deliver hoặc message tool gửi kênh ngoài trong thử nghiệm.
