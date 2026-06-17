/* ============================================================
   FFC SEA FOODS — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ---- NAVBAR: scroll state + mobile menu ---- */
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  function updateNavbar () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  hamburger.addEventListener('click', function () {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---- SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        const offset = 70;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- SCROLL-TRIGGERED ANIMATIONS (lightweight AOS) ---- */
  const animateEls = document.querySelectorAll('[data-aos]');

  function checkAOS () {
    const viewH = window.innerHeight;
    animateEls.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewH - 60) {
        el.classList.add('aos-animate');
      }
    });
  }
  window.addEventListener('scroll', checkAOS, { passive: true });
  checkAOS(); // run on load too

  /* ---- HIDE SCROLL CUE on first scroll ---- */
  const scrollCue = document.getElementById('scrollCue');
  if (scrollCue) {
    window.addEventListener('scroll', function hideCue () {
      if (window.scrollY > 80) {
        scrollCue.style.opacity = '0';
        scrollCue.style.pointerEvents = 'none';
        window.removeEventListener('scroll', hideCue);
      }
    }, { passive: true });
  }

  /* ---- ORDER FORM: live price calculator ---- */
  const gradeSelect  = document.getElementById('fgrade');
  const qtyInput     = document.getElementById('fqty');
  const formTotal    = document.getElementById('formTotal');
  const totalAmt     = document.getElementById('totalAmt');

  const prices = { '100': 300, '150': 250, '200': 200 };

  function calcTotal () {
    const grade = gradeSelect ? gradeSelect.value : '';
    const qty   = parseFloat(qtyInput ? qtyInput.value : 0) || 0;
    const price = prices[grade];

    if (price && qty > 0) {
      const total = price * qty;
      totalAmt.textContent = '₹' + total.toLocaleString('en-IN');
      formTotal.style.display = 'block';
    } else {
      formTotal.style.display = 'none';
    }
  }

  if (gradeSelect) gradeSelect.addEventListener('change', calcTotal);
  if (qtyInput)    qtyInput.addEventListener('input', calcTotal);

  /* ---- ORDER FORM SUBMIT ---- */
  const orderForm    = document.getElementById('orderForm');
  const formSuccess  = document.getElementById('formSuccess');
  const successName  = document.getElementById('successName');

  if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name  = document.getElementById('fname').value.trim();
      const phone = document.getElementById('fphone').value.trim();
      const grade = gradeSelect.value;

      // Minimal validation
      if (!name) { showFieldError('fname', 'Please enter your name.'); return; }
      if (!phone || phone.length < 10) { showFieldError('fphone', 'Please enter a valid phone number.'); return; }
      if (!grade) { showFieldError('fgrade', 'Please select a prawn grade.'); return; }

      // Build WhatsApp message
      const gradeLabels = { '100': 'Jumbo 100 Count – ₹300/kg', '150': 'Medium 150 Count – ₹250/kg', '200': 'Small 200 Count – ₹200/kg' };
      const qty    = qtyInput.value || '1';
      const proc   = document.getElementById('fprocess').value || 'None';
      const notes  = document.getElementById('fnotes').value.trim();

      const msg = encodeURIComponent(
        'Hi FFC Sea Foods! I would like to place an order.\n\n' +
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Grade: ' + gradeLabels[grade] + '\n' +
        'Quantity: ' + qty + ' kg\n' +
        'Processing: ' + proc + '\n' +
        (notes ? 'Notes: ' + notes : '')
      );

      // Show success state
      successName.textContent = name;
      orderForm.style.display = 'none';
      formSuccess.style.display = 'block';

      // Open WhatsApp after short delay
      setTimeout(function () {
        window.open('https://wa.me/918985734989?text=' + msg, '_blank');
      }, 800);
    });
  }

  function showFieldError (id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = '#e63946';
    el.focus();
    // Remove error highlight on next input
    el.addEventListener('input', function clear () {
      el.style.borderColor = '';
      el.removeEventListener('input', clear);
    });
    // Brief shake animation
    el.style.animation = 'shake 0.35s ease';
    el.addEventListener('animationend', function () { el.style.animation = ''; });
  }

  /* ---- NAVBAR ACTIVE LINK HIGHLIGHT on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightNav () {
    let current = '';
    sections.forEach(function (s) {
      const top = s.offsetTop - 120;
      if (window.scrollY >= top) current = s.id;
    });
    navAnchors.forEach(function (a) {
      a.style.fontWeight = a.getAttribute('href') === '#' + current ? '700' : '';
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---- INJECT SHAKE KEYFRAMES once ---- */
  const style = document.createElement('style');
  style.textContent = '@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }';
  document.head.appendChild(style);

  /* ---- PRODUCT CARD hover ripple effect ---- */
  document.querySelectorAll('.product-cta').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      ripple.style.cssText = [
        'position:absolute', 'border-radius:50%',
        'background:rgba(255,255,255,0.35)',
        'width:' + size + 'px', 'height:' + size + 'px',
        'top:' + (e.clientY - rect.top - size/2) + 'px',
        'left:' + (e.clientX - rect.left - size/2) + 'px',
        'animation:ripple 0.6s ease-out',
        'pointer-events:none'
      ].join(';');
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 700);
    });
  });

  const rippleKf = document.createElement('style');
  rippleKf.textContent = '@keyframes ripple{from{opacity:1;transform:scale(0)}to{opacity:0;transform:scale(2)}}';
  document.head.appendChild(rippleKf);

})();
