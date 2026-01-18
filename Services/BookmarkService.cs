using Microsoft.JSInterop;
using System.Text.Json;

namespace DocumentationWeb.Services;

public class BookmarkService
{
    private readonly IJSRuntime _js;
    private List<BookmarkItem> _bookmarks = new();
    private bool _isInitialized = false;

    public event Action? OnBookmarksChanged;

    public BookmarkService(IJSRuntime js)
    {
        _js = js;
    }

    public IReadOnlyList<BookmarkItem> Bookmarks => _bookmarks.AsReadOnly();

    public async Task InitializeAsync()
    {
        if (_isInitialized) return;

        try
        {
            var data = await _js.InvokeAsync<string>("localStorage.getItem", "bookmarks");
            if (!string.IsNullOrEmpty(data))
            {
                _bookmarks = JsonSerializer.Deserialize<List<BookmarkItem>>(data) ?? new();
            }
            _isInitialized = true;
        }
        catch
        {
            _bookmarks = new();
        }
    }

    public bool IsBookmarked(string slug)
    {
        return _bookmarks.Any(b => b.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));
    }

    public BookmarkItem? GetBookmark(string slug)
    {
        return _bookmarks.FirstOrDefault(b => b.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));
    }

    public async Task ToggleBookmarkAsync(string slug, string title, string bookName, double scrollPosition = 0)
    {
        await InitializeAsync();

        var existing = _bookmarks.FirstOrDefault(b => b.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));

        if (existing != null)
        {
            _bookmarks.Remove(existing);
        }
        else
        {
            _bookmarks.Add(new BookmarkItem
            {
                Slug = slug,
                Title = title,
                BookName = bookName,
                ScrollPosition = scrollPosition,
                AddedAt = DateTime.Now
            });
        }

        await SaveAsync();
        OnBookmarksChanged?.Invoke();
    }

    public async Task UpdateScrollPositionAsync(string slug, double scrollPosition)
    {
        var bookmark = _bookmarks.FirstOrDefault(b => b.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));
        if (bookmark != null)
        {
            bookmark.ScrollPosition = scrollPosition;
            bookmark.LastReadAt = DateTime.Now;
            await SaveAsync();
        }
    }

    public async Task RemoveBookmarkAsync(string slug)
    {
        var existing = _bookmarks.FirstOrDefault(b => b.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));
        if (existing != null)
        {
            _bookmarks.Remove(existing);
            await SaveAsync();
            OnBookmarksChanged?.Invoke();
        }
    }

    public async Task ClearAllAsync()
    {
        _bookmarks.Clear();
        await SaveAsync();
        OnBookmarksChanged?.Invoke();
    }

    private async Task SaveAsync()
    {
        try
        {
            var json = JsonSerializer.Serialize(_bookmarks);
            await _js.InvokeVoidAsync("localStorage.setItem", "bookmarks", json);
        }
        catch
        {
            // Ignore localStorage errors
        }
    }
}

public class BookmarkItem
{
    public string Slug { get; set; } = "";
    public string Title { get; set; } = "";
    public string BookName { get; set; } = "";
    public double ScrollPosition { get; set; } = 0;
    public DateTime AddedAt { get; set; }
    public DateTime? LastReadAt { get; set; }
}
