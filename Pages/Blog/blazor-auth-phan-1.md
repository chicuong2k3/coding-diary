---
title: 'My first test page 3'
date: 2025-07-16
image: images/blake-logo.png
tags: ["non-technical", "personal", "career", "community"]
description: "Get to know the fundamentals of Blake, the static site generator."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
---


Authentication là tính năng mà gần như project nào cũng có.
Mà thật ra hầu hết chúng ta chỉ cần login chạy được là xong.
Template có sẵn, copy vài dòng code, thấy form đăng nhập hiện lên, login thành công thế
là xong phần auth, chuyển qua làm mấy tính năng "xịn" hơn.

Và mọi thứ vẫn ổn... cho đến khi không còn ổn nữa.

Một buổi tối, team tôi phải vội vàng reset access token
sau khi phát hiện token nội bộ bị lộ ra ngoài
chỉ vì lưu chúng trong `localStorage` cho đơn giản.
Hacker chỉ cần cầm token đó là có thể truy cập thẳng vào hệ thống.

Nếu bạn từng làm app thuần SPA với React, Angular hay Blazor WebAssembly
thì bạn đang đối mặt với cùng một vấn đề: token nằm ở phía client mà client thì không an toàn.

Authentication là cả một hệ thống phối hợp giữa frontend, backend, cookie, token và browser.
Chỉ cần xử lý sai một bước thôi là đủ để toang cả hệ thống.


# Authentication trong ứng dụng Server-Side Rendering (SSR)

Cái thời mà Razor Pages, Laravel hay Ruby on Rails còn thống trị thì mọi thứ thật đơn giản.
Cả quá trình đăng nhập gói gọn trong vài bước:
1. Người dùng bấm "Đăng nhập", gửi username/password tới server.
2. Server kiểm tra nếu thông tin hợp lệ thì
   tạo session và gửi lại cookie cho browser. Cookie này có flag `HttpOnly` để
   JavaScript không đọc được (chặn XSS).
3. Mọi request tiếp theo browser đều tự động gửi cookie đó theo, server chỉ việc kiểm tra session là xong.

<div class="mermaid">
sequenceDiagram
    participant User as Browser
    participant Server as SSR Server

    User->>Server: Gửi credentials (username/password)
    Server-->>User: Tạo session, gửi HttpOnly cookie
    Note right of User: Cookie HttpOnly, JS không thể đọc
    User->>Server: Gửi request tiếp theo (tự động kèm cookie)
    Server-->>Server: Kiểm tra session
    Server-->>User: Trả HTML/data tương ứng
</div>

Authentication kiểu này rất an toàn vì mọi thông tin quan trọng đều nằm ở server
và cookie do browser nắm giữ cũng không thể truy cập bằng Javascript.

Tuy nhiên ứng dụng SSR đem lại trải nghiệm người dùng (UX) không tốt. Cứ mỗi lần chuyển trang
là reload phải chờ lâu, lại còn mất hết state. Form đang điền dở thì lỡ có sự cố phải reload lại
là dữ liệu đã điền mất sạch thì người dùng chỉ muốn... đóng tab và thề không quay lại nữa 😆

Cái UX tệ hại đó chính là lý do SPA ra đời.

> ✨ Thực ra, thời đó các website cũng đã có AJAX cho phép cập nhật dữ liệu mà không reload
toàn trang. Nhưng AJAX chỉ là một miếng vá giúp vài phần trên trang mượt hơn, còn kiến trúc
tổng thể vẫn là server render, mỗi lần chuyển trang vẫn phải tải lại HTML mới.

# Thời đại thống trị của Single Page Application (SPA)

Rồi React, Vue, Angular xuất hiện, mọi thứ đều chạy trong trình duyệt.
Không cần reload, không phải chờ đợi, chỉ render lại những phần cần thiết.
Frontend giờ không chỉ render HTML mà còn lưu state.

Đây là luồng đăng nhập của ứng dụng SPA:
<div class="mermaid">
sequenceDiagram
    participant User as Browser
    participant Api as API Server

    User->>Api: Gửi credentials (username/password) tới login endpoint
    Api-->>User: Trả về access token
    Note right of User: Lưu access token trong localStorage
    User->>Api: Gọi API protected với Header Authorization: Bearer access_token
    Api-->>User: Trả dữ liệu
</div>

Nhưng để gọi API protected thì ứng dụng SPA cần một thứ: **access token**. Và vì browser nằm
ở phía người dùng nên **access token** không thể được lưu ở một chỗ nào đó kín đáo không ai truy
cập được. Và token thường được lưu ở `localStorage` hoặc `sessionStorage`.

Vì `localStorage` và `sessionStorage` có thể độc được bằng Javascript nên nếu
trang bị chèn script độc thì token có thể bị đánh cắp.

> ⚠️ Vấn đề cốt lõi của SPA Authentication  
Token nằm ở phía client, nơi bạn không thể tin tưởng tuyệt đối.

**Nhưng các framework bây giờ đều sanitize HTML rồi mà, sao vẫn sợ XSS?**

Đúng là các framework ngày nay như React, Vue hay Angular đều sanitize HTML nên
bạn không thể dễ dàng vào ô comment rồi chèn đoạn script độc được nữa. Tuy nhiên ứng dụng vẫn
có thể bị tấn công XSS nếu:
- Các thư viện hoặc plugin của bên thứ ba có thể **"vô tình một cách cố ý"** chèn script độc.
- Dev vô tình render **HTML không kiểm soát** như dùng `dangerouslySetInnerHTML` trong React (khả năng
  này rất thấp tuy nhiên không phải là 0%).

**Thế thì lưu token trong cookie thay vì lưu trong storage có được không?**

Hoàn toàn có thể, nhưng nếu bạn lưu access token trong cookie
và gọi API trực tiếp từ browser thì trình duyệt sẽ **tự động gửi cookie kèm theo mỗi request**,
kể cả request đó đến từ **trang giả mạo** vì cookie được gắn theo domain, chứ không theo origin của trang gọi.
Điều này sẽ dẫn tới lỗ hổng bảo mật khác là **CSRF (Cross-Site Request Forgery)**.

Ví dụ:
Bạn đang đăng nhập `mybank.com`, cookie session vẫn còn hạn.
Bạn truy cập một trang là `evil.com` có thẻ `<img src="https://mybank.com/api/transfer?to=attacker">`.
Trình duyệt không phân biệt được mà gửi request với cookie xác thực của `mybank.com`
và thế là số dư của bạn không cánh mà bay.

> Bạn có thể đọc thêm về CSRF tại [bài viết này](/post/sop-cors-va-csrf-khi-long-tin-bi-loi-dung)

**SSR cũng dùng cookie, sao không bị CSRF?**

Đúng, SSR truyền thống (Razor Pages, Laravel, Rails,...)
cũng dùng cookie để giữ session nên vẫn có nguy cơ bị CSRF. Nhưng khác ở chỗ SSR
kiểm soát toàn bộ UI và form render ra nên có thể thêm anti-forgery token vào form, còn SPA thì
không thể nên không thể chống CSRF (*) nếu chỉ dựa vào cookie mà không có một tầng trung gian hay
còn gọi là Backend for Frontend (BFF) để xử lý xác thực an toàn thay cho browser.

> (*) Việc thêm anti-forgery token vào form trong SPA là vô nghĩa vì token được tạo
trên client nên không thể kiểm tra tính hợp lệ tại server.

## Rồi đến Hybrid: Next.js, Remix và Blazor

Nhìn lại, SSR thì an toàn nhưng đem lại trải nghiệm tệ, SPA thì mượt mà nhưng bảo mật kém.
Các framework mới như Next.js, Remix và gần đây là Blazor Web App
ra đời kết hợp điểm mạnh của cả hai:
- Trải nghiệm tuyệt vời như SPA.
- Bảo mật an toàn như SSR.

Và đó chính là lúc mô hình BFF (Backend for Frontend) xuất hiện như một người trung gian
đáng tin cậy giữa frontend và API. Lúc này, Frontend không còn giữ token nữa mà
mọi thứ nhạy cảm đều nằm ở backend.

<div class="mermaid">
sequenceDiagram
    participant Browser as Browser
    participant BFF as BFF Server
    participant API as API Server

    Browser->>BFF: Login → gửi credentials (username/password)
    BFF->>BFF: Xác thực credentials, tạo access token
    Note right of BFF: Token chỉ nằm ở BFF, không gửi ra Browser
    BFF-->>Browser: Trả HttpOnly cookie
    Browser->>BFF: Gửi request API tiếp theo (tự động kèm cookie)
    BFF->>API: Gọi API bằng token thật
    API-->>BFF: Response
    BFF-->>Browser: Trả HTML/data
    Note right of BFF: BFF đóng vai trò proxy giữa Browser và API
</div>

Ông này mới là người thật sự cầm token và nói chuyện với API. Nhờ đó mà:
- Không còn chứa token trong `localStorage` nên không lo bị XSS nữa.
- Không sợ CSRF khi cookie có flag `SameSite` (**) và `HttpOnly`.
- Người dùng vẫn có trải nghiệm như SPA.

> (**) Cookie có thể được cấu hình với flag `SameSite=Lax` hoặc `Strict` để ngăn việc tự động gửi
khi request từ trang khác.

Tóm lại, BFF giúp cân bằng giữa bảo mật và trải nghiệm người dùng — điều mà SSR hay SPA thuần túy đều không làm trọn vẹn.
Ở [phần tiếp theo](/post/authentication-va-authorization-trong-blazor-phan-2-trien-khai-authentication-trong-blazor),
ta sẽ đi sâu vào cách Blazor Web App triển khai mô hình này.
