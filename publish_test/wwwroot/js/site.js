// =============================================
// Theme Management
// =============================================
const ThemeManager = {
    init() {
        const saved = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', saved);
        this.updateIcon(saved);
    },

    toggle() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateIcon(newTheme);
    },

    updateIcon(theme) {
        const darkIcon = document.getElementById('theme-icon-dark');
        const lightIcon = document.getElementById('theme-icon-light');
        if (darkIcon && lightIcon) {
            darkIcon.style.display = theme === 'dark' ? 'block' : 'none';
            lightIcon.style.display = theme === 'light' ? 'block' : 'none';
        }
    }
};

// =============================================
// Mobile Menu Management
// =============================================
const MobileMenuManager = {
    toggle() {
        const drawer = document.getElementById('mobile-nav-drawer');
        const overlay = document.querySelector('.mobile-nav-overlay');
        if (drawer && overlay) {
            const isOpen = drawer.classList.contains('open');
            if (isOpen) {
                this.close();
            } else {
                this.open();
            }
        }
    },

    open() {
        const drawer = document.getElementById('mobile-nav-drawer');
        const overlay = document.querySelector('.mobile-nav-overlay');
        if (drawer && overlay) {
            drawer.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';

            // Close other drawers
            if (window.closeSearch) window.closeSearch();
            if (window.closeToc) window.closeToc();
        }
    },

    close() {
        const drawer = document.getElementById('mobile-nav-drawer');
        const overlay = document.querySelector('.mobile-nav-overlay');
        if (drawer && overlay) {
            drawer.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
};

// =============================================
// Reading Progress Management
// =============================================
const ReadingProgressManager = {
    trackView(currentPath) {
        if (!currentPath) return;

        // Remove leading/trailing slashes
        const slug = currentPath.replace(/^\/+/, '').replace(/\/+$/, '');
        if (!slug) return;

        // Pattern: book-slug/chapter-slug
        const parts = slug.split('/');
        if (parts.length >= 2) {
            const bookSlug = parts[0];
            const chapterSlug = '/' + slug; // Keep leading slash as stored in index

            let readChapters = [];
            try {
                const data = localStorage.getItem('reading_progress_' + bookSlug);
                if (data) {
                    readChapters = JSON.parse(data) || [];
                }
            } catch (e) { }

            if (readChapters.indexOf(chapterSlug) === -1) {
                readChapters.push(chapterSlug);
                localStorage.setItem('reading_progress_' + bookSlug, JSON.stringify(readChapters));

                // Update bookmarks to reflect last read time
                if (window.BookmarkManager) {
                    const bookmark = window.BookmarkManager.getBookmark(chapterSlug);
                    if (bookmark) {
                        bookmark.lastReadAt = new Date().toISOString();
                        window.BookmarkManager.save();
                    }
                }
            }
        }
    }
};


// =============================================
// Bookmark Management
// =============================================
const BookmarkManager = {
    bookmarks: [],
    initialized: false,

    init() {
        if (this.initialized) return;
        try {
            const data = localStorage.getItem('bookmarks');
            this.bookmarks = data ? JSON.parse(data) : [];
        } catch (e) {
            this.bookmarks = [];
        }
        this.initialized = true;
        this.render();
    },

    toggle(slug, title, bookName) {
        const scrollPos = window.scrollY || window.pageYOffset || 0;
        const idx = this.bookmarks.findIndex(b => b.slug === slug);
        let added = false;

        if (idx >= 0) {
            this.bookmarks.splice(idx, 1);
        } else {
            this.bookmarks.push({
                slug: slug,
                title: title,
                bookName: bookName,
                scrollPosition: scrollPos,
                addedAt: new Date().toISOString(),
                lastReadAt: new Date().toISOString()
            });
            added = true;
        }

        this.save();
        this.render();
        this.notifyChange();
        return added;
    },

    updateScrollPosition(slug) {
        const bookmark = this.bookmarks.find(b => b.slug === slug);
        if (bookmark) {
            bookmark.scrollPosition = window.scrollY || window.pageYOffset || 0;
            bookmark.lastReadAt = new Date().toISOString();
            this.save();
        }
    },

    remove(slug) {
        const idx = this.bookmarks.findIndex(b => b.slug === slug);
        if (idx >= 0) {
            this.bookmarks.splice(idx, 1);
            this.save();
            this.render();
            this.notifyChange();
        }
    },

    clearAll() {
        this.bookmarks = [];
        this.save();
        this.render();
        this.notifyChange();
    },

    notifyChange() {
        document.dispatchEvent(new CustomEvent('bookmarksChanged', { detail: { bookmarks: this.bookmarks } }));
    },

    isBookmarked(slug) {
        return this.bookmarks.some(b => b.slug === slug);
    },

    getBookmark(slug) {
        return this.bookmarks.find(b => b.slug === slug);
    },

    getAll() {
        this.init();
        return [...this.bookmarks];
    },

    getByBook(bookName) {
        return this.bookmarks.filter(b => b.bookName === bookName);
    },

    save() {
        try {
            localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
        } catch (e) {
            console.warn('Failed to save bookmarks:', e);
        }
    },

    render() {
        // Update floating bookmark buttons
        document.querySelectorAll('[data-bookmark-slug]').forEach(el => {
            const slug = el.dataset.bookmarkSlug;
            const isBookmarked = this.isBookmarked(slug);
            el.classList.toggle('bookmarked', isBookmarked);

            // Update icon if present
            const addIcon = el.querySelector('.bookmark-icon-add');
            const removeIcon = el.querySelector('.bookmark-icon-remove');
            if (addIcon && removeIcon) {
                addIcon.style.display = isBookmarked ? 'none' : 'block';
                removeIcon.style.display = isBookmarked ? 'block' : 'none';
            }
        });

        // Update bookmark lists
        this.renderBookmarkList();
    },

    renderBookmarkList: function () {
        const listContainer = document.getElementById('bookmark-list-container');
        if (!listContainer) return;

        const recentBookmarks = this.bookmarks.slice(-5).reverse();

        if (recentBookmarks.length === 0) {
            listContainer.innerHTML = '<p class="text-muted small">Chưa có đánh dấu nào</p>';
            return;
        }

        let html = '<div class="bookmark-list-small">';
        recentBookmarks.forEach(b => {
            const truncatedTitle = b.title.length > 28 ? b.title.substring(0, 28) + '...' : b.title;
            html += `
                <div class="bookmark-item-small">
                    <a href="${b.slug}" class="bookmark-link-small" onclick="BookmarkManager.navigateTo('${b.slug}'); return false;">
                        <span class="bookmark-title-small">${truncatedTitle}</span>
                    </a>
                    <button class="btn-remove-small" onclick="BookmarkManager.remove('${b.slug}')" title="Xóa">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            `;
        });
        html += '</div>';

        if (this.bookmarks.length > 5) {
            html += `<a href="/bookmarks" class="view-more-link">Xem tất cả (${this.bookmarks.length})</a>`;
        }

        listContainer.innerHTML = html;

        // NUCLEAR STYLE RESET: Programmatic list-style removal
        setTimeout(() => {
            const sidebar = document.querySelector('.left-sidebar');
            if (sidebar) {
                const elements = sidebar.querySelectorAll('.bookmark-list-small, .bookmark-item-small, .bookmark-item-small *');
                elements.forEach(el => {
                    el.style.listStyle = 'none';
                    el.style.listStyleType = 'none';
                    el.style.padding = '0';
                    el.style.margin = '0';
                    if (el.tagName === 'LI') el.style.display = 'none'; // Just in case
                });
            }
        }, 50);
    },

    navigateTo: function (slug) {
        const bookmark = this.getBookmark(slug);
        if (bookmark && bookmark.scrollPosition > 0) {
            // Store scroll position to restore after navigation
            sessionStorage.setItem('restoreScroll', JSON.stringify({
                slug: slug,
                position: bookmark.scrollPosition
            }));
        }
        window.location.href = slug;
    },

    restoreScrollPosition: function () {
        try {
            this.init();
            const data = sessionStorage.getItem('restoreScroll');
            if (data) {
                const { slug, position } = JSON.parse(data);
                const currentPath = window.location.pathname;

                // Try to match slug with or without leading slash
                const match = currentPath === slug ||
                    currentPath === '/' + slug ||
                    '/' + currentPath === slug;

                if (match && position > 0) {
                    // Content might take a moment to render (MathJax, images)
                    // We try a few times to ensure we get to the right position
                    const attemptScroll = (count) => {
                        window.scrollTo({ top: position, behavior: 'instant' });
                        if (count > 0) {
                            setTimeout(() => attemptScroll(count - 1), 100);
                        }
                    };
                    attemptScroll(3);
                }
                sessionStorage.removeItem('restoreScroll');
            }
        } catch (e) {
            console.error('Failed to restore scroll position:', e);
        }
    }
};

// =============================================
// Search Modal
// =============================================
function openSearch() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.add('open');
        MobileMenuManager.close();
        closeToc();
        const input = document.getElementById('search-input');
        if (input) {
            input.value = '';
            window.searchSelectedIndex = -1;
            setTimeout(() => input.focus(), 100);
            if (window.performSearch) window.performSearch('');
        }
    }
}

function closeSearch() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.remove('open');
    }
}

// Global search state
window.searchSelectedIndex = -1;

function handleSearchKeyDown(e) {
    const results = document.querySelectorAll('.search-result');
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        window.searchSelectedIndex = (window.searchSelectedIndex + 1) % results.length;
        updateSearchSelection(results);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        window.searchSelectedIndex = (window.searchSelectedIndex - 1 + results.length) % results.length;
        updateSearchSelection(results);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        let target = null;
        if (window.searchSelectedIndex >= 0 && window.searchSelectedIndex < results.length) {
            target = results[window.searchSelectedIndex];
        } else if (results.length > 0) {
            target = results[0];
        }

        if (target) {
            let href = target.getAttribute('href');
            if (href) {
                closeSearch();
                if (!href.startsWith('/') && !href.startsWith('http')) {
                    href = '/' + href;
                }
                window.location.href = href;
            }
        }
    } else if (e.key === 'Escape') {
        closeSearch();
    }
}

function updateSearchSelection(results) {
    if (!results || results.length === 0) return;
    results.forEach((el, idx) => {
        if (idx === window.searchSelectedIndex) {
            el.classList.add('selected');
            el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            el.classList.remove('selected');
        }
    });
}

// Delegate search input keydown to document
document.addEventListener('keydown', function (e) {
    const modal = document.getElementById('search-modal');
    if (!modal || !modal.classList.contains('open')) return;
    if (e.target && e.target.id === 'search-input') {
        handleSearchKeyDown(e);
    }
});

window.handleSearchKeyDown = handleSearchKeyDown;
window.updateSearchSelection = updateSearchSelection;

// =============================================
// Mobile TOC Drawer
// =============================================
function toggleToc() {
    const drawer = document.getElementById('toc-drawer');
    const overlay = document.querySelector('.toc-mobile-overlay');
    const fab = document.querySelector('.toc-fab');

    if (drawer && overlay) {
        const isOpen = drawer.classList.contains('open');
        if (isOpen) {
            closeToc();
        } else {
            drawer.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            MobileMenuManager.close();
            closeSearch();
        }
    }
    if (fab) {
        fab.classList.toggle('hidden', drawer && drawer.classList.contains('open'));
    }
}

function closeToc() {
    const drawer = document.getElementById('toc-drawer');
    const overlay = document.querySelector('.toc-mobile-overlay');
    const fab = document.querySelector('.toc-fab');

    if (drawer) {
        drawer.classList.remove('open');
    }
    if (overlay) {
        overlay.classList.remove('open');
    }
    if (fab) {
        fab.classList.remove('hidden');
    }
}

// =============================================
// Table of Contents
// =============================================
function initToc() {
    const content = document.querySelector('.content');
    const tocNavs = document.querySelectorAll('.toc-nav');

    if (!content || tocNavs.length === 0) return;

    const headings = content.querySelectorAll('h1, h2, h3');

    // Populate all TOC nav elements (desktop and mobile)
    tocNavs.forEach(tocNav => {
        tocNav.innerHTML = '';

        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = 'heading-' + index;
            }

            const link = document.createElement('a');
            link.href = '#' + heading.id;
            link.className = 'toc-link toc-level-' + heading.tagName.charAt(1);
            link.textContent = heading.textContent.trim();
            link.onclick = function (e) {
                e.preventDefault();
                scrollToHeading(heading.id);
                closeToc(); // Close mobile drawer if open
            };

            tocNav.appendChild(link);
        });
    });

    // Setup scroll tracking
    setupTocScrollTracking();
}

function setupTocScrollTracking() {
    let ticking = false;

    const scrollHandler = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const headings = document.querySelectorAll('.content h1, .content h2, .content h3');
                const tocLinks = document.querySelectorAll('.toc-link');
                let activeId = null;

                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                for (const heading of headings) {
                    const rect = heading.getBoundingClientRect();
                    if (rect.top <= 150) {
                        activeId = heading.id;
                    }
                }

                // If at the very top, select first heading
                if (scrollTop < 100 && headings.length > 0) {
                    activeId = headings[0].id;
                }

                // If at the very bottom, select last heading
                if ((window.innerHeight + scrollTop) >= document.body.offsetHeight - 50) {
                    if (headings.length > 0) {
                        activeId = headings[headings.length - 1].id;
                    }
                }

                // Update active class
                tocLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === '#' + activeId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    setTimeout(scrollHandler, 200);
}

function scrollToHeading(id) {
    const element = document.getElementById(id);
    if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// =============================================
// Code Blocks
// =============================================
function initCodeBlocks() {
    document.querySelectorAll('pre:not(.code-initialized)').forEach(pre => {
        // Skip mermaid and special pre blocks
        if (pre.closest('.mermaid-container') || pre.style.display === 'none') return;

        pre.classList.add('code-initialized');

        // Wrap in code-block container
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block';

        // Get language from code element class
        const code = pre.querySelector('code');
        let language = 'text';
        if (code) {
            const langClass = Array.from(code.classList).find(c => c.startsWith('language-'));
            if (langClass) {
                language = langClass.replace('language-', '');
            }
        }

        // Create header with language label and copy button
        const header = document.createElement('div');
        header.className = 'code-header';
        header.innerHTML = `
            <span class="code-lang">${language}</span>
            <button class="copy-btn" onclick="copyCode(this)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
            </button>
        `;

        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
    });

    // Apply Prism highlighting
    if (window.Prism) {
        Prism.highlightAll();
    }
}

async function copyCode(button) {
    if (!button) return;
    const codeBlock = button.closest('.code-block');
    if (!codeBlock) return;
    const codeEl = codeBlock.querySelector('code');
    const text = codeEl ? (codeEl.textContent || codeEl.innerText || '') : '';
    if (!text) return;

    // Try navigator.clipboard first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            showCopied(button);
            return;
        } catch (e) {
            // fall through to fallback
        }
    }

    // Fallback using textarea + execCommand
    try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);

        const range = document.createRange();
        range.selectNodeContents(ta);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        ta.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(ta);

        if (successful) {
            showCopied(button);
        }
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

function showCopied(btn) {
    if (!btn) return;
    btn.classList.add('copied');
    const prev = btn.innerHTML;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
    setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = prev;
    }, 2000);
}

// Search Logic
window.performSearch = function (term) {
    window.searchSelectedIndex = -1;
    const container = document.getElementById('search-results-container');
    if (!container) return;

    if (!term || term.trim() === '') {
        container.innerHTML = window.getDefaultSuggestions();
        return;
    }

    const dataEl = document.getElementById('search-data');
    if (!dataEl) return;

    try {
        const pages = JSON.parse(dataEl.textContent);
        const termLower = term.toLowerCase();

        let results = pages.filter(p =>
            p.title.toLowerCase().indexOf(termLower) !== -1 ||
            p.description.toLowerCase().indexOf(termLower) !== -1 ||
            (p.tags && p.tags.some(t => t.toLowerCase().indexOf(termLower) !== -1))
        );

        results.sort((a, b) => {
            const scoreA = getRelevanceScore(a, termLower);
            const scoreB = getRelevanceScore(b, termLower);
            return scoreB - scoreA;
        });

        results = results.slice(0, 8);

        if (results.length > 0) {
            let html = '<div class="search-results"><div class="results-label">Chương tìm thấy</div>';
            results.forEach(r => {
                html += `
                    <a href="/${r.url}" class="search-result" onclick="closeSearch()">
                        <div class="result-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
                        <div class="result-content">
                            <div class="result-title">${escapeHtml(r.title)}</div>
                            ${r.tags && r.tags.length > 0 ? `<div class="result-book">${escapeHtml(r.tags[0])}</div>` : ''}
                        </div>
                        <div class="result-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
                    </a>
                `;
            });
            html += '</div>';
            container.innerHTML = html;
        } else {
            container.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
                    <p>Không có kết quả cho "<strong>${escapeHtml(term)}</strong>"</p>
                    <span>Thử từ khóa khác</span>
                </div>
            `;
        }
    } catch (e) {
        console.error('Search error:', e);
    }
};

window.getDefaultSuggestions = function () {
    const dataEl = document.getElementById('search-data');
    if (!dataEl) return '';
    try {
        const pages = JSON.parse(dataEl.textContent);
        const bookCounts = {};
        pages.forEach(p => {
            if (p.tags && p.tags.length > 0) {
                const book = p.tags[0];
                bookCounts[book] = (bookCounts[book] || 0) + 1;
            }
        });

        const books = Object.keys(bookCounts).map(name => ({
            name: name,
            slug: name.toLowerCase().replace(/ /g, '-'),
            count: bookCounts[name]
        })).sort((a, b) => b.count - a.count).slice(0, 6);

        let html = '<div class="search-suggestions"><div class="suggestions-label">Sách phổ biến</div><div class="tag-suggestions">';
        books.forEach(b => {
            html += `<a href="/book/${b.slug}" class="tag-suggestion" onclick="closeSearch()">${escapeHtml(b.name)}</a>`;
        });
        html += '</div></div>';
        return html;
    } catch (e) { return ''; }
};

function getRelevanceScore(item, term) {
    let score = 0;
    if (item.title.toLowerCase().indexOf(term) !== -1) score += 10;
    if (item.title.toLowerCase() === term) score += 20;
    if (item.tags && item.tags.some(t => t.toLowerCase() === term)) score += 15;
    return score;
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

window.handleSearchInput = function (term) {
    if (window.searchDebounce) clearTimeout(window.searchDebounce);
    window.searchDebounce = setTimeout(() => {
        window.performSearch(term);
    }, 150);
};

// =============================================
// Browser Compatibility
// =============================================
function isOldSafari() {
    try {
        var ua = navigator.userAgent || '';
        var iosMatch = ua.match(/OS (\d+)_/i);
        if (iosMatch && iosMatch[1]) {
            return parseInt(iosMatch[1], 10) <= 15;
        }
        if (/Safari/.test(ua) && !/Chrome|Chromium|CrMo|CriOS|Edg|OPR|Android/.test(ua)) {
            var verMatch = ua.match(/Version\/(\d+)\./i);
            if (verMatch && verMatch[1]) {
                return parseInt(verMatch[1], 10) <= 15;
            }
        }
    } catch (e) { }
    return false;
}

// =============================================
// Print Book Functions
// =============================================
window.loadChapterContent = function (url) {
    return new Promise((resolve, reject) => {
        const iframe = document.getElementById('content-loader');
        if (!iframe) {
            const newIframe = document.createElement('iframe');
            newIframe.id = 'content-loader';
            newIframe.style.cssText = 'display:none; position:absolute; left:-9999px; width:1024px; height:768px;';
            document.body.appendChild(newIframe);
        }

        const loader = document.getElementById('content-loader');
        let timeoutId = null;
        let checkInterval = null;

        const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (checkInterval) clearInterval(checkInterval);
            loader.onload = null;
            loader.onerror = null;
        };

        loader.onload = () => {
            let attempts = 0;
            const maxAttempts = 50;

            checkInterval = setInterval(() => {
                attempts++;
                try {
                    const iframeDoc = loader.contentDocument || loader.contentWindow.document;
                    const content = iframeDoc.querySelector('.content') || iframeDoc.querySelector('article');

                    if (content && content.innerHTML.trim().length > 10) {
                        cleanup();
                        let html = content.innerHTML;
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = html;

                        // Clean up navigation and scripts
                        tempDiv.querySelectorAll('script').forEach(s => s.remove());
                        tempDiv.querySelectorAll('.chapter-navigation, .ChapterNavigation, .prev-next-nav').forEach(n => n.remove());

                        // Fix relative links in the extracted content
                        tempDiv.querySelectorAll('a[href]').forEach(a => {
                            const href = a.getAttribute('href');
                            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                                // Keep them relative to base but avoid broken links in print
                            }
                        });

                        resolve(tempDiv.innerHTML);
                    } else if (attempts >= maxAttempts) {
                        console.warn('Print loader: Timeout or no content found for', url);
                        cleanup();
                        resolve('<p class="content-error">Timeout loading content for: ' + url + '</p>');
                    }
                } catch (e) {
                    if (attempts >= maxAttempts) {
                        cleanup();
                        reject(e);
                    }
                }
            }, 100);
        };

        loader.onerror = (e) => {
            cleanup();
            reject(new Error('Failed to load iframe'));
        };

        timeoutId = setTimeout(() => {
            cleanup();
            resolve('<p>Timeout loading content.</p>');
        }, 10000);

        loader.src = url;
    });
};

window.printbookTypeset = function () {
    try {
        if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
            return MathJax.typesetPromise();
        }
    } catch (e) {
        console.warn('printbookTypeset failed', e);
    }
    return Promise.resolve();
};

// =============================================
// HTMX Event Handlers
// =============================================
document.body.addEventListener('htmx:afterSwap', function (evt) {
    // Re-initialize all components after htmx content swap
    initCodeBlocks();
    initToc();
    BookmarkManager.render();

    // Re-typeset MathJax
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise().catch(function (err) {
            console.warn('MathJax typeset failed:', err);
        });
    }

    // Re-highlight with Prism
    if (window.Prism) {
        Prism.highlightAll();
    }

    // Re-render any mermaid diagrams
    // Re-render any mermaid diagrams
    document.querySelectorAll('.mermaid-container:not(.rendered)').forEach(container => {
        const srcId = container.dataset.mermaidSrc;
        if (srcId && window.renderMermaid) {
            renderMermaid(srcId, container.id);
            container.classList.add('rendered');
        }
    });

    // Track reading progress on HTMX swap
    if (window.ReadingProgressManager) {
        window.ReadingProgressManager.trackView(window.location.pathname);
    }
});

document.body.addEventListener('htmx:beforeSwap', function (evt) {
    // Close any open modals before swap
    closeSearch();
    closeToc();
    MobileMenuManager.close();
});

// =============================================
// Keyboard Shortcuts
// =============================================
document.addEventListener('keydown', function (e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        closeSearch();
        closeToc();
        MobileMenuManager.close();
    }

    // Ctrl/Cmd + K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
    }
});

// =============================================
// Initialize on Page Load
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    ThemeManager.init();
    BookmarkManager.init();
    BookmarkManager.restoreScrollPosition();
    initToc();
    initCodeBlocks();
    ReadingProgressManager.trackView(window.location.pathname);

    // Show browser compatibility warning if needed
    if (isOldSafari()) {
        const warning = document.getElementById('browser-compat-warning');
        if (warning) {
            warning.style.display = 'block';
        }
    }
});

// Also handle page show event (for back/forward navigation)
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        // Page was restored from cache
        ThemeManager.init();
        BookmarkManager.init();
        initToc();
    }
});

// Save bookmark scroll position periodically
let scrollSaveTimeout;
window.addEventListener('scroll', function () {
    clearTimeout(scrollSaveTimeout);
    scrollSaveTimeout = setTimeout(function () {
        const currentPath = window.location.pathname;
        if (BookmarkManager.isBookmarked(currentPath)) {
            BookmarkManager.updateScrollPosition(currentPath);
        }
    }, 1000);
}, { passive: true });

// Expose functions globally
window.ThemeManager = ThemeManager;
window.BookmarkManager = BookmarkManager;
window.MobileMenuManager = MobileMenuManager;
window.ReadingProgressManager = ReadingProgressManager;
window.openSearch = openSearch;
window.closeSearch = closeSearch;
window.toggleToc = toggleToc;
window.closeToc = closeToc;
window.initToc = initToc;
window.scrollToHeading = scrollToHeading;
window.initCodeBlocks = initCodeBlocks;
window.copyCode = copyCode;
window.isOldSafari = isOldSafari;
