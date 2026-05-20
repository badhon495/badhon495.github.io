document.addEventListener('DOMContentLoaded', function () {
    var targetId = window._pendingScrollHash;
    if (!targetId) return;

    var targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    var navbar = document.querySelector('.navbar');
    var navbarHeight = navbar ? navbar.offsetHeight : 48;

    // Start at top
    window.scrollTo(0, 0);

    // Restore hash in URL without triggering jump
    history.replaceState(null, '', '#' + targetId);

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // rAF after paint so layout is settled
    requestAnimationFrame(function () {
        var targetPos = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
        var duration = 800;
        var startTime = null;

        function animate(currentTime) {
            if (startTime === null) startTime = currentTime;
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            window.scrollTo(0, targetPos * easeInOutCubic(progress));
            if (elapsed < duration) requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    });
});
