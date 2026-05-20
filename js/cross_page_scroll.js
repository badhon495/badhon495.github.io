document.addEventListener('DOMContentLoaded', function () {
    var targetId = window._pendingScrollHash;
    if (!targetId) return;

    var targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    var navbar = document.querySelector('.navbar');
    var navbarHeight = navbar ? navbar.offsetHeight : 48;

    window.scrollTo(0, 0);
    history.replaceState(null, '', '#' + targetId);

    requestAnimationFrame(function () {
        var top = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
        window.scrollTo({ top: top, behavior: 'smooth' });
    });
});
