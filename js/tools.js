document.addEventListener('DOMContentLoaded', () => {

  // ── Command Palette ──────────────────────────────────────────────
  const tools = [
    { name: 'Word Counter',              url: 'tools/word-counter.html',       category: 'Analysis' },
    { name: 'Character Counter',         url: 'tools/character-counter.html',  category: 'Analysis' },
    { name: 'Sentence Counter',          url: 'tools/sentence-counter.html',   category: 'Analysis' },
    { name: 'Paragraph Counter',         url: 'tools/paragraph-counter.html',  category: 'Analysis' },
    { name: 'Reading Time',              url: 'tools/reading-time.html',       category: 'Analysis' },
    { name: 'Keyword Density',           url: 'tools/keyword-density.html',    category: 'Analysis' },
    { name: 'Most Used Words',           url: 'tools/most-used-words.html',    category: 'Analysis' },
    { name: 'Add Line Breaks',           url: 'tools/add-line-breaks.html',    category: 'Convert'  },
    { name: 'Uppercase',                 url: 'tools/uppercase.html',          category: 'Convert'  },
    { name: 'Lowercase',                 url: 'tools/lowercase.html',          category: 'Convert'  },
    { name: 'Title Case',                url: 'tools/title-case.html',         category: 'Convert'  },
    { name: 'Reverse Text',              url: 'tools/reverse-text.html',       category: 'Convert'  },
    { name: 'Remove Extra Spaces',       url: 'tools/remove-spaces.html',      category: 'Convert'  },
    { name: 'Remove Line Breaks',        url: 'tools/remove-line-breaks.html', category: 'Convert'  },
    { name: 'Capitalize Text',           url: 'tools/capitalize-text.html',    category: 'Convert'  },
    { name: 'Slug Generator',            url: 'tools/slug-generator.html',     category: 'Convert'  },
    { name: 'Random Word Generator',     url: 'tools/random-word.html',        category: 'Write'    },
    { name: 'Lorem Ipsum Generator',     url: 'tools/lorem-ipsum.html',        category: 'Write'    },
    { name: 'Text Repeater',             url: 'tools/text-repeater.html',      category: 'Write'    },
    { name: 'Typing Speed Checker',      url: 'tools/typing-speed.html',       category: 'Write'    },
    { name: 'Rhyming Words Finder',      url: 'tools/rhyming-words.html',      category: 'Write'    },
    { name: 'Password Generator',        url: 'tools/password-generator.html', category: 'Write'    },
    { name: 'Twitter Counter',           url: 'tools/twitter-counter.html',    category: 'Social'   },
    { name: 'Instagram Caption Counter', url: 'tools/instagram-counter.html',  category: 'Social'   },
    { name: 'TikTok Bio Counter',        url: 'tools/tiktok-counter.html',     category: 'Social'   },
    { name: 'Bio Generator',             url: 'tools/bio-generator.html',      category: 'Social'   },
  ];

  const categoryColors = {
    Analysis: { bg: '#EEF2FF', color: '#4F46E5' },
    Convert:  { bg: '#ECFDF5', color: '#059669' },
    Write:    { bg: '#FFF7ED', color: '#EA580C' },
    Social:   { bg: '#FDF4FF', color: '#9333EA' },
  };

  const overlay   = document.getElementById('cmdOverlay');
  const input     = document.getElementById('cmdInput');
  const results   = document.getElementById('cmdResults');
  let selectedIdx = -1;

  function resolveUrl(url) {
    return window.location.pathname.includes('/tools/') ? '../' + url : url;
  }

  function openCmd() {
    if (!overlay) return;
    overlay.classList.add('active');
    input.value = '';
    selectedIdx = -1;
    renderResults('');
    setTimeout(() => input.focus(), 50);
  }

  function closeCmd() {
    overlay?.classList.remove('active');
  }

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    const filtered = q ? tools.filter(t => t.name.toLowerCase().includes(q)) : tools;

    if (!filtered.length) {
      results.innerHTML = '<div style="padding:24px;text-align:center;color:#9CA3AF;font-size:14px;">No tools found</div>';
      return;
    }

    // Group by category when no query
    if (!q) {
      const groups = {};
      filtered.forEach(t => {
        if (!groups[t.category]) groups[t.category] = [];
        groups[t.category].push(t);
      });

      let html = '';
      let globalIdx = 0;
      Object.entries(groups).forEach(([cat, items]) => {
        html += `<div class="cmd-group-label">${cat}</div>`;
        items.forEach(t => {
          const c = categoryColors[cat];
          html += `
            <a href="${resolveUrl(t.url)}" class="cmd-item${globalIdx === 0 ? ' selected' : ''}" data-idx="${globalIdx}">
              <span class="cmd-item-dot" style="background:${c.color}"></span>
              <span class="cmd-item-name">${t.name}</span>
              <span class="cmd-item-tag" style="background:${c.bg};color:${c.color}">${cat}</span>
            </a>`;
          globalIdx++;
        });
      });
      results.innerHTML = html;
      selectedIdx = 0;
    } else {
      results.innerHTML = filtered.map((t, i) => {
        const c = categoryColors[t.category];
        return `
          <a href="${resolveUrl(t.url)}" class="cmd-item${i === 0 ? ' selected' : ''}" data-idx="${i}">
            <span class="cmd-item-dot" style="background:${c.color}"></span>
            <span class="cmd-item-name">${highlight(t.name, q)}</span>
            <span class="cmd-item-tag" style="background:${c.bg};color:${c.color}">${t.category}</span>
          </a>`;
      }).join('');
      selectedIdx = 0;
    }
  }

  function highlight(text, query) {
    const idx = text.toLowerCase().indexOf(query);
    if (idx === -1) return text;
    return text.slice(0, idx) +
      `<mark style="background:#EEF2FF;color:#4F46E5;border-radius:3px;padding:0 2px">${text.slice(idx, idx + query.length)}</mark>` +
      text.slice(idx + query.length);
  }

  function moveSelection(dir) {
    const items = results.querySelectorAll('.cmd-item');
    if (!items.length) return;
    items[selectedIdx]?.classList.remove('selected');
    selectedIdx = (selectedIdx + dir + items.length) % items.length;
    items[selectedIdx]?.classList.add('selected');
    items[selectedIdx]?.scrollIntoView({ block: 'nearest' });
  }

  function confirmSelection() {
    const sel = results.querySelector('.cmd-item.selected');
    if (sel) { window.location.href = sel.href; closeCmd(); }
  }

  window.openCmd = openCmd;

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      overlay?.classList.contains('active') ? closeCmd() : openCmd();
    }
    if (!overlay?.classList.contains('active')) return;
    if (e.key === 'Escape')    { e.preventDefault(); closeCmd(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSelection(1); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); moveSelection(-1); }
    if (e.key === 'Enter')     { e.preventDefault(); confirmSelection(); }
  });

  input?.addEventListener('input',   e => { selectedIdx = -1; renderResults(e.target.value); });
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeCmd(); });

  // ── Counter animation ────────────────────────────────────────────
  const counters = document.querySelectorAll('.count-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounter(entry.target); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));

  function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    if (!target) { counter.textContent = '0'; return; }
    const steps = 60, duration = 1800;
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    let step = 0;
    const timer = setInterval(() => {
      step++;
      counter.textContent = Math.round(target * easeOut(step / steps));
      if (step >= steps) { counter.textContent = target; clearInterval(timer); }
    }, duration / steps);
  }

  // ── Card scroll animation ────────────────────────────────────────
  const cards = document.querySelectorAll('.tool-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(c => cardObserver.observe(c));

  // ── Nav dropdown ─────────────────────────────────────────────────
  const dropdownLi   = document.querySelector('.nav-dropdown');
  const dropdownMenu = document.querySelector('.nav-dropdown-menu');
  let hideTimer;
  if (dropdownLi && dropdownMenu) {
    const show = () => { clearTimeout(hideTimer); dropdownMenu.style.display = 'block'; };
    const hide = () => { hideTimer = setTimeout(() => { dropdownMenu.style.display = 'none'; }, 400); };
    dropdownLi.addEventListener('mouseenter', show);
    dropdownLi.addEventListener('mouseleave', hide);
    dropdownMenu.addEventListener('mouseenter', show);
    dropdownMenu.addEventListener('mouseleave', hide);
  }

});