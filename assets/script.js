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

  // contact form — Envio assíncrono via Formspree sem redirecionamento externo
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Impede totalmente o redirecionamento para a página do Formspree
      
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
      
      // Enviamos a requisição com o cabeçalho Accept JSON exigido pelo Formspree para AJAX
      fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          if (status) {
            status.style.color = '#28a745'; // Mensagem em Verde de sucesso
            status.textContent = 'Obrigado! O seu pedido foi enviado com sucesso. Entraremos em contacto brevemente.';
          }
          form.reset(); // Limpa todas as caixas de texto do formulário automaticamente
          if (button) button.innerText = 'Enviado';
        } else {
          return response.json().then(data => {
            if (status) {
              status.style.color = '#dc3545'; // Vermelho de erro
              if (Object.hasOwn(data, 'errors')) {
                status.textContent = data["errors"].map(error => error["message"]).join(", ");
              } else {
                status.textContent = 'Oops! Ocorreu um problema ao processar o seu envio.';
              }
            }
          });
        }
      })
      .catch(error => {
        if (status) {
          status.style.color = '#dc3545';
          status.textContent = 'Oops! Ocorreu um erro ao enviar. Por favor, tente novamente.';
        }
      })
      .finally(() => {
        // Devolve o estado normal ao botão após 4 segundos
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

