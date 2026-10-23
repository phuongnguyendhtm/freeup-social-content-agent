# Vận hành local

Đọc project trong runtime.json. Cú pháp chung: `node <skill>/runtime/cli.cjs <lệnh> --project <project>`; runtime tự lấy project khi chạy từ skill đã cài. Input là file JSON UTF-8, không ghép caption vào lệnh shell.

Các lệnh: `doctor`, `init`, `save --input file.json`, `list`, `get --key "id|format|channel"`, `render --input brief.json`, `assets-sync`, `assets-update`.

Ví dụ lưu bài:

```json
{"id":"bai-001","format":"text","channel":"Facebook","topic":"Ủy quyền","caption":"Nội dung đầy đủ của bài"}
```

Format: idea, text, image, carousel, infographic, video. Channel chỉ là tên kênh viết nội dung, mặc định Facebook (ideas cho ý tưởng); không phải Page ID hay tài khoản đăng. Mã bài dùng chữ không dấu/số/gạch ngang/gạch dưới. Cùng mã có nhiều định dạng độc lập.

`save` trả captionFile/documentFile và revision. Caption .txt giữ nguyên nội dung, file .md có thông tin bài và đường dẫn media. Khi sửa, dùng nguyên id/format/channel và `expectedRevision` vừa đọc; REVISION_CONFLICT thì đọc lại, không ghi đè. Media phải là file có thật trong project.

Trả caption đã lưu ngay trong chat, đính kèm thành phẩm hoặc đưa vị trí mở file phù hợp khả năng host. `list`/`get` để lấy lại bài. Nội dung đã tạo nằm theo ngày/kênh/mã/định dạng; Dữ liệu vận hành do runtime quản lý.
