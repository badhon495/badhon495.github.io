let lastScrollTop = 0;
let scrollThreshold = 5; // Minimum scroll distance to trigger hide/show
let isScrolling;

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Clear timeout if user is still scrolling
    clearTimeout(isScrolling);
    
    // Prevent hide/show on very small scroll movements
    if (Math.abs(currentScroll - lastScrollTop) < scrollThreshold) {
        return;
    }
    
    // Don't hide navbar at the very top of the page
    if (currentScroll <= 50) {
        navbar.classList.remove('navbar-hidden');
    } 
    // Scrolling down
    else if (currentScroll > lastScrollTop) {
        navbar.classList.add('navbar-hidden');
    } 
    // Scrolling up
    else {
        navbar.classList.remove('navbar-hidden');
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    
    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function() {
        // Optional: You can add additional behavior when scrolling stops
    }, 150);
}, false);
