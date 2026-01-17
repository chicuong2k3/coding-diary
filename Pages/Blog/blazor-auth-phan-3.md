---
title: 'My first test page 3'
date: 2025-07-16
image: images/blake-logo.png
tags: ["non-technical", "personal", "career", "community"]
description: "Get to know the fundamentals of Blake, the static site generator."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
---

Sau khi người dùng đăng nhập thành công, bước tiếp theo là xác định họ được phép làm gì.
Phần này sẽ tập trung vào hai nội dung quan trọng:
- Authorization trong Blazor bao gồm Role-based, Policy-based và Resource-based Authorization.
- Cách Blazor Web App gọi các API nội bộ và bên ngoài một cách an toàn.

# Tổng quan về Authorization trong Blazor

Blazor sử dụng cơ chế **Authorization của ASP.NET Core**, dựa trên mô hình **Claims-based Identity**.  
Mỗi người dùng được biểu diễn bởi một `ClaimsPrincipal`, chứa các `Claim` (như email, vai trò, hoặc quyền hạn cụ thể).

::: info
💡 Để hiểu rõ hơn về mô hình Claims-based Identity trong .NET hãy
đọc [bài viết này](/post/authentication-va-authorization-trong-net)
:::

Các claim này được lưu trong `ClaimsPrincipal` và có thể truy cập thông
qua `AuthenticationStateProvider` như sau:

```markup
&#64;page "/me"
&#64;inject AuthenticationStateProvider AuthStateProvider

<h3>Thông tin người dùng</h3>

&#64;code {
    private string? userName;
    private string? email;

    protected override async Task OnInitializedAsync()
    {
        var authState = await AuthStateProvider.GetAuthenticationStateAsync();
        var user = authState.User;

        if (user.Identity?.IsAuthenticated == true)
        {
            userName = user.Identity.Name;
            email = user.FindFirst(c => c.Type == "email")?.Value;
        }
    }
}
```

Hoặc có thể inject trực tiếp qua Cascading Parameter:
```markup
&#64;attribute [Authorize]
&#64;page "/dashboard"

<CascadingAuthenticationState>
    <AuthorizeView>
        <Authorized>
            <h3>Chào &#64;context.User.Identity?.Name!</h3>
        </Authorized>
        <NotAuthorized>
            <p>Bạn cần đăng nhập để xem trang này.</p>
        </NotAuthorized>
    </AuthorizeView>
</CascadingAuthenticationState>
```

Nhờ mô hình này, mọi component trong Blazor đều có thể dễ dàng truy cập thông tin người dùng
để hiển thị UI phù hợp và phân quyền.

# Các cơ chế Authorization

## Role-based Authorization

Phân quyền dựa trên **Role** là cách phổ biến nhất, sử dụng khi
Identity Provider (Azure AD, IdentityServer, Keycloak...) trả về claim `role` hoặc `roles`.

Sử dụng `AuthorizeView`:
```markup
<AuthorizeView Roles="Administrator">
    <Authorized>
        <h3>Khu vực quản trị</h3>
        <p>Chỉ quản trị viên mới thấy được phần này.</p>
    </Authorized>
    <NotAuthorized>
        <p>Bạn không có quyền truy cập.</p>
    </NotAuthorized>
</AuthorizeView>
```

Hoặc route được bảo vệ bằng attribute:
```razor
&#64;page "/admin"

&#64;attribute [Authorize(Roles = "Administrator")]

<h3>Admin Dashboard</h3>

&#64;code {

}
```

## Policy-based Authorization

Policy-based cho phép bạn định nghĩa quy tắc phức tạp hơn Role.

Định nghĩa Policy trong `Program.cs`:
```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireEmail", policy =>
        policy.RequireClaim("email"));
});
```

Sử dụng `AuthorizeView`:
```markup
<AuthorizeView Policy="RequireEmail">
    <Authorized>
        <p>Cấu hình tài khoản</p>
    </Authorized>
    <NotAuthorized>
        <p>Bạn không có quyền truy cập nội dung này.</p>
    </NotAuthorized>
</AuthorizeView>
```

Hoặc route được bảo vệ bằng attribute:
```markup
&#64;page "/settings"

&#64;attribute [Authorize(Policy = "RequireEmail")]

<h3>Cấu hình tài khoản</h3>

&#64;code {

}
```

## Resource-based Authorization

Resource-based cho phép kiểm tra quyền động (dynamic), tùy vào từng đối tượng cụ thể.
Ví dụ: User chỉ được sửa bài viết của chính mình hoặc xóa tài nguyên mà họ sở hữu.

Tạo Handler Resource:
```csharp
using Microsoft.AspNetCore.Authorization;

public class Document
{
    public string OwnerId { get; set; } = default!;
}

public class DocumentAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, Document>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OperationAuthorizationRequirement requirement,
        Document resource)
    {
        if (requirement.Name == "Edit" && 
            context.User.Identity?.Name == resource.OwnerId)
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}
```

Đăng ký handler trong `Program.cs`:
```csharp
builder.Services.AddSingleton<IAuthorizationHandler, DocumentAuthorizationHandler>();
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CanEdit", policy =>
        policy.AddRequirements(new OperationAuthorizationRequirement { Name = "Edit" }));
});
```

Dùng trong Component
```markup
&#64;page "/document/{Id}"
&#64;inject IAuthorizationService AuthorizationService
&#64;inject AuthenticationStateProvider AuthProvider

&#64;if (canEdit)
{
    <button>Sửa tài liệu</button>
}
else
{
    <p>Bạn không có quyền chỉnh sửa tài liệu này.</p>
}

&#64;code {
    Document doc = new() { OwnerId = "alice@example.com" };

    bool canEdit = false;

    protected override async Task OnInitializedAsync()
    {
        var authState = await AuthProvider.GetAuthenticationStateAsync();
        var user = authState.User;
        var result = await AuthorizationService.AuthorizeAsync(user, doc, "CanEdit");
        canEdit = result.Succeeded;
    }
}
```

::: info
Xem thêm về Authorization trong .NET [tại đây](/post/authentication-va-authorization-trong-net)
:::

# Gọi Protected API

Trong Blazor Web App với mô hình BFF (Backend for Frontend),
ứng dụng không giữ token ở client mà token nằm ở phía server. Điều này có nghĩa là:
- Browser chỉ giữ cookie xác thực.
- Khi gọi API, cookie đó sẽ được gửi tự động đến BFF.
- BFF lấy lại Access Token đã được lưu trong cookie (nhờ `SaveTokens = true`) và sử dụng
  token đó để gọi API backend.

## Internal API

Internal API là các endpoint chạy trực tiếp trong cùng ứng dụng Blazor Server (BFF).
Người dùng đã đăng nhập, nên cookie xác thực được gửi kèm trong mọi request.
Server đọc cookie, xác định danh tính qua `HttpContext.User`.

**Luồng hoạt động:**

::: mermaid
sequenceDiagram
    participant User as Browser
    participant BFF as Blazor Server
    participant API as Internal API

    User->>BFF: GET /api/profile (cookie tự động gửi)
    BFF->>API: Xử lý request, đọc HttpContext.User
    API-->>BFF: Dữ liệu người dùng
    BFF-->>User: JSON response
:::

Ví dụ: API lấy thông tin người dùng

```csharp
app.MapGet("/api/profile", (HttpContext ctx) =>
{
    var user = ctx.User;
    if (user?.Identity?.IsAuthenticated != true)
        return Results.Unauthorized();

    return Results.Ok(new
    {
        Name = user.Identity!.Name,
        Email = user.FindFirst(ClaimTypes.Email)?.Value
    });
}).RequireAuthorization();
```

Client gọi:
```csharp
&#64;inject HttpClient Http

&#64;code {
    private object? profile;

    protected override async Task OnInitializedAsync()
    {
        // Cookie tự động gửi kèm
        profile = await Http.GetFromJsonAsync<object>("api/profile");
    }
}
```

## External API

Khi BFF cần gọi API bên ngoài thay mặt người dùng (ví dụ GitHub API),
ta không thể dùng cookie vì cookie chỉ có giá trị nội bộ.
Thay vào đó, server sẽ lấy Access Token đã lưu khi đăng nhập (OIDC) rồi
đính kèm token vào header `Authorization: Bearer <token>`, rồi proxy request ra ngoài.

**Luồng hoạt động:**

::: mermaid
sequenceDiagram
    participant User as Browser/Blazor Client
    participant BFF as BFF Server
    participant API as External API

    User->>BFF: Gọi /api/github-repos
    BFF->>BFF: Lấy access_token từ cookie (GetTokenAsync)
    BFF->>API: Gửi request với Authorization: Bearer token
    API-->>BFF: Trả dữ liệu JSON
    BFF-->>User: JSON response
:::

### TokenHandler

Ta tạo một `DelegatingHandler` để tự động gắn Access Token cho các request ra ngoài.

```csharp
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authentication;

public class TokenHandler(IHttpContextAccessor httpContextAccessor) : 
    DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, CancellationToken cancellationToken)
    {
        if (httpContextAccessor.HttpContext is null)
        {
            throw new Exception("HttpContext not available");
        }

        var accessToken = await httpContextAccessor.HttpContext.GetTokenAsync("access_token");

        if (accessToken is null)
        {
            throw new Exception("No access token");
        }

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", accessToken);

        return await base.SendAsync(request, cancellationToken);
    }
}
```

### Cấu hình trong Program.cs:
```csharp
builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<TokenHandler>();

builder.Services.AddHttpClient("ExternalApi", client =>
{
    client.BaseAddress = new Uri("https://api.github.com/");
    client.DefaultRequestHeaders.UserAgent.ParseAdd("BlazorBFF");
}).AddHttpMessageHandler<TokenHandler>();
```

::: info
Khi gọi ExternalApi, .NET sẽ tự động thêm Access Token từ `HttpContext`.
:::

### Endpoint proxy server

```csharp
app.MapGet("/api/github-repos", async (IHttpClientFactory factory) =>
{
    var client = factory.CreateClient("ExternalApi");
    var repos = await client.GetFromJsonAsync<List<GithubRepo>>("user/repos");
    return Results.Ok(repos);
}).RequireAuthorization();
```

### Client sẽ gọi tới server endpoint

```markup
&#64;inject HttpClient Http

&#64;code {
    private List<GithubRepo>? repos;

    protected override async Task OnInitializedAsync()
    {
        repos = await Http.GetFromJsonAsync<List<GithubRepo>>("api/github-repos");
    }
}
```

# Kết luận

Trong phần này, chúng ta đã tìm hiểu chi tiết về Authorization trong Blazor, bao gồm các cơ chế     
Role-based, Policy-based cho đến Resource-based Authorization, giúp kiểm soát quyền truy
cập của người dùng một cách linh hoạt. Bên cạnh đó, bạn cũng đã nắm được cách Blazor Web App
gọi Internal API và External API một cách an toàn sử dụng Cookie Authentication và
Access Token được lưu trữ trên server.

Ở [phần tiếp theo](/post/authentication-va-authorization-trong-blazor-phan-4-authentication-voi-nhieu-identity-provider), chúng ta sẽ xây dựng một cơ chế đăng nhập linh hoạt hơn cho phép người dùng
sử dụng nhiều Identity Provider (IdP) như Google, Facebook hoặc Microsoft Entra ID
nhưng vẫn được ánh xạ về một tài khoản duy nhất trong ứng dụng. Điều này sẽ giúp hệ thống
hỗ trợ đăng nhập đa kênh mà vẫn duy trì tính thống nhất và bảo mật trong quản lý danh tính.
