using System;
using System.IO;
using System.Linq;
using System.Xml.Linq;
using System.Collections.Generic;
using System.Reflection;

// Reference the main project to access GeneratedContentIndex and PageModel
using Blake.Generated;
using Blake.Types;

namespace DocumentationWeb.Tools.SitemapGenerator
{
    class Program
    {
        static int Main(string[] args)
        {
            try
            {
                string output = "sitemap.xml";
                // simple arg parsing: --output <path>
                for (int i = 0; i < args.Length; i++)
                {
                    if (args[i] == "--output" && i + 1 < args.Length)
                    {
                        output = args[i + 1];
                        i++;
                    }
                }

                var pages = Blake.Generated.GeneratedContentIndex.GetPages().Where(p => !p.Draft).ToList();
                string baseUrl = Environment.GetEnvironmentVariable("SITE_BASE_URL") ?? "https://example.com/";
                if (!baseUrl.EndsWith("/")) baseUrl += "/";

                XNamespace ns = "http://www.sitemaps.org/schemas/sitemap/0.9";

                var urlset = new XElement(ns + "urlset",
                    pages.Select(p =>
                        new XElement(ns + "url",
                            new XElement(ns + "loc", baseUrl.TrimEnd('/') + p.Slug),
                            new XElement(ns + "changefreq", "weekly"),
                            new XElement(ns + "priority", p.Slug == "/" ? "1.0" : "0.5")
                        )
                    )
                );

                var doc = new XDocument(new XDeclaration("1.0", "UTF-8", "yes"), urlset);
                var dir = Path.GetDirectoryName(output);
                if (!string.IsNullOrEmpty(dir)) Directory.CreateDirectory(dir);
                doc.Save(output);
                Console.WriteLine($"Sitemap generated at {output}");
                return 0;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine("Error generating sitemap: " + ex);
                return 2;
            }
        }
    }
}
