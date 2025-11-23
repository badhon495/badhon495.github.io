document.addEventListener('DOMContentLoaded', function () {
    // Get all section headings with IDs and navbar links
    const sectionIds = ['Bio', 'Education', 'Project', 'Experience', 'Research', 'Technical_Skill', 'Miscellaneous'];
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

    // Track which sections are currently visible (based on bottom indicators)
    const visibleSections = new Set();
    
    // Track which section headers are visible
    const visibleHeaders = new Set();
    
    // Function to determine the active section
    function determineActiveSection() {
        // If at the very top of the page, always show Bio
        if (window.scrollY < 50) {
            setActiveLink('Bio');
            return;
        }
        
        // Prioritize visible headers (the section we're currently viewing)
        if (visibleHeaders.size > 0) {
            // Get the LAST visible header (closest to current scroll position)
            const visibleHeadersList = sectionIds.filter(id => {
                // For Bio, check Bio-header instead
                if (id === 'Bio') {
                    return visibleHeaders.has('Bio-header');
                }
                return visibleHeaders.has(id);
            });
            const lastVisibleHeader = visibleHeadersList[visibleHeadersList.length - 1];
            if (lastVisibleHeader) {
                setActiveLink(lastVisibleHeader);
                return;
            }
        }
        
        // If no headers visible but sections are, use the last visible section
        if (visibleSections.size > 0) {
            const lastVisibleSection = sectionIds.filter(id => visibleSections.has(id)).pop();
            if (lastVisibleSection) {
                setActiveLink(lastVisibleSection);
                return;
            }
        }
    }

    // Observer for bottom indicators (tells us which sections are in viewport)
    const bottomIndicatorObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const sectionId = entry.target.dataset.section;
            if (entry.isIntersecting) {
                visibleSections.add(sectionId);
            } else {
                visibleSections.delete(sectionId);
            }
        });
        determineActiveSection();
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0
    });

    // Observer for section headers (h2 elements)
    const headerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const sectionId = entry.target.id;
            if (entry.isIntersecting) {
                visibleHeaders.add(sectionId);
            } else {
                visibleHeaders.delete(sectionId);
            }
        });
        determineActiveSection();
    }, {
        root: null,
        rootMargin: '-60px 0px -80% 0px', // More strict: only visible in top 20% of viewport
        threshold: 0
    });

    // Observe all bottom indicators
    const bottomIndicators = document.querySelectorAll('.section-bottom-indicator');
    bottomIndicators.forEach(indicator => {
        bottomIndicatorObserver.observe(indicator);
    });

    // Observe all section headers
    // For Bio, observe the name element instead of the entire table
    const bioHeader = document.getElementById('Bio-header');
    if (bioHeader) {
        headerObserver.observe(bioHeader);
    }
    
    // Observe h2 headers for other sections
    sectionIds.slice(1).forEach(id => {
        const header = document.getElementById(id);
        if (header) {
            headerObserver.observe(header);
        }
    });
    
    // Add scroll listener for top of page detection
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(determineActiveSection, 50);
    });

    // Handle hash changes (when clicking links)
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            setActiveLink(hash);
        }
    });

    // Add click event listeners to all nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Manually set active state for the clicked link
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                console.log('Clicked section:', sectionId, 'Setting active...');
                setActiveLink(sectionId);
                
                // Verify the class was added
                setTimeout(() => {
                    const activeLinks = document.querySelectorAll('.active-section');
                    console.log('Active links after click:', activeLinks.length, Array.from(activeLinks).map(l => l.textContent));
                }, 50);
            }
            
            // Blur after a short delay to prevent persistent highlighting on mobile
            setTimeout(() => {
                this.blur();
                if (document.activeElement === this) {
                    document.activeElement.blur();
                }
            }, 100);
        });
        
        // Also handle touchend for better mobile support
        link.addEventListener('touchend', function() {
            setTimeout(() => {
                this.blur();
                if (document.activeElement === this) {
                    document.activeElement.blur();
                }
            }, 100);
        }, { passive: true });
    });

    // Set initial active link based on current hash or scroll position
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        setActiveLink(hash);
    } else {
        // Set Bio as active by default
        setActiveLink('Bio');
    }
});
