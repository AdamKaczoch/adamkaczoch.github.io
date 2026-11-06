// Strona działa w całości bez JavaScriptu. Skrypt dodaje dwie rzeczy:
// przełącznik motywu i jednorazowe „wpisywanie” poleceń w terminalu na starcie.
(() => {
  /* ---------- motyw: systemowy → ciemny → jasny ---------- */
  const themes = ['system', 'dark', 'light'];
  const icons = { system: '◐', dark: '●', light: '○' };
  const btn = document.getElementById('theme');
  const load = () => { try { return localStorage.getItem('ak-theme') || 'system'; } catch { return 'system'; } };
  const save = (t) => { try { localStorage.setItem('ak-theme', t); } catch { /* prywatne okno: bez zapamiętywania */ } };
  function apply(t) {
    if (t === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
    btn.textContent = icons[t];
    btn.setAttribute('aria-label', `Motyw: ${t === 'system' ? 'systemowy' : t === 'dark' ? 'ciemny' : 'jasny'}. Kliknij, żeby zmienić.`);
  }
  let theme = load();
  apply(theme);
  btn.addEventListener('click', () => { theme = themes[(themes.indexOf(theme) + 1) % 3]; apply(theme); save(theme); });

  /* ---------- terminal: wpisywanie poleceń, tylko gdy ktoś nie wyłączył animacji ---------- */
  const term = document.getElementById('term');
  if (!term || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Treść jest już w HTML (dla czytników ekranu i bez JS). Tu tylko odtwarzamy ją krok po kroku.
  const lines = [
    { cmd: 'whoami', out: 'adam kaczoch' },
    { cmd: 'cat rola.txt', out: 'analityk danych → data engineer' },
    { cmd: 'echo $STACK', out: 'python · sql · airflow · gcp · llm' },
  ];
  const full = term.innerHTML;
  term.setAttribute('aria-hidden', 'true');           // czytnik ekranu dostaje pełny tekst z aria-label panelu
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const prompt = '<span class="p">$</span> ';
  const cursor = '<span class="cursor"></span>';
  let html = '';
  term.innerHTML = prompt + cursor;

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  (async () => {
    await wait(450);
    for (const { cmd, out } of lines) {
      for (let i = 1; i <= cmd.length; i++) {
        term.innerHTML = html + prompt + esc(cmd.slice(0, i)) + cursor;
        await wait(55 + Math.random() * 45);
      }
      await wait(220);
      html += prompt + esc(cmd) + '\n' + esc(out) + '\n';
      term.innerHTML = html + prompt + cursor;
      await wait(380);
    }
    term.innerHTML = full;                             // stan końcowy = dokładnie to, co w HTML
    term.removeAttribute('aria-hidden');
  })();
})();
