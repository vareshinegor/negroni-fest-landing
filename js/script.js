document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ---------- Age gate ----------
(() => {
  const gate = document.getElementById('agegate');
  if (!gate) return;
  const STORAGE_KEY = 'negroniAgeConfirmed';

  if (localStorage.getItem(STORAGE_KEY) === '1') {
    gate.classList.add('is-hidden');
  } else {
    document.body.style.overflow = 'hidden';
  }

  document.getElementById('agegate-yes').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, '1');
    gate.classList.add('is-hidden');
    document.body.style.overflow = '';
  });

  document.getElementById('agegate-no').addEventListener('click', () => {
    window.location.href = 'https://www.google.com';
  });
})();

// ---------- Embassies auto-rotation ----------
(() => {
  const content = document.getElementById('embassies-content');
  const list = document.getElementById('embassies-list');
  const photo = document.getElementById('embassies-photo');
  if (!content || !list || !photo) return;

  const row1 = content.querySelector('.embassies__row1');
  const items = [row1, ...list.querySelectorAll('li')];
  let index = 0;

  function show(i) {
    index = i;
    items.forEach((li, idx) => li.classList.toggle('is-active', idx === i));
    const item = items[i];
    photo.style.opacity = '0';
    window.setTimeout(() => {
      photo.src = item.dataset.photo;
      photo.style.objectPosition = item.dataset.pos || 'center';
      photo.style.opacity = '1';
    }, 250);
  }

  let timer = window.setInterval(() => { show((index + 1) % items.length); }, 2500);

  items.forEach((li, idx) => {
    li.addEventListener('mouseenter', () => {
      window.clearInterval(timer);
      show(idx);
    });
  });
  content.addEventListener('mouseleave', () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => { show((index + 1) % items.length); }, 2500);
  });
})();

// ---------- Ambassadors carousel ----------
(() => {
  const track = document.querySelector('.ambassadors__track');
  if (!track) return;

  const ambassadors = [
    {
      first: 'Алексей', last: 'Лапин',
      img: 'assets/amb3-alexey.png', sparkle: false,
      bio: ['Управляющий бара «Жуклевичъ»', 'Соучредитель бара «Аперитиво»'],
    },
    {
      first: 'Давид', last: 'Стеньшин',
      img: 'assets/amb3-david.png', sparkle: true, wide: true,
      bio: ['Автор книги «Архитектура коктейля»', 'Шеф бармен WRF', 'Совладелец школы Solution'],
    },
    {
      first: 'Даниил', last: 'Панов',
      img: 'assets/amb3-daniil.png', sparkle: true,
      bio: ['Амбассадор красного итальянского биттера', 'Амбассадор Негрони Фест', 'Основатель проекта ВСБ'],
    },
    {
      first: 'Павел', last: 'Неудахин',
      img: 'assets/amb3-pavel.png', sparkle: false,
      bio: ['Управляющий бара Френдс'],
    },
    {
      first: 'Никита', last: 'Сиденко',
      img: 'assets/amb3-nikita.png', sparkle: false,
      bio: ['Бренд шеф-бармен London Restaurant Group'],
    },
    {
      first: 'Айрат', last: 'Калимуллин',
      img: 'assets/amb3-airat.png', sparkle: false,
      bio: ['Шеф-бармен Relab Family'],
    },
    {
      first: 'Артем', last: 'Гриненко',
      img: 'assets/amb3-artem.png', sparkle: false,
      bio: ['Бармен бара «Детектив, где вы?»'],
    },
  ];

  const left = document.getElementById('amb-left');
  const center = document.getElementById('amb-center');
  const right = document.getElementById('amb-right');
  const n = ambassadors.length;
  let featured = 1;

  function fillCard(el, data) {
    const sparkleImg = data.sparkle ? '<img class="amb-card__sparkle" src="assets/sparkle-white.svg" alt="">' : '';
    const bioLines = data.bio.map((line) => `<div class="amb-card__bioline"><span>-</span><p>${line}</p></div>`).join('');
    const photoClass = data.wide ? 'amb-card__photo amb-card__photo--wide' : 'amb-card__photo';
    el.innerHTML = `
      <div class="amb-card__name">${sparkleImg}<span class="amb-card__namelines"><span>${data.first}</span><span>${data.last}</span></span></div>
      <div class="${photoClass}">
        <img src="${data.img}" alt="${data.first} ${data.last}">
        <div class="amb-card__fade"></div>
        <div class="amb-card__bio">${bioLines}</div>
      </div>
    `;
  }

  track.style.willChange = 'transform';

  function render(dir) {
    const prev = ambassadors[(featured - 1 + n) % n];
    const next = ambassadors[(featured + 1) % n];

    fillCard(left, prev);
    fillCard(center, ambassadors[featured]);
    fillCard(right, next);

    if (!dir) return;

    const shift = dir === 'next' ? 130 : -130;
    const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
    track.style.transition = 'none';
    track.style.transform = `translateX(${shift}px)`;
    // eslint-disable-next-line no-unused-expressions
    track.offsetHeight;
    track.style.transition = `transform .38s ${ease}`;
    track.style.transform = 'translateX(0)';
  }

  document.getElementById('amb-next').addEventListener('click', () => {
    featured = (featured + 1) % ambassadors.length;
    render('next');
  });
  document.getElementById('amb-prev').addEventListener('click', () => {
    featured = (featured - 1 + ambassadors.length) % ambassadors.length;
    render('prev');
  });

  let touchStartX = null;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 30) return;
    if (dx < 0) {
      featured = (featured + 1) % ambassadors.length;
      render('next');
    } else {
      featured = (featured - 1 + ambassadors.length) % ambassadors.length;
      render('prev');
    }
  }, { passive: true });

  render();
})();
