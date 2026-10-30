# Vận hành trong thư mục FreeUp

runtime.json của skill đã cài lưu project, workspace, engineSkill và skillRoot. engineSkill là project/Hệ thống; skillRoot là nơi host nhận diện chín skill, không phải thư mục cha engineSkill. Chạy node "<engineSkill>/runtime/cli.cjs" <command> --project "<project>". Dùng argument array hoặc quote đường dẫn, không ghép caption thành shell.

- doctor kiểm công cụ; init khởi tạo dữ liệu. profile-discover/profile-status/profile-merge/profile-confirm phục vụ kích hoạt; guide trả ảnh menu, choose chọn số.
- save --input file.json nhận id, format, channel, topic, caption, masterContent, media, expectedRevision. format kỹ thuật giữ idea/text/image/carousel/infographic/comment_chain/broll/reels. id dùng chữ/số/gạch ASCII; cập nhật cần expectedRevision từ get.
- list/get lấy nội dung đã lưu. Giữ nguyên key có dấu | và quote đúng. Lấy đường dẫn do CLI trả, không ghép tên theo phiên bản cũ.
- render --input brief.json xuất PNG/MP4; kiểm file rồi save. Giữ cùng id khi chuyển định dạng; không tự rút gọn bài gốc ngoài yêu cầu.
- assets-sync dùng mẫu đi kèm; assets-update --version v2.1.0 dùng tài nguyên GitHub FreeUp có checksum và giữ file khách đã sửa.

Tài nguyên đầu vào: Thương hiệu của tôi, Ảnh cá nhân, Ảnh nhân vật, Ảnh minh họa, Video nền, Nhạc nền, Giọng đọc, Mẫu FreeUp. Mẫu được thêm khi cài. File khách giữ nguyên tên.

Đầu ra: Nội dung đã tạo/ngày/kênh/mã bài/định dạng tiếng Việt. Bài gốc.md nằm ở mã bài; Bài viết.txt và Chi tiết.md ở định dạng. Mỗi render tạo Bản dựng riêng. Bài cũ vẫn dùng đường dẫn trong state, không đổi/xóa file cũ chỉ để Việt hóa.

Đọc workflow thích hợp trong engineSkill/workflows. Khi cần công cụ, setup.cjs cài và selftest.cjs xuất thử; không cài lại nếu doctor đã xác nhận đủ. Không tự sửa hướng dẫn/tiêu chuẩn kỹ thuật trong lúc tạo bài. Không dùng scripts/API/kết nối của repo nguồn.
