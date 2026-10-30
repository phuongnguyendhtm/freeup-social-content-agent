# Kiểm thử 2.0.1 — 30/10/2026

- Đã nhận lỗi gốc của học viên: native 2026.9.9 bị `EPERM` khi đổi tên `.fs-safe-move-…tmp` sang `skills/freeup-social-content`. Nhánh phục hồi 2.0.0 yêu cầu đích đã tồn tại nên không xử lý lần cài mới này.
- Thêm kiểm thử tái hiện đúng JSON log có đường dẫn Windows escape hai lớp. Các ca kiểm tra từ chối sai đích, nguồn ngoài thư mục skills, chính sách chặn, nguồn bị thay, native chưa xác minh và thư mục do tiến trình khác tạo.
- Kiểm tra cạnh tranh khi tạo/thay thư mục, lỗi chép hai tệp đầu, ghi tệp dở và định danh filesystem bằng 0: không ghi đè thư mục lạ, không xóa tệp không chứng minh được sở hữu; lần chép lỗi thông thường có thể chạy lại.
- Windows local: 70/70 test đạt trên Node 24.22.1 và 22.22.3; `verify:release` đạt cho 2.0.1, chín skill và 11 tài nguyên có checksum.
- Native OpenClaw 2026.9.9 thật, workspace thử riêng có dấu/khoảng trắng: cài mới bình thường đạt. Lượt tái hiện có kiểm soát gây `EPERM` tại đúng lời gọi đổi tên cuối của native: phục hồi đủ chín skill, inventory thật xác nhận, receipt `verified: true`, `mediaReady: true`, selftest xuất PNG/B-roll/Reels đạt. Không sửa file native đã cài hoặc cấu hình host thật.
- Review độc lập đã kiểm tra cơ chế phục hồi và bảo toàn dữ liệu; không còn phát hiện P1/P2 trong phạm vi bản sửa.

Chưa chạy trực tiếp trên máy học viên. Lượt tái hiện chứng minh đường phục hồi cho lỗi đã gửi, không xác định tiến trình nào khóa thư mục trên máy đó. Lỗi quyền ghi thực sự hoặc định danh thư mục không xác minh được vẫn dừng và lưu báo cáo; không đổi ACL, tắt bảo vệ Windows hay bỏ qua chính sách native.

## Lịch sử kiểm thử 2.0.0 — 30/10/2026

- Windows local: 49/49 test đạt trên Node 22.22.3 và 24.22.1. GitHub Actions đạt trên Windows, macOS, Ubuntu: [run 41047932579](https://github.com/phuongnguyendhtm/freeup-social-content-agent/actions/runs/41047932579). Ca phục hồi rename chỉ chạy trên Windows.
- `verify:release` đạt: version/lockfile 2.0.0, chín skill và 11 tài nguyên có checksum; không có adapter Google Sheets hoặc tự đăng Facebook.
- Cài từ ZIP đã giải nén vào workspace tiếng Việt mới, bằng native OpenClaw 2026.9.9 đi kèm 9BizClaw: nhận đủ chín skill, receipt `verified: true`, `mediaReady: true`. Tải dependencies, probe Chromium/FFmpeg/Remotion và chạy selftest thật đều đạt.
- Selftest xuất năm PNG (ảnh đơn, carousel ba trang, infographic), B-roll 3 giây và Reels khoảng 6 giây. Đã xem ảnh và khung hình; video H.264 1080×1920/30fps, audio AAC. Đây là ca kiểm tra đường chạy, không phải mẫu nội dung để phát hành cho khách.
- Kiểm tra xác nhận dữ liệu sẵn có, skill khác, allowlist dùng chung và agent khác được giữ nguyên. Selftest dùng hồ sơ QA riêng; không tự xác nhận hồ sơ thật của học viên.
- Cài lại cùng ZIP qua native: chín cập nhật có backup, receipt verified/mediaReady và selftest đều đạt lần nữa; dữ liệu khách thử, skill khác, agent khác và allowlist dùng chung vẫn giữ nguyên.
- Test hồi quy: lỗi native giữ cả stdout/stderr; chính sách chặn không được đổi thành copy trực tiếp; thư mục không xác định sở hữu không bị ghi đè; phục hồi rename có backup; cài lại giữ dữ liệu/dependencies; đường dẫn tương đối được chuẩn hóa; media tải thiếu hoặc selftest lỗi không có receipt thành công.
- Review độc lập đã kiểm tra lại các bản sửa về đường dẫn, binary Remotion, hai chế độ Chromium, log media và allowlist riêng của agent; không còn phát hiện P1/P2 chưa xử lý trong phạm vi này.

Tại thời điểm kiểm thử 2.0.0, chưa có mã lỗi gốc hoặc phiên bản máy học viên. Báo cáo này khi đó chưa xác nhận tái hiện đúng lỗi; bằng chứng mới và phần sửa tương ứng được ghi ở mục 2.0.1 phía trên.

Bản này dùng tài nguyên FreeUp/file khách; chưa tích hợp tìm Pexels hoặc tạo giọng ElevenLabs. TTS tiếng Việt và gửi file qua từng kênh còn phụ thuộc host. Lượt 30/10 không chạy lại tất cả bố cục hoặc gửi tin ra kênh ngoài; các kiểm tra rộng hơn dưới đây thuộc bản trước.

## Lịch sử kiểm thử 2.0.0-beta.1 — 23/10/2026

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
