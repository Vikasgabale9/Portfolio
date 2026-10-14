(function () {
  'use strict';
  // Mobile menu
  var btn = document.getElementById('menuBtn'), nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); btn.focus(); }
  });
  // Hide avatar if the image file is missing
  var av = document.getElementById('avatar');
  av.addEventListener('error', function () { av.style.display = 'none'; });
  // Reveal on scroll (CSS keeps content visible if this never runs)
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }
  // Contact form (Formspree)
  var form = document.getElementById('contactForm'), status = document.getElementById('formStatus'), submit = document.getElementById('submitBtn');
  function show(msg, cls) { status.textContent = msg; status.className = cls; }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.elements['_replyto'], msg = form.elements['message'];
    if (!email.value.trim() || !email.validity.valid) { show('Please enter a valid email address.', 'err'); email.focus(); return; }
    if (!msg.value.trim()) { show('Please enter a message.', 'err'); msg.focus(); return; }
    submit.disabled = true; submit.textContent = 'Sending...'; show('Sending your message...', '');
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset(); show("Message sent. I'll get back to you soon.", 'ok');
      })
      .catch(function () { show('Could not send the message. Please email me at vikasgabale9@gmail.com.', 'err'); })
      .then(function () { submit.disabled = false; submit.textContent = 'Send message'; });
  });
})();