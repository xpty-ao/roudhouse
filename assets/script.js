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

  // contact form — Envio assíncrono via Formspree (Sem abrir aplicação de e-mail)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Impede o recarregamento da página ou abertura do mailto
      
      const button = document.getElementById('submit-button');
      const status = document.getElementById('form-status');
      
      if (button) {
        button.disabled = true;
        button.innerText = 'A enviar...';
      }
      if (status) {
        status.textContent = '';
      }

      const data = new FormData(form);
      
      fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          if (status) {
            status.style.color = '#28a745'; // Cor verde de sucesso
            status.textContent = 'Obrigado! O seu pedido foi enviado com sucesso. Entraremos em contacto brevemente.';
          }
          form.reset(); // Limpa todos os campos do formulário
          if (button) button.innerText = 'Enviado';
        } else {
          if (status) {
            status.style.color = '#dc3545'; // Cor vermelha de erro
            status.textContent = 'Oops! Ocorreu um problema ao enviar o seu pedido.';
          }
        }
      }).catch(error => {
        if (status) {
          status.style.color = '#dc3545'; // Cor vermelha de erro
          status.textContent = 'Oops! Ocorreu um erro de rede. Verifique a sua ligação.';
        }
      }).finally(() => {
        setTimeout(() => {
          if (button) {
            button.disabled = false;
            button.innerText = 'Enviar pedido';
          }
        }, 4000);
      });
    });
  }
});

