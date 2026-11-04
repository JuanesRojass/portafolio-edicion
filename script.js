// ===== Barra de progreso (playhead) =====
const bar = document.getElementById('playheadBar');
function updatePlayhead() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  bar.style.width = pct + '%';
}
window.addEventListener('scroll', updatePlayhead, { passive: true });
updatePlayhead();

// ===== Menú móvil =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', open);
});
navMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  })
);

// ===== Modal de video (YouTube, solo formato largo) =====
const modal = document.getElementById('videoModal');
const frame = document.getElementById('modalFrame');
const closeBtn = document.getElementById('modalClose');
let lastFocused = null;

function openVideo(id) {
  lastFocused = document.activeElement;
  frame.innerHTML =
    `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0"
      allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  modal.hidden = false;
  closeBtn.focus();
}
function closeVideo() {
  modal.hidden = true;
  frame.innerHTML = '';
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('.work[data-video]').forEach(work => {
  work.querySelector('.work__thumb').addEventListener('click', () =>
    openVideo(work.dataset.video)
  );
});
closeBtn.addEventListener('click', closeVideo);
modal.addEventListener('click', e => { if (e.target === modal) closeVideo(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeVideo(); });

// ===== Cortos de TikTok (se reproducen en la misma tarjeta) =====
const TIKTOK_ID = /tiktok\.com\/.*\/video\/(\d+)/;
let activeShort = null;

function stopShort() {
  if (!activeShort) return;
  activeShort.player.replaceWith(activeShort.thumb);   // vuelve la miniatura
  activeShort = null;
}

document.querySelectorAll('.work[data-tiktok]').forEach(work => {
  const thumb = work.querySelector('.work__thumb');
  const url = work.dataset.tiktok.trim();
  const match = url.match(TIKTOK_ID);

  thumb.addEventListener('click', () => {
    // Si el link no tiene ID (por ejemplo, links cortos vm.tiktok.com), lo abre en TikTok
    if (!match) {
      window.open(url, '_blank', 'noopener');
      return;
    }

    stopShort(); // detiene el que estuviera sonando

    const player = document.createElement('div');
    player.className = 'work__player';

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.tiktok.com/player/v1/${match[1]}` +
                 '?autoplay=1&music_info=0&description=0&rel=0&native_context_menu=0';
    iframe.allow = 'autoplay; fullscreen; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.title = thumb.getAttribute('aria-label') || 'Video de TikTok';

    player.appendChild(iframe);
    thumb.replaceWith(player);
    activeShort = { thumb, player };
  });
});

// ===== Formulario de contacto =====
// Por ahora abre el cliente de correo. Para envío real usa Formspree, EmailJS, etc.
const EMAIL = 'juanesprograma@gmail.com';
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  if (!data.nombre || !data.email || !data.tipo || !data.mensaje) {
    status.textContent = 'Completa todos los campos antes de enviar.';
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    status.textContent = 'Revisa que el email tenga un formato válido.';
    return;
  }

  const subject = encodeURIComponent(`Proyecto: ${data.tipo}`);
  const body = encodeURIComponent(
    `Nombre: ${data.nombre}\nEmail: ${data.email}\nTipo: ${data.tipo}\n\n${data.mensaje}`
  );
  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  status.textContent = 'Abriendo tu correo para enviar la solicitud.';
  form.reset();
});


// ===== Reseñas: duplicar tarjetas para el bucle infinito =====
const reviewsTrack = document.getElementById('reviewsTrack');
if (reviewsTrack) {
  [...reviewsTrack.children].forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    reviewsTrack.appendChild(clone);
  });
}
