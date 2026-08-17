/* Little Goonz — vanilla JS interactions */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.slice.call(
          el.parentElement ? el.parentElement.querySelectorAll(":scope > .reveal") : []
        );
        var i = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(i * 90, 450) + "ms";
        el.classList.add("is-visible");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 2. Milestone number count-up ---------- */
  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (reduce || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var start = performance.now();
        var dur = 700;
        function tick(now) {
          var p = Math.min(1, (now - start) / dur);
          var v = Math.round(1 + (target - 1) * p);
          el.textContent = "0" + v;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3. FAQ accordion (one open at a time) ---------- */
  function initFaq() {
    var list = document.getElementById("faqList");
    if (!list) return;
    var buttons = list.querySelectorAll(".faq-q");

    function close(btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.setAttribute("aria-expanded", "false");
      btn.parentElement.parentElement.classList.remove("is-open");
      if (!panel) return;
      panel.style.height = panel.scrollHeight + "px";
      requestAnimationFrame(function () { panel.style.height = "0px"; });
      window.setTimeout(function () {
        if (btn.getAttribute("aria-expanded") === "false") {
          panel.hidden = true;
          panel.style.height = "";
        }
      }, 260);
    }

    function open(btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.setAttribute("aria-expanded", "true");
      btn.parentElement.parentElement.classList.add("is-open");
      if (!panel) return;
      panel.hidden = false;
      panel.style.height = "0px";
      requestAnimationFrame(function () { panel.style.height = panel.scrollHeight + "px"; });
      window.setTimeout(function () {
        if (btn.getAttribute("aria-expanded") === "true") panel.style.height = "auto";
      }, 280);
    }

    buttons.forEach(function (btn, idx) {
      btn.addEventListener("click", function () {
        var isOpen = btn.getAttribute("aria-expanded") === "true";
        buttons.forEach(function (other) {
          if (other.getAttribute("aria-expanded") === "true") close(other);
        });
        if (!isOpen) open(btn);
      });
      btn.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowDown") next = buttons[(idx + 1) % buttons.length];
        if (e.key === "ArrowUp") next = buttons[(idx - 1 + buttons.length) % buttons.length];
        if (next) { e.preventDefault(); next.focus(); }
      });
    });
  }

  /* ---------- 4. Age / product finder ---------- */
  function initFinder() {
    var cards = document.querySelectorAll(".age-card");
    var panel = document.getElementById("panel-1");
    if (!cards.length || !panel) return;
    var out = {
      age: panel.querySelector('[data-out="age"]'),
      stage: panel.querySelector('[data-out="stage"]'),
      products: panel.querySelector('[data-out="products"]')
    };

    function select(card) {
      cards.forEach(function (c) {
        c.classList.toggle("is-active", c === card);
        c.setAttribute("aria-selected", c === card ? "true" : "false");
      });
      panel.setAttribute("aria-labelledby", card.id);
      panel.classList.remove("is-swap");
      void panel.offsetWidth;
      panel.classList.add("is-swap");
      var ageEl = card.querySelector(".age-num");
      out.age.textContent = ageEl ? ageEl.textContent : "";
      out.stage.textContent = card.getAttribute("data-stage") || "";
      out.products.textContent = card.getAttribute("data-products") || "";
      panel.dataset.accent = (card.className.match(/a-(\w+)/) || [, "yellow"])[1];
    }

    cards.forEach(function (card, idx) {
      card.addEventListener("click", function () { select(card); });
      card.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = cards[(idx + 1) % cards.length];
        if (e.key === "ArrowLeft") next = cards[(idx - 1 + cards.length) % cards.length];
        if (next) { e.preventDefault(); next.focus(); select(next); }
      });
    });
    select(document.querySelector(".age-card.is-active") || cards[0]);
  }

  /* ---------- 5. Pointer-follow micro-interaction on cards ---------- */
  function initCardTilt() {
    if (reduce || window.matchMedia("(hover: none)").matches) return;
    document.querySelectorAll(".prod-card, .col-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width).toFixed(3));
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height).toFixed(3));
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--mx", "0.5");
        card.style.setProperty("--my", "0.5");
      });
    });
  }

  /* ---------- 6. Parallax for decorative shapes + sticky header ---------- */
  function initScrollFx() {
    var header = document.getElementById("siteHeader");
    var shapes = Array.prototype.slice.call(
      document.querySelectorAll(".goonz-wheel, .goonz-star, .goonz-circle, .goonz-dot-pattern")
    );
    var ticking = false;

    function frame() {
      var y = window.scrollY || 0;
      if (header) header.classList.toggle("is-stuck", y > 24);
      if (!reduce) {
        shapes.forEach(function (el, i) {
          var speed = ((i % 4) + 1) * 0.035;
          el.style.transform = "translate3d(0," + (-y * speed % 120).toFixed(2) + "px,0)";
        });
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    }, { passive: true });
    frame();
  }

  /* ---------- 7. Drag-to-scroll for mobile rails ---------- */
  function initRails() {
    document.querySelectorAll("[data-rail]").forEach(function (rail) {
      var down = false, startX = 0, startLeft = 0;
      rail.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "touch") return;
        down = true; startX = e.clientX; startLeft = rail.scrollLeft;
      });
      window.addEventListener("pointerup", function () { down = false; rail.classList.remove("is-dragging"); });
      rail.addEventListener("pointermove", function (e) {
        if (!down) return;
        var dx = e.clientX - startX;
        if (Math.abs(dx) > 4) rail.classList.add("is-dragging");
        rail.scrollLeft = startLeft - dx;
      });
    });
  }

  function init() {
    initReveal();
    initCounters();
    initFaq();
    initFinder();
    initCardTilt();
    initScrollFx();
    initRails();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
