/* Navigation enhancement only: all substantive content is in the HTML. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      toggle.textContent = open ? 'Close menu' : 'Menu';
    });
    nav.addEventListener('click', (event) => {
      if (!(event.target instanceof Element) || !event.target.closest('a')) return;
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      toggle.textContent = 'Menu';
    });
  }
  const navLinks = [...document.querySelectorAll('.navigation a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  let queued = false;
  const markCurrent = () => {
    let current = sections[0];
    sections.forEach(section => { if (section.getBoundingClientRect().top <= 180) current = section; });
    navLinks.forEach(link => {
      if (current && link.getAttribute('href') === '#' + current.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    queued = false;
  };
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; window.requestAnimationFrame(markCurrent); }
  }, {passive: true});
  markCurrent();
  // Expand disclosure widgets for printing, then restore each original state.
  let printStates = [];
  window.addEventListener('beforeprint', () => {
    printStates = [...document.querySelectorAll('details')].map(el => [el, el.open]);
    printStates.forEach(([el]) => { el.open = true; });
  });
  window.addEventListener('afterprint', () => printStates.forEach(([el, state]) => { el.open = state; }));
})();
