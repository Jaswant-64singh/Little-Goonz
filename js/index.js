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
    function initFaqAccordion() {
        var cards = document.querySelectorAll('.little-goonz-faq-section .faq-accordion-card');
        if (!cards.length) return;

        cards.forEach(function (card) {
            var btn = card.querySelector('.faq-card-header-btn');
            if (!btn) return;

            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var isActive = card.classList.contains('active');

                // Close all other open cards for clean accordion behaviour
                cards.forEach(function (otherCard) {
                    if (otherCard !== card && otherCard.classList.contains('active')) {
                        otherCard.classList.remove('active');
                        var otherBtn = otherCard.querySelector('.faq-card-header-btn');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle clicked card
                if (isActive) {
                    card.classList.remove('active');
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    card.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFaqAccordion);
    } else {
        initFaqAccordion();
    }
})();
