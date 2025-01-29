let files = [];
let selectedIndex = 0;
let inFileView = false;
let directoryPath = "";
let typingActive = true;

// ✅ Mostrar la terminal al hacer clic en el icono
document.getElementById("terminal-icon").addEventListener("click", () => {
    document.getElementById("terminal-container").style.display = "block";
    loadDirectory();
});

// ✅ Cerrar la terminal con el botón de cierre
document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById("terminal-container").style.display = "none";
});

async function loadDirectory() {
    const response = await fetch("data.json");
    const data = await response.json();
    files = data.files;
    directoryPath = data.directory;

    const terminal = document.getElementById("terminal-output");
    terminal.innerHTML = "";

    await typeWriter(terminal, `PS ${directoryPath}>\n\n`);
    typingActive = false;
    renderFiles();
}

function renderFiles() {
    if (inFileView) return;

    const terminal = document.getElementById("terminal-output");
    terminal.innerHTML = `PS ${directoryPath}>\n\n`;

    files.forEach((file, index) => {
        let prefix = index === selectedIndex ? "> " : "  ";
        terminal.innerHTML += `${prefix}${file.date}  ${file.name}\n`;
    });
}

async function typeWriter(element, text, speed = 50) {
    typingActive = true;
    return new Promise(resolve => {
        let i = 0;
        function type() {
            if (!typingActive) return resolve();

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

function openFile() {
    if (typingActive || inFileView) return;
    inFileView = true;
    typingActive = false;

    const selectedFile = files[selectedIndex];
    const viewer = document.getElementById("text-viewer");

    viewer.innerHTML = "";
    viewer.style.display = "block"; // ✅ Asegura que se muestre correctamente

    typeWriter(viewer, selectedFile.content, 30);
}

function closeFile() {
    if (!inFileView) return;
    inFileView = false;
    typingActive = false;

    document.getElementById("text-viewer").style.display = "none"; // ✅ Oculta la ventana
    renderFiles();
}

// ✅ Teclas de navegación
document.addEventListener("keydown", (event) => {
    if (typingActive) return;

    if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
        updateSelection(-1);
    } else if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
        updateSelection(1);
    } else if (event.key === "Enter" || event.key === " ") {
        openFile();
    } else if (event.key === "Escape") {
        closeFile();
    }
});

document.addEventListener("DOMContentLoaded", loadDirectory);