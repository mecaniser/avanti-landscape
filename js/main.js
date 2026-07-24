document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  // Close mobile nav when a link is clicked
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
      });
    });
  }

  // Before & After sliders
  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    var handle = slider.querySelector('.ba-handle');

    function setPos(clientX) {
      var rect = slider.getBoundingClientRect();
      var pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      slider.style.setProperty('--pos', pct + '%');
    }

    var dragging = false;

    slider.addEventListener('pointerdown', function (e) {
      dragging = true;
      slider.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });
    slider.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      setPos(e.clientX);
    });
    slider.addEventListener('pointerup', function () { dragging = false; });
    slider.addEventListener('pointercancel', function () { dragging = false; });

    // Keyboard support on the handle
    if (handle) {
      handle.setAttribute('tabindex', '0');
      handle.setAttribute('role', 'slider');
      handle.setAttribute('aria-label', 'Before and after comparison slider');
      handle.setAttribute('aria-valuemin', '0');
      handle.setAttribute('aria-valuemax', '100');
      handle.addEventListener('keydown', function (e) {
        var current = parseFloat(getComputedStyle(slider).getPropertyValue('--pos')) || 50;
        if (e.key === 'ArrowLeft') { current = Math.max(0, current - 4); slider.style.setProperty('--pos', current + '%'); }
        if (e.key === 'ArrowRight') { current = Math.min(100, current + 4); slider.style.setProperty('--pos', current + '%'); }
      });
    }
  });

  // Simple contact form handler (no backend yet)
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.querySelector('#form-success');
      form.style.display = 'none';
      if (msg) msg.style.display = 'block';
    });
  }
});
