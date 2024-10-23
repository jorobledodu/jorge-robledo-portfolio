// Función para alternar la visibilidad del dropdown al hacer clic
function toggleDropdown() {
    const dropdown = document.querySelector('.custom-dropdown');
    dropdown.classList.toggle('show'); // Alterna la clase 'show' para mostrar u ocultar el contenido
}

// Función para cambiar el idioma del contenido de la página y del dropdown
function changeLanguage(lang) {
    const currentLang = document.getElementById('current-language-btn').getAttribute('data-lang');

    // Si ya está en el idioma seleccionado, no hacer nada
    if (currentLang === lang) {
        closeDropdown(); // Cerrar el dropdown si se hace clic en el mismo idioma
        return;
    }

    // Cambiar el contenido de la página al nuevo idioma
    loadLanguage(lang);

    // Actualizar el valor del atributo data-lang del botón principal
    document.getElementById('current-language-btn').setAttribute('data-lang', lang); // Actualiza el atributo 'data-lang'
    
    closeDropdown(); // Cierra el dropdown después de seleccionar
}

// Función para cargar el archivo JSON del idioma y actualizar los textos
function loadLanguage(lang) {
    fetch(`${lang}.json`)
        .then(response => response.json())
        .then(data => {
            // Actualizar los textos principales de la página
            document.getElementById('title').innerText = data.title;
            document.getElementById('about-title').innerText = data.about.title;
            document.getElementById('about-description').innerText = data.about.description;
            document.getElementById('projects-title').innerText = data.projects.title;
            document.getElementById('projects-description').innerText = data.projects.description;
            document.getElementById('contact-title').innerText = data.contact.title;
            document.getElementById('contact-description').innerText = data.contact.description;

            // Actualizar el botón principal con el idioma actual
            document.getElementById('current-language-btn').innerText = lang === 'es' ? 'Español' : 'English'; // Botón principal muestra el idioma actual

            // Mostrar solo el idioma alternativo en el dropdown
            const alternateLanguage = lang === 'es' ? 'en' : 'es';
            document.getElementById('lang-option1').innerText = alternateLanguage === 'es' ? 'Español' : 'English'; // Mostrar el idioma alternativo
            document.getElementById('lang-option1').setAttribute('onclick', `changeLanguage('${alternateLanguage}')`); // Cambiar al idioma alternativo
        })
        .catch(error => console.error('Error al cargar el archivo de idioma:', error));
}

// Función para cerrar el dropdown
function closeDropdown() {
    const dropdown = document.querySelector('.custom-dropdown');
    dropdown.classList.remove('show'); // Cierra el dropdown
}

// Cargar el idioma predeterminado al iniciar la página según el idioma del navegador
document.addEventListener('DOMContentLoaded', function() {
    var userLang = navigator.language || navigator.userLanguage;
    
    // Verifica si el idioma del navegador es español o inglés
    const initialLang = userLang.startsWith('es') ? 'es' : 'en';
    
    // Carga el idioma detectado automáticamente al iniciar la página
    loadLanguage(initialLang);

    // Actualiza el valor de 'data-lang' y el texto del botón principal para reflejar el idioma activo
    document.getElementById('current-language-btn').setAttribute('data-lang', initialLang);
    document.getElementById('current-language-btn').innerText = initialLang === 'es' ? 'Español' : 'English';
});

// Cerrar el dropdown si se hace clic fuera de él
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.custom-dropdown');
    const isClickInside = dropdown.contains(event.target);
    
    if (!isClickInside) {
        closeDropdown(); // Cierra el dropdown si se hace clic fuera
    }
});

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
