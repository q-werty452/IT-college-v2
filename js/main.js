/* ================================================
   main.js — Скрипты главной страницы
   IT COLLEGE v2
   ================================================ */

// ── Прокрутка и UI ────────────────────────────────────────────────────────
var pb  = document.getElementById('progress-bar');
var btt = document.getElementById('btt');
var nb  = document.querySelector('.navbar');
window.addEventListener('scroll', function() {
  var s = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
  if (pb)  pb.style.width = (h ? s/h*100 : 0) + '%';
  if (btt) btt.classList.toggle('visible', s > 400);
  if (nb)  nb.classList.toggle('scrolled', s > 60);
}, {passive:true});
if (btt) btt.onclick = function() { window.scrollTo({top:0,behavior:'smooth'}); };

// ── Мобильная навигация ────────────────────────────────────────────────────
var toggle = document.getElementById('nav-toggle');
var mobile = document.getElementById('nav-mobile');
var mclose = document.getElementById('nav-mobile-close');
if (toggle) toggle.onclick = function() { mobile.classList.add('open'); };
if (mclose) mclose.onclick = function() { mobile.classList.remove('open'); };
if (mobile) mobile.addEventListener('click', function(e) {
  if (e.target === mobile) mobile.classList.remove('open');
});

// ── Фильтр программ обучения ───────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.programs-grid .program-card').forEach(function(card) {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── Анимация появления при прокрутке ───────────────────────────────────────
function animateCounter(el) {
  var target = parseInt(el.getAttribute('data-counter'), 10);
  var suffix = el.getAttribute('data-suffix') || '';
  var duration = 1200;
  var start = null;
  function step(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / duration, 1);
    var ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

var io = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      e.target.querySelectorAll('[data-counter]').forEach(animateCounter);
      io.unobserve(e.target);
    }
  });
}, {threshold: 0.12});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function(el) {
  io.observe(el);
});

// ── Паспорт колледжа: прокрутка и перетаскивание ───────────────────────────
(function() {
  var track = document.getElementById('certTrack');
  var prev  = document.getElementById('certPrev');
  var next  = document.getElementById('certNext');
  if (!track) return;

  var STEP = 308; // card width + gap

  if (prev) prev.onclick = function() { track.scrollBy({ left: -STEP, behavior: 'smooth' }); };
  if (next) next.onclick = function() { track.scrollBy({ left:  STEP, behavior: 'smooth' }); };

  // drag-to-scroll
  var isDragging = false, startX, scrollLeft;
  track.addEventListener('mousedown', function(e) {
    isDragging = true;
    track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  document.addEventListener('mouseup', function() {
    isDragging = false;
    track.classList.remove('dragging');
  });
  track.addEventListener('mouseleave', function() {
    isDragging = false;
    track.classList.remove('dragging');
  });
  track.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    e.preventDefault();
    var x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX);
  });
})();

// ── Вопросы и ответы (FAQ) ─────────────────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(function(q) {
  q.onclick = function() { q.closest('.faq-item').classList.toggle('open'); };
});

// ── Аккордеон НПА ──────────────────────────────────────────────────────────
document.querySelectorAll('.npa-header').forEach(function(h) {
  h.onclick = function() { h.closest('.npa-item').classList.toggle('open'); };
});

// ── Встроенный просмотрщик PDF (НПА) ───────────────────────────────────────
document.querySelectorAll('.npa-doc').forEach(function(doc) {
  doc.onclick = function() {
    var pdfSrc = doc.getAttribute('data-pdf');
    if (!pdfSrc) return;
    // Строим абсолютный URL чтобы iframe корректно показал PDF
    var base = window.location.href.replace(/\/[^/]*$/, '/');
    pdfSrc = base + pdfSrc;

    var viewer = doc.nextElementSibling;
    if (!viewer || !viewer.classList.contains('npa-pdf-viewer')) return;
    var isOpen = viewer.classList.contains('open');
    // close all viewers in this accordion item
    doc.closest('.npa-docs').querySelectorAll('.npa-pdf-viewer').forEach(function(v) {
      v.classList.remove('open');
      v.querySelector('iframe').src = '';
    });
    doc.closest('.npa-docs').querySelectorAll('.npa-doc').forEach(function(d) {
      d.classList.remove('active');
      d.querySelector('.npa-doc-open').textContent = 'Открыть';
    });
    if (!isOpen) {
      viewer.querySelector('iframe').src = pdfSrc;
      viewer.classList.add('open');
      doc.classList.add('active');
      doc.querySelector('.npa-doc-open').textContent = 'Закрыть';
    }
  };
});

// ── Клонирование строки быстрых ссылок (тикер) ─────────────────────────────
(function() {
  var track = document.getElementById('quick-track');
  if (!track) return;
  var inner = track.querySelector('.quick-inner');
  if (!inner) return;
  var clone = inner.cloneNode(true);
  track.appendChild(clone);
})();


// ── Частицы на фоне секции «Как поступить» ─────────────────────────────────
(function() {
  var canvas = document.getElementById('steps-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var section = canvas.closest('.steps-section');
  var mouse = { x: -9999, y: -9999 };
  var particles = [];
  var COUNT = 80;
  var animRunning = false;

  function resize() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 2 + 1,
        alpha: Math.random() * 0.45 + 0.15
      });
    }
  }

  window.addEventListener('resize', function() { resize(); initParticles(); });

  section.addEventListener('mousemove', function(e) {
    var r = section.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  section.addEventListener('mouseleave', function() {
    mouse.x = -9999; mouse.y = -9999;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var W = canvas.width, H = canvas.height;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var dx = p.x - mouse.x, dy = p.y - mouse.y;
      var dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 130 && dist > 0) {
        var force = (130 - dist) / 130;
        p.vx += (dx / dist) * force * 0.5;
        p.vy += (dy / dist) * force * 0.5;
      }
      p.vx *= 0.97; p.vy *= 0.97;
      p.x += p.vx;  p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + p.alpha + ')';
      ctx.fill();
    }

    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var a = particles[i], b = particles[j];
        var ddx = a.x - b.x, ddy = a.y - b.y;
        var d = Math.sqrt(ddx*ddx + ddy*ddy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(255,255,255,' + (0.15 * (1 - d/110)) + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  // init after page load so section has correct height
  window.addEventListener('load', function() {
    resize();
    initParticles();
    if (!animRunning) { animRunning = true; draw(); }
  });
})();

// ── Переводы (мультиязычность) ─────────────────────────────────────────────
var T = {
  ru: {
    nav_abit:       'Абитуриентам',
    nav_programs:   'Программы',
    nav_students:   'Студентам',
    nav_news:       'Новости',
    nav_contacts:   'Контакты',
    btn_apply:      'Поступить',
    btn_submit:     'Подать документы',
    btn_ebilim:     'E-bilim',
    btn_all_news:   'Все новости →',
    btn_all_grads:  'Все выпускники →',
    btn_all_faq:    'Все вопросы',
    btn_read_more:  'Читать далее →',
    btn_programs:   'Программы →',
    btn_contact:    'Связаться',
    hero_badge:     'Приём 2025/2026 открыт',
    hero_h1a:       'Начни карьеру',
    hero_h1b:       'в IT уже сегодня',
    hero_desc:      'IT COLLEGE — современное профессиональное образование в сфере информационных технологий. Диплом государственного образца. Бюджетные места. Трудоустройство.',
    stat_students:  'Студентов обучаются',
    stat_specs:     'Специальностей',
    stat_employ:    'Трудоустройство',
    stat_partners:  'Партнёров',
    tag_study:      'Обучение',
    tag_advantages: 'Преимущества',
    tag_media:      'Медиа',
    tag_success:    'Успех',
    tag_faq:        'FAQ',
    sec_programs:   'Программы обучения',
    sec_programs_s: '6 востребованных специальностей в сфере IT',
    sec_adv:        'IT COLLEGE — это',
    sec_adv_s:      'Почему тысячи студентов выбирают нас',
    sec_news:       'Новости',
    sec_grads:      'Наши выпускники',
    sec_grads_s:    'Они уже работают в крупнейших компаниях страны',
    sec_faq:        'Часто задаваемые вопросы',
    cta_title:      'Готов начать? Поступай сейчас!',
    cta_desc:       'Приём документов открыт. Бюджетные и платные места.',
    adv_diploma:    'Государственный диплом',
    adv_diploma_d:  'Диплом государственного образца, признанный во всех странах СНГ',
    adv_equip:      'Современное оборудование',
    adv_equip_d:    'Лаборатории оснащены последними моделями компьютеров и серверов',
    adv_intl:       'Международное партнёрство',
    adv_intl_d:     'Обмены с вузами Германии, России и Китая',
    adv_teach:      'Практикующие преподаватели',
    adv_teach_d:    'Более 70% педагогов — действующие специалисты IT-отрасли',
    adv_trophy:     'Победители олимпиад',
    adv_trophy_d:   'Многократные призёры республиканских и международных конкурсов',
    adv_employ:     'Трудоустройство',
    adv_employ_d:   'Центр карьеры помогает найти работу ещё во время учёбы',
    adv_budget:     'Бюджетные места',
    adv_budget_d:   'Государственное финансирование для лучших абитуриентов',
    adv_science:    'Научная деятельность',
    adv_science_d:  'Участие в исследованиях и стартап-проектах',
    adv_fast:       'Ускоренное обучение',
    adv_fast_d:     'Интенсивные программы для быстрого старта карьеры',
  },
  ky: {
    nav_abit:       'Абитуриенттерге',
    nav_programs:   'Программалар',
    nav_students:   'Студенттерге',
    nav_news:       'Жаңылыктар',
    nav_contacts:   'Байланыш',
    btn_apply:      'Тапшыруу',
    btn_submit:     'Документ тапшыруу',
    btn_ebilim:     'E-bilim',
    btn_all_news:   'Бардык жаңылыктар →',
    btn_all_grads:  'Бардык бүтүрүүчүлөр →',
    btn_all_faq:    'Бардык суроолор',
    btn_read_more:  'Толук окуу →',
    btn_programs:   'Программалар →',
    btn_contact:    'Байланышуу',
    hero_badge:     'Кабыл алуу 2025/2026 ачылды',
    hero_h1a:       'Карьераңды баста',
    hero_h1b:       'IT-де бүгүн эле',
    hero_desc:      'IT COLLEGE — маалыматтык технологиялар чөйрөсүндөгү заманбап кесиптик билим берүү. Мамлекеттик диплом. Бюджеттик орундар. Жумушка орношуу.',
    stat_students:  'Студент окуйт',
    stat_specs:     'Адестик',
    stat_employ:    'Жумушка орношуу',
    stat_partners:  'Өнөктөштөр',
    tag_study:      'Окутуу',
    tag_advantages: 'Артыкчылыктар',
    tag_media:      'Медиа',
    tag_success:    'Ийгилик',
    tag_faq:        'FAQ',
    sec_programs:   'Окуу программалары',
    sec_programs_s: 'IT чөйрөсүндө 6 суранычтуу адестик',
    sec_adv:        'IT COLLEGE — бул',
    sec_adv_s:      'Эмне үчүн миңдеген студент бизди тандайт',
    sec_news:       'Жаңылыктар',
    sec_grads:      'Биздин бүтүрүүчүлөр',
    sec_grads_s:    'Алар чоң компанияларда иштешет',
    sec_faq:        'Көп берилүүчү суроолор',
    cta_title:      'Баштоого даярсыңбы? Азыр тапшыр!',
    cta_desc:       'Документтерди кабыл алуу ачылды. Бюджеттик жана акылуу орундар.',
    adv_diploma:    'Мамлекеттик диплом',
    adv_diploma_d:  'МДА өлкөлөрүндө таанылган мамлекеттик үлгүдөгү диплом',
    adv_equip:      'Заманбап жабдуулар',
    adv_equip_d:    'Лабораториялар акыркы компьютерлер менен жабдылган',
    adv_intl:       'Эл аралык өнөктөштүк',
    adv_intl_d:     'Германия, Россия жана Кытайдын жогорку окуу жайлары менен алмашуу',
    adv_teach:      'Тажрыйбалуу окутуучулар',
    adv_teach_d:    'Мугалимдердин 70%дан ашыгы IT тармагынын активдүү адистери',
    adv_trophy:     'Олимпиада жеңүүчүлөрү',
    adv_trophy_d:   'Республикалык жана эл аралык конкурстардын кайталаган байгелүүлөрү',
    adv_employ:     'Жумушка орношуу',
    adv_employ_d:   'Карьера борбору окуу учурунда эле жумуш табууга жардам берет',
    adv_budget:     'Бюджеттик орундар',
    adv_budget_d:   'Мыкты абитуриенттер үчүн мамлекеттик каржылоо',
    adv_science:    'Илимий иш',
    adv_science_d:  'Изилдөөлөргө жана стартап долбоорлоруна катышуу',
    adv_fast:       'Тездетилген окутуу',
    adv_fast_d:     'Карьерани тез баштоо үчүн интенсивдүү программалар',
  },
  en: {
    nav_abit:       'For Applicants',
    nav_programs:   'Programs',
    nav_students:   'For Students',
    nav_news:       'News',
    nav_contacts:   'Contacts',
    btn_apply:      'Apply',
    btn_submit:     'Submit Documents',
    btn_ebilim:     'E-bilim',
    btn_all_news:   'All news →',
    btn_all_grads:  'All graduates →',
    btn_all_faq:    'All questions',
    btn_read_more:  'Read more →',
    btn_programs:   'Programs →',
    btn_contact:    'Contact us',
    hero_badge:     'Admissions 2025/2026 open',
    hero_h1a:       'Start your career',
    hero_h1b:       'in IT today',
    hero_desc:      'IT COLLEGE — modern professional education in information technology. State-recognized diploma. Budget places. Career support.',
    stat_students:  'Students enrolled',
    stat_specs:     'Specialties',
    stat_employ:    'Employment rate',
    stat_partners:  'Partners',
    tag_study:      'Education',
    tag_advantages: 'Advantages',
    tag_media:      'Media',
    tag_success:    'Success',
    tag_faq:        'FAQ',
    sec_programs:   'Study Programs',
    sec_programs_s: '6 in-demand IT specialties',
    sec_adv:        'IT COLLEGE is',
    sec_adv_s:      'Why thousands of students choose us',
    sec_news:       'News',
    sec_grads:      'Our Graduates',
    sec_grads_s:    'They already work at top companies',
    sec_faq:        'Frequently Asked Questions',
    cta_title:      'Ready to start? Apply now!',
    cta_desc:       'Applications are open. Budget and paid places available.',
    adv_diploma:    'State Diploma',
    adv_diploma_d:  'State-recognized diploma, valid across all CIS countries',
    adv_equip:      'Modern Equipment',
    adv_equip_d:    'Labs equipped with the latest computers and servers',
    adv_intl:       'International Partnership',
    adv_intl_d:     'Exchange programs with universities in Germany, Russia and China',
    adv_teach:      'Practicing Teachers',
    adv_teach_d:    'Over 70% of instructors are active IT industry professionals',
    adv_trophy:     'Olympiad Winners',
    adv_trophy_d:   'Multiple prize-winners of national and international competitions',
    adv_employ:     'Employment',
    adv_employ_d:   'Career center helps find jobs even during studies',
    adv_budget:     'Budget Places',
    adv_budget_d:   'State funding for the best applicants',
    adv_science:    'Research',
    adv_science_d:  'Participation in research projects and startups',
    adv_fast:       'Accelerated Learning',
    adv_fast_d:     'Intensive programs for a fast career start',
  }
};

var FLAGS = { ru: '🇷🇺', ky: '🇰🇬', en: '🇬🇧' };
var CODES = { ru: 'RU', ky: 'KY', en: 'EN' };

function setLang(lang) {
  // Update switcher UI
  document.querySelectorAll('.lang-btn[data-lang]').forEach(function(b) {
    b.classList.toggle('active', b.dataset.lang === lang);
  });

  // Animate: fade out main content
  var sections = document.querySelectorAll('section, .page-header, .quick-bar, footer');
  sections.forEach(function(s) { s.classList.add('lang-fade'); });

  setTimeout(function() {
    // Apply translations
    var dict = T[lang] || T.ru;
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    // Fade in
    sections.forEach(function(s) {
      s.classList.remove('lang-fade');
      s.classList.add('lang-fade-in');
      setTimeout(function() { s.classList.remove('lang-fade-in'); }, 400);
    });
    // Save
    try { localStorage.setItem('itcollege_lang', lang); } catch(e){}
  }, 250);
}

// Restore saved language
(function() {
  try {
    var saved = localStorage.getItem('itcollege_lang');
    if (saved && saved !== 'ru' && T[saved]) setLang(saved);
  } catch(e) {}
})();

// ── Баннер-слайдер в герое ────────────────────────────────────────────────
(function() {
  var track = document.getElementById('bannerTrack');
  if (!track) return;
  var prev  = document.getElementById('bannerPrev');
  var next  = document.getElementById('bannerNext');
  var dotsC = document.getElementById('bannerDots');
  var slides = track.children;
  var total  = slides.length;
  var cur    = 0;
  var timer;

  // Создаём точки
  for (var i = 0; i < total; i++) {
    var d = document.createElement('div');
    d.className = 'banner-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('data-i', i);
    dotsC.appendChild(d);
  }

  function go(n) {
    cur = (n + total) % total;
    track.style.transform = 'translateX(-' + cur * 100 + '%)';
    dotsC.querySelectorAll('.banner-dot').forEach(function(d, i) {
      d.classList.toggle('active', i === cur);
    });
  }

  function startAuto() { timer = setInterval(function() { go(cur + 1); }, 5500); }
  function stopAuto()  { clearInterval(timer); }

  prev.onclick = function() { stopAuto(); go(cur - 1); startAuto(); };
  next.onclick = function() { stopAuto(); go(cur + 1); startAuto(); };
  dotsC.addEventListener('click', function(e) {
    var d = e.target.closest('.banner-dot');
    if (d) { stopAuto(); go(+d.getAttribute('data-i')); startAuto(); }
  });
  track.parentElement.addEventListener('mouseenter', stopAuto);
  track.parentElement.addEventListener('mouseleave', startAuto);

  startAuto();
})();
