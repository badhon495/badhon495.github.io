document.addEventListener('DOMContentLoaded', function () {
    const sectionLinks = document.querySelectorAll('a[href^="#"]:not([href="#Bio"])');
    const navbar = document.querySelector('.navbar');

    let navbarHeight = 48;
    if (navbar) {
        navbarHeight = navbar.offsetHeight;
    }

    sectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            this.blur();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const top = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
                window.scrollTo({ top, behavior: 'smooth' });

                history.pushState(null, null, '#' + targetId);
                window.dispatchEvent(new HashChangeEvent('hashchange'));
            }
        });
    });
});
