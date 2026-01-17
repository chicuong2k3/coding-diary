using Blake.Types;
namespace Blake.Generated;
public static partial class GeneratedContentIndex
{
    public static partial List<PageModel> GetPages() => new()
    {
        new PageModel
        {
            Id = @"c2ccf001-9f70-48fb-8c49-feddd3643e5c",
            Title = @"My first test page 2",
            Slug = @"/blog/sample2",
            Description = @"Get to know the fundamentals of Blake, the static site generator.",
            Date = new DateTime(2025, 7, 16),
            Draft = false,
            IconIdentifier = @"bi bi-plus-square-fill-nav-menu",
            Tags = new List<string> { "non-technical", "personal", "career", "community" },
            Image = @"images/blake-logo.png",
            Metadata = new Dictionary<string, string>
            {
            }
        },
        new PageModel
        {
            Id = @"0e8a8cfd-f9e5-4340-892e-14cd093110af",
            Title = @"My first test page",
            Slug = @"/blog/sample-post",
            Description = @"Get to know the fundamentals of Blake, the static site generator.",
            Date = new DateTime(2025, 7, 16),
            Draft = false,
            IconIdentifier = @"bi bi-plus-square-fill-nav-menu",
            Tags = new List<string> { "machine-learning", "algebra" },
            Image = @"images/blake-logo.png",
            Metadata = new Dictionary<string, string>
            {
            }
        },
    };
}
