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
