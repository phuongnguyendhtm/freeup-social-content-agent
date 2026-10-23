# Tiến độ triển khai

Kế hoạch: `docs/superpowers/plans/2026-10-23-freeup-social-content-plan.md` trong workspace bàn giao.

- Ruling: tạo repo riêng trong `freeup-social-content-agent` vì workspace cha không phải checkout Git hợp lệ; không thay repository tham khảo hoặc các gói cũ.
- Ruling: viết mới phần triển khai theo đặc tả, không sao chép mã/tài nguyên tác giả khi điều kiện phân phối chưa rõ. Tài nguyên mẫu FreeUp được tạo mới và có nguồn gốc trong manifest.
- Pre-flight: installer → runtime cần chung tên skill/root; assets → render dùng đường dẫn tiếng Việt; Sheet/chat/publish dùng chung revision và khóa (Ticket, Format, Kênh).
- Task 1–6: đang triển khai; bằng chứng thật được lưu trong verification và báo cáo nghiệm thu. Không đánh dấu đăng thật/cài thật bốn host nếu chỉ kiểm tra mô phỏng.
- Task 1: complete — repo local độc lập, mã mới, SKILL.md chuẩn và reference cố định; commit khởi tạo 4d85cbd.
- Task 2: 7 kiểm tra bộ cài/allowlist/host đạt; native 9BizClaw đang chạy. Bộ cài hỗ trợ bố cục OpenClaw riêng qua state-dir/cli.
- Task 3: complete — 7 tài nguyên FreeUp tạo mới; render thật đủ bốn định dạng; update giữ chỉnh sửa khách và xác minh SHA-256.
- Task 4: mẫu FreeUp đã copy/làm sạch/readback; schema và cơ chế hai chiều đã qua test; cần bằng chứng đồng bộ với bản sao riêng.
- Task 5: core/CLI/reference đã triển khai và kiểm tra; chưa đăng Page thật hoặc tạo lịch nền vì chưa có preview/Page thử nghiệm được duyệt.
- Ruling: engine video local bản đầu là nền chữ/chuyển động có nhạc, chưa tái tạo đầy đủ footage/voice pipeline của tác giả; phải công bố giới hạn, không gọi là đã nghiệm thu B-roll người thật.
- Ruling: bộ cài được kiểm tra ở bốn workspace fixture; không đồng nhất với bốn phiên agent thật. Nghiệm thu host thật được tách rõ trong KIEM-THU.md.
- Verification: `npm test` 25/25 PASS; `npm run verify:release` PASS, manifest 7 tài nguyên. Có bằng chứng RED trước các nhóm triển khai trong lịch sử công việc.
