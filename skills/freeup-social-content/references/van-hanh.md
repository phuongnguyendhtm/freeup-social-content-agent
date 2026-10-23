# Lệnh vận hành

Đọc `runtime.json` để lấy project. Quy ước bên dưới: `<cli>` là đường dẫn tuyệt đối tới `runtime/cli.cjs` của skill đã cài. Dữ liệu dài ghi JSON UTF-8 bằng file tool, không nối caption vào câu lệnh shell.

```text
node <cli> init --project <project>
node <cli> save --project <project> --input <ticket.json>
node <cli> get --project <project> --key <id|format|channel>
node <cli> list --project <project>
node <cli> render --project <project> --input <brief.json>
node <cli> approve --project <project> --key <key> --type produce --revision 1
node <cli> approve --project <project> --key <key> --type publish --revision 2
```

Ticket mới: `{ "id":"bai-001", "format":"image", "channel":"<Page ID thật>", "topic":"...", "caption":"nguyên bài viết", "media":[] }`. Format: `idea`, `image`, `carousel`, `infographic`, `video`. Ý tưởng dùng `channel:"ideas"`. Sửa ticket thêm `expectedRevision` đúng giá trị vừa đọc. Media là đường dẫn tệp thực tế trong project; nhiều ảnh dùng danh sách có thứ tự. `postTime` nếu có phải là ISO 8601 kèm múi giờ, ví dụ `2026-11-01T09:00:00+07:00`.

Khách yêu cầu viết bài là đủ để soạn và trả bài, không bắt duyệt ý tưởng riêng nếu đã yêu cầu sản xuất trực tiếp. Đăng luôn cần bản xem trước và phê duyệt đúng phiên bản. ID do runtime dùng để giữ cùng việc; không bắt khách nhớ ID.

Sau save/render: trả nội dung trong chat bằng chính dữ liệu đã lưu, rồi đồng bộ Sheet cùng lượt theo `dong-bo-sheet.md`. Nếu Sheet lỗi, báo kết quả vẫn đã lưu local và chờ đồng bộ. Không sản xuất lại để thử ghi Sheet. Lỗi `BUSY_RETRY_LATER`: lượt khác đang giữ khóa; thử lại sau, không xóa khóa đang dùng. Nếu máy tắt giữa ghi, giữ dữ liệu để kiểm tra; không tự reset.
