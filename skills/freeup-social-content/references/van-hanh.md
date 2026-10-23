# Vận hành local

runtime.json được bộ cài ghi theo agent/workspace thật. Chạy node <engineSkill>/runtime/cli.cjs <command> --project <project>. Tham số đường dẫn dùng argument array hoặc quote shell đúng; không ghép caption thành lệnh shell. Ghi input JSON bằng công cụ file trước khi gọi CLI.

- doctor: engine khả dụng; init: thư mục; profile-status/profile-discover/profile-merge/profile-confirm/guide/choose: kích hoạt và menu.
- save --input file.json: {id,format,channel,topic,caption,masterContent,media,expectedRevision}. format: idea/text/image/carousel/infographic/comment_chain/broll/reels. id ASCII chữ/số/gạch. media là file trong project. Cập nhật bản có sẵn cần expectedRevision.
- list; get --key id|format|channel: dùng nguyên key, quote dấu |.
- render --input brief.json: tạo PNG/MP4, chưa ghi bài; kiểm file rồi save kèm media. Dùng cùng id khi chuyển định dạng. Không đổi bài gốc thành tóm tắt ngoài yêu cầu.
- assets-sync: tài nguyên đi kèm; assets-update --version v2.0.0-beta.1: cập nhật từ GitHub FreeUp có checksum, giữ tài nguyên khách đã sửa.

Tài nguyên đầu vào: Ảnh cá nhân, Ảnh danh nhân, Ảnh minh họa, Ảnh mẫu, Video nền, Video mẫu, Nhạc nền, Thương hiệu của tôi. Kết quả: Nội dung đã tạo/ngày/kênh/mã bài/định dạng; master_content.md ở thư mục mã bài, caption.txt/noi-dung.md ở định dạng. Dữ liệu vận hành chứa trạng thái/phiên bản/hồ sơ.

Khởi tạo media bằng node <engineSkill>/runtime/setup.cjs khi cần. Không cài lại nếu doctor xác nhận đủ. Không chạy scripts/.. được ghi trong tài liệu nguồn; các lệnh đó đã thay bằng CLI hiện tại. Không đụng kết nối chung của host. Bản nâng cấp giữ dữ liệu khách và backup phần skill cũ.

Mỗi lần render tạo thư mục Bản dựng riêng, không ghi đè media bản đang lưu. Sau render và QA, save mới gắn bộ file đó vào revision mới; conflict không làm đổi media cũ. Giữ các file chưa lưu khi lỗi để kiểm tra, không tự xóa dữ liệu khách.
