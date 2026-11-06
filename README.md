# Strona osobista: Adam Kaczoch

Strona w ramach personal brandingu: analityk danych w drodze do data engineeringu, w świecie AI.
Styl jak tutoriale w notatniku z kursu. Czysty HTML i CSS, bez frameworka i bez zależności.
Adres: https://adamkaczoch.github.io. Tutorial krok po kroku jest w repo notatnika (`public/tutorial-strona.html`).

```
index.html                    cała treść strony (jedna strona z sekcjami)
style.css                     wygląd; kolory tylko jako tokeny w :root (tryb ciemny i jasny)
app.js                        przełącznik motywu + jednorazowe „wpisywanie” w terminalu; strona działa też bez JS
favicon.svg                   znak AK
scripts/check_site.py         test: tytuł, opis, alt obrazków, linki wewnętrzne (kod wyjścia 1 = błąd)
.github/workflows/check.yml   uruchamia test przy każdym pushu i pull requeście
.nojekyll                     GitHub Pages wysyła pliki tak, jak są, bez przetwarzania przez Jekyll
```

## Podgląd na Macu

```bash
python3 -m http.server 8000      # otwórz http://localhost:8000, Ctrl+C kończy
python3 scripts/check_site.py    # test przed publikacją
```

## Do uzupełnienia przed publikacją (TODO)

- [ ] `index.html`, sekcja Kontakt: prawdziwy adres e-mail i link do profilu LinkedIn.
- [ ] Po zakupie domeny: obrazek `og.png` (1200×630) i odkomentowana linia `og:image` w `<head>`.
- [ ] Projekt „Kursy walut NBP w BigQuery”: gdy powstanie repo, zmień status na „działa” i dodaj link do kodu.
- [ ] Fonty ładują się z Google Fonts. Przeglądarka odwiedzającego łączy się wtedy z serwerami Google, a stopka mówi „bez śledzenia”. Docelowo pobierz pliki fontów do `fonts/` i podłącz je przez `@font-face`, bez zewnętrznych serwerów.

## Publikacja

Każdy push na `main` publikuje stronę (Settings → Pages → Deploy from a branch → `main` / root).
Domena i HTTPS: rozdziały 09–10 tutorialu.
