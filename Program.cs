using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using DocumentationWeb;
using DocumentationWeb.Services;
using Microsoft.Extensions.DependencyInjection;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

// Configure services in a static method so pre-rendering tooling can discover them.
ConfigureServices(builder.Services, builder.HostEnvironment);

builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

await builder.Build().RunAsync();

static void ConfigureServices(IServiceCollection services, IWebAssemblyHostEnvironment hostEnv)
{
    services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(hostEnv.BaseAddress) });
    services.AddScoped<BookmarkService>();
}
