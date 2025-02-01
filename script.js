let files = [];
let selectedIndex = 0;
let inFileView = false;
let directoryPath = "";
let typingActive = true; // Solo para la terminal
let viewerTypingActive = false; // Solo para el visor de texto
let currentLanguage = 'en'; // Idioma predeterminado: inglés
let data = {}; // Variable global para almacenar los datos del JSON

// Mostrar la terminal al hacer clic en el icono
document.getElementById("terminal-icon").addEventListener("click", () => {
    document.getElementById("terminal-container").style.display = "block";
    loadDirectory();
});

// Cerrar la terminal con el botón de cierre
document.querySelector(".close-btn").addEventListener("click", () => {
    closeTerminal();
});

// Función para cerrar la terminal
function closeTerminal() {
    document.getElementById("terminal-container").style.display = "none";
    inFileView = false; // Asegurarse de salir del visor de texto si está abierto
    typingActive = false;
}

// Cargar archivos desde el JSON
async function loadDirectory() {
    applyInitialLanguage();
    const response = await fetch("data.json");
    data = await response.json();
    files = data.files;
    directoryPath = data.directory;

    const terminal = document.getElementById("terminal-output");
    terminal.innerHTML = "";
    
    typingActive = true; // Activar animación de la terminal
    await typeWriter(terminal, `PS ${directoryPath}>\n\n`);
    typingActive = false;
    
    renderFiles();
    updateIconTexts();
    highlightCurrentLanguage();
}

// Aplicar el idioma inglés de manera inmediata
function applyInitialLanguage() {
    const initialTranslations = {
        terminal: "Terminal",
        spanish: "Spanish",
        english: "English",
    };

    // Actualizar textos de los iconos con las traducciones iniciales
    document.querySelector("#terminal-icon p").textContent = initialTranslations.terminal;
    document.querySelector("#es-icon p").textContent = initialTranslations.spanish;
    document.querySelector("#en-icon p").textContent = initialTranslations.english;

    // Resaltar el idioma actual (inglés)
    document.querySelectorAll(".desktop-icon p").forEach(p => p.classList.remove("active-language"));
    document.querySelector("#en-icon p").classList.add("active-language");
}

// Mostrar archivos en la Terminal con parpadeo en la opción seleccionada
function renderFiles() {
    if (inFileView) return;

    const terminal = document.getElementById("terminal-output");
    terminal.innerHTML = `PS ${directoryPath}>\n\n`;

    files.forEach((file, index) => {
        let prefix = index === selectedIndex ? "> " : "  ";
        let fileClass = index === selectedIndex ? 'terminal-selected' : '';
        terminal.innerHTML += `<span class="${fileClass}">${prefix}${file.date}  ${file.name}</span>\n`;
    });

    // Añadir instrucciones de navegación en el idioma actual
    const translations = data.translations[currentLanguage];
    terminal.innerHTML += `\n${translations.select_file}\n`;
    terminal.innerHTML += `${translations.navigate}\n`;
    terminal.innerHTML += `${translations.press_enter}\n`;
    terminal.innerHTML += `${translations.press_esc}\n\n`;
}

// Simulación de escritura de la Terminal
async function typeWriter(element, text, speed = 50) {
    typingActive = true; // Usar la variable de la terminal
    return new Promise(resolve => {
        let i = 0;
        function type() {
            if (!typingActive) { // Verificar con la variable de la terminal
                resolve();
                return;
            }
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                typingActive = false;
                resolve();
            }
        }
        type();
    });
}

// Navegación en la Terminal
function updateSelection(move) {
    if (typingActive || inFileView) return; // Solo moverse si la Terminal está activa
    selectedIndex = (selectedIndex + move + files.length) % files.length;
    renderFiles();
}

function openFile() {
    if (typingActive || inFileView) return;

    viewerTypingActive = true; // Reiniciar el estado de la animación
    inFileView = true;
    const viewer = document.getElementById("text-viewer");
    
    viewer.innerHTML = ""; // Limpiar contenido previo
    viewer.style.display = "block";
    
    typeWriter(viewer, files[selectedIndex].content[currentLanguage], 30);
}

// Cerrar el visor y restaurar la navegación
function closeFile() {
    if (!inFileView) return;
    
    viewerTypingActive = false; // Detener la animación
    inFileView = false;
    document.getElementById("text-viewer").style.display = "none";
    renderFiles();
}

function changeLanguage(lang) {
    currentLanguage = lang;
    updateIconTexts();
    highlightCurrentLanguage();
    renderFiles();

    if (inFileView) {
        viewerTypingActive = false; // Detener animación actual
        setTimeout(() => {
            const viewer = document.getElementById("text-viewer");
            viewer.innerHTML = ""; // Limpiar sin ocultar
            viewerTypingActive = true;
            typeWriter(viewer, files[selectedIndex].content[currentLanguage], 30);
        }, 10);
    }
}

// Función para actualizar el contenido del visor de texto
function updateTextViewer() {
    const selectedFile = files[selectedIndex];
    const viewer = document.getElementById("text-viewer");
    viewer.innerHTML = ""; // Limpiar contenido previo
    typeWriter(viewer, selectedFile.content[currentLanguage], 30); // Escribir en el nuevo idioma
}

// Actualizar los textos de los iconos
function updateIconTexts() {
    const translations = data.translations[currentLanguage];

    // Actualizar textos de los iconos
    document.querySelector("#terminal-icon p").textContent = translations.terminal;
    document.querySelector("#es-icon p").textContent = translations.spanish;
    document.querySelector("#en-icon p").textContent = translations.english;
}

// Resaltar el idioma actual en amarillo
function highlightCurrentLanguage() {
    document.querySelectorAll(".desktop-icon p").forEach(p => p.classList.remove("active-language"));
    if (currentLanguage === 'es') {
        document.querySelector("#es-icon p").classList.add("active-language");
    } else if (currentLanguage === 'en') {
        document.querySelector("#en-icon p").classList.add("active-language");
    }
}

// Teclas de navegación
document.addEventListener("keydown", (event) => {
    if (typingActive) return; // Evita interacciones mientras escribe

    if (!inFileView) { // Solo permite navegación si el visor de texto NO está abierto
        if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
            updateSelection(-1); // Moverse hacia arriba
        } else if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
            updateSelection(1); // Moverse hacia abajo
        } else if (event.key === "Enter" || event.key === " ") {
            openFile(); // Abrir archivo seleccionado
        }
    }

    // Cerrar la terminal o el visor de texto con ESC
    if (event.key === "Escape") {
        if (inFileView) {
            closeFile(); // Cerrar el visor de texto si está abierto
        } else {
            closeTerminal(); // Cerrar la terminal si no hay visor abierto
        }
    }
});

// Event listeners para cambiar el idioma
document.getElementById("es-icon").addEventListener("click", () => changeLanguage('es'));
document.getElementById("en-icon").addEventListener("click", () => changeLanguage('en'));

// Cargar el directorio al iniciar la Terminal
document.addEventListener("DOMContentLoaded", loadDirectory);

// Limpiar cookies (opcional)
document.cookie.split(";").forEach((c) => {
    document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});