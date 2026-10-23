# Đối chiếu bản 2.0 với nguồn

Nguồn phuongnguyendhtm/FreeUp-Content-Agent, commit 65ebff0eb4cc2510b47ab7900aef81080c3d91b2. Bản 1.1 dùng renderer đơn giản đã được thay bằng bản 2.0; không dùng kết quả v1.1 làm bằng chứng giữ đủ tiêu chuẩn.

| Nguồn | Bản quà tặng 9BizClaw |
|---|---|
| Researcher | freeup-nghien-cuu; nguồn thật, hook/insight/cảm xúc/dàn ý |
| Copywriter | freeup-viet-bai; giọng/xưng hô/từ tránh dùng, Story Ads bảy phần |
| Image specialist | freeup-anh; đủ sáu hướng, tối đa 50 từ, caption gốc |
| Carousel specialist | freeup-carousel; 1080×1080, khoảng 30–50 từ/trang, cover theo ảnh, list/quote/grid/before-after/tags/checklist/device |
| Infographic specialist | freeup-infographic; 1080×1350, duel/growth/insight, tối đa 4–5 ý |
| Comment chain | freeup-binh-luan; bài dẫn dưới 30 từ và 5–10 bình luận |
| B-roll specialist | freeup-broll; sáu khối CSS nguồn, hook + footage thật + nhạc, caption gốc |
| Reels specialist + engine | freeup-reels; tám component Remotion nguồn và karaoke theo timing thực, mặc định 45–60 giây/5–8 cảnh |
| Setup/điều phối | freeup-social-content; hồ sơ có nguồn, chỉ hỏi thiếu, xác nhận rồi gửi ảnh ngang logo/Foxy/menu 1–8 |

Mỗi specialist có references/TIEU-CHUAN.md chứa toàn bộ tiêu chuẩn chuyên môn nguồn, chuyển đường dẫn sang tiếng Việt và chỉ dẫn chạy bằng CLI mới. Các ví dụ CSS/HTML được giữ để agent tạo bố cục riêng, renderer hỗ trợ htmlFile; không ép mọi bài vào cùng mẫu mặc định. Tiêu chuẩn là hướng dẫn cho model; agent vẫn cần xem sản phẩm thật để duyệt chất lượng.

Đã bỏ mọi adapter/lệnh gọi Google Sheets, Apps Script, duyệt đăng, scheduler và xuất bản Facebook của gói. Không gỡ kết nối chung của 9BizClaw. Caption/bài gốc vẫn lưu local theo mã, định dạng, phiên bản. Khách tự đăng.

Chuẩn hóa mâu thuẫn nguồn: ảnh mục tiêu 20–40, tối đa 50 từ; số trang carousel theo nội dung/yêu cầu; Reels có thể ngắn hơn khi khách yêu cầu nhưng không cắt mất ý âm thầm. Sửa đường dẫn viết bài không tồn tại trong nguồn. Không chuyển dữ liệu tài khoản, ảnh/nhạc cá nhân của tác giả, Google Fonts tải mạng hoặc số lượt xem/phần trăm giả định vào runtime. Giữ component thiết kế nhưng bỏ số liệu mặc định bịa, profile cá nhân hard-code và avatar mạng.

Tài nguyên: ảnh/video/nhạc mẫu tạo riêng cho FreeUp; logo FreeUp từ bộ nhận diện của chủ sở hữu; Foxy chuẩn ôm trái tim từ file Drive chị cung cấp trong phiên làm việc. Khi nâng cấp, checksum bảo vệ tài nguyên, file khách sửa được giữ lại. Thư mục Media input/output trở thành Tài nguyên đầu vào/Nội dung đã tạo; cấu hình vận hành nằm Dữ liệu vận hành.

Xem KIEM-THU.md cho bằng chứng và giới hạn. Không tuyên bố TTS tiếng Việt hay gửi media ở mọi kênh đã đạt nếu chưa chạy thực tế trên kênh đó.
