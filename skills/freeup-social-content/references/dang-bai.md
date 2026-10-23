# Duyệt và đăng fanpage

1. Xác định đúng Page từ kết nối Facebook hiện tại. Hiển thị nguyên caption, tập media theo thứ tự, Page và giờ. Phê duyệt là tin chủ tài khoản đồng ý đúng preview hoặc trạng thái duyệt trên Sheet riêng được cấp quyền.
2. Chạy `approve --type publish --revision N` chỉ sau phê duyệt đó. Không dùng lời duyệt cũ cho nội dung đã sửa.
3. Khi thực sự tới lượt thực thi, chạy `prepare-publish --key K`. Lệnh kiểm hash file, nội dung, Page và lịch; trả operationId. Bước này khóa lần đăng trước khi gọi provider. Không prepare rồi để đó chờ lịch.
4. Dùng native connected apps của host để nạp file và đăng. 9BizClaw dùng Composio native; đọc reference hiện tại của host về media/file upload và schema thực tế. Một ảnh dùng photo post; nhiều ảnh dùng action gộp một bài; video dùng action video được hỗ trợ. Không tự chuyển sang trang cá nhân, lấy Page token, tắt policy hoặc dùng browser để né từ chối.
5. Lưu kết quả provider, đọc lại post ID để xác minh đúng Page, caption/media và permalink. Chỉ khi readback thành công, ghi JSON `{operationId,postId,permalink,verified:true}` rồi gọi confirm-publish. Receipt phải đến từ lần đọc provider hiện tại, không suy từ việc đã click/gửi hoặc ảnh screenshot.
6. Trả link bài thật trong chat, đồng bộ Sheet; G chỉ HOÀN THÀNH sau xác minh. Nếu mất mạng/không rõ kết quả sau gửi, gọi uncertain; tra bài đã có trên Page trước. Không prepare/gửi lại cùng việc. Chỉ reconcile-absent sau provider xác nhận chưa có bài, rồi cần duyệt lại để thử lại.

## Lịch

Khách chọn bật theo dõi Sheet hoặc hẹn giờ thì tạo kế hoạch bằng scheduler-plan với `{approved:true,intervalMinutes:5,timezone:"Asia/Saigon"}`. Dùng kết quả để đăng ký công việc **chủ tài khoản** qua scheduler/Nhiệm vụ native thực sự có trong host. Tool này chỉ xuất kế hoạch, chưa tạo lịch. Xác minh tác vụ bằng native readback rồi mới báo bật tự động. Không dùng heartbeat/cron khác để giả quyền chủ.

Máy phải hoạt động. Lịch trễ quá 15 phút yêu cầu chủ xác nhận lại; thời gian luôn có offset. Native task không được quyền upload/đăng: báo bước bị chặn, giữ hàng đợi. Kiểm tra quyền ngay tại môi trường chạy nền trước khi quảng cáo tự đăng không cần thao tác.
