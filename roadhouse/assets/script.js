// Roadhouse — shared behaviour
document.addEventListener('DOMContentLoaded', () => {
  // mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // scroll reveal — single orchestrated pass, respects reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // contact form — client-side only (mailto fallback)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent('Pedido de contacto — ' + (data.get('empresa') || data.get('nome') || 'Roadhouse'));
      const body = encodeURIComponent(
        `Nome: ${data.get('nome') || ''}\nEmpresa: ${data.get('empresa') || ''}\nE-mail: ${data.get('email') || ''}\nTelefone: ${data.get('telefone') || ''}\nAssunto: ${data.get('assunto') || ''}\n\nMensagem:\n${data.get('mensagem') || ''}`
      );
      window.location.href = `mailto:roadhouse@gmail.com?subject=${subject}&body=${body}`;
      const status = document.getElementById('form-status');
      if (status) status.textContent = 'A abrir o seu cliente de e-mail…';
    });
  }
});
