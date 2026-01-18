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
            string output = args.Length > 1 && args[0] == "--output" ? args[1] : "sitemap.xml";
            var pages = Blake.Generated.GeneratedContentIndex.GetPages().Where(p => !p.Draft).ToList();
            string baseUrl = Environment.GetEnvironmentVariable("SITE_BASE_URL") ?? "https://example.com/";
            if (!baseUrl.EndsWith("/")) baseUrl += "/";

            var urlset = new System.Xml.Linq.XElement("urlset",
                new System.Xml.Linq.XAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9"),
                pages.Select(p =>
                    new System.Xml.Linq.XElement("url",
                        new System.Xml.Linq.XElement("loc", baseUrl.TrimEnd('/') + p.Slug),
                        new System.Xml.Linq.XElement("changefreq", "weekly"),
                        new System.Xml.Linq.XElement("priority", p.Slug == "/" ? "1.0" : "0.5")
                    )
                )
            );
            var doc = new System.Xml.Linq.XDocument(new System.Xml.Linq.XDeclaration("1.0", "UTF-8", "yes"), urlset);
            System.IO.Directory.CreateDirectory(System.IO.Path.GetDirectoryName(output) ?? ".");
            doc.Save(output);
            System.Console.WriteLine($"Sitemap generated at {output}");
            return 0;
        }
    }
}
