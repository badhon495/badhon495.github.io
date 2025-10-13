const toggle = document.getElementById('toggleDark');
const html = document.documentElement;

// Check if the browser prefers dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.classList.add('dark-mode');
    if (toggle) {
        toggle.classList.remove('bi-brightness-high-fill');
        toggle.classList.add('bi-moon');
    }
} else {
    html.classList.remove('dark-mode');
    if (toggle) {
        toggle.classList.remove('bi-moon');
        toggle.classList.add('bi-brightness-high-fill');
    }
}

if (toggle) {
    toggle.addEventListener('click', function(){
        if(html.classList.contains('dark-mode')){
            html.classList.remove('dark-mode');
            toggle.classList.remove('bi-moon');
            toggle.classList.add('bi-brightness-high-fill');
        }else{
            html.classList.add('dark-mode');
            toggle.classList.remove('bi-brightness-high-fill');
            toggle.classList.add('bi-moon');
        }
    });
}