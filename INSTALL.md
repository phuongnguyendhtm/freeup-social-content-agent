# Cài FreeUp 2.1.2 trên 9BizClaw

## Chọn thư mục

Giải nén ZIP, lấy thư mục FreeUp bên trong đặt ở vị trí cố định, đường dẫn ngắn như D:\FreeUp. Thư mục này chứa Tài nguyên đầu vào, Nội dung đã tạo, Dữ liệu vận hành và Hệ thống. Không tự thay workspace của 9BizClaw bằng thư mục này.

Agent xác định root host từ %APPDATA%/9BizClaw-v3/install-root.json, agent hiện tại và workspace trong cấu hình. Dùng Node đi kèm host. Bản native 2026.9.9 được thử với Node 24.22.1; mã FreeUp hỗ trợ Node 22+ nhưng native có thể yêu cầu cao hơn.

Chạy từ gốc gói tải, đặt đường dẫn trong dấu nháy:

    node install.cjs --host 9bizclaw --root "<root 9BizClaw>" --agent "<id agent>" --project "<thư mục FreeUp cố định>" --with-media

Có thể bỏ --root khi pointer host tồn tại. --plan chỉ xem đích. Nếu bỏ --project, bản đã cài dùng lại project trong runtime.json; lần cài đầu qua CLI dùng thư mục gốc gói tải. Không đoán hoặc cấp quyền truy cập vượt quyền host: nếu 9BizClaw chưa được phép đọc/chạy tại thư mục được chọn, hướng dẫn chủ máy cấp quyền theo cơ chế chính thức.

## Bộ cài thực hiện

1. Kiểm tra đường dẫn và dữ liệu cũ. Chép ba thư mục dữ liệu khi người dùng chọn chuyển từ nơi cũ; giữ nguồn, dừng khi có xung đột. Tệp riêng ngoài ba thư mục vẫn ở nơi cũ.
2. Cài chín skill bằng native, giữ chính sách host và kiểm inventory. Ghi project, engineSkill và skillRoot vào runtime.json để cuộc trò chuyện sau dùng đúng thư mục.
3. Cập nhật Hệ thống trong thư mục FreeUp, giữ node_modules khi chép mã và tạo hướng dẫn/tài nguyên mẫu. Dữ liệu hồ sơ và nội dung không bị khởi tạo lại.
4. --with-media cài công cụ rồi xuất thử ảnh đơn, carousel, infographic, B-roll và Reels trong dữ liệu QA riêng. Hồ sơ QA không phải hồ sơ của học viên.

Lệnh có thể mất nhiều phút. Tiếp tục chờ session đang chạy đến exit code; không coi việc chưa có JSON cuối là thất bại.

Chỉ báo đầy đủ khi exit 0, biên nhận của lần cài hiện tại có verified=true, mediaReady=true và selfTestReport có passed=true. Biên nhận ở <project>/Dữ liệu vận hành/install-receipt.json; bản trước lưu vào Lịch sử cài đặt. Nếu lỗi, biên nhận hiện tại phải thể hiện thất bại.

## Kích hoạt và cập nhật

Sau cài đọc SKILL.md của skill đã đăng ký, kiểm tra hồ sơ, hỏi phần thiếu, trình xác nhận rồi gửi ảnh menu Foxy. Mở lượt/chat mới nếu host cần làm mới skill. Tham khảo Hệ thống/workflows.

Cập nhật: giải nén phiên bản mới ở nơi riêng, chạy bộ cài mới với --project trỏ đúng FreeUp đang dùng. Không giải nén đè dữ liệu. Nếu thư mục đã bị chuyển/đổi tên, không tự tạo kho mới hoặc bỏ qua PROJECT_BINDING_MISSING; xác minh nơi dữ liệu cũ đang ở trước khi xử lý.

## Khi gặp lỗi

Báo cáo ở <workspace>/.freeup-install-reports/<mã lần cài>.json. Đọc failedStep, runtime.version, exitCode/stdout/stderr của commands. Báo cáo media ở <project>/Hệ thống/media-setup-report.json.

- Native EPERM/EBUSY rename: giữ cơ chế 2.0.1 cho đúng native 2026.9.9, đường dẫn .fs-safe-move-…tmp và đích mới chưa tồn tại; kiểm nguồn không đổi, tạo đích độc quyền, xác minh inventory. Gói đã xác định sở hữu được backup/phục hồi. Không vượt lỗi chính sách, scan, thư mục lạ hoặc định danh filesystem không xác minh được.
- NATIVE_CLI_INCOMPATIBLE: dùng bản 9BizClaw chính thức hỗ trợ skills install --agent --as. Không báo thành công chỉ vì chép được file.
- PROJECT_MIGRATION_CONFLICT: hai nơi có dữ liệu khác nhau. Giữ cả hai, xác định dữ liệu cần dùng; không tự ghi đè hoặc xóa nguồn.
- PROJECT_BINDING_MISSING / PROJECT_PATH_UNSAFE: kiểm tra đúng vị trí và quyền truy cập; không tự chuyển workspace hay đi qua junction/symlink để ghi nơi khác.
- MEDIA_SETUP_FAILED: đọc báo cáo tải npm/Chromium và probe binary. Sửa nguyên nhân rồi chạy lại cùng bộ cài và --project. Windows có thể không chạy binary tại đường dẫn từ 260 ký tự; chọn đường dẫn FreeUp ngắn từ đầu, không tự di chuyển dữ liệu khách.
- INSTALL_RECOVERY_DIRECTORY_CHANGED / INSTALL_RECOVERY_IDENTITY_UNAVAILABLE / RECOVERY_CLEANUP_INCOMPLETE: dừng và giữ đường dẫn để kiểm tra, không tự xóa thư mục hoặc đổi ACL/tắt bảo vệ Windows.

Giữ model, persona, kết nối, các skill khác và cấu hình agent khác. Không thiết lập Google Sheets, tự đăng Facebook hoặc lịch nền cho FreeUp.
