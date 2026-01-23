import re
from pathlib import Path
p=Path('Pages/Blog/Mathematics-for-Machine-Learning/Chapter-2.md')
s=p.read_text()
lines=s.splitlines()
out=[]
in_block=False
for line in lines:
    stripped=line.strip()
    if re.match(r'^:::\s*(latex|info)\s*$', stripped):
        in_block=True
        out.append(line)
        continue
    if stripped==':::':
        in_block=False
        out.append(line)
        continue
    if in_block or '$$' in line:
        out.append(line)
        continue
    # wrap backslash commands
    line = re.sub(r'(\\[A-Za-z]+(?:\{[^}]*\})*)', r'$$\\1$$', line)
    # wrap identifiers with subscripts like x_1 or a_{ij}
    line = re.sub(r'\b([A-Za-z]+)_(\{?[A-Za-z0-9]+\}?)', r'$$\\1_\\2$$', line)
    # wrap identifiers with superscripts like R^n
    line = re.sub(r'\b([A-Za-z]+)\^(\{?[A-Za-z0-9]+\}?)', r'$$\\1^\\2$$', line)
    out.append(line)
new='\n'.join(out)
# backup
p.rename(p.with_suffix('.md.bak2'))
p.write_text(new)
print('wrapped')
