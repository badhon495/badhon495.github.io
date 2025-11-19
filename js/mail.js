document.addEventListener('DOMContentLoaded', function () {
    const popupOverlay = document.querySelector('.popup-overlay');
    const popupClose = document.querySelector('.popup-close');
    const anonymousMessageLink = document.querySelector('#anonymousMessageLink');
    const anonymousMessageFooterLink = document.querySelector('#anonymousMessageFooterLink');
    const form = document.querySelector('.popup-content form');
    const submitButton = form.querySelector('input[type="submit"]');

    // Handle click for profile section link
    if (anonymousMessageLink) {
        anonymousMessageLink.addEventListener('click', function (event) {
            event.preventDefault();
            popupOverlay.style.display = 'flex';
        });
    }

    // Handle click for footer link
    if (anonymousMessageFooterLink) {
        anonymousMessageFooterLink.addEventListener('click', function (event) {
            event.preventDefault();
            popupOverlay.style.display = 'flex';
        });
    }

    popupClose.addEventListener('click', function () {
        popupOverlay.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === popupOverlay) {
            popupOverlay.style.display = 'none';
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        fetch('https://formsubmit.co/ajax/badhon495@gmail.com', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                form.reset();
                submitButton.value = 'Delivered';
                submitButton.disabled = true;
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
