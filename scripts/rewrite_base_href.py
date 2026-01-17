#!/usr/bin/env python3
"""
Rewrite root-relative links in publish/wwwroot to include BASE_HREF from environment.
This is extracted from the GitHub Actions workflow to avoid large YAML heredocs.
"""
import os
import re
import sys

base = os.environ.get('BASE_HREF', '/')
root = os.path.join(os.getcwd(), 'publish', 'wwwroot')
if not os.path.isdir(root):
    print('publish/wwwroot not found; nothing to rewrite')
    sys.exit(0)

# patterns
pat_attr = re.compile(r'(?P<prefix>\b(?:href|src|action)\s*=\s*)(?P<q>["\'])/(?P<path>[^"\'>\s]+)(?P=q)', flags=re.IGNORECASE)
pat_url = re.compile(r'(url\(\s*)(?P<q>["\']?)/(?P<path>[^)"\']+)(?P<q2>["\']?\s*\))', flags=re.IGNORECASE)

for dirpath, dirs, files in os.walk(root):
    for fn in files:
        if not (fn.endswith('.html') or fn.endswith('.css') or fn.endswith('.js')):
            continue
        path = os.path.join(dirpath, fn)
        try:
            text = open(path, 'rb').read().decode('utf-8')
        except Exception:
            # skip non-text files
            continue
        # protect first <base ...> tag (if any)
        m = re.search(r'<base\b[^>]*>', text, flags=re.IGNORECASE)
        base_tag = None
        placeholder = '__BASE_TAG_PLACEHOLDER__'
        if m:
            base_tag = m.group(0)
            text = text.replace(base_tag, placeholder, 1)

        def repl_attr(m):
            pfx = m.group('prefix')
            q = m.group('q')
            path_tail = m.group('path')
            # if already starts with base (strip leading / from base)
            base_no_lead = base.lstrip('/')
            if path_tail.startswith(base_no_lead):
                return m.group(0)  # leave unchanged
            return f"{pfx}{q}{base}{path_tail}{q}"

        def repl_url(m):
            p1 = m.group(1)
            q = m.group('q')
            path_tail = m.group('path')
            base_no_lead = base.lstrip('/')
            if path_tail.startswith(base_no_lead):
                return m.group(0)
            return f"{p1}{q}{base}{path_tail}{m.group('q2')}"

        new = pat_attr.sub(repl_attr, text)
        new = pat_url.sub(repl_url, new)

        # restore base tag if it was protected
        if base_tag:
            new = new.replace(placeholder, base_tag, 1)

        if new != text:
            open(path, 'w', encoding='utf-8').write(new)
print('Python rewrite completed')

