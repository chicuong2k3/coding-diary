#!/usr/bin/env python3
import shutil
from pathlib import Path
import re
import time

ROOT = Path("Pages/Blog/Mathematics-for-Machine-Learning")
FNAME = ROOT / "Chapter-2.md"

MAP = {
    'đại số tuyến tính': 'Linear algebra',
    'vectơ': 'vector',
    'vecto': 'vector',
    'ma trận': 'matrix',
    'không gian vectơ': 'vector space',
    'hệ phương trình tuyến tính': 'system of linear equations',
    'tích vô hướng': 'scalar multiplication',
    'tính đóng': 'closure',
    'định thức': 'determinant',
    'ma trận đơn vị': 'identity matrix',
    'nghịch đảo': 'inverse',
    'chuyển vị': 'transpose',
    'hạng': 'rank',
    'cơ sở': 'basis',
    'trực giao': 'orthogonal',
    'đối xứng': 'symmetric matrix',
    'nghiệm': 'solution',
    'vô số nghiệm': 'infinitely many solutions',
    'vô nghiệm': 'no solution',
}


def backup(p: Path):
    ts = time.strftime('%Y%m%d_%H%M%S')
    dest = p.with_suffix(p.suffix + f'.gloss.{ts}.bak')
    shutil.copy2(p, dest)
    return dest


def should_skip_line(line, in_block, in_dollar):
    if in_block:
        return True
    if in_dollar:
        return True
    return False


def run():
    if not FNAME.exists():
        print('File not found:', FNAME)
        return 1
    bak = backup(FNAME)
    print('Backup created:', bak)

    text = FNAME.read_text(encoding='utf-8')
    lines = text.splitlines()

    in_block = False
    in_dollar = False
    replaced_counts = {k: 0 for k in MAP}

    out_lines = []

    # prepare regex patterns with word boundaries (Unicode-aware)
    patterns = [(re.compile(r'(?<!\*)\b' + re.escape(k) + r'\b', flags=re.IGNORECASE), k, v) for k, v in MAP.items()]

    for ln in lines:
        stripped = ln.strip()
        # detect ::: block start/end
        if stripped.startswith(':::'):
            # toggle block on start, off on closing ':::' alone
            if not in_block and (stripped.startswith('::: latex') or stripped.startswith('::: info')):
                in_block = True
                out_lines.append(ln)
                continue
            if in_block and stripped == ':::':
                in_block = False
                out_lines.append(ln)
                continue
            # other ::: lines just copy
            out_lines.append(ln)
            continue

        # handle $$ inline math toggling
        # count number of $$ occurrences in the line (may be even)
        dollar_count = ln.count('$$')
        if dollar_count > 0:
            # if odd toggles may flip state
            if dollar_count % 2 == 1:
                in_dollar = not in_dollar

        if should_skip_line(ln, in_block, in_dollar):
            out_lines.append(ln)
            continue

        new_ln = ln
        for pat, orig, eng in patterns:
            # skip if already bolded
            if f'**{orig}**' in new_ln:
                continue
            # perform replacement
            def repl(m):
                replaced_counts[orig] += 1
                return f'**{m.group(0)}** ({eng})'

            new_ln, n = pat.subn(repl, new_ln)

        out_lines.append(new_ln)

    FNAME.write_text('\n'.join(out_lines) + '\n', encoding='utf-8')
    print('Wrote file with glosses:', FNAME)
    total = sum(replaced_counts.values())
    print('Total replacements:', total)
    for k, v in replaced_counts.items():
        if v:
            print(f"{k}: {v}")
    # list keys not found
    not_found = [k for k, v in replaced_counts.items() if v == 0]
    if not_found:
        print('\nTerms not found (consider checking variants):')
        for k in not_found:
            print('-', k)

    return 0


if __name__ == '__main__':
    raise SystemExit(run())
