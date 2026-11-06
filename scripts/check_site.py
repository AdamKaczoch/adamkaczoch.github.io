#!/usr/bin/env python3
"""Test jakości strony przed publikacją (jak test danych przed załadowaniem do tabeli).

Sprawdza każdy plik .html w folderze strony:
- czy jest <title> i <meta name="description"> (to widzi Google i LinkedIn),
- czy każdy obrazek ma opis alt (dostępność),
- czy każdy link wewnętrzny prowadzi do istniejącego pliku albo kotwicy #id.

Uruchom:  python3 scripts/check_site.py        (kod wyjścia 1 = są błędy)
Tylko biblioteka standardowa, więc działa lokalnie i w GitHub Actions bez instalacji.
"""
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.links, self.imgs_no_alt = set(), [], 0
        self.has_title = self.has_desc = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.add(a['id'])
        if tag == 'title':
            self.has_title = True
        if tag == 'meta' and a.get('name') == 'description' and a.get('content'):
            self.has_desc = True
        if tag == 'img' and not a.get('alt'):
            self.imgs_no_alt += 1
        for attr in ('href', 'src'):
            if a.get(attr):
                self.links.append(a[attr])


def main():
    pages = {}
    for f in sorted(ROOT.rglob('*.html')):
        p = Page()
        p.feed(f.read_text(encoding='utf-8'))
        pages[f] = p

    errors = []
    for f, p in pages.items():
        name = f.relative_to(ROOT)
        if not p.has_title:
            errors.append(f'{name}: brak <title>')
        if not p.has_desc:
            errors.append(f'{name}: brak <meta name="description">')
        if p.imgs_no_alt:
            errors.append(f'{name}: {p.imgs_no_alt} obrazków bez alt')
        for link in p.links:
            u = urlparse(link)
            if u.scheme or link.startswith('//'):      # http(s), mailto: — zewnętrzne, pomijamy
                continue
            target = f if not u.path else (ROOT / u.path.lstrip('/') if u.path.startswith('/') else f.parent / u.path)
            if target.is_dir():
                target = target / 'index.html'
            if not target.exists():
                errors.append(f'{name}: link do nieistniejącego pliku {link}')
            elif u.fragment and target in pages and u.fragment not in pages[target].ids:
                errors.append(f'{name}: brak kotwicy #{u.fragment} ({link})')

    for e in errors:
        print('BŁĄD', e)
    print(f'Sprawdzono {len(pages)} stron, błędów: {len(errors)}')
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
