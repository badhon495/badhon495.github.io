document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar');

    // Smooth scroll to a section by element ID, accounting for navbar height
    function smoothScrollToElement(targetElement) {
        let navbarHeight = 48;
        if (navbar) navbarHeight = navbar.offsetHeight;

        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navbarHeight - 20;
        const startPosition = window.scrollY;
        const distance = offsetPosition - startPosition;
        const duration = 800;
        let start = null;

        function easeInOutCubic(t) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        requestAnimationFrame(animation);
    }

    // If the page loaded with a hash (e.g. navigated from social.html), scroll smoothly from top
    if (window._pendingScrollHash) {
        const targetId = window._pendingScrollHash;
        delete window._pendingScrollHash;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo(0, 0);
            setTimeout(function () {
                smoothScrollToElement(targetElement);
            }, 50);
        }
    }

    // Get all anchor links that point to sections (except Bio which is handled separately)
    const sectionLinks = document.querySelectorAll('a[href^="#"]:not([href="#Bio"])');

    sectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Aggressively remove focus from the clicked link (Chromium mobile fix)
            this.blur();
            if (document.activeElement === this) {
                document.activeElement.blur();
            }

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                smoothScrollToElement(targetElement);

                // Update URL hash
                history.pushState(null, null, '#' + targetId);

                // Trigger hashchange event for navbar active state
                window.dispatchEvent(new HashChangeEvent('hashchange'));
            }
        });
    });
});
