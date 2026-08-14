const carouselData = {
  flowers: [
    ['flower-pink-rose.jpg.jpg','Pink Rose'],
    ['flower-white-rose.jpg.jpg','White Rose'],
    ['flower-oleander.jpg.jpg','Oleander'],
    ['flower-hibiscus.jpg.jpg','Hibiscus'],
    ['flower-jasmine.jpg.jpg','Jasmine']
  ],
  fruit: [
    ['fruit-tree-coconut.jpg.jpg','Coconut'],
    ['fruit-tree-mango.jpg.jpg','Mango'],
    ['fruit-tree-aavala.jpg.jpg','Aavala / Amla'],
    ['fruit-tree-chincha.jpg.jpg','Chincha / Tamarind'],
    ['fruit-tree-jamun.jpg.jpg','Jamun'],
    ['fruit-tree-guava.jpg.jpg','Guava'],
    ['fruit-tree-papaya.jpg.jpg','Papaya'],
    ['fruit-tree-custard-apple.jpg.jpg','Custard Apple']
  ],
  surroundings: [
    ['surroundings-01.jpg.jpg','Around the House 1'],
    ['surroundings-02.jpg.jpg','Around the House 2'],
    ['surroundings-03.jpg.jpg','Around the House 3'],
    ['surroundings-04.jpg.jpg','Around the House 4'],
    ['surroundings-05.jpg.jpg','Around the House 5']
  ],
  'harvest-all': [
    ['harvest-sowing.jpg.jpg','Sowing'],
    ['harvest-01.jpg.jpg','Harvesting 1'],
    ['harvest-02.jpg.jpg','Harvesting 2'],
    ['harvest-03.jpg.jpg','Harvesting 3'],
    ['harvest-04.jpg.jpg','Harvesting 4']
  ]
};

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = [...document.querySelectorAll('.main-nav a')];
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});
navLinks.forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

function setupCarousel(name, items) {
  const root = document.querySelector(`[data-carousel="${name}"]`);
  if (!root) return;
  const track = root.querySelector('.carousel-track');
  const viewport = root.querySelector('.carousel-viewport');
  const count = document.querySelector(`[data-count="${name}"]`);
  const caption = document.querySelector(`[data-caption="${name}"]`);
  const dots = root.querySelector(`[data-dots="${name}"]`);
  let index = 0;

  track.innerHTML = '';
  items.forEach(([src, label], i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    const img = document.createElement('img');
    img.src = src;
    img.alt = label;
    img.loading = i === 0 ? 'eager' : 'lazy';
    slide.appendChild(img);
    track.appendChild(slide);
  });

  if (dots) {
    dots.innerHTML = '';
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => { index = i; update(); });
      dots.appendChild(dot);
    });
  }

  const update = () => {
    track.style.transform = `translate3d(-${index * 100}%,0,0)`;
    if (count) count.textContent = `${String(index + 1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
    if (caption) caption.textContent = items[index][1];
    if (dots) [...dots.children].forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  root.querySelector('.prev')?.addEventListener('click', () => {
    index = (index - 1 + items.length) % items.length;
    update();
  });
  root.querySelector('.next')?.addEventListener('click', () => {
    index = (index + 1) % items.length;
    update();
  });

  let startX = null;
  viewport?.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive:true});
  viewport?.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      index = dx < 0 ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
      update();
    }
    startX = null;
  }, {passive:true});

  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') root.querySelector('.prev')?.click();
    if (e.key === 'ArrowRight') root.querySelector('.next')?.click();
  });
  update();
}
Object.entries(carouselData).forEach(([name, items]) => setupCarousel(name, items));

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const closeLightbox = () => {
  lightbox?.classList.remove('open');
  lightbox?.setAttribute('aria-hidden', 'true');
  if (lightboxImage) lightboxImage.src = '';
  document.body.style.overflow = '';
};
document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const src = trigger.dataset.src || trigger.querySelector('img')?.src;
    if (!src || !lightbox) return;
    lightboxImage.src = src;
    lightboxImage.alt = trigger.querySelector('img')?.alt || 'Sarkate Farm photograph';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});
document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox(); });

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  });
}, {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const sections = [...document.querySelectorAll('main section[id]')];
const linkById = new Map(navLinks.map(a => [a.getAttribute('href').slice(1), a]));
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      linkById.get(entry.target.id)?.classList.add('active');
    }
  });
}, {rootMargin:'-35% 0px -55% 0px', threshold:0});
sections.forEach(section => activeObserver.observe(section));

document.getElementById('year').textContent = new Date().getFullYear();
