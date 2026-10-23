# Tiến độ triển khai

Kế hoạch: `docs/superpowers/plans/2026-10-23-freeup-social-content-plan.md` trong workspace bàn giao.

- Ruling: tạo repo riêng trong `freeup-social-content-agent` vì workspace cha không phải checkout Git hợp lệ; không thay repository tham khảo hoặc các gói cũ.
- Ruling: viết mới phần triển khai theo đặc tả, không sao chép mã/tài nguyên tác giả khi điều kiện phân phối chưa rõ. Tài nguyên mẫu FreeUp được tạo mới và có nguồn gốc trong manifest.
- Pre-flight: installer → runtime cần chung tên skill/root; assets → render dùng đường dẫn tiếng Việt; Sheet/chat/publish dùng chung revision và khóa (Ticket, Format, Kênh).
- Task 1–6: có bản triển khai thử nghiệm; bằng chứng thật được lưu trong verification và báo cáo nghiệm thu. Chưa phát hành ổn định vì chưa nghiệm thu đăng thật và cả bốn phiên agent thật.
- Task 1: complete — repo local độc lập, mã mới, SKILL.md chuẩn và reference cố định; commit khởi tạo 4d85cbd.
- Task 2: 7 kiểm tra bộ cài/allowlist/host đạt; đã cài native và thử một lượt agent 9BizClaw. Bộ cài hỗ trợ bố cục OpenClaw riêng qua state-dir/cli.
- Task 3: complete — 7 tài nguyên FreeUp tạo mới; render thật đủ bốn định dạng; update giữ chỉnh sửa khách và xác minh SHA-256.
- Task 4: mẫu FreeUp đã copy/làm sạch/readback; schema và cơ chế hai chiều đã qua test. Ghi/đọc lại bản sao riêng bằng connector phiên triển khai đã khớp caption từ 9BizClaw; chưa đồng nhất bằng chứng này với native Composio của 9BizClaw.
- Task 5: core/CLI/reference đã triển khai và kiểm tra; chưa đăng Page thật hoặc tạo lịch nền vì chưa có preview/Page thử nghiệm được duyệt.
- Ruling: engine video local bản đầu là nền chữ/chuyển động có nhạc, chưa tái tạo đầy đủ footage/voice pipeline của tác giả; phải công bố giới hạn, không gọi là đã nghiệm thu B-roll người thật.
- Ruling: bộ cài được kiểm tra ở bốn workspace fixture; không đồng nhất với bốn phiên agent thật. Nghiệm thu host thật được tách rõ trong KIEM-THU.md.
- Verification: `npm test` 35/35 PASS; `npm run verify:release` PASS, manifest 7 media và 1 mẫu XLSX. Có bằng chứng RED trước các nhóm triển khai trong lịch sử công việc.
- Ruling: mẫu cloud mới chỉ có quyền owner; connector hiện tại không cung cấp public-link sharing, browser không điều khiển được và hosted Composio chưa có Drive connection. Đóng thêm bản XLSX export chính xác từ mẫu sạch, kiểm header/dropdown và checksum, cho khách import bản cố định này khi thiếu quyền cloud; không tái tạo Sheet tùy ý. Chi phí: phải xác minh dropdown sau import trước khi bind.
- Final review: 8 Important findings; đã tái hiện bằng kiểm tra RED. Fix pass xử lý approval cũ, sync generation, xóa lịch, giữ notes, giữ metadata ý tưởng, đóng băng media, trả bản mới nhất và khôi phục khóa của tiến trình đã chết. 35/35 PASS sau sửa; không có Minor được hoãn.
- Clean-package check: tái hiện lỗi test cần thư mục verification có sẵn; thêm khởi tạo riêng cho từng nhóm test để gói tải mới chạy độc lập, không phụ thuộc thứ tự test.
- GitHub beta: tạo repo riêng và tag v1.0.0-beta.1 tại commit 07b551c; clone từ GitHub chạy 35/35 PASS, tải đủ tài nguyên có checksum. CI Node.js 22 đạt cả Windows, macOS và Ubuntu. Import bản mẫu XLSX sang Google Sheets thật và validate schema đạt.
- Các điểm chờ live: native 9BizClaw CLI bị no_identity trước Composio, phiên Codex URL bị sandbox chặn mạng; không chuyển sang danh tính/gói khác để giả nghiệm thu. Cần phiên chat chủ tài khoản và quyền mạng tương ứng. Chưa đăng thật hoặc tạo lịch nền.
