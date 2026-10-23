# Tiến độ triển khai

Kế hoạch: `docs/superpowers/plans/2026-10-23-freeup-social-content-plan.md` trong workspace bàn giao.

- Ruling: tạo repo riêng trong `freeup-social-content-agent` vì workspace cha không phải checkout Git hợp lệ; không thay repository tham khảo hoặc các gói cũ.
- Ruling: viết mới phần triển khai theo đặc tả, không sao chép mã/tài nguyên tác giả khi điều kiện phân phối chưa rõ. Tài nguyên mẫu FreeUp được tạo mới và có nguồn gốc trong manifest.
- Pre-flight: installer → runtime cần chung tên skill/root; assets → render dùng đường dẫn tiếng Việt; Sheet/chat/publish dùng chung revision và khóa (Ticket, Format, Kênh).
- Task 1–6: đang triển khai; bằng chứng thật được lưu trong verification và báo cáo nghiệm thu. Không đánh dấu đăng thật/cài thật bốn host nếu chỉ kiểm tra mô phỏng.
