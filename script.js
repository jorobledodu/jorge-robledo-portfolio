// Función para cambiar el idioma del contenido de la página
function changeLanguage(lang) {
    loadLanguage(lang);  // Cargar el archivo JSON según el idioma
    document.querySelector('.dropdown-btn').innerText = (lang === 'es') ? 'Español' : 'English';
}

// Función para cargar el archivo JSON del idioma y actualizar los textos
function loadLanguage(lang) {
    fetch(`${lang}.json`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('title').innerText = data.title;
            document.getElementById('about-title').innerText = data.about.title;
            document.getElementById('about-description').innerText = data.about.description;
            document.getElementById('projects-title').innerText = data.projects.title;
            document.getElementById('projects-description').innerText = data.projects.description;
            document.getElementById('contact-title').innerText = data.contact.title;
            document.getElementById('contact-description').innerText = data.contact.description;
        })
        .catch(error => console.error('Error al cargar el archivo de idioma:', error));
}

// Función para alternar el menú hamburguesa
function toggleMenu() {
    var menu = document.getElementById("nav-menu");
    var btn = document.getElementById("menu-btn");

    var isOpen = menu.classList.toggle("show");
    btn.classList.toggle("open"); // Aplica la clase 'open' al botón hamburguesa para la transformación
}

// Función para cerrar el menú
function closeMenu() {
    var menu = document.getElementById("nav-menu");
    var btn = document.getElementById("menu-btn");

    menu.classList.remove("show");
    btn.classList.remove("open"); // Reversa la animación al cerrar
}

// Función para cerrar el menú al hacer clic fuera del área del menú o del botón
document.addEventListener('click', function(event) {
    var isClickInsideMenu = document.getElementById('nav-menu').contains(event.target);
    var isClickInsideBtn = document.getElementById('menu-btn').contains(event.target);

    if (!isClickInsideMenu && !isClickInsideBtn) {
        closeMenu(); // Cierra el menú si se hace clic fuera
    }
});

// Cargar el idioma predeterminado al iniciar la página según el idioma del navegador
document.addEventListener('DOMContentLoaded', function() {
    var userLang = navigator.language || navigator.userLanguage;
    loadLanguage(userLang.startsWith('es') ? 'es' : 'en');
});
