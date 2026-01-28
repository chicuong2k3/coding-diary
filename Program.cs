using DocumentationWeb;
using DocumentationWeb.Components;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddRazorComponents();
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>();

app.Run();
