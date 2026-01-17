---
title: 'My first test page 2'
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

<div class="mermaid"> 
flowchart LR
    A[Hành khách đến sân bay] --> B[Xác thực danh tính - kiểm tra CCCD hoặc hộ chiếu và vé]
    B --> C{Đã xác thực hợp lệ?}
    C -- Không --> D[Không cho phép lên máy bay]
    C -- Có --> E[Phân quyền theo loại vé]
    E --> F[Vé Economy - Khoang phổ thông]
    E --> G[Vé Business - Phòng chờ VIP + khoang thương gia]
</div>

Tóm lại thì:
> **Authentication** trả lời cho câu hỏi **Bạn là ai**  
> **Authorization** trả lời cho câu hỏi **Bạn được phép làm gì**

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

> 💡 Tip: `app.UseAuthentication()` chỉ thiết lập `HttpContext.User`, nó không chặn request.
Việc chặn request (ví dụ yêu cầu đăng nhập hoặc trả về 401) do `UseAuthorization()` đảm nhiệm ở bước sau.

## IAuthenticationService

Đây là bộ điều phối trung tâm, nó quyết định handler (xem bên dưới) nào sẽ thực hiện việc xác thực dựa
trên `AuthenticationScheme` (xem bên dưới) được cấu hình. Interface này cung cấp các phương thức sau:
- `AuthenticateAsync`: Xác thực yêu cầu hiện tại và trả về `AuthenticateResult`.
- `ChallengeAsync()`: Phản hồi khi yêu cầu cần xác thực (redirect hoặc HTTP 401).
- `ForbidAsync()`: Phản hồi khi người dùng đã đăng nhập nhưng không đủ quyền (HTTP 403).
- `SignInAsync`: Tạo thông tin đăng nhập (cookie hoặc token).
- `SignOutAsync`: Xóa thông tin đăng nhập.

> 💡 Tip: Interface này được .NET cung cấp mặc định thông qua dependency injection.
Bạn có thể inject `IAuthenticationService` vào Controller nếu muốn thực hiện xác thực
thủ công.  
📘 Tham khảo: [Microsoft Docs – Authentication service](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authentication.iauthenticationservice?view=aspnetcore-9.0)

## Authentication Scheme

Mỗi scheme là một cấu hình xác thực cụ thể, xác định handler nào sẽ được sử dụng cho cơ chế đó.
. Khi cấu hình, bạn có thể đăng ký
nhiều Scheme, ví dụ scheme dùng JWT cho API, một scheme khác dùng Cookie cho MVC web.

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => builder.Configuration.Bind("JwtSettings", options))
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options => builder.Configuration.Bind("CookieSettings", options));
```

Khi xác thực, `IAuthenticationService` sẽ tra cứu tên scheme để gọi handler tương ứng.

> 💡 Tip: Khi ứng dụng có nhiều scheme (JWT cho API, Cookie cho Web), bạn có thể
dùng `[Authorize(AuthenticationSchemes = "JwtBearer")]` để buộc controller/action chỉ
dùng đúng loại xác thực mong muốn.

> ⚠️ Note: Nếu bạn không đặt `DefaultScheme`, hệ thống sẽ không biết dùng handler nào và
`AuthenticateAsync()` có thể trả về null.

##  Authentication Handler

Handler là thành phần thực thi cốt lõi của quá trình xác thực.
Mỗi scheme sẽ tương ứng với một handler cụ thể, ví dụ:
- `CookieAuthenticationHandler`: Quản lý xác thực dựa trên cookie.
- `JwtBearerHandler`: Quản lý xác thực dựa trên JWT.
- `OpenIdConnectHandler`: Quản lý xác thực theo chuẩn OpenIDConnect hay WS-Federation.
- `RemoteAuthenticationHandler`: OAuth2/External Provider như Google, Facebook...

Một handler có trách nhiệm xử lý 3 nhiệm vụ chính:
- **Authenticate:** Đọc và xác thực thông tin đăng nhập (cookie hoặc token) và tạo danh tính
  người dùng (đối tượng `ClaimsPrincipal`).
- **Challenge:** Phản hồi khi một người dùng chưa đăng nhập cố truy cập vào
  tài nguyên được bảo vệ (như chuyển hướng người dùng đến trang đăng nhập hoặc trả về HTTP 401 Unauthorized).
- **Forbid:** Phản hồi khi một người dùng đã đăng nhập nhưng không có
  quyền truy cập (trả về HTTP 403 Forbidden).

> 💡 Tip: Một handler có thể kế thừa từ `AuthenticationHandler<TOptions>` để bạn viết
custom authentication.
Bạn chỉ cần override `HandleAuthenticateAsync()` để tự xác định danh tính người dùng.

## ClaimsPrincipal - Danh tính của người dùng

Sau khi xác thực thành công, thông tin người dùng được lưu vào
`ClaimsPrincipal`, một đối tượng đại diện cho người dùng trong hệ thống.
Cấu trúc của `ClaimsPrincipal` gồm:
- `Claim`: Là một mảnh thông tin về người dùng, được lưu trữ dưới dạng cặp key-value, tương tự
  như một dòng thông tin trong căn cước công dân (Họ và tên: Nguyễn Văn A; Ngày sinh: 01/01/1990).
- `ClaimsIdentity`: Một tập hợp các Claim, tương tự như như một loại giấy tờ tuỳ thân (căn cước công dân, giấy phép lái xe, hộ chiếu).
- `ClaimsPrincipal`: Chứa một hoặc nhiều ClaimsIdentity, đại diện cho người dùng hiện tại. Giống
  việc một người có thể có nhiều loại giấy tờ tùy thân.

```csharp
// Tưởng tượng ClaimsPrincipal như một chiếc ví chứa nhiều loại giấy tờ của một người
var principal = new ClaimsPrincipal();

// Giấy tờ 1: Căn cước công dân (Identity chính)
var nationalId = new ClaimsIdentity(new[]
{
    new Claim(ClaimTypes.NameIdentifier, "12345"),  // Số CCCD
    new Claim(ClaimTypes.Name, "Nguyễn Văn A"),     // Họ tên
    new Claim(ClaimTypes.DateOfBirth, "1990-01-01") // Ngày sinh
}, "NationalID");

// Giấy tờ 2: Bằng lái xe (Identity thứ 2)
var driverLicense = new ClaimsIdentity(new[]
{
    new Claim("LicenseNumber", "DL-123456"),
    new Claim("VehicleType", "B2"),
    new Claim("ExpiryDate", "2030-12-31")
}, "DriverLicense");

// Cho cả 2 vào ví
principal.AddIdentity(nationalId);
principal.AddIdentity(driverLicense);
```

Trong ứng dụng .NET, bạn có thể truy cập đối tượng này thông qua `HttpContext.User`:

```csharp
var userName = HttpContext.User.Identity.Name;
var roles = HttpContext.User.Claims
                .Where(c => c.Type == ClaimTypes.Role)
                .Select(c => c.Value);
```

> 💡 Tip: Trong .NET, chỉ một identity được xem là chính (`User.Identity`). Nếu có nhiều
identity (ví dụ thêm từ external provider), bạn nên hợp nhất claim hoặc chỉ giữ lại
một identity cần thiết.

> ⚠️ Note: Một số middleware (ví dụ OpenID Connect) có thể thêm nhiều identity vào
cùng một principal nên cần cẩn trọng nếu serialize hoặc lưu vào cookie.

## Luồng hoạt động của Authentication

Để hình dung rõ hơn về pipeline xác thực trong .NET, xem sơ đồ sau:
<div class="mermaid">
flowchart TD
    subgraph Client["🧑‍💻 Client"]
    end
    subgraph Pipeline["🌐 ASP.NET Core Middleware Pipeline"]
        A["Authentication Middleware"]
        B["IAuthenticationService"]
        C["Authentication Scheme"]
        D["Authentication Handler"]
        E["ClaimsPrincipal"]
        F["Authorization Middleware"]
    end
    subgraph AuthZ["🧭 Authorization Layer"]
        G["IAuthorizationService"]
        H["IAuthorizationHandler"]
        I["Access Granted/Denied"]
    end
    Client --> A
    A -->|AuthenticateAsync| B
    B --> C
    C --> D
    D -->|Trả về ClaimsPrincipal| E
    E -->|Gán vào HttpContext.User| F
    F -->|Gọi AuthorizeAsync| G
    G --> H
    H -->|Kết quả đánh giá policy| I
</div>

> 💡 Tip: `HttpContext.User` luôn tồn tại, ngay cả khi người dùng chưa đăng nhập,
nhưng khi đó `User.Identity.IsAuthenticated == false`. Do đó không dùng User != null để kiểm tra
đăng nhập.

# Cookie Authentication (thường dùng cho Web App như .NET MVC và Razor Pages)

Cookie Authentication là một trong những phương pháp xác thực phổ biến nhất trong các ứng dụng web.
Nó sử dụng cookie để lưu trữ thông tin xác thực của người dùng sau khi họ đăng nhập thành công.
Dưới đây là cách triển khai Cookie Authentication trong .NET:

> 💡 Tip: Cookie xác thực trong ASP.NET Core được mã hóa và bảo vệ bằng `IDataProtector`,
vì vậy không thể đọc plain text claim trong cookie.

> ⚠️ Note: Cookie authentication phụ thuộc vào state (cookie lưu session trên client)
nên không phù hợp cho API RESTful, vì API nên stateless.

**Bước 1: Cấu hình Cookie Authentication**

```csharp
var builder = WebApplication.CreateBuilder(args);

// Đăng ký dịch vụ xác thực với Scheme mặc định là Cookies
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "MyAppCookie";
        options.LoginPath = "/Account/Login"; // Đường dẫn tới trang đăng nhập
        options.AccessDeniedPath = "/Account/AccessDenied"; // Đường dẫn khi bị từ chối truy cập
        options.ExpireTimeSpan = TimeSpan.FromMinutes(20); // Thời gian cookie hết hạn
        options.SlidingExpiration = true; // Tự động gia hạn nếu còn hoạt động
        options.Cookie.HttpOnly = true; // Bảo vệ cookie khỏi JavaScript
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Chỉ gửi cookie qua HTTPS
    });

builder.Services.AddControllersWithViews();

var app = builder.Build();

app.UseRouting();

// UseAuthentication phải được đặt sau UseRouting và trước UseAuthorization
app.UseAuthentication(); // Middleware này thiết lập HttpContext.User
app.UseAuthorization(); // Middleware này thực thi việc phân quyền

app.MapControllers();

app.Run();
```

**Bước 2: Đăng nhập và tạo Cookie**

Khi người dùng gửi thông tin đăng nhập, bạn sẽ tạo `ClaimsPrincipal` rồi
gọi `SignInAsync` để tạo và lưu cookie:

```csharp
[HttpPost]
public async Task<IActionResult> Login(LoginModel model)
{
    if (!ModelState.IsValid)
        return View(model);

    var user = await AuthenticateUser(model.UserName, model.Password);
    if (user == null)
    {
        ModelState.AddModelError("", "Tên đăng nhập hoặc mật khẩu không đúng");
        return View(model);
    }

    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.Role, "Member"),
        new Claim("FavoriteDrink", "Tea")
    };

    var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
    var principal = new ClaimsPrincipal(identity);

    await HttpContext.SignInAsync(
        CookieAuthenticationDefaults.AuthenticationScheme, 
        principal,
        new AuthenticationProperties
        {
            IsPersistent = model.RememberMe, // Ghi nhớ đăng nhập
            ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(20)
        });

    return LocalRedirect(model.ReturnUrl ?? "/");
}
```

Để đăng xuất, bạn chỉ cần gọi `SignOutAsync`, hệ thống sẽ xóa cookie xác thực:
```csharp
[Authorize]
public async Task<IActionResult> Logout()
{
    await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return RedirectToAction("Index", "Home");
}
```

# JWT Bearer Authentication (thường dùng cho API)

## JWT là gì?

JWT (JSON Web Token) là một token tự chứa (self-contained) dưới dạng json gồm 3 phần:
- Header: loại thuật toán ký (ví dụ HS256).
- Payload: chứa các `claims` (thông tin về người dùng như id, email...).
- Signature: dùng để xác minh tính toàn vẹn (được ký bằng secret key).

Ví dụ:

```javascript
{
  "sub": "user123",
  "name": "Alice",
  "role": "Admin",
  "exp": 1734567890
}
```

> 💡 Tip: JWT là dạng stateless authentication, token không cần lưu server-side.
Do đó, khi user đổi mật khẩu hoặc bị khóa tài khoản, token cũ vẫn còn hiệu lực cho tới
khi hết hạn -> cần có cơ chế blacklist token nếu cần.

## Cấu hình JWT Bearer trong .NET

Đầu tiên cần đăng ký Service và Middleware:

```csharp
// Program.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình JwtSettings trong appsettings.json (Issuer, Audience, SecretKey, ExpireMinutes)
var jwtSettings = builder.Configuration.GetSection("JwtSettings");

// Thêm Authentication với JWT Bearer
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],

        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],

        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"])),

        RequireExpirationTime = true,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromSeconds(30)
    };
});

builder.Services.AddAuthorization();
```

Tiếp theo tạo JWT:
```csharp
public class JwtTokenService
{
    private readonly IConfiguration _config;

    public JwtTokenService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(User user)
    {
        var jwtSettings = _config.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role),
            // thêm claim khác nếu cần
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpireMinutes"])),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

# Authorization - Kiểm soát quyền truy cập

## Kiến trúc Authorization trong .NET

Sau khi người dùng đã được xác thực (Authentication), hệ thống cần kiểm tra quyền truy cập
(Authorization) trước khi cho phép thực hiện hành động hoặc truy cập tài nguyên.

Cơ chế Authorization trong .NET được xây dựng dựa trên 4 thành phần chính, liên kết chặt
chẽ với tầng Authentication:

| Thành phần | Vai trò |
|-------------|----------|
|**Authorization Middleware** | Thành phần trong pipeline chịu trách nhiệm gọi `IAuthorizationService.AuthorizeAsync()` để xác định quyền truy cập. |
|**IAuthorizationService** | Bộ điều phối chính — xử lý logic đánh giá policy hoặc yêu cầu quyền truy cập. |
|**IAuthorizationHandler** | Xử lý từng yêu cầu (requirement) cụ thể trong policy, xác định người dùng có đạt điều kiện không. |
|**Authorization Requirement / Policy** | Mô tả điều kiện cần thỏa mãn để truy cập tài nguyên (ví dụ: yêu cầu vai trò, claim, hoặc điều kiện tùy chỉnh). |


## Mối quan hệ giữa các thành phần

<div class="mermaid">
flowchart LR
    subgraph Authentication["🔐 Tầng Authentication"]
        E["ClaimsPrincipal<br/>(Danh tính người dùng)"]
    end
    subgraph Authorization["🧭 Tầng Authorization (4 thành phần)"]
        F["Authorization Middleware"]
        G["IAuthorizationService"]
        H["IAuthorizationHandler"]
        I["Policy/Requirement"]
        J["Access Granted /Denied"]
    end
    E --> F
    F -->|Gọi AuthorizeAsync| G
    G -->|Đánh giá Policy| H
    H -->|Kiểm tra Requirement| I
    I -->|Kết quả| J
</div>

## Luồng hoạt động của Authorization

<div class="mermaid">
sequenceDiagram
    participant C as Client
    participant M as AuthorizationMiddleware
    participant S as IAuthorizationService
    participant H as IAuthorizationHandler
    participant P as PolicyRequirement
    C->>M: Gửi HTTP Request (đã có ClaimsPrincipal)
    M->>S: Gọi AuthorizeAsync()
    S->>H: Gửi từng Requirement trong Policy
    H->>P: Đánh giá điều kiện
    P-->>H: Kết quả từng Requirement
    H-->>S: Tất cả Requirement thỏa mãn?
    S-->>M: Access Granted hoặc Denied
    M-->>C: Trả về 403 Forbidden hoặc cho phép truy cập Controller
    Note over M,C: Nếu được phép thì tiếp tục thực thi Controller Action
</div>


## Triển khai trong .NET MVC (hoặc API)

### Role-based Authorization

Phân quyền dựa theo vai trò.
Áp dụng khi bạn gán role cho người dùng (Admin, Manager, Premium Member, ...):

```csharp
[Authorize(Roles = "Admin,Manager")]
public IActionResult Dashboard()
{
    return View();
}
```

> 💡 Tip: Có thể khai báo nhiều role trong 1 attribute bằng dấu phẩy: `[Authorize(Roles = "Admin,Manager")]`

> ⚠️ Note: Role chỉ nên dùng cho hệ thống nhỏ. Khi hệ thống có nhiều quyền chi tiết
(ví dụ "Xem đơn hàng", "Sửa đơn hàng"), nên chuyển sang policy-based authorization để
linh hoạt hơn.

### Claims-based Authorization

Phân quyền dựa vào giá trị cụ thể của `Claim`:

```csharp
[Authorize(Policy = "CanDrinkTea")]
public IActionResult TeaLounge() => View();
```

Cấu hình policy:

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CanDrinkTea", policy =>
        policy.RequireClaim("FavoriteDrink", "Tea"));
});
```

> 💡 Tip: Claim là dữ liệu động nên bạn có thể thêm claim "FavoriteDrink" hoặc "Department" tùy người dùng.
Điều này cực kỳ tiện nếu muốn xác thực theo context kinh doanh
(Ví dụ: chỉ cho phép người dùng uống trà vào).

> ⚠️ Note: Nếu claim được load từ cơ sở dữ liệu, hãy cache hoặc sử dụng
`IClaimsTransformation` để tránh truy vấn DB mỗi request.

### Policy-based Authorization

Cho phép kết hợp nhiều điều kiện (role, claim, custom logic).
Dùng khi quyền truy cập phức tạp, cần custom logic.
Ví dụ custom handler:

Tạo requirement và handler:
```csharp
public class MinimumAgeRequirement : IAuthorizationRequirement
{
    public int Age { get; }
    public MinimumAgeRequirement(int age) => Age = age;
}

public class MinimumAgeHandler : AuthorizationHandler<MinimumAgeRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, MinimumAgeRequirement requirement)
    {
        var birthDateClaim = context.User.FindFirst(c => c.Type == "BirthDate");
        if (birthDateClaim == null)
            return Task.CompletedTask;

        var birthDate = DateTime.Parse(birthDateClaim.Value);
        var age = DateTime.Today.Year - birthDate.Year;

        if (age >= requirement.Age)
            context.Succeed(requirement);

        return Task.CompletedTask;
    }
}
```

Đăng ký policy:

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AtLeast18", policy =>
        policy.Requirements.Add(new MinimumAgeRequirement(18)));
});

builder.Services.AddSingleton<IAuthorizationHandler, MinimumAgeHandler>();
```

> ⚠️ Note: Đừng quên đăng ký handler bằng `AddSingleton<IAuthorizationHandler, THandler>()`.
Nếu không, policy sẽ không được kích hoạt.

### Resource-based Authorization

Dùng resource-based Authorization khi quyền phụ thuộc cụ thể vào một tài nguyên cụ thể
(document, order hay photo).
Ví dụ: Khi cần phân quyền "chỉ chủ sở hữu bài viết được chỉnh sửa bài viết của họ".
Đây là ownership check, không thể chỉ dựa trên role hay claim.

Định nghĩa Requirement:
```csharp
public class DocumentEditRequirement : IAuthorizationRequirement { }
```

Định nghĩa Handler (resource-based):
```csharp
public class DocumentEditHandler : AuthorizationHandler<DocumentEditRequirement, Document>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        DocumentEditRequirement requirement,
        Document resource)
    {
        // Nếu là Admin thì pass
        if (context.User.IsInRole("Admin"))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // Ownership check - resource.OwnerId so với user claim
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId != null && resource.OwnerId == userId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
```

Đăng ký handler trong `Program.cs`:
```csharp
builder.Services.AddAuthorization();
builder.Services.AddSingleton<IAuthorizationHandler, DocumentEditHandler>();
```

Sử dụng `IAuthorizationService` trong Controller:
```csharp
public class DocumentsController : Controller
{
    private readonly IAuthorizationService _authorizationService;
    private readonly IDocumentRepository _repo;

    public DocumentsController(IAuthorizationService authorizationService, IDocumentRepository repo)
    {
        _authorizationService = authorizationService;
        _repo = repo;
    }

    [HttpPost]
    public async Task<IActionResult> Edit(Guid id, DocumentEditModel model)
    {
        var doc = await _repo.GetByIdAsync(id);
        if (doc == null) return NotFound();

        var authResult = await _authorizationService.AuthorizeAsync(User, doc, new DocumentEditRequirement());
        if (!authResult.Succeeded) return Forbid();

        // thực hiện update
        // ...
        return Ok();
    }
}
```

> ⚠️ Note: Không thể dùng `[Authorize]` attribute cho kiểu này, vì requirement cần
object cụ thể để so sánh (ví dụ Document).

# Claims Transformation

Dùng `IClaimsTransformation` để thêm hoặc sửa claim sau khi xác thực.  
Ví dụ: load roles/permissions từ DB và thêm claim khi user login.

```csharp
public class ClaimsTransformer : IClaimsTransformation
{
    public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        var id = ((ClaimsIdentity)principal.Identity);
        var permission = GetUserPermissionFromDatabase(id);
        id.AddClaim(new Claim("Permission", permission));
        return Task.FromResult(principal);
    }
}
```

> `TransformAsync` chạy ở mỗi request, nên cần tránh truy vấn DB liên tục. Hãy cache hoặc
dùng in-memory permission service.

> 📘 Tham khảo: [Claims transformation – Microsoft Docs](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/claims?view=aspnetcore-8.0)

Hy vọng qua bài viết này, bạn đã hiểu rõ hơn sự khác biệt giữa Authentication
và Authorization, cũng như cách mà .NET triển khai hai cơ chế này thông qua các middleware,
handler, scheme và service.
Bảo mật không chỉ là lớp tường rào, mà là nền tảng giúp hệ thống vận hành an toàn, tin cậy
và dễ mở rộng. Hãy luôn đảm bảo mọi endpoint, service và hành động trong ứng dụng của
bạn đều được xác thực và phân quyền đúng cách. 