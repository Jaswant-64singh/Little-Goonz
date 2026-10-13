# Little Goonz performance optimization report

Baseline: `f6f5a052a5dd491d0268bcf363cb4550fc0847fb` (`baseline before optimization`). Optimizations remain in the working tree for review. No production deployment was performed.

## 1. New files and page ownership

Readable sources remain available. HTML loads the production `.min.css` / `.min.js` versions. Existing already-minified vendor files were retained. No framework, site dependency, package manifest, or build system was added.

| New readable file | New production copy | Pages | Source bytes | Production bytes |
|---|---|---|---:|---:|
| `css/become-a-dealer.css` | `css/become-a-dealer.min.css` | become-a-dealer.html | 15,114 | 13,144 |
| `css/common-help.css` | `css/common-help.min.css` | product-support.html, safety-guidelines.html, terms.html | 12,813 | 11,035 |
| `css/common.css` | `css/common.min.css` | All 14 pages | 20,287 | 11,589 |
| `css/index-adventure.css` | `css/index-adventure.min.css` | index.html | 5,964 | 3,835 |
| `css/index-instagram.css` | `css/index-instagram.min.css` | index.html | 5,191 | 3,179 |
| `css/index.css` | `css/index.min.css` | index.html | 12,152 | 6,218 |
| `css/privacy.css` | `css/privacy.min.css` | privacy.html | 21,580 | 11,028 |
| `js/about.js` | `js/about.min.js` | about.html | 372 | 293 |
| `js/become-a-dealer.js` | `js/become-a-dealer.min.js` | become-a-dealer.html | 2,942 | 2,277 |
| `js/contact.js` | `js/contact.min.js` | contact.html | 372 | 293 |
| `js/index-feed.js` | `js/index-feed.min.js` | index.html | 1,891 | 1,357 |
| `js/index.js` | `js/index.min.js` | index.html | 1,898 | 1,154 |
| `js/kids-scooters.js` | `js/kids-scooters.min.js` | kids-scooters.html | 372 | 293 |
| `js/kids-walkers.js` | `js/kids-walkers.min.js` | kids-walkers.html | 372 | 293 |
| `js/privacy.js` | `js/privacy.min.js` | privacy.html | 2,693 | 2,098 |
| `js/product-support.js` | `js/product-support.min.js` | product-support.html | 2,693 | 2,098 |
| `js/roller-skates.js` | `js/roller-skates.min.js` | roller-skates.html | 372 | 293 |
| `js/safety-accessories.js` | `js/safety-accessories.min.js` | safety-accessories.html | 372 | 293 |
| `js/safety-guidelines.js` | `js/safety-guidelines.min.js` | safety-guidelines.html | 2,693 | 2,098 |
| `js/shop.js` | `js/shop.min.js` | shop.html | 372 | 293 |
| `js/skateboards.js` | `js/skateboards.min.js` | skateboards.html | 372 | 293 |
| `js/terms.js` | `js/terms.min.js` | terms.html | 2,693 | 2,098 |

Production copies of existing readable files:

| Existing readable source | New production copy | Pages | Source bytes | Production bytes |
|---|---|---|---:|---:|
| `css/ai.css` | `css/ai.min.css` | Retained source; not loaded by a page | 29,763 | 23,514 |
| `css/animate.css` | `css/animate.min.css` | All 14 pages | 73,589 | 54,282 |
| `css/catalog.css` | `css/catalog.min.css` | kids-scooters.html, kids-walkers.html, roller-skates.html, safety-accessories.html, shop.html, skateboards.html | 23,739 | 17,846 |
| `css/custom.css` | `css/custom.min.css` | All 14 pages | 254,625 | 191,416 |
| `css/magnific-popup.css` | `css/magnific-popup.min.css` | All 14 pages | 6,951 | 5,264 |
| `css/mousecursor.css` | `css/mousecursor.min.css` | All 14 pages | 6,892 | 6,043 |
| `js/SmoothScroll.js` | `js/SmoothScroll.min.js` | All 14 pages | 24,489 | 11,515 |
| `js/ai.js` | `js/ai.min.js` | Retained source; not loaded by a page | 8,464 | 5,575 |
| `js/catalog.js` | `js/catalog.min.js` | kids-scooters.html, kids-walkers.html, roller-skates.html, safety-accessories.html, shop.html, skateboards.html | 5,993 | 3,699 |
| `js/function.js` | `js/function.min.js` | All 14 pages | 13,550 | 9,441 |
| `js/jquery.slicknav.js` | `js/jquery.slicknav.min.js` | All 14 pages | 21,205 | 10,531 |
| `js/magiccursor.js` | `js/magiccursor.min.js` | All 14 pages | 3,720 | 2,446 |
| `js/parallaxie.js` | `js/parallaxie.min.js` | Retained source; not loaded by a page | 2,033 | 1,163 |

Index retains separate stylesheet slots (`index`, `common`, `index-adventure`, `index-instagram`) and a separate mid-body `index-feed` script to preserve the original cascade and execution order. Pages with only identical header/footer CSS use `common.css` rather than empty page files. The three identical help styles use `common-help.css`.

## 2. Changes grouped by HTML, CSS and JavaScript

### HTML

- Replaced all 22 `<style>` blocks at their original positions and all 21 executable inline script blocks with external production references. Adjacent footer IIFEs retain their scopes and order in the page script.
- Deferred page scripts and local dependencies in their original order. Home retains its original synchronous dependency chain at the end of body after a deferred-startup benchmark exposed higher blocking; its extracted page scripts remain deferred. The independent Elfsight script remains async.
- Added descriptions for Home, About and Contact and corrected the About/Contact browser titles. Existing visible text, navigation links, image references, forms and handlers were preserved.
- Added DNS hints for the existing font origins, Elfsight connection hints on Home, and a preload for the 10,364-byte local IT Pimo font used above the fold.
- Added async image decoding, intrinsic dimensions where they preserve layout, and lazy loading only for images proven below the 900px viewport at all four tested widths. Hero/header images remain eager. Existing alt text was preserved; all real image tags already supplied alt attributes. No iframe tags were present.
- Removed commented-out HTML only. Actual wrappers, empty icon containers, menu mount points and other layout/JavaScript hooks remain.

### CSS

- Shared identical rules through common files, preserving every original stylesheet slot. Only relative URLs from extracted inline CSS were rebased; every URL still resolves to the exact original asset.
- Promoted the existing Exo 2 font import to a stylesheet link immediately before custom CSS, using the exact existing URL, for earlier discovery. Existing Google Font requests retain `display=swap`.
- Changed the ten Font Awesome font-face display settings to swap and added swap to the Swiper icon face. The custom face already used swap.
- Created conservative production copies using clean-css 5.3.3 with whitespace removal only: no rule reordering, level-2 merging, rounding, URL normalization or rebasing.
- Retained existing reduced-motion rules, responsive overrides and animation definitions. No uncertain selectors were removed.

### JavaScript

- Created page scripts and guarded Swiper, WOW and contact validation when those optional libraries are absent. Removed unused local variables and added safe element checks; animation timing and event behavior remain.
- Load Swiper/SplitText/ScrollTrigger only on Home; WOW only on Home/About/Contact; Validator only on Contact; catalog interactions on Shop and the five product category pages.
- Stopped loading Bootstrap JS, CounterUp, Waypoints, Parallaxie, MagnificPopup and YTPlayer after checking all real HTML and custom JavaScript consumers. Library files remain in the repository.
- Preserved SmoothScroll and its nonpassive wheel handler because it calls preventDefault. Existing passive/requestAnimationFrame scroll handlers were retained.
- Created Terser 5.51.2 production copies with ordinary compression, no name mangling and no unsafe options. All 34 production scripts pass syntax checks.

## 3. Before / after sizes, audit and Lighthouse

### Per-page local code payload

Bytes below are uncompressed HTML plus local CSS and JavaScript requested on a cold visit; they exclude images, fonts, third-party widgets and HTTP compression. Shared caching saves additional bytes when navigating between pages. Keeping both readable sources and production copies increases disk storage intentionally.

| Page | HTML before | HTML after | JS before | JS after | HTML + CSS + JS before | After | Reduction |
|---|---:|---:|---:|---:|---:|---:|---:|
| about.html | 101,531 | 71,856 | 595,193 | 202,348 | 1,368,287 | 872,203 | 36.3% |
| become-a-dealer.html | 76,008 | 33,594 | 595,193 | 196,177 | 1,342,764 | 840,914 | 37.4% |
| contact.html | 57,332 | 32,749 | 595,193 | 210,077 | 1,324,088 | 840,825 | 36.5% |
| index.html | 140,033 | 77,870 | 595,193 | 403,618 | 1,406,789 | 1,092,719 | 22.3% |
| kids-scooters.html | 70,171 | 46,264 | 601,186 | 197,892 | 1,366,659 | 860,001 | 37.1% |
| kids-walkers.html | 71,109 | 47,280 | 601,186 | 197,892 | 1,367,597 | 861,017 | 37.0% |
| privacy.html | 95,000 | 45,352 | 595,193 | 195,998 | 1,361,756 | 850,377 | 37.6% |
| product-support.html | 74,777 | 35,007 | 595,193 | 195,998 | 1,341,533 | 840,039 | 37.4% |
| roller-skates.html | 64,043 | 40,108 | 601,186 | 197,892 | 1,360,531 | 853,845 | 37.2% |
| safety-accessories.html | 71,646 | 47,792 | 601,186 | 197,892 | 1,368,134 | 861,529 | 37.0% |
| safety-guidelines.html | 78,659 | 38,889 | 595,193 | 195,998 | 1,345,415 | 843,921 | 37.3% |
| shop.html | 56,599 | 32,606 | 601,186 | 197,892 | 1,353,087 | 846,343 | 37.5% |
| skateboards.html | 65,648 | 41,760 | 601,186 | 197,892 | 1,362,136 | 855,497 | 37.2% |
| terms.html | 77,784 | 37,513 | 595,193 | 195,998 | 1,344,540 | 842,545 | 37.3% |

Readable CSS copied to production: **488,660 → 358,393 bytes**. Readable JS copied to production: **99,933 → 59,894 bytes**.

### Lighthouse

Lighthouse 13.5.0, default mobile form factor and simulated throttling, installed headless Edge, performance category. Before and after use the same settings and no screenshot-only animation controls. These are single-run local measurements; live third-party/network behavior and rotating hero content can vary.

| Page | Performance before → after | LCP seconds before → after | CLS before → after | TBT ms before → after |
|---|---:|---:|---:|---:|
| index.html | 45 → 45 | 39.93 → 20.51 | 0.00692 → 0.00695 | 465.0 → 539.0 |
| shop.html | 56 → 60 | 33.14 → 21.36 | 0.00247 → 0.00245 | 158.0 → 24.0 |
| about.html | 57 → 60 | 20.20 → 14.58 | 0.00248 → 0.00255 | 37.0 → 37.0 |
| contact.html | 57 → 60 | 17.27 → 13.30 | 0.03131 → 0.00209 | 8.5 → 32.0 |
| become-a-dealer.html | 57 → 60 | 28.44 → 24.25 | 0.00260 → 0.00272 | 81.0 → 60.0 |

Home startup experiment: deferring its entire dependency chain measured Performance 40 and TBT 808ms. Restoring the original body-end execution mode measured Performance 45, TBT 539ms and LCP 20.51s. Home therefore retains that original mode; extracted page scripts still defer. Its final aggregate score matches baseline, while LCP improves substantially. TBT remains above the single-run baseline, and retained animation/layout work is documented in the diagnosis.

### Initial per-page audit

Every page had a valid doctype, lang, charset and viewport. The inline submit handler on each page is the newsletter `event.preventDefault()` hook; it remains unchanged. The origins already in use are Google Fonts and its font CDN on every page, plus Elfsight on Home. All linked stylesheets are render-blocking; all original local script tags lacked defer. The detailed JSON lists each original blocking resource and third-party URL.

| Page | Inline style blocks before → after | Inline script blocks before → after | Style attributes retained | Handlers retained | H1 count retained |
|---|---:|---:|---:|---:|---:|
| about.html | 1 → 0 | 1 → 0 | 0 | 1 | 0 |
| become-a-dealer.html | 2 → 0 | 2 → 0 | 0 | 1 | 1 |
| contact.html | 1 → 0 | 1 → 0 | 0 | 1 | 0 |
| index.html | 4 → 0 | 3 → 0 | 3 | 1 | 3 |
| kids-scooters.html | 1 → 0 | 1 → 0 | 15 | 1 | 1 |
| kids-walkers.html | 1 → 0 | 1 → 0 | 12 | 1 | 1 |
| privacy.html | 2 → 0 | 2 → 0 | 0 | 1 | 1 |
| product-support.html | 2 → 0 | 2 → 0 | 0 | 1 | 1 |
| roller-skates.html | 1 → 0 | 1 → 0 | 7 | 1 | 1 |
| safety-accessories.html | 1 → 0 | 1 → 0 | 15 | 1 | 1 |
| safety-guidelines.html | 2 → 0 | 2 → 0 | 0 | 1 | 1 |
| shop.html | 1 → 0 | 1 → 0 | 6 | 1 | 1 |
| skateboards.html | 1 → 0 | 1 → 0 | 5 | 1 | 1 |
| terms.html | 2 → 0 | 2 → 0 | 0 | 1 | 1 |

### All original HTML/CSS/JS file sizes

| Original file | Before bytes | Current readable/existing bytes |
|---|---:|---:|
| `about.html` | 101,531 | 71,856 |
| `become-a-dealer.html` | 76,008 | 33,594 |
| `contact.html` | 57,332 | 32,749 |
| `css/ai.css` | 29,763 | 29,763 |
| `css/all.min.css` | 75,706 | 75,696 |
| `css/animate.css` | 73,589 | 73,589 |
| `css/bootstrap.min.css` | 232,757 | 232,757 |
| `css/catalog.css` | 23,739 | 23,739 |
| `css/custom.css` | 254,734 | 254,625 |
| `css/magnific-popup.css` | 6,951 | 6,951 |
| `css/mousecursor.css` | 6,892 | 6,892 |
| `css/slicknav.min.css` | 2,505 | 2,505 |
| `css/swiper-bundle.min.css` | 18,429 | 18,447 |
| `index.html` | 140,033 | 77,870 |
| `js/ai.js` | 8,464 | 8,464 |
| `js/bootstrap.min.js` | 60,593 | 60,593 |
| `js/catalog.js` | 5,993 | 5,993 |
| `js/function.js` | 13,409 | 13,550 |
| `js/gsap.min.js` | 72,435 | 72,435 |
| `js/jquery-3.7.1.min.js` | 87,532 | 87,532 |
| `js/jquery.counterup.min.js` | 1,057 | 1,057 |
| `js/jquery.magnific-popup.min.js` | 20,735 | 20,735 |
| `js/jquery.mb.YTPlayer.min.js` | 64,021 | 64,021 |
| `js/jquery.slicknav.js` | 21,205 | 21,205 |
| `js/jquery.waypoints.min.js` | 9,028 | 9,028 |
| `js/magiccursor.js` | 3,720 | 3,720 |
| `js/parallaxie.js` | 2,033 | 2,033 |
| `js/ScrollTrigger.min.js` | 43,380 | 43,380 |
| `js/SmoothScroll.js` | 24,489 | 24,489 |
| `js/SplitText.min.js` | 7,247 | 7,247 |
| `js/swiper-bundle.min.js` | 148,425 | 148,425 |
| `js/validator.min.js` | 7,729 | 7,729 |
| `js/wow.min.js` | 8,155 | 8,155 |
| `kids-scooters.html` | 70,171 | 46,264 |
| `kids-walkers.html` | 71,109 | 47,280 |
| `privacy.html` | 95,000 | 45,352 |
| `product-support.html` | 74,777 | 35,007 |
| `roller-skates.html` | 64,043 | 40,108 |
| `safety-accessories.html` | 71,646 | 47,792 |
| `safety-guidelines.html` | 78,659 | 38,889 |
| `shop.html` | 56,599 | 32,606 |
| `skateboards.html` | 65,648 | 41,760 |
| `terms.html` | 77,784 | 37,513 |

### Verification

- SHA-256 hashes match for all **131 image files**, including untracked files present at audit time. The required git image diff prints nothing.
- Verified all 14 pages at 360, 768, 1024 and 1440px, including full-page content and image geometry.
- Screenshot comparison: **51/56 exact pixel matches**. The other 5 captures contain minor image rasterization differences; only 268 pixels across them differ by more than 8/255 in any channel. Text, headings, document dimensions and all image boxes match in every capture; the image-edge differences varied on repeated Chromium captures.
- Snapshot-only controls freeze animations/cursors, complete image decoding and hold live Elfsight content static for reproducibility. Normal-motion interactions and the live widget were checked separately without those controls.
- Separately verified all 56 loading-state cases: the 12 actual preloader cases retain the original approximately 66 × 76px logo; the 44 absent cases remain absent. Home was rechecked at all four widths after retaining its original body-end execution mode.
- Checked menus and current submenu highlighting, hero and company sliders, FAQ, every product gallery/keyboard/dialog/focus interaction, help TOCs/hash/focus, newsletter prevention, contact validation/reset and dealer validation/mailto composition. Test submissions and external email launches were intercepted.
- Local reference checks find no missing CSS/JS files; page loading has no new JavaScript exceptions or missing resources. A baseline malformed footer inline SVG path warning remains unchanged.
- Live Elfsight testing without request blocking confirmed matching mounted feed structure, six images and feed content in both versions, with successful widget/media responses and no new exceptions.
- Served production with the requested `npx serve . --listen 3000 --no-clipboard`; QA also used equivalent immutable-baseline/live static servers for controlled comparison.

## 4. Items left unchanged or reverted because of risk

- Reverted width/height additions for `images/exploreimg1.png` through `exploreimg5.png`: their existing CSS does not reset height, so intrinsic attributes changed rendered image heights. Existing dimensions and appearance are restored; lazy/decoding attributes remain.
- Reverted intrinsic dimension additions for the preloader logo (`images/logofav.png`) on Home, About and Contact because its CSS constrains width without resetting height. Its original loading-state proportions are restored and receive a separate before/after comparison. The other 11 pages have only the favicon reference and retain no loading overlay.
- Reverted excluding the catalog script from Shop after identifying that its in-page Explore link also uses the smooth-scroll/hash/focus handler. Shop retains that dependency; all 432 before/after catalogue anchor checks passed.
- Kept every inline style attribute and inline submit handler. Catalog color variables and layout/JavaScript dependencies make blanket conversion unsafe.
- Kept unused-looking template CSS/vendor rules without proof, overwritten responsive rules, layout-affecting animations and uncertain wrappers. Minification only removes whitespace.
- Kept the original heading structure: Home has one H1 per hero slide (three total), About and Contact have no H1. Changing the elements can affect existing tag-specific styles and animation targets.
- Kept the existing `css/custom.css` FAQ background URL that resolves to missing `css/images/faq.png`; Home overrides it with a valid reference. Changing an existing image URL was forbidden.
- Kept an existing malformed inline footer SVG path rather than alter its appearance. This produces a pre-existing console warning, not a new optimization failure.
- Kept the contact form endpoint `form-process.php`. It is not included in the repository, so static hosting cannot complete real submissions; validation and the intercepted success/reset flow were checked.
- Kept dynamically populated catalog dialog images without source/dimensions until a product is opened. No size can be asserted for their initially empty state.
- Did not preload guessed Google font-file URLs or change third-party widget/account behavior. Only the known local above-fold font was preloaded.

## 5. Additional suggestions requiring separate image permission

- Compress the large raster originals and export appropriately sized responsive variants.
- Convert suitable PNG/JPEG assets to WebP or AVIF and add responsive srcset/sizes.
- Reduce the large hero backgrounds and preload only the first visible hero asset after confirming the final strategy.
- Consider vector alternatives for logos where suitable. None of these image changes were made.

For future CSS/JS edits, regenerate the matching production copy before previewing or deploying, because HTML loads the `.min` files. The source-to-production maps and conservative minifier settings are included in the evidence JSON.

Evidence: `performance-audit.json`; full baseline/after screenshots and raw Lighthouse reports are saved under `C:/Users/User/AppData/Local/Temp/little-goonz-optimize/`.
