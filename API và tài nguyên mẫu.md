# API và tư liệu mẫu

FreeUp dùng AI đã được cấu hình trong 9BizClaw để nghiên cứu và viết; công cụ trên máy dựng ảnh chữ, carousel, infographic và video từ tư liệu có sẵn. Không cần thêm API Pexels hoặc Gemini cho luồng này. Lần đầu vẫn cần mạng để tải công cụ; truy cập AI của 9BizClaw theo cấu hình/gói đang dùng.

| Nhu cầu | Hiện tại | API bổ sung |
|---|---|---|
| Viết bài, ảnh chữ, carousel, infographic | Dùng AI 9BizClaw và bộ dựng local | Không bắt buộc Pexels/Gemini |
| B-roll/Reels từ ảnh/video/nhạc bạn thêm | Dùng file local | Không bắt buộc Pexels/Gemini |
| Tự tìm và tải ảnh/video Pexels | FreeUp chưa tích hợp | Tích hợp Pexels API cần key; tải thủ công rồi thêm file thì không cần key API |
| Tạo ảnh AI mới bằng Gemini | FreeUp chưa tích hợp Gemini image API | Khi gọi trực tiếp Gemini API cần thông tin xác thực phù hợp; nếu host đã cung cấp công cụ tạo ảnh thì dùng công cụ đó theo quyền hiện có |

Nhập API key riêng không tự bật những tính năng chưa tích hợp. Không đưa key vào thư mục tư liệu hay GitHub. Khi thiếu ảnh/video đúng chủ đề, thêm file của bạn hoặc dùng công cụ được phép trên host; AI không được báo đã tạo/tải file khi chưa có file thật.

Bộ mẫu từ repo FreeUp-Content-Agent của chị Phương: ba ảnh cá nhân, ba ảnh nhân vật, ba clip nền khác cảnh và 14 file nhạc nền giữ nguyên byte/tên gốc. Các mẫu FreeUp đã có vẫn giữ. Mẫu có sẵn trong Tài nguyên đầu vào ngay khi tải và giải nén, không cần cài đặt để xem/nghe. Hệ thống/assets giữ bản nguồn để bộ cài bổ sung file thiếu và cập nhật; file bạn đã sửa được giữ nguyên.

Ảnh/video trong Mẫu tham khảo giúp hiểu loại file cần chuẩn bị. Chép tư liệu của bạn vào thư mục cùng loại, nêu tên file muốn dùng. Không lấy người trong mẫu làm chủ thương hiệu/học viên, không dùng mẫu làm avatar hoặc video cá nhân nếu chưa được yêu cầu rõ. Ba ảnh nhân vật chỉ minh họa cách sắp tư liệu; nội dung nhắc ai phải dùng đúng ảnh người đó. Không suy ra lời nói, chứng thực hay quan hệ thương hiệu từ ảnh.

Nguồn kỹ thuật: [Pexels API](https://www.pexels.com/api/documentation/), [Gemini image generation](https://ai.google.dev/gemini-api/docs/image-generation). Nguồn từng file: Hệ thống/assets/NGUON-TAI-NGUYEN.md và manifest.json.
