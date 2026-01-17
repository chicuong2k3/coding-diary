---
title: 'My first test page 3'
date: 2025-07-16
image: images/blake-logo.png
tags: ["non-technical", "personal", "career", "community"]
description: "Get to know the fundamentals of Blake, the static site generator."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
---

Ở [phần 1](authentication-va-authorization-trong-blazor-phan-1-nen-tang) chúng ta đã tìm hiểu các khái niệm,
các mô hình (SSR/SPA/BFF) và lý do Microsoft khuyến nghị BFF cho Blazor Web App. Ở phần 2 này,
chúng ta đi sâu vào việc triển khai từ các thành phần cốt lõi và cách hoạt động
của chúng.

# Các thành phần chính và vai trò của chúng

Dưới đây là danh sách thành phần bạn sẽ gặp khi triển khai BFF-based authentication
trong Blazor Web App.

<div class="mermaid">
graph TD
    subgraph Browser["Blazor Client (WebAssembly)"]
        ASP[AuthenticationStateProvider]
        AV[AuthorizeView/ClaimsPrincipal]
        ASP --> AV
    end

    subgraph Server["Blazor Server (BFF)"]
        COR[CookieOidcRefresher]
        OIDC[OpenIdConnect Middleware]
        COOKIE[Cookie Authentication]
        COR --> COOKIE
        COOKIE --> OIDC
    end

    subgraph IdP["Identity Provider (Google, Azure AD, ...)"]
        TOKEN[OIDC Token Endpoint]
    end

    AV -->|Gửi request| COOKIE
    COOKIE -->|Refresh Token/Access Token| TOKEN
    TOKEN -->|Token Response| COR
    COR -->|Lưu token trong cookie| ASP
</div>

## AuthenticationStateProvider

`AuthenticationStateProvider` là abstraction của Blazor để cung cấp trạng thái xác thực
(`AuthenticationState`) cho component. Microsoft có hai implementation quan trọng phục vụ
cho cơ chế prerendering + hydrate của Blazor Web App:
- `PersistingAuthenticationStateProvider` (nằm trong Server project): Trong lúc prerendering, nó tạo `AuthenticationState`
  trên server và lưu lại `UserInfo` vào `PersistentComponentState` để client có thể deserialize khi hydrate. Được dùng
  trong `InteractiveWebAssembly` hoặc `Auto` render mode.
- `PersistentAuthenticationStateProvider` (nằm trong Client project): Khi client hydrate, đọc lại `UserInfo`  
  (từ `PersistentComponentState`) và khởi tạo `ClaimsPrincipal` giúp UI hiển thị đúng trạng thái đăng nhập.

> **Vì sao cần có 2 Provider?**  
Khi ứng dụng được prerender trên server, Blazor chưa có runtime WebAssembly nên phải lưu
`UserInfo` vào `PersistentComponentState`. Sau khi hydrate, client (wasm) đọc lại để đồng bộ
trạng thái đăng nhập.

```csharp
internal sealed class PersistingAuthenticationStateProvider
    : AuthenticationStateProvider, IHostEnvironmentAuthenticationStateProvider, IDisposable
{
    private readonly PersistentComponentState _persistentComponentState;
    private readonly PersistingComponentStateSubscription _subscription;
    private Task<AuthenticationState>? _authenticationStateTask;

    public PersistingAuthenticationStateProvider(PersistentComponentState state)
    {
        _persistentComponentState = state;
        _subscription = state.RegisterOnPersisting(OnPersistingAsync, RenderMode.InteractiveWebAssembly);
    }

    public override Task<AuthenticationState> GetAuthenticationStateAsync()
        => _authenticationStateTask ??
            throw new InvalidOperationException($"Do not call {nameof(GetAuthenticationStateAsync)} outside of the DI scope for a Razor component. Typically, this means you can call it only within a Razor component or inside another DI service that is resolved for a Razor component.");

    public void SetAuthenticationState(Task<AuthenticationState> task)
    {
        _authenticationStateTask = task;
    }

    private async Task OnPersistingAsync()
    {
        var authenticationState = await GetAuthenticationStateAsync();
        var principal = authenticationState.User;

        if (principal.Identity?.IsAuthenticated == true)
        {
            _persistentComponentState.PersistAsJson(nameof(UserInfo), UserInfo.FromClaimsPrincipal(principal));
        }
    }

    public void Dispose()
    {
        _subscription.Dispose();
    }
}
```

```csharp
internal sealed class PersistentAuthenticationStateProvider : AuthenticationStateProvider
{
    private static readonly Task<AuthenticationState> _defaultUnauthenticatedTask =
        Task.FromResult(new AuthenticationState(new ClaimsPrincipal(new ClaimsIdentity())));

    private readonly Task<AuthenticationState> _authenticationStateTask = _defaultUnauthenticatedTask;

    public PersistentAuthenticationStateProvider(PersistentComponentState state)
    {
        if (!state.TryTakeFromJson<UserInfo>(nameof(UserInfo), out var userInfo) || userInfo is null)
        {
            return;
        }

        _authenticationStateTask = Task.FromResult(new AuthenticationState(userInfo.ToClaimsPrincipal()));
    }

    public override Task<AuthenticationState> GetAuthenticationStateAsync() => _authenticationStateTask;
}
```


> Client không là nguồn truth cho xác thực, nó chỉ hiển thị UI dựa trên dữ liệu đã được
server serialize.


## CookieOidcRefresher (Token refresh orchestration)

Dùng để kiểm tra `expires_at` trong cookie properties, nếu token gần hết hạn thì tự động gửi  
refresh token để lấy access token mới từ IdP và cập nhật cookie.

```csharp
public class CookieOidcRefresher
{
    public CookieOidcRefresher(IOptionsMonitor<OpenIdConnectOptions> oidcOptionsMonitor)
    {
        _oidcOptionsMonitor = oidcOptionsMonitor;
    }

    private readonly OpenIdConnectProtocolValidator _oidcTokenValidator = new()
    {
        // We no longer have the original nonce cookie which is deleted at the end of the authorization code flow having served its purpose.
        // Even if we had the nonce, it's likely expired. It's not intended for refresh requests. Otherwise, we'd use oidcOptions.ProtocolValidator.
        RequireNonce = false,
    };
    private readonly IOptionsMonitor<OpenIdConnectOptions> _oidcOptionsMonitor;

    public async Task ValidateOrRefreshCookieAsync(CookieValidatePrincipalContext validateContext, string oidcScheme)
    {
        var accessTokenExpirationText = validateContext.Properties.GetTokenValue("expires_at");
        if (!DateTimeOffset.TryParse(accessTokenExpirationText, out var accessTokenExpiration))
        {
            return;
        }

        var oidcOptions = _oidcOptionsMonitor.Get(oidcScheme);
        var now = oidcOptions.TimeProvider!.GetUtcNow();
        if (now + TimeSpan.FromMinutes(5) < accessTokenExpiration)
        {
            return;
        }

        var oidcConfiguration = await oidcOptions.ConfigurationManager!.GetConfigurationAsync(validateContext.HttpContext.RequestAborted);
        var tokenEndpoint = oidcConfiguration.TokenEndpoint ?? throw new InvalidOperationException("Cannot refresh cookie. TokenEndpoint missing!");

        using var refreshResponse = await oidcOptions.Backchannel.PostAsync(tokenEndpoint,
            new FormUrlEncodedContent(new Dictionary<string, string?>()
            {
                ["grant_type"] = "refresh_token",
                ["client_id"] = oidcOptions.ClientId,
                ["client_secret"] = oidcOptions.ClientSecret,
                ["scope"] = string.Join(" ", oidcOptions.Scope),
                ["refresh_token"] = validateContext.Properties.GetTokenValue("refresh_token"),
            }));

        if (!refreshResponse.IsSuccessStatusCode)
        {
            validateContext.RejectPrincipal();
            return;
        }

        var refreshJson = await refreshResponse.Content.ReadAsStringAsync();
        var message = new OpenIdConnectMessage(refreshJson);

        var validationParameters = oidcOptions.TokenValidationParameters.Clone();
        if (oidcOptions.ConfigurationManager is BaseConfigurationManager baseConfigurationManager)
        {
            validationParameters.ConfigurationManager = baseConfigurationManager;
        }
        else
        {
            validationParameters.ValidIssuer = oidcConfiguration.Issuer;
            validationParameters.IssuerSigningKeys = oidcConfiguration.SigningKeys;
        }

        var validationResult = await oidcOptions.TokenHandler.ValidateTokenAsync(message.IdToken, validationParameters);

        if (!validationResult.IsValid)
        {
            validateContext.RejectPrincipal();
            return;
        }

        var validatedIdToken = JwtSecurityTokenConverter.Convert(validationResult.SecurityToken as JsonWebToken);
        validatedIdToken.Payload["nonce"] = null;
        _oidcTokenValidator.ValidateTokenResponse(new()
        {
            ProtocolMessage = message,
            ClientId = oidcOptions.ClientId,
            ValidatedIdToken = validatedIdToken,
        });

        validateContext.ShouldRenew = true;
        validateContext.ReplacePrincipal(new ClaimsPrincipal(validationResult.ClaimsIdentity));

        var expiresIn = int.Parse(message.ExpiresIn, NumberStyles.Integer, CultureInfo.InvariantCulture);
        var expiresAt = now + TimeSpan.FromSeconds(expiresIn);
        validateContext.Properties.StoreTokens(new[]
        {
            new AuthenticationToken { Name = "access_token", Value = message.AccessToken },
            new AuthenticationToken { Name = "id_token", Value = message.IdToken },
            new AuthenticationToken { Name = "refresh_token", Value = message.RefreshToken },
            new AuthenticationToken { Name = "token_type", Value = message.TokenType },
            new AuthenticationToken { Name = "expires_at", Value = expiresAt.ToString("o", CultureInfo.InvariantCulture) },
        });
    }
}
```

Extension method để đăng ký `CookieOidcRefresher` và hook `OnValidatePrincipal`:

```csharp
internal static class CookieOidcServiceCollectionExtensions
{
    public static IServiceCollection ConfigureCookieOidcRefresh(this IServiceCollection services, string cookieScheme, string oidcScheme)
    {
        services.AddSingleton<CookieOidcRefresher>();
        services.AddOptions<CookieAuthenticationOptions>(cookieScheme).Configure<CookieOidcRefresher>((cookieOptions, refresher) =>
        {
            cookieOptions.Events.OnValidatePrincipal = context => refresher.ValidateOrRefreshCookieAsync(context, oidcScheme);
        });
        
        services.AddOptions<OpenIdConnectOptions>(oidcScheme).Configure(oidcOptions =>
        {
            var provider = oidcOptions.Authority ?? "";

            // Chỉ thêm offline_access nếu không phải Google
            if (!provider.Contains("accounts.google.com", StringComparison.OrdinalIgnoreCase))
            {
                oidcOptions.Scope.Add(OpenIdConnectScope.OfflineAccess);
            }

            oidcOptions.SaveTokens = true;
        });

        return services;
    }
}
```


## TokenHandler (DelegatingHandler cho HTTP client)

Dùng khi server cần gọi external API thay mặt user, handler này sẽ lấy access token
từ `HttpContext` và thêm header `Authorization: Bearer <token>` vào request.

```csharp
public class TokenHandler : DelegatingHandler
{
	private readonly IHttpContextAccessor _httpContextAccessor;

	public TokenHandler(IHttpContextAccessor httpContextAccessor)
	{
		_httpContextAccessor = httpContextAccessor;
	}

	protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
	{
		var ctx = _httpContextAccessor.HttpContext;
		if (ctx != null)
		{
			var token = await ctx.GetTokenAsync("access_token");
			if (!string.IsNullOrEmpty(token))
			{
				request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
			}
		}

		return await base.SendAsync(request, cancellationToken);
	}
}
```

## UserInfo và ClaimMapper

Dùng để chuẩn hóa `ClaimsPrincipal` lấy từ nhiều IdP (Google, Github...) về một model
thống nhất vì mỗi IdP trả về claim khác nhau.

```csharp
public class UserInfo
{
	public string Sub { get; set; } = default!;
	public string? Email { get; set; }
	public string? Name { get; set; }
	public string? Picture { get; set; }

	public static UserInfo FromClaimsPrincipal(ClaimsPrincipal principal)
	{
		var id = principal.FindFirst("sub")?.Value
			?? principal.FindFirst("oid")?.Value
			?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;


		var email = principal.FindFirst(ClaimTypes.Email)?.Value
			?? principal.FindFirst("email")?.Value;

		var name = principal.FindFirst("name")?.Value
		?? principal.FindFirst(ClaimTypes.GivenName)?.Value
		?? principal.FindFirst(ClaimTypes.Surname)?.Value;

		var picture = principal.FindFirst("picture")?.Value;


		return new UserInfo { Sub = id ?? "", Email = email, Name = name, Picture = picture };
	}


	public ClaimsPrincipal ToClaimsPrincipal()
	{
		var claims = new List<Claim>();
		claims.Add(new Claim("sub", Sub));
		if (!string.IsNullOrEmpty(Email)) 
			claims.Add(new Claim(ClaimTypes.Email, Email));
		if (!string.IsNullOrEmpty(Name)) 
			claims.Add(new Claim(ClaimTypes.Name, Name));
		if (!string.IsNullOrEmpty(Picture)) 
			claims.Add(new Claim("picture", Picture));

		var identity = new ClaimsIdentity(claims, "oidc");
		return new ClaimsPrincipal(identity);
	}
}
```

# Triển khai

## Cấu hình Server Project

### Packages cần thiết

```bash
dotnet add package Microsoft.AspNetCore.Authentication.OpenIdConnect
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
```

### appsettings.json

Ví dụ với Google:

```javascript
{
  "Oidc": {
    "Authority": "https://accounts.google.com",
    "ClientId": "YOUR_GOOGLE_CLIENT_ID",
    "ClientSecret": "YOUR_GOOGLE_CLIENT_SECRET",
    "CallbackPath": "/signin-oidc",
    "ResponseType": "code"
  }
}
```

> Lưu client secret trong enviroment variables, không lưu trong appsettings.json
(sử dụng user-secrets nếu là môi trường development).

### Program.cs

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveWebAssemblyComponents();

// Persistent state (prerender -> wasm)
builder.Services.AddSingleton<PersistentComponentState>();

builder.Services.AddScoped<AuthenticationStateProvider, PersistingAuthenticationStateProvider>();
builder.Services.AddCascadingAuthenticationState();
builder.Services.AddAuthorization();

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.ExpireTimeSpan = TimeSpan.FromHours(8);
    options.SlidingExpiration = true;
})
.AddOpenIdConnect(options =>
{
    builder.Configuration.Bind("Oidc", options);
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.SaveTokens = true; // Lưu token ở server để gọi API
    options.GetClaimsFromUserInfoEndpoint = true;
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("email");

    options.ClaimActions.MapJsonKey("sub", "sub");
    options.ClaimActions.MapUniqueJsonKey(ClaimTypes.NameIdentifier, "sub");
    options.ClaimActions.MapUniqueJsonKey(ClaimTypes.Email, "email");
    options.ClaimActions.MapUniqueJsonKey("picture", "picture");

    options.TokenValidationParameters.NameClaimType = ClaimTypes.Email;
});

// Cookie refresh helper
builder.Services.ConfigureCookieOidcRefresh(
    CookieAuthenticationDefaults.AuthenticationScheme,
    OpenIdConnectDefaults.AuthenticationScheme);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseWebAssemblyDebugging();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAntiforgery();

app.UseAuthentication();
app.UseAuthorization();

app.MapRazorComponents<App>()
    .AddInteractiveWebAssemblyRenderMode()
    .AddAdditionalAssemblies(typeof(Blogtify.Client._Imports).Assembly);

app.MapLoginAndLogout();
app.Run();
```

### Endpoints login/logout

Định nghĩa route để trigger SignIn/SignOut:
```csharp
internal static class LoginLogoutEndpointRouteBuilderExtensions
{
    internal static IEndpointConventionBuilder MapLoginAndLogout(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("authentication");

        group.MapGet("/login", (string? returnUrl) => TypedResults.Challenge(GetAuthProperties(returnUrl)))
            .AllowAnonymous();

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

            await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme, props);
        });

        return group;
    }

    private static AuthenticationProperties GetAuthProperties(string? returnUrl)
    {
        // TODO: Use HttpContext.Request.PathBase instead.
        const string pathBase = "/";

        // Prevent open redirects.
        if (string.IsNullOrEmpty(returnUrl))
        {
            returnUrl = pathBase;
        }
        else if (!Uri.IsWellFormedUriString(returnUrl, UriKind.Relative))
        {
            returnUrl = new Uri(returnUrl, UriKind.Absolute).PathAndQuery;
        }
        else if (returnUrl[0] != '/')
        {
            returnUrl = $"{pathBase}{returnUrl}";
        }

        return new AuthenticationProperties { RedirectUri = returnUrl };
    }
}
```

> Lưu ý: Trước khi redirect, kiểm tra returnUrl là relative path, không phải full URL từ bên ngoài
để tránh lỗ hổng bảo mật Open Redirect.

## Cấu hình Client Project

### Program.cs

```csharp
var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");

builder.Services.AddScoped<AuthenticationStateProvider, PersistentAuthenticationStateProvider>();
builder.Services.AddCascadingAuthenticationState();
builder.Services.AddAuthorizationCore();

await builder.Build().RunAsync();
```

### Routes.razor

```markup
<CascadingAuthenticationState>
    <Router AppAssembly="&#64;typeof(Blogtify.Client.Program).Assembly">
        <Found Context="routeData">
            <AuthorizeRouteView RouteData="&#64;routeData" DefaultLayout="&#64;typeof(MainLayout)">
                <NotAuthorized>
                    <p>Bạn cần đăng nhập để truy cập trang này.</p>
                </NotAuthorized>
            </AuthorizeRouteView>
        </Found>
        <NotFound>
            <PageTitle>Not found</PageTitle>
            <LayoutView Layout="&#64;typeof(MainLayout)">
                <p role="alert">Sorry, there's nothing at this address.</p>
            </LayoutView>
        </NotFound>
    </Router>
</CascadingAuthenticationState>
```

### Login/Logout UI

```markup
&#64;inject NavigationManager NavigationManager

<AuthorizeView>
    <Authorized>
        <span>Xin chào, &#64;context.User.Identity?.Name!</span>
        <form action="authentication/logout" method="post">
            <AntiforgeryToken />
            <input type="hidden" name="returnUrl" value="&#64;NavigationManager.Uri" />
            <button type="submit">Đăng xuất</button>
        </form>
    </Authorized>
    <NotAuthorized>
        <button &#64;onclick="&#64;Login">Đăng nhập</button>
    </NotAuthorized>
</AuthorizeView>

&#64;code {
    private void Login()
    {
        var returnUrl = Uri.EscapeDataString(NavigationManager.Uri);
        NavigationManager.NavigateTo($"authentication/login?returnUrl={returnUrl}", forceLoad: true);
    }
}
```

# Kết luận

Trong phần này, chúng ta đã đi sâu vào cách Blazor triển khai cơ chế Authentication dựa trên BFF,
bao gồm các thành phần quan trọng như `AuthenticationStateProvider`, `CookieOidcRefresher`,
`TokenHandler` và `UserInfo`. Qua đó, bạn có thể thấy rõ luồng xác thực trong Blazor Web App.

Ở [phần tiếp theo](/post/authentication-va-authorization-trong-blazor-phan-3-authorization-va-api-call), chúng ta sẽ tìm hiểu Authorization và API Call trong Blazor, cách kiểm soát
quyền truy cập và cách Blazor BFF gọi các API nội bộ hoặc bên ngoài một cách bảo mật.