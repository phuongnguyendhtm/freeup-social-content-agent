# Trạng thái nghiệm thu

## Đã kiểm tra

- Bộ kiểm tra tự động trên Windows/Node.js 24: phiên bản, xung đột chat/Sheet, duyệt, hash media, chặn đăng lặp, lịch, tài nguyên và bộ cài bốn loại host trên workspace thử nghiệm. Số lượng và kết quả cuối cùng được ghi ở phần bằng chứng phát hành.
- Kết xuất thật: ảnh 1080×1350, carousel 3 trang, infographic 1080×1920, video dọc 8 giây có nhạc. 7 file mẫu mới của FreeUp; checksum trong manifest.
- Sao chép workbook nguồn thành mẫu FreeUp có ID khác, xóa dữ liệu ví dụ và giữ header/dropdown. Đã đọc lại qua Google Sheets API.
- Kiểm tra cấu trúc gói phát hành và không nhúng đường dẫn người tạo trong runtime/skill.
- Cài native vào 9BizClaw/OpenClaw 2026.9.9 trên máy triển khai, inventory xác nhận skill eligible. Cài Playwright/FFmpeg vào thư mục skill độc lập thành công.
- Một lượt agent 9BizClaw local mới đã đọc skill/reference, chạy doctor, lưu Ticket và trả đúng caption đã lưu. Lượt này không gửi tin ra Telegram/Zalo hoặc đăng Facebook.
- Lượt thử native Sheet riêng trong 9BizClaw CLI đã gọi Composio để kiểm tra connection nhưng bị `no_identity` tại `plugin-before-tool-call`. Đã dừng đúng tại lớp quyền; không xác thực mới hoặc mượn danh tính. Project native vẫn `boundSheet:false`, `pendingSync:1`. Cần thử lại từ chat có danh tính chủ tài khoản; lỗi CLI này chưa chứng minh tình trạng quyền của chat thật.
- Ghi 2 hàng ý tưởng/thành phẩm từ chính caption của lượt 9BizClaw đó vào bản sao Sheet nghiệm thu qua Google Drive connector của phiên triển khai; đọc lại khớp caption, khóa/revision/generation và dropdown, hàng đợi đồng bộ về 0. Đây chưa phải kiểm tra native Composio Google Sheets trong phiên 9BizClaw.
- Rà soát độc lập phát hiện 8 lỗi Important; đã viết kiểm tra tái hiện và sửa: duyệt chat bị dữ liệu Sheet cũ hủy, ack cùng revision, xóa lịch, mất preview note, mất metadata ý tưởng, media bị đổi sau prepare, trả caption cũ sau sync và khóa mồ côi.

## Bản mẫu phân phối

Cloud template mới hiện chỉ có quyền owner. Gói kèm file XLSX export trực tiếp từ mẫu sạch, đã kiểm tra đúng 2 tab/header/dropdown và không có dữ liệu ví dụ. Agent import file cố định này vào Drive khách nếu chưa có quyền bản cloud; không tự thiết kế lại Sheet.

## Chưa xác nhận

- Đăng bài thật lên fanpage và chạy lịch nền tới thời điểm đăng; không tự đăng bài thử vào Page của khách.
- Một phiên agent thật mới trên cả bốn host; kiểm tra bộ cài bằng fixture không thay thế kiểm tra này.
- Đồng bộ Google Sheets trực tiếp qua native Composio của 9BizClaw bằng tài khoản khách; hiện bằng chứng live Sheet dùng connector của phiên triển khai.
- Windows/macOS/Linux qua GitHub Actions: workflow đã chuẩn bị, cần kết quả run trên GitHub.
- Video B-roll người thật/giọng AI; engine local hiện có video nền chữ/chuyển động và nhạc.

Không quảng cáo toàn bộ quy trình tự đăng đã nghiệm thu khi các phần trên chưa có bằng chứng.

## Bằng chứng phát hành thử nghiệm

- Ngày 23/10/2026: 35/35 kiểm tra tự động đạt trên bản sao gói sạch; `verify:release` đạt, xác minh checksum 8 file phân phối.
- Mẫu XLSX: đúng hai tab, header và danh sách dropdown; không còn hàng dữ liệu ví dụ.
- Đã sửa 8 lỗi từ rà soát độc lập, mỗi lỗi có kiểm tra tái hiện trước khi sửa. Kiểm tra bản sao gói sạch phát hiện thêm phụ thuộc thư mục test cũ và đã sửa.
