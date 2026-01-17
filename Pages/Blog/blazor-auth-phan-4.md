---
title: 'My first test page 3'
date: 2025-07-16
image: images/blake-logo.png
tags: ["non-technical", "personal", "career", "community"]
description: "Get to know the fundamentals of Blake, the static site generator."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
---

Ở [phần 2](/post/authentication-va-authorization-trong-blazor-phan-2-trien-khai-authentication-trong-blazor),
chúng ta đã triển khai Authentication cho ứng dụng Blazor nhưng chỉ hỗ trợ một
Identity Provider (IdP) duy nhất.

Tuy nhiên trong thực tế nhiều ứng dụng thường có yêu cầu cao hơn:
- Cho phép người dùng đăng nhập bằng nhiều IdP khác nhau. Ví dụ như Google, Facebook, GitHub, TikTok...
- Dù sử dụng nhiều IdP, ứng dụng vẫn ánh xạ tất cả các danh tính đó
  về một user account duy nhất trong cơ sở dữ liệu để việc quản lý được nhất quán.

Trong phần này, chúng ta sẽ mở rộng triển khai từ phần 2:
1. Đăng nhập với nhiều Identity Provider (IdP) như Google, Facebook, GitHub, TikTok,...
2. Ánh xạ tất cả IdP về một user account duy nhất trong cơ sở dữ liệu.

# Tổng quan về Authentication đa IdP

Đăng nhập đa IdP (Multiple Identity Provider Authentication) là việc cho phép người dùng
xác thực bằng nhiều Identity Provider
nhưng kết quả cuối cùng được ánh xạ vào một user account duy nhất trong cơ sở dữ liệu
của ứng dụng.

Trước khi đi vào chi tiết, hãy cùng xem sơ đồ tổng quan luồng đăng nhập đa IdP trong
ứng dụng Blazor Web App (với WebAssembly Render Mode) sử dụng mô hình BFF.

<div class="mermaid"> 
sequenceDiagram 
    participant User as Browser 
    participant Client as Blazor Client 
    participant BFF as Server BFF 
    participant IdP as Identity Provider 
    participant DB as Internal Database

    Client->>BFF: Chọn đăng nhập với Google/Facebook/Tiktok
    BFF->>IdP: Redirect tới OIDC endpoint của IdP
    IdP-->>BFF: Trả về authorization code và id_token
    BFF->>DB: Map token IdP về user account nội bộ
    DB-->>BFF: User account
    BFF->>Client: Lưu cookie xác thực Identity
    Client->>BFF: Gọi API 
    BFF->>DB/External API: Xác thực bằng cookie hoặc token tùy vào internal hay external API
    BFF-->>Client: Trả dữ liệu
</div>

# Triển khai

## Cấu hình Identity

Tạo lớp `ApplicationUser` kế thừa từ `IdentityUser`:

```csharp
public class ApplicationUser : IdentityUser
{
    public string? Picture { get; set; }

    public virtual ICollection<IdentityUserLogin<string>> UserLogins { get; set; } = new List<IdentityUserLogin<string>>();
}
```

Cấu hình `ApplicationDbContext`:

```csharp
public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>().ToTable("Users");
        builder.Entity<IdentityRole>().ToTable("Roles");
        builder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
        builder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
        builder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
        builder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");
        builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
    }
}
```

Trước khi cấu hình các IdP, bạn cần thêm Identity vào `Program.cs` (Server project):

```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddDefaultIdentity<ApplicationUser>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Cấu hình cookie Identity
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});
```

> Điều này đảm bảo `UserManager`, `SignInManager` được đăng ký và cookie của Identity sẽ được tạo.

##  Cấu hình External Authentication trong Program.cs (Server project)

Thêm `AddOpenIdConnect` cho các IdP muốn sử dụng:

```csharp
var oidcSection = builder.Configuration.GetSection("Oidc");

JsonWebTokenHandler.DefaultInboundClaimTypeMap.Clear();
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
})
.AddOpenIdConnect("Google", options =>
{
    oidcSection.GetSection("Google").Bind(options);
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.SaveTokens = true;
    options.GetClaimsFromUserInfoEndpoint = true;

    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("email");

    options.ClaimActions.MapJsonKey("sub", "sub");
    options.ClaimActions.MapUniqueJsonKey(ClaimTypes.NameIdentifier, "sub");
    options.ClaimActions.MapUniqueJsonKey(ClaimTypes.Email, "email");
    options.ClaimActions.MapUniqueJsonKey("picture", "picture");

    options.TokenValidationParameters.NameClaimType = ClaimTypes.Email;

    // Xử lý ánh xạ user nội bộ
    options.Events.OnTicketReceived = async context =>
    {
        if (context == null || context.Principal == null) 
            return;

        var userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<ApplicationUser>>();

        var user = await MapUserToInternalAccount(userManager, context.Principal, "Google");
        if (user is null)
            return;

        var signInManager = context.HttpContext.RequestServices.GetRequiredService<SignInManager<ApplicationUser>>();
        await signInManager.SignInAsync(user, isPersistent: false);
    };
})
.AddFacebook(options =>
{
    oidcSection.GetSection("Facebook").Bind(options);
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.SaveTokens = true;

    options.Scope.Add("public_profile");
    options.Scope.Add("email");

    options.Fields.Add("email");
    options.Fields.Add("name");
    options.Fields.Add("picture");

    options.ClaimActions.MapUniqueJsonKey(ClaimTypes.Email, "email");
    options.ClaimActions.MapUniqueJsonKey("picture", "picture.data.url");
    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");

    options.Events.OnCreatingTicket = async context =>
    {
        if (context == null || context.Principal == null)
            return;

        var userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<ApplicationUser>>();

        var user = await MapUserToInternalAccount(userManager, context.Principal, "Facebook");
        if (user is null)
            return;

        var signInManager = context.HttpContext.RequestServices.GetRequiredService<SignInManager<ApplicationUser>>();
        await signInManager.SignInAsync(user, isPersistent: false);
    };
});

// ...

var app = builder.Build();

/// ...

app.MapLoginAndLogout();

app.Run();

static async Task<ApplicationUser?> MapUserToInternalAccount(
        UserManager<ApplicationUser> userManager,
        ClaimsPrincipal principal,
        string provider)
{
    var providerKey = principal.FindFirstValue(ClaimTypes.NameIdentifier);
    var email = principal.FindFirstValue(ClaimTypes.Email);
    var picture = principal.FindFirstValue("picture");
    if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(providerKey))
    {
        return null;
    }

    // Kiểm tra IdP đã liên kết với user nào chưa
    var user = await userManager.Users
        .Include(u => u.UserLogins)
        .FirstOrDefaultAsync(u => u.UserLogins.Any(l => l.LoginProvider == provider && l.ProviderKey == providerKey));

    // Nếu IdP đã liên kết thì dùng user hiện tại
    if (user != null)
        return user;

    // Nếu email đã tồn tại nhưng IdP khác thì liên kết thêm IdP
    user = await userManager.FindByEmailAsync(email);
    if (user != null)
    {
        await userManager.AddLoginAsync(user, new UserLoginInfo(provider, providerKey, provider));
        return user;
    }

    // Nếu chưa có user thì tạo mới
    user = new ApplicationUser
    {
        UserName = email,
        Email = email,
        Picture = picture
    };

    await userManager.CreateAsync(user);
    await userManager.AddLoginAsync(user, new UserLoginInfo(provider, providerKey, provider));
    return user;
}
```

Hàm `MapUserToInternalAccount` thực hiện việc liên kết IdP với user account.

Để thêm các `Claims` vào cookie ta cần thêm `AppClaimsPrincipalFactory`, ở đây chúng ta
thêm `picture` claim:

```csharp
public class AppClaimsPrincipalFactory
    : UserClaimsPrincipalFactory<ApplicationUser, IdentityRole>
{
    public AppClaimsPrincipalFactory(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, roleManager, optionsAccessor)
    {
    }

    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
    {
        var identity = await base.GenerateClaimsAsync(user);

        if (!string.IsNullOrEmpty(user.Picture))
        {
            identity.AddClaim(new Claim("picture", user.Picture));
        }

        return identity;
    }
}
```

Và đăng ký nó trong `Program.cs`:
```csharp
builder.Services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, AppClaimsPrincipalFactory>();
```

Trong `appsettings.json`:

```javascript
{
  "Oidc": {
    "Google": {
      "Authority": "https://accounts.google.com",
      "ClientId": "717065824517-rn6kcibgapocld3uis01itnosfdefjd5.apps.googleusercontent.com",
      "ClientSecret": "",
      "CallbackPath": "/signin-callback/google",
      "ResponseType": "code"
    },
    "Facebook": {
      "AppId": "828675846194375",
      "AppSecret": "",
      "CallbackPath": "/signin-callback/facebook"
    }
  }
}
```

> ❌ Không thể dùng `.AddOpenIdConnect()` cho Facebook
vì Facebook không hỗ trợ chuẩn OpenID Connect (OIDC).
Bạn bắt buộc phải dùng `.AddFacebook()` (package **Microsoft.AspNetCore.Authentication.Facebook**) nếu muốn login qua Facebook.

## Giao diện đăng nhập

Trong phần 2, giao diện chỉ có một nút login cho Google. Ở đây, chúng ta thêm component     
`ExternalLogin.razor` để hiển thị các nút Login cho các IdP khác (bạn có thể tùy chỉnh tùy theo nhu cầu):

```markup
&#64;inject NavigationManager NavigationManager

<div class="external-login-buttons">
    &#64;foreach (var provider in availableProviders)
    {
        <button &#64;onclick="() => Login(provider)">
            &#64;provider
        </button>
    }
</div>

&#64;code {
    // danh sách các IdP
    private List<string> availableProviders = new() { "Google", "Facebook" };

    // redirect client tới server endpoint tương ứng với IdP
    private void Login(string provider)
    {
        var returnUrl = Uri.EscapeDataString(NavigationManager.Uri);
        NavigationManager.NavigateTo($"/authentication/signin-{provider.ToLower()}?returnUrl={returnUrl}", forceLoad: true);
    }
}
```

## Endpoint cho mỗi IdP

Phần 2 chỉ có `/authentication/login`. Ở đây, chúng ta thêm endpoint cho từng IdP.

```csharp
internal static class LoginLogoutEndpointRouteBuilderExtensions
{
    internal static IEndpointConventionBuilder MapLoginAndLogout(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("authentication");

        var idps = new[] { "Google", "Facebook" };
        foreach (var provider in idps)
        {
            group.MapGet($"/signin-{provider.ToLower()}", (HttpContext context, string? returnUrl) =>
            {
                
                var props = GetAuthProperties(returnUrl);
                return Results.Challenge(props, new[] { provider });
            });
        }
            
        group.MapPost("/logout", async (HttpContext context, [FromQuery] string? returnUrl) =>
        {
            var props = GetAuthProperties(returnUrl);

            var oidcOptionsMonitor = context.RequestServices.GetRequiredService<
                Microsoft.Extensions.Options.IOptionsMonitor<OpenIdConnectOptions>>();
            var oidcOptions = oidcOptionsMonitor.Get(OpenIdConnectDefaults.AuthenticationScheme);

            if (oidcOptions.Configuration?.EndSessionEndpoint != null)
            {
                await context.SignOutAsync(OpenIdConnectDefaults.AuthenticationScheme, props);
            }

            await context.SignOutAsync(IdentityConstants.ApplicationScheme, props);
        });

        return group;
    }

    // Giữ nguyên method khác
}
```

Logout endpoint sử dụng `IdentityConstants.ApplicationScheme` thay cho `CookieAuthenticationDefaults.AuthenticationScheme`
vì dùng Identity.


Vậy là chúng ta đã hoàn tất series về Authentication và Authorization trong Blazor.
Từ việc đăng nhập cơ bản, quản lý quyền truy cập đến triển khai đa Identity Provider và
ánh xạ người dùng.

Hy vọng series này giúp bạn tự tin hơn khi triển khai xác thực và phân quyền
trong các dự án thực tế.
