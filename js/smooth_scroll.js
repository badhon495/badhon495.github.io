document.addEventListener('DOMContentLoaded', function () {
    // Get all anchor links that point to sections (except Bio which is handled separately)
    const sectionLinks = document.querySelectorAll('a[href^="#"]:not([href="#Bio"])');
    const navbar = document.querySelector('.navbar');
    
    // Cache navbar height to avoid forced reflow - read once at load
    let navbarHeight = 48; // Default fallback
    if (navbar) {
        // Read layout property only once during initialization
        navbarHeight = navbar.offsetHeight;
    }
    
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
                // Use cached navbar height to avoid forced reflow
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - navbarHeight - 20;
                const startPosition = window.scrollY;
                const distance = offsetPosition - startPosition;
                const duration = 800; // Increased duration for smoother animation
                let start = null;
                
                // Easing function for smoother animation (ease-in-out)
                function easeInOutCubic(t) {
                    return t < 0.5 
                        ? 4 * t * t * t 
                        : 1 - Math.pow(-2 * t + 2, 3) / 2;
                }
                
                // Animation function
                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const progress = Math.min(timeElapsed / duration, 1);
                    const ease = easeInOutCubic(progress);
                    
                    window.scrollTo(0, startPosition + distance * ease);
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
                
                requestAnimationFrame(animation);
                
                // Update URL hash
                history.pushState(null, null, '#' + targetId);
                
                // Trigger hashchange event for navbar active state
                window.dispatchEvent(new HashChangeEvent('hashchange'));
            }
        });
    });
});
