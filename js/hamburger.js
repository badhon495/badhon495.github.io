document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                
                // Remove focus and blur to prevent persistent highlighting on mobile
                this.blur();
                
                // On touch devices, prevent the hover state from sticking
                if ('ontouchstart' in window) {
                    e.currentTarget.style.background = 'transparent';
                    setTimeout(() => {
                        e.currentTarget.style.background = '';
                    }, 300);
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!hamburger.contains(event.target) && !mobileMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
        
        // Handle viewport changes (desktop mode toggle)
        let viewportWidth = window.innerWidth;
        window.addEventListener('resize', function() {
            const newWidth = window.innerWidth;
            
            // If viewport significantly changed (desktop mode toggled), close mobile menu
            if (Math.abs(newWidth - viewportWidth) > 100) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                viewportWidth = newWidth;
            }
        });
    }
});
