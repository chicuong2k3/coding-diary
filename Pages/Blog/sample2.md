---
title: 'asd'
date: 2025-07-16
image: images/blake-logo.png
tags: ["non-technical", "personal", "career", "community"]
description: "Get to know the fundamentals of Blake, the static site generator."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
---

Trong các ứng dụng web và API ngày nay, bảo mật là một phần không thể thiếu. Dù bạn
xây dựng hệ thống quản lý nội bộ, thương mại điện tử hay ứng dụng SaaS thì việc đảm bảo
người dùng **được xác thực chính xác** và **chỉ truy cập được tài nguyên họ được phép**
là hết sức quan trong. Bài viết này sẽ giúp bạn nắm rõ:
- [Phân biệt Authentication và Authorization](/post/authentication-va-authorization-trong-net#authentication-va-authorization-la-gi)
- [Hiểu kiến trúc Authentication trong .NET](/post/authentication-va-authorization-trong-net#kien-truc-authentication-trong.net)
- [Hiểu kiến trúc Authorization trong .NET](/post/authentication-va-authorization-trong-net#kien-truc-authorization-trong.net)
- [Triển khai Cookie Authentication](/post/authentication-va-authorization-trong-net#cookie-authentication-thuong-dung-cho-web-app-nhu.net-mvc-va-razor-pages)
- [Triển khai JWT Bearer Authentication](/post/authentication-va-authorization-trong-net#jwt-bearer-authentication-thuong-dung-cho-api)
- [Khám phá các cơ chế Authorization](/post/authentication-va-authorization-trong-net#authorization-kiem-soat-quyen-truy-cap)

# Authentication và Authorization là gì?

Chúng ta cần phân biệt rõ hai khái niệm quan trọng
mà mọi lập trình viên đều phải nắm vững là Authentication (xác thực) và Authorization (phân quyền).
Dù nghe có vẻ quen thuộc nhưng rất nhiều người vẫn nhầm lẫn giữa chúng.
- Authentication (Xác thực): Là quá trình xác minh danh tính của một người, tức là kiểm
  tra xem bạn thật sự là ai. Ví dụ như khi bạn đến sân bay, nhân viên an ninh yêu cầu bạn
  xuất trình căn cước công dân hoặc hộ chiếu và vé máy bay. Họ kiểm tra ảnh, tên và mã vé để
  chắc chắn rằng bạn chính là người đã đặt vé. Đó chính là xác thực.
- Authorization (Phân quyền): Là quá trình kiểm tra quyền hạn truy cập hoặc hành động
  mà bạn được phép thực hiện sau khi đã xác thực danh tính. Ví dụ như sau khi bạn đã qua cửa
  an ninh và lên máy bay, vé hạng phổ thông (Economy) chỉ cho phép bạn ngồi ở khoang phổ thông,
  trong khi vé hạng thương gia (Business Class) được phép ngồi ở khoang riêng và sử dụng phòng chờ VIP.
  Dù cả hai hành khách đều đã được xác thực, quyền truy cập của họ khác nhau dựa trên "vai trò" (class).
  Đây chính là phân quyền.

::: mermaid
flowchart LR
    A[Hành khách đến sân bay] --> B[Xác thực danh tính - kiểm tra CCCD hoặc hộ chiếu và vé]
    B --> C{Đã xác thực hợp lệ?}
    C -- Không --> D[Không cho phép lên máy bay]
    C -- Có --> E[Phân quyền theo loại vé]
    E --> F[Vé Economy - Khoang phổ thông]
    E --> G[Vé Business - Phòng chờ VIP + khoang thương gia]
:::

::: info
**Authentication** trả lời cho câu hỏi **Bạn là ai**
**Authorization** trả lời cho câu hỏi **Bạn được phép làm gì**
:::

# Kiến trúc Authentication trong .NET

Hệ thống Authentication trong .NET được tổ chức dựa trên 5 thành phần chính:

## Authentication Middleware

Middleware này được thêm vào pipeline bằng dòng sau:
```csharp
app.UseAuthentication();

```

Middleware này là điểm khởi đầu cho quá trình xác thực: khi có request đến, Middleware sẽ gọi
phương thức `AuthenticateAsync()` của interface `IAuthenticationService` (xem bên dưới) để xác định người dùng hiện tại.
Nếu thành công, `ClaimsPrincipal` sẽ được gán vào `HttpContext.User`.

::: info
💡 Tip: `app.UseAuthentication()` chỉ thiết lập `HttpContext.User`, nó không chặn request.
Việc chặn request (ví dụ yêu cầu đăng nhập hoặc trả về 401) do `UseAuthorization()` đảm nhiệm ở bước sau.
:::

## IAuthenticationService

Đây là bộ điều phối trung tâm, nó quyết định handler (xem bên dưới) nào sẽ thực hiện việc xác thực dựa
trên `AuthenticationScheme` (xem bên dưới) được cấu hình. Interface này cung cấp các phương thức sau:
- `AuthenticateAsync`: Xác thực yêu cầu hiện tại và trả về `AuthenticateResult`.
- `ChallengeAsync()`: Phản hồi khi yêu cầu cần xác thực (redirect hoặc HTTP 401).
- `ForbidAsync()`: Phản hồi khi người dùng đã đăng nhập nhưng không đủ quyền (HTTP 403).
- `SignInAsync`: Tạo thông tin đăng nhập (cookie hoặc token).
- `SignOutAsync`: Xóa thông tin đăng nhập.

::: info
💡 Tip: Interface này được .NET cung cấp mặc định thông qua dependency injection.
Bạn có thể inject `IAuthenticationService` vào Controller nếu muốn thực hiện xác thực
thủ công.  
📘 Tham khảo: [Microsoft Docs – Authentication service](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authentication.iauthenticationservice?view=aspnetcore-9.0)
:::

## Authentication Scheme

Mỗi scheme là một cấu hình xác thực cụ thể, xác định handler nào sẽ được sử dụng cho cơ chế đó.
. Khi cấu hình, bạn có thể đăng ký
nhiều Scheme, ví dụ scheme dùng JWT cho API, một scheme khác dùng Cookie cho MVC web.

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => builder.Configuration.Bind("JwtSettings", options))
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options => builder.Configuration.Bind("CookieSettings", options));
```

::: info
💡 Tip: Khi ứng dụng có nhiều scheme (JWT cho API, Cookie cho Web), bạn có thể
dùng `[Authorize(AuthenticationSchemes = "JwtBearer")]` để buộc controller/action chỉ
dùng đúng loại xác thực mong muốn.
:::

##  Authentication Handler

Handler là thành phần thực thi cốt lõi của quá trình xác thực.
Mỗi scheme sẽ tương ứng với một handler cụ thể, ví dụ:
- `CookieAuthenticationHandler`: Quản lý xác thực dựa trên cookie.
- `JwtBearerHandler`: Quản lý xác thực dựa trên JWT.
- `OpenIdConnectHandler`: Quản lý xác thực theo chuẩn OpenIDConnect hay WS-Federation.
- `RemoteAuthenticationHandler`: OAuth2/External Provider như Google, Facebook...

::: info
⚠️ Note: Nếu bạn không đặt `DefaultScheme`, hệ thống sẽ không biết dùng handler nào và
`AuthenticateAsync()` có thể trả về null.
:::

// ...existing content...
