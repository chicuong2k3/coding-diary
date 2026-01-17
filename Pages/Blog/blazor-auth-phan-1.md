---
title: 'Authentication và Authorization trong Blazor (Phần 1): Tổng quan về Authentication'
date: 2026-01-16
tags: ["blazor", "dotnet", "web development", "authentication", "frontend"]
description: "Tìm hiểu về các mô hình authentication phổ biến trong ứng dụng web hiện đại, từ SSR truyền thống đến SPA và mô hình Backend for Frontend (BFF) trong Blazor Web App."
---


Authentication là tính năng mà gần như project nào cũng có.
Mà thật ra hầu hết chúng ta chỉ cần login chạy được là xong.
Template có sẵn, copy vài dòng code, thấy form đăng nhập hiện lên, login thành công thế
là xong phần auth, chuyển qua làm mấy tính năng "xịn" hơn.

Và mọi thứ vẫn ổn... cho đến khi không còn ổn nữa.

Nếu bạn từng làm app thuần SPA với React, Angular hay Blazor WebAssembly
thì bạn đang đối mặt với cùng một vấn đề: token được lưu ở client mà client thì không an toàn.

Vậy làm sao để triển khai authentication vừa an toàn, vừa đem lại trải nghiệm người dùng tốt?

## Authentication trong ứng dụng Server-Side Rendering (SSR)

Cái thời mà Razor Pages hay Ruby on Rails còn thống trị thì mọi thứ rất đơn giản.
Cả quá trình đăng nhập gói gọn trong vài bước:
1. Người dùng bấm "Đăng nhập", gửi username/password tới server.
2. Server kiểm tra nếu thông tin hợp lệ thì
   tạo session và gửi lại cookie cho browser. Cookie này có flag `HttpOnly` để
   JavaScript không đọc được (chặn XSS).
3. Mọi request tiếp theo browser đều tự động gửi cookie đó theo, server chỉ việc kiểm tra session là xong.

::: mermaid
sequenceDiagram
    participant User as Browser
    participant Server as SSR Server

    User->>Server: Gửi credentials (username/password)
    Server-->>User: Tạo session, gửi HttpOnly cookie
    Note right of User: Cookie HttpOnly, JS không thể đọc
    User->>Server: Gửi request tiếp theo (tự động kèm cookie)
    Server-->>Server: Kiểm tra session
    Server-->>User: Trả HTML/data tương ứng
:::

Authentication kiểu này rất an toàn vì mọi thông tin quan trọng đều nằm ở server
và cookie do browser nắm giữ cũng không thể truy cập bằng Javascript.

Tuy nhiên ứng dụng SSR đem lại trải nghiệm người dùng (UX) không tốt. Cứ mỗi lần chuyển trang
là reload trang. Và đó một phần lý do SPA ra đời.

::: info
Dù lúc đó đã có AJAX cho phép cập nhật dữ liệu mà không reload
toàn trang. Nhưng AJAX chỉ là một miếng vá giúp vài phần trên trang mượt hơn, còn kiến trúc
tổng thể vẫn là server render, mỗi lần chuyển trang vẫn phải tải lại HTML mới.
:::

## Thời đại thống trị của Single Page Application (SPA)

Rồi React, Vue, Angular xuất hiện, mọi thứ đều chạy trong trình duyệt.
Không cần reload, không phải chờ đợi, chỉ render lại những phần cần thiết.
Frontend giờ không chỉ render HTML mà còn lưu state.

Đây là luồng đăng nhập của ứng dụng SPA:

::: mermaid
sequenceDiagram
    participant User as Browser
    participant Api as API Server

    User->>Api: Gửi credentials (username/password) tới login endpoint
    Api-->>User: Trả về access token
    Note right of User: Lưu access token trong localStorage
    User->>Api: Gọi API protected với Header Authorization: Bearer access_token
    Api-->>User: Trả dữ liệu
:::

Nhưng để gọi API thì ứng dụng SPA cần một thứ: **access token**. Và vì browser nằm
ở phía người dùng nên **access token** không thể được lưu ở một chỗ nào đó kín đáo không ai truy
cập được. Và token thường được lưu ở `localStorage` hoặc `sessionStorage`.

Vì `localStorage` và `sessionStorage` có thể bị đọc bằng Javascript nên nếu
trang bị chèn script độc thì token có thể bị đánh cắp.

::: info
Vấn đề cốt lõi của SPA Authentication là token nằm ở phía client, nơi bạn không thể tin tưởng tuyệt đối.
:::

**Nhưng các framework bây giờ đều sanitize HTML rồi mà, sao vẫn sợ XSS?**

Đúng là các framework ngày nay như React, Vue hay Angular đều sanitize HTML nên
bạn không thể dễ dàng vào ô comment rồi chèn đoạn script độc được nữa. Tuy nhiên ứng dụng vẫn
có thể bị tấn công XSS nếu:
- Các thư viện hoặc plugin của bên thứ ba có thể **"vô tình một cách cố ý"** chèn script độc.
- Dev vô tình render **HTML không kiểm soát** như dùng `dangerouslySetInnerHTML` trong React.

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

::: info
Bạn có thể đọc thêm về CSRF tại [bài viết này](/post/sop-cors-va-csrf-khi-long-tin-bi-loi-dung)
:::

**SSR cũng dùng cookie, sao không bị CSRF?**

Đúng, SSR truyền thống cũng dùng cookie để giữ session nên vẫn có nguy cơ bị CSRF. Nhưng khác ở chỗ SSR
kiểm soát toàn bộ UI và form render ra nên có thể thêm anti-forgery token vào form, còn SPA thì
không thể (*).

::: info
Việc thêm anti-forgery token vào form trong SPA là vô nghĩa vì token được tạo
trên client nên không thể kiểm tra tính hợp lệ (validate token).
:::

## Rồi đến Hybrid: Next.js, Remix và Blazor

Nhìn lại, SSR thì an toàn nhưng đem lại trải nghiệm tệ, SPA thì mượt mà nhưng bảo mật kém.
Các framework mới như Next.js, Remix và gần đây là Blazor Web App
ra đời kết hợp điểm mạnh của cả hai:
- Trải nghiệm tuyệt vời như SPA.
- Bảo mật an toàn như SSR.

Và đó chính là lúc mô hình BFF (Backend for Frontend) xuất hiện như một người trung gian
đáng tin cậy giữa frontend và API. Lúc này, Frontend không còn giữ token nữa.

::: mermaid
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
:::

BFF mới là người thật sự giữ token và nói chuyện với API. Nhờ đó mà:
- Không còn lưu token trong `localStorage` nên không lo bị XSS nữa.
- Không sợ CSRF khi cookie có flag `SameSite` (**) và `HttpOnly`.
- Người dùng vẫn có trải nghiệm như SPA.

::: info
(**) Cookie có thể được cấu hình với flag `SameSite=Lax` hoặc `Strict` để ngăn việc tự động gửi
khi request từ trang khác.
:::

Tóm lại, BFF giúp cân bằng giữa bảo mật và trải nghiệm người dùng - điều mà SSR hay SPA thuần túy đều không làm trọn vẹn.
Ở [phần tiếp theo](/post/authentication-va-authorization-trong-blazor-phan-2-trien-khai-authentication-trong-blazor),
ta sẽ đi sâu vào cách Blazor Web App triển khai mô hình này.
