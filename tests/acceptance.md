# Nghiệm thu trước bản ổn định

Môi trường và bằng chứng hiện tại: [KIEM-THU.md](../KIEM-THU.md). Fixture chỉ kiểm tra bộ cài và bộ máy; không xác nhận kết nối dịch vụ thật.

- [x] 35 bài kiểm tra: phiên bản, duyệt, đối soát, đồng bộ hai chiều và bộ cài bốn host.
- [x] Kết xuất thật ảnh, carousel, infographic, video có nhạc; đủ dấu tiếng Việt.
- [x] Mẫu FreeUp sạch riêng và bản XLSX cố định, giữ header/dropdown.
- [x] Cài native 9BizClaw, inventory eligible, engine sẵn sàng, một lượt agent trả đúng nội dung đã lưu.
- [x] Cùng caption từ 9BizClaw ghi lên Sheet nghiệm thu qua connector phiên triển khai, đọc lại khớp và hết pending ở project nghiệm thu.
- [x] Rà soát độc lập và sửa 8 lỗi Important bằng kiểm tra tái hiện.
- [ ] Từ chat chủ tài khoản trong 9BizClaw: chỉ gửi URL repo; agent cài, sao chép mẫu, bind Sheet và trả cùng nội dung ở chat/Sheet bằng kết nối native.
- [ ] Sửa/duyệt trên chat và trên Sheet trong phiên thật, kiểm tra xung đột và sắp xếp hàng.
- [ ] Mở một phiên thật mới trên OpenClaw tiêu chuẩn, Codex và Claude Code; xác minh host nhận skill sau cài URL.
- [ ] Chủ tài khoản duyệt nội dung/Page thử nghiệm cụ thể; upload media qua công cụ native trong chat riêng và nhóm được cấp quyền, đọc lại bài và permalink.
- [ ] Tạo tác vụ lịch native được chủ cho phép; kiểm tra đến hạn, máy ngủ, đăng chưa rõ kết quả và không đăng trùng.
- [x] GitHub Actions đạt trên Windows, macOS và Linux từ repo mới (commit 07b551c).

Chỉ bỏ nhãn thử nghiệm sau khi các mục còn lại có bằng chứng. Không đưa token, log phiên hoặc dữ liệu khách vào repo.
