# Kích hoạt hồ sơ

Chạy CLI profile-discover --workspace <workspace trong runtime.json>, profile-status. JSON chỉ nhập các trường thương hiệu biết trước, không nhập token. Notes USER.md/IDENTITY.md/brand.md/memory/brand.md chỉ đọc phần liên quan và được cấp quyền; trích vào profile-merge --input <JSON> --source <tên nguồn>.

Sáu trường bắt buộc: brand (tên thương hiệu), product (sản phẩm/dịch vụ), audience (khách hàng), usp (điểm khác biệt), tone (giọng), pronouns (cách xưng hô). Các trường thêm: founder, handle, forbiddenWords, colors={accent,background,foreground}, fonts={primary,secondary}, logo/avatar (đường dẫn tương đối trong project), goals. Không ép học viên cung cấp logo/ảnh cá nhân để bắt đầu; thiếu ảnh chọn bố cục chữ. Logo FreeUp và Foxy trên ảnh hướng dẫn là nhận diện quà tặng; ảnh nội dung dùng thương hiệu khách khi đã cung cấp.

Tóm tắt trường có sẵn để khách xác nhận và hỏi thiếu. profile-discover giữ giá trị đang có, trả conflicts để khách chọn; không ghi đè im lặng. profile-confirm --revision N chỉ sau câu xác nhận thật của khách. Sau đủ+confirmed, guide trả file PNG để host gửi ngay trong chat; choose --number 1..8 trả specialist. Không tự chạy confirm từ cùng lượt chỉ vì đã đủ trường.

Hồ sơ và nguồn nằm trong Dữ liệu vận hành/ho-so-thuong-hieu.json. Không yêu cầu Sheet hay tài khoản Facebook. Nếu thiếu quyền đọc/ghi/gửi file, nói đúng giới hạn; không tạo hồ sơ giả hoặc đổi host.

Gửi ảnh trong 9BizClaw/OpenClaw: ưu tiên structured mediaUrl từ guide.reply trong reply payload; khi dùng message tool thì media/attachments chỉ nhắm chính chat đang nhận yêu cầu. Automatic visible-reply hỗ trợ một dòng MEDIA:<đường dẫn> đứng riêng trong lời đáp assistant cuối, không bọc Markdown/code fence. Không đặt MEDIA trong tool output rồi coi đã gửi ảnh. Message-tool-only bắt buộc dùng structured media của host. Theo docs rich-output-protocol đi kèm host; không đổi chính sách để gửi file.
