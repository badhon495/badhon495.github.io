const toggle = document.getElementById('toggleDark');
const body = document.querySelector('body');

// Check if the browser prefers dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.style.background = '#1D2023';
    body.style.color = 'white';
    toggle.classList.remove('bi-brightness-high-fill');
    toggle.classList.add('bi-moon');
} else {
    body.style.background = 'white';
    body.style.color = 'black';
    toggle.classList.remove('bi-moon');
    toggle.classList.add('bi-brightness-high-fill');
}

toggle.addEventListener('click', function(){
    if(body.style.background == 'white'){
        body.style.background = '#1D2023';
        body.style.color = 'white';
        body.style.transition = '2s';
        toggle.classList.remove('bi-brightness-high-fill');
        toggle.classList.add('bi-moon');
    }else{
        body.style.background = 'white';
        body.style.color = 'black';
        body.style.transition = '2s';
        toggle.classList.remove('bi-moon');
        toggle.classList.add('bi-brightness-high-fill');
    }
});