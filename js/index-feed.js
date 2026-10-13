(function () {
    var app = document.querySelector('.little-goonz-instagram .elfsight-app-f9de96f4-b988-4b70-b885-2e015dd655ea');
    if (!app) return;
    var creditSelector = 'a[href^="https://elfsight.com/instagram-feed-instashow/"][href*="utm_campaign=free-widget"]';
    var watchedRoots = new WeakSet();
    var watchedCredits = new WeakSet();

    function hideCredit(credit) {
        if (!credit.matches(creditSelector)) return;
        if (credit.style.getPropertyValue('display') !== 'none' || credit.style.getPropertyPriority('display') !== 'important') {
            credit.style.setProperty('display', 'none', 'important');
        }
    }

    function updateCredits(root) {
        root.querySelectorAll(creditSelector).forEach(function (credit) {
            hideCredit(credit);
            if (watchedCredits.has(credit)) return;
            watchedCredits.add(credit);
            new MutationObserver(function () { hideCredit(credit); }).observe(credit, {
                attributes: true,
                attributeFilter: ['style', 'href']
            });
        });
    }

    function connectFeed() {
        updateCredits(app);
        app.querySelectorAll('.es-embed-root').forEach(function (host) {
            var root = host.shadowRoot;
            if (!root) return;
            updateCredits(root);
            if (watchedRoots.has(root)) return;
            watchedRoots.add(root);
            new MutationObserver(function () { updateCredits(root); }).observe(root, {
                childList: true,
                subtree: true
            });
        });
    }

    new MutationObserver(connectFeed).observe(app, { childList: true, subtree: true });
    var platform = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
    if (platform) platform.addEventListener('load', connectFeed, { once: true });
    connectFeed();
})();
