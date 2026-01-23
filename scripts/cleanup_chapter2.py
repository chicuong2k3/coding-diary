#!/usr/bin/env python3
import shutil
from pathlib import Path
import time

ROOT = Path("Pages/Blog/Mathematics-for-Machine-Learning")
FNAME = ROOT / "Chapter-2.md"

def backup(p: Path):
    ts = time.strftime('%Y%m%d_%H%M%S')
    dest = p.with_suffix(p.suffix + f'.cleanup.{ts}.bak')
    shutil.copy2(p, dest)
    return dest

def is_start_block(line):
    s = line.strip()
    return s.startswith('::: latex') or s.startswith('::: info')

def run():
    if not FNAME.exists():
        print('File not found:', FNAME)
        return 1
    bak = backup(FNAME)
    print('Backup created:', bak)

    text = FNAME.read_text(encoding='utf-8')
    lines = text.splitlines()
    out = []
    i = 0
    removed_blocks = 0
    cleaned_tokens = 0

    while i < len(lines):
        line = lines[i]
        if is_start_block(line):
            # find end ':::'
            j = i + 1
            content = []
            while j < len(lines) and lines[j].strip() != ':::':
                content.append(lines[j])
                j += 1
            if j >= len(lines):
                # no closing ':::' found — keep the start line and advance
                out.append(line)
                i += 1
                continue
            # j is index of closing ':::'
            # check if content is empty or only whitespace or contains only stray tokens like 'latex'
            nonempty = [ln for ln in content if ln.strip() and ln.strip() not in ('latex', 'tag', '$$')]
            if not nonempty:
                # remove entire empty/malformed block
                removed_blocks += 1
                i = j + 1
                continue
            else:
                # clean ' latex' artifacts inside content lines
                new_content = []
                for ln in content:
                    new_ln = ln.replace(' latex', '')
                    if new_ln != ln:
                        cleaned_tokens += 1
                    new_content.append(new_ln)
                out.append(line)
                out.extend(new_content)
                out.append(lines[j])
                i = j + 1
                continue
        else:
            # clean stray ' latex' tokens in normal lines
            if ' latex' in line:
                line = line.replace(' latex', '')
                cleaned_tokens += 1
            out.append(line)
            i += 1

    # collapse runs of >2 blank lines to 2
    final = []
    blank_run = 0
    for ln in out:
        if not ln.strip():
            blank_run += 1
            if blank_run <= 2:
                final.append(ln)
        else:
            blank_run = 0
            final.append(ln)

    FNAME.write_text('\n'.join(final) + '\n', encoding='utf-8')
    print(f'Wrote cleaned file: {FNAME}')
    print(f'removed empty/malformed blocks: {removed_blocks}')
    print(f'cleaned stray tokens occurrences: {cleaned_tokens}')
    # check balanced $$ occurrences
    content = FNAME.read_text(encoding='utf-8')
    dcount = content.count('$$')
    if dcount % 2 != 0:
        print('Warning: odd number of $$ occurrences:', dcount)
    else:
        print('$$ occurrences balanced:', dcount)
    return 0

if __name__ == '__main__':
    raise SystemExit(run())
