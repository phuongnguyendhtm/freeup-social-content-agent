# Mẫu Sheet bắt buộc

- Nguồn mẫu chị cung cấp: https://docs.google.com/spreadsheets/d/1JpTEMMK9Np-zRvkg9OFiUtivfF3FmoSwRhoSX6C_vto/edit
- Mẫu FreeUp đã sao chép, làm sạch: https://docs.google.com/spreadsheets/d/1N2vWZTWNfrXVtVJXM2MUlFf5nQ0EHw3a1LS7cw7-IUc/edit
- Tạo bản riêng: https://docs.google.com/spreadsheets/d/1N2vWZTWNfrXVtVJXM2MUlFf5nQ0EHw3a1LS7cw7-IUc/copy
- Sơ đồ máy đọc: `sheet-schema.json` cạnh file này. Phải đọc file đó trước khi bind hoặc đồng bộ.

Sao chép **cả workbook** bằng công cụ Drive copy của khách. Không ghi vào hai ID mẫu trên. Thiếu quyền thì hướng dẫn cấp quyền đúng mẫu; không tự thiết kế Sheet khác. Không chạy menu/hàm setupSystem của Apps Script vì có thể xóa tab.

`💡 IDEA HUB`: A ID, B nguồn, C nội dung/link, D hook, E góc nhìn, F trụ cột, G phễu, H định dạng, I trạng thái, J thời gian. Duyệt sản xuất: **✅ DUYỆT - LÀM NGAY**.

`🚀 CONTENT PIPELINE`: A Ticket ID, B Format, C Caption, D đường dẫn media local (mỗi tệp một dòng), E Page ID, F giờ ISO 8601, G duyệt đăng. Giá trị G chỉ gồm **📝 Đang kiểm duyệt**, **🚀 ĐĂNG BÀI NGAY**, **✅ HOÀN THÀNH**. Không dùng tên Page mơ hồ thay ID trong E; agent giải quyết tên Page cho khách qua kết nối hiện tại.

Ghi chú ô A chứa khóa/revision/hash và permalink đã xác minh. Agent thêm link Drive xem trước vào ghi chú ô D khi media đã được upload vào Drive riêng và kiểm tra quyền xem. Không tự thêm cột/tab. Caption được ghi kiểu chuỗi, không thành công thức dù bắt đầu `=`.
