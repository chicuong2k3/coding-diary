using Blake.Types;
using System.Collections.Generic;

namespace Blake.Generated;

public static partial class GeneratedContentIndex
{
    // defining declaration (no body) - some generators may produce only the implementation or only the declaration.
    public static partial List<PageModel> GetPages();

    // implementing declaration - fallback implementation that returns an empty list.
    public static partial List<PageModel> GetPages()
    {
        return new List<PageModel>();
    }
}