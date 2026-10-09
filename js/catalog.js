/* Category galleries and image viewer. No changes to the shared navigation. */
(function () {
    'use strict';

    function initCatalog() {
        var main = document.querySelector('.catalog-main');
        if (!main) return;

        var dialog = document.getElementById('catalog-image-dialog');
        var dialogImage = dialog && dialog.querySelector('img');
        var dialogClose = dialog && dialog.querySelector('.catalog-dialog-close');
        var returnFocus = null;
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        main.querySelectorAll('.catalog-gallery').forEach(function (gallery) {
            var imageButton = gallery.querySelector('.catalog-main-image-button');
            var image = imageButton && imageButton.querySelector('img');
            var thumbnails = Array.prototype.slice.call(gallery.querySelectorAll('.catalog-thumbnail'));

            function selectThumbnail(button) {
                if (!image || !button.dataset.image) return;
                var thumbnailImage = button.querySelector('img');
                var description = button.dataset.alt || (thumbnailImage && thumbnailImage.alt) || image.alt;
                image.src = button.dataset.image;
                image.alt = description;
                imageButton.dataset.fullImage = button.dataset.image;
                imageButton.setAttribute('aria-label', 'View larger image: ' + description);
                thumbnails.forEach(function (thumbnail) {
                    thumbnail.setAttribute('aria-pressed', thumbnail === button ? 'true' : 'false');
                });
            }

            thumbnails.forEach(function (button, index) {
                button.addEventListener('click', function () {
                    selectThumbnail(button);
                });

                button.addEventListener('keydown', function (event) {
                    var nextIndex;
                    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                        nextIndex = (index + 1) % thumbnails.length;
                    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                        nextIndex = (index - 1 + thumbnails.length) % thumbnails.length;
                    } else if (event.key === 'Home') {
                        nextIndex = 0;
                    } else if (event.key === 'End') {
                        nextIndex = thumbnails.length - 1;
                    } else {
                        return;
                    }
                    event.preventDefault();
                    thumbnails[nextIndex].focus();
                    selectThumbnail(thumbnails[nextIndex]);
                });
            });

            if (imageButton && image && dialogImage && typeof dialog.showModal === 'function') {
                imageButton.addEventListener('click', function () {
                    dialogImage.src = imageButton.dataset.fullImage || image.currentSrc || image.src;
                    dialogImage.alt = image.alt;
                    returnFocus = imageButton;
                    if (!dialog.open) dialog.showModal();
                    if (dialogClose) dialogClose.focus();
                });
            }
        });

        if (dialog) {
            if (dialogClose) {
                dialogClose.addEventListener('click', function () {
                    dialog.close();
                });
            }

            dialog.addEventListener('click', function (event) {
                if (event.target !== dialog) return;
                var rect = dialog.getBoundingClientRect();
                if (event.clientX < rect.left || event.clientX > rect.right ||
                    event.clientY < rect.top || event.clientY > rect.bottom) {
                    dialog.close();
                }
            });

            dialog.addEventListener('close', function () {
                if (returnFocus && document.contains(returnFocus)) returnFocus.focus();
                returnFocus = null;
            });
        }

        main.addEventListener('click', function (event) {
            var link = event.target.closest('a[href]');
            if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey ||
                event.ctrlKey || event.shiftKey || event.altKey) return;
            if (link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
            var destination;
            try {
                destination = new URL(link.href, window.location.href);
            } catch (error) {
                return;
            }
            if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname ||
                destination.search !== window.location.search) return;
            var hash = destination.hash;
            if (!hash || hash === '#') return;
            var target;
            try {
                target = document.getElementById(decodeURIComponent(hash.slice(1)));
            } catch (error) {
                return;
            }
            if (!target || !main.contains(target)) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
            if (window.location.hash !== hash) window.history.pushState(null, '', hash);
            if (!target.hasAttribute('tabindex')) {
                target.setAttribute('tabindex', '-1');
                target.addEventListener('blur', function removeTemporaryTabindex() {
                    target.removeAttribute('tabindex');
                    target.removeEventListener('blur', removeTemporaryTabindex);
                });
            }
            target.focus({ preventScroll: true });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCatalog);
    } else {
        initCatalog();
    }
})();
