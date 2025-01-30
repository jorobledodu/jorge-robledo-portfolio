let files = [];
let selectedIndex = 0;
let inFileView = false;
let directoryPath = "";
let typingActive = true;
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
    const response = await fetch("data.json");
    data = await response.json(); // Almacenar los datos en la variable global
    files = data.files;
    directoryPath = data.directory;

    const terminal = document.getElementById("terminal-output");
    terminal.innerHTML = "";

    await typeWriter(terminal, `PS ${directoryPath}>\n\n`);
    typingActive = false;
    renderFiles();
    updateIconTexts(); // Actualizar los textos de los iconos al cargar la página
    highlightCurrentLanguage(); // Resaltar el idioma actual al cargar la página
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
    terminal.innerHTML += `${translations.press_enter}\n`;
    terminal.innerHTML += `${translations.press_esc}\n\n`;
    terminal.innerHTML += `Navigation:\n`;
    terminal.innerHTML += `Use arrows (W/S ↑/↓) to move.\n`;
    terminal.innerHTML += `Space/Enter to open the file.\n`;
    terminal.innerHTML += `ESC to go back.\n`;
}

// Simulación de escritura de la Terminal
async function typeWriter(element, text, speed = 50) {
    typingActive = true;
    return new Promise(resolve => {
        let i = 0;
        function type() {
            if (!typingActive) return resolve(); // Detener si la Terminal cambia de estado

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

// Abrir el visor de texto correctamente
function openFile() {
    if (typingActive || inFileView) return; // Evita abrir si está escribiendo o ya está abierto
    inFileView = true;
    typingActive = false;

    const selectedFile = files[selectedIndex];
    const viewer = document.getElementById("text-viewer");

    viewer.innerHTML = ""; // Resetear contenido antes de escribir
    viewer.style.display = "block"; // Asegura que el visor se muestre correctamente

    typeWriter(viewer, selectedFile.content[currentLanguage], 30);
}

// Cerrar el visor y restaurar la navegación
function closeFile() {
    if (!inFileView) return;
    inFileView = false; // Restaurar navegación en la Terminal
    typingActive = false;

    document.getElementById("text-viewer").style.display = "none"; // Oculta la ventana
    renderFiles(); // Volver a mostrar la lista en la Terminal
}

// Cambiar idioma
function changeLanguage(lang) {
    currentLanguage = lang;
    updateIconTexts(); // Actualizar los textos de los iconos
    highlightCurrentLanguage(); // Resaltar el idioma actual
    renderFiles(); // Actualizar la terminal con el nuevo idioma
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