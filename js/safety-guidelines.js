(function () {
    var header = document.querySelector('header.reference-navbar');
    if (!header) return;
    var toggle = header.querySelector('.responsive-menu .slicknav_btn');
    var slot = header.querySelector('.navbar-toggle');
    if (toggle && slot) {
        toggle.setAttribute('aria-label', 'Toggle navigation');
        slot.appendChild(toggle);
    }
})();

(function () {
    'use strict';
    var main = document.querySelector('.help-main');
    if (!main) return;
    var panel = main.querySelector('.help-toc-panel');
    var compact = window.matchMedia('(max-width: 991px)');
    function sizeContents() { if (panel) panel.open = !compact.matches; }
    sizeContents();
    if (compact.addEventListener) compact.addEventListener('change', sizeContents);
    else compact.addListener(sizeContents);
    var links = Array.prototype.slice.call(main.querySelectorAll('.help-toc a[href^="#"]'));
    var sections = links.map(function (link) { return document.getElementById(link.hash.slice(1)); }).filter(Boolean);
    var scheduled = false;
    function updateCurrent() {
        scheduled = false;
        if (!sections.length) return;
        var active = sections[0];
        sections.forEach(function (section) { if (section.getBoundingClientRect().top <= 160) active = section; });
        links.forEach(function (link) {
            if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }
    window.addEventListener('scroll', function () {
        if (!scheduled) { scheduled = true; window.requestAnimationFrame(updateCurrent); }
    }, { passive: true });
    updateCurrent();
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    main.addEventListener('click', function (event) {
        var link = event.target.closest('a[href^="#"]');
        if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        var target = document.getElementById(link.hash.slice(1));
        if (!target || !main.contains(target)) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
        if (location.hash !== link.hash) window.history.pushState(null, '', link.hash);
        if (!target.hasAttribute('tabindex')) {
            target.setAttribute('tabindex', '-1');
            target.addEventListener('blur', function clearFocus() { target.removeAttribute('tabindex'); target.removeEventListener('blur', clearFocus); });
        }
        target.focus({ preventScroll: true });
    });
})();
