document.addEventListener('DOMContentLoaded', function () {
    var targetId = window._pendingScrollHash;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function revealPage() {
        if (!targetId) {
            document.documentElement.style.visibility = 'visible';
            return;
        }

        var targetElement = document.getElementById(targetId);
        if (!targetElement) {
            document.documentElement.style.visibility = 'visible';
            return;
        }

        var navbar = document.querySelector('.navbar');
        var navbarHeight = navbar ? navbar.offsetHeight : 48;

        history.replaceState(null, '', '#' + targetId);

        // One rAF lets the browser finish any pending paint/scroll before we take over.
        requestAnimationFrame(function () {
            window.scrollTo(0, 0);
            // Reveal the page at y=0 so user sees top-of-page before animation starts.
            document.documentElement.style.visibility = 'visible';

            var targetPos = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
            targetPos = Math.max(0, targetPos);

            var duration = 800;
            var startTime = null;

            function animate(currentTime) {
                if (startTime === null) startTime = currentTime;
                var elapsed = currentTime - startTime;
                var progress = Math.min(elapsed / duration, 1);
                // Drives scroll on every frame — immune to browser fragment-scroll interruption.
                window.scrollTo(0, targetPos * easeInOutCubic(progress));
                if (elapsed < duration) requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);
        });
    }

    function showPlaceholder(img) {
        var placeholder = document.createElement('div');
        placeholder.setAttribute('aria-label', 'Profile Picture');
        placeholder.style.cssText = [
            'width:300px',
            'max-width:100%',
            'height:300px',
            'border-radius:50%',
            'display:flex',
            'align-items:center',
            'justify-content:center',
            'background:rgba(128,128,128,0.15)',
            'border:2px dashed rgba(128,128,128,0.4)',
            'font-size:1em',
            'color:#888',
            'font-style:italic',
            'box-sizing:border-box',
            'margin:0 auto'
        ].join(';');
        placeholder.textContent = 'Profile Picture';
        img.parentElement.replaceWith(placeholder);
    }

    // Gate: only reveal the page once the profile picture has loaded.
    // Falls back to placeholder + reveal after 5 seconds if image never loads.
    var profileImg = document.querySelector('img.hoverZoomLink');

    if (!profileImg) {
        revealPage();
        return;
    }

    if (profileImg.complete) {
        if (profileImg.naturalWidth > 0) {
            revealPage();
        } else {
            showPlaceholder(profileImg);
            revealPage();
        }
        return;
    }

    var done = false;
    var timeoutId = null;

    function onLoad() {
        if (done) return;
        done = true;
        clearTimeout(timeoutId);
        revealPage();
    }

    function onError() {
        if (done) return;
        done = true;
        clearTimeout(timeoutId);
        showPlaceholder(profileImg);
        revealPage();
    }

    function onTimeout() {
        if (done) return;
        done = true;
        showPlaceholder(profileImg);
        revealPage();
    }

    profileImg.addEventListener('load', onLoad);
    profileImg.addEventListener('error', onError);
    timeoutId = setTimeout(onTimeout, 5000);
});
