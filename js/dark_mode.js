const toggle = document.getElementById('toggleDark');
const body = document.querySelector('body');

// Check if the browser prefers dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark-mode');
    toggle.classList.remove('bi-brightness-high-fill');
    toggle.classList.add('bi-moon');
} else {
    body.classList.remove('dark-mode');
    toggle.classList.remove('bi-moon');
    toggle.classList.add('bi-brightness-high-fill');
}

toggle.addEventListener('click', function(){
    if(body.classList.contains('dark-mode')){
        body.classList.remove('dark-mode');
        toggle.classList.remove('bi-moon');
        toggle.classList.add('bi-brightness-high-fill');
    }else{
        body.classList.add('dark-mode');
        toggle.classList.remove('bi-brightness-high-fill');
        toggle.classList.add('bi-moon');
    }
});