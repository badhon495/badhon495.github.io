document.addEventListener('DOMContentLoaded', function() {
    const lastModified = new Date(document.lastModified);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('last-modified').textContent = 'Last Modified: ' + lastModified.toLocaleDateString('en-US', options);
});