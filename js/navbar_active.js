document.addEventListener('DOMContentLoaded', function () {
    // Get all section headings with IDs and navbar links
    const sectionIds = ['Bio', 'Education', 'Project', 'Experience', 'Research', 'Technical_Skill', 'Miscellaneous'];
    const sections = [];
    
    // Collect all elements with section IDs (both tables and h2s)
    sectionIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            sections.push(element);
        }
    });
    
    const navLinks = document.querySelectorAll('.navbar a[href^="#"], .mobile-menu a[href^="#"]');

    // Function to remove active class from all links
    function removeAllActive() {
        navLinks.forEach(link => {
            link.classList.remove('active-section');
        });
    }

    // Function to add active class to matching links
    function setActiveLink(sectionId) {
        removeAllActive();
        navLinks.forEach(link => {
            if (link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('active-section');
            }
        });
    }

    // Track current active section
    let currentActive = 'Bio';
    
    // Intersection Observer to detect which section is in view
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -60% 0px', // Trigger when section header crosses top of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentActive = entry.target.id;
                setActiveLink(entry.target.id);
            }
        });
    }, observerOptions);
    
    // Add scroll listener to handle top of page
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            // If at the top of the page (within 50px), always show Bio as active
            if (window.scrollY < 50) {
                setActiveLink('Bio');
            } else if (currentActive) {
                setActiveLink(currentActive);
            }
        }, 50);
    });

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Handle hash changes (when clicking links)
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            setActiveLink(hash);
        }
    });

    // Set initial active link based on current hash or scroll position
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        setActiveLink(hash);
    } else if (sections.length > 0) {
        // Set Bio as active by default
        setActiveLink('Bio');
    }
});
