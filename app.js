const imageData = {
  heroImage: 'assets/studio.jpg',
  introImage: 'assets/community.jpg',
  founderImages: ['assets/founder-rahul.jpg', 'assets/founder-priyanka.jpg'],
  galleryImages: [
    { src: 'assets/community.jpg', alt: 'The Dance Hub community together' },
    { src: 'assets/founder-priyanka.jpg', alt: 'Dance Hub community members' },
    { src: 'assets/kids-session.jpg', alt: 'Young dancers in a Dance Hub session' },
    { src: 'assets/kids-stage.jpg', alt: 'Dance Hub children celebrating on stage' },
    { src: 'assets/kids-group.jpg', alt: 'Dance Hub students and mentors' },
    { src: 'assets/studio.jpg', alt: 'The Dance Hub practice studio' }
  ],
  styleImages: ['assets/kids-session.jpg', 'assets/kids-group.jpg', 'assets/community.jpg', 'assets/kids-stage.jpg', 'assets/founder-priyanka.jpg', 'assets/kids-session.jpg', 'assets/kids-group.jpg', 'assets/community.jpg', 'assets/studio.jpg']
};

const styles = ['HIP HOP', 'CONTEMPORARY', 'ZUMBA', 'AEROBICS', 'PUNJABI', 'BOLLYWOOD', 'CLASSICAL', 'SEMI-CLASSICAL', 'BHARATNATYAM'];
const formatNumber = (number) => String(number).padStart(2, '0');

function preventBrokenImage(image) {
  image.addEventListener('error', () => {
    image.style.display = 'none';
    const container = image.closest('.image-frame, .video-card');
    container?.classList.add('has-image-error');
  }, { once: true });
}

document.querySelectorAll('img').forEach(preventBrokenImage);

const header = document.getElementById('siteHeader');
addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 30), { passive: true });

const menu = document.getElementById('mobileMenu');
const menuButton = document.getElementById('menuButton');
const closeMenu = document.getElementById('closeMenu');
function setMenu(open) {
  menu.classList.toggle('is-open', open); document.body.classList.toggle('menu-open', open);
  menu.setAttribute('aria-hidden', String(!open)); menuButton.setAttribute('aria-expanded', String(open));
}
menuButton.addEventListener('click', () => setMenu(true)); closeMenu.addEventListener('click', () => setMenu(false));
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

const list = document.getElementById('styleList');
const styleImage = document.getElementById('styleImage');
const styleCaption = document.getElementById('styleCaption');
styles.forEach((style, index) => {
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button'; button.innerHTML = `<span>${formatNumber(index + 1)}</span>${style}<b>↗</b>`;
  button.setAttribute('aria-label', `View ${style}`); item.appendChild(button); list.appendChild(item);
  const activate = () => {
    list.querySelector('.is-active')?.classList.remove('is-active'); button.classList.add('is-active');
    styleImage.style.opacity = '0'; setTimeout(() => { styleImage.src = imageData.styleImages[index]; styleImage.alt = `${style} at The Dance Hub`; styleCaption.textContent = style; styleImage.style.opacity = '1'; }, 160);
  };
  button.addEventListener('mouseenter', activate); button.addEventListener('focus', activate); button.addEventListener('click', activate);
});
list.querySelector('button')?.classList.add('is-active');

const track = document.getElementById('galleryTrack');
const viewport = document.getElementById('galleryViewport');
const current = document.getElementById('galleryCurrent');
imageData.galleryImages.forEach((photo, index) => {
  const figure = document.createElement('figure'); figure.className = `gallery-item gallery-item--${index + 1}`;
  figure.innerHTML = `<img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async"><figcaption>${formatNumber(index + 1)}</figcaption>`;
  track.appendChild(figure); preventBrokenImage(figure.querySelector('img'));
});

let drag = { active: false, startX: 0, startScroll: 0, resume: 0 };
const pause = () => viewport.classList.add('is-paused');
const resumeLater = () => { clearTimeout(drag.resume); drag.resume = setTimeout(() => viewport.classList.remove('is-paused'), 1800); };
viewport.addEventListener('pointerdown', (event) => { drag = { ...drag, active: true, startX: event.clientX, startScroll: viewport.scrollLeft }; viewport.setPointerCapture(event.pointerId); pause(); });
viewport.addEventListener('pointermove', (event) => { if (!drag.active) return; viewport.scrollLeft = drag.startScroll - (event.clientX - drag.startX); });
['pointerup', 'pointercancel', 'pointerleave'].forEach((eventName) => viewport.addEventListener(eventName, () => { if (drag.active) { drag.active = false; resumeLater(); } }));
viewport.addEventListener('mouseenter', pause); viewport.addEventListener('mouseleave', resumeLater);
viewport.addEventListener('scroll', () => {
  const width = Math.max(1, viewport.scrollWidth - viewport.clientWidth); const item = Math.min(6, Math.floor((viewport.scrollLeft / width) * 6) + 1); current.textContent = formatNumber(item);
}, { passive: true });
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let last = performance.now();
  const autoScroll = (time) => { const delta = time - last; last = time; if (!viewport.classList.contains('is-paused') && !drag.active) { if (viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 2) viewport.scrollLeft = 0; else viewport.scrollLeft += delta * 0.012; } requestAnimationFrame(autoScroll); };
  requestAnimationFrame(autoScroll);
}
