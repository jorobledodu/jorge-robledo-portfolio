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

// ✅ Cargar archivos desde el JSON
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

// ✅ Mostrar archivos en la Terminal con parpadeo en la opción seleccionada
function renderFiles() {
  if (inFileView) return;

  const terminal = document.getElementById("terminal-output");
  terminal.innerHTML = `PS ${directoryPath}>\n\n`;

  files.forEach((file, index) => {
    let prefix = index === selectedIndex ? "> " : "  ";
    let fileClass = index === selectedIndex ? 'terminal-selected' : '';
    terminal.innerHTML += `<span class="${fileClass}">${prefix}${file.date}  ${file.name}</span>\n`;
  });
}

// ✅ Simulación de escritura de la Terminal
async function typeWriter(element, text, speed = 50) {
  typingActive = true;
  return new Promise(resolve => {
    let i = 0;
    function type() {
      if (!typingActive) return resolve(); // 🔹 Detener si la Terminal cambia de estado

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

// ✅ Navegación en la Terminal
function updateSelection(move) {
  if (typingActive || inFileView) return; // 🔹 Solo moverse si la Terminal está activa
  selectedIndex = (selectedIndex + move + files.length) % files.length;
  renderFiles();
}

// ✅ Abrir el visor de texto correctamente
function openFile() {
  if (typingActive || inFileView) return; // 🔹 Evita abrir si está escribiendo o ya está abierto
  inFileView = true;
  typingActive = false;

  const selectedFile = files[selectedIndex];
  const viewer = document.getElementById("text-viewer");

  viewer.innerHTML = ""; // 🔹 Resetear contenido antes de escribir
  viewer.style.display = "block"; // 🔹 Asegura que el visor se muestre correctamente

  typeWriter(viewer, selectedFile.content, 30);
}

// ✅ Cerrar el visor y restaurar la navegación
function closeFile() {
  if (!inFileView) return;
  inFileView = false; // 🔹 Restaurar navegación en la Terminal
  typingActive = false;

  document.getElementById("text-viewer").style.display = "none"; // 🔹 Oculta la ventana
  renderFiles(); // 🔹 Volver a mostrar la lista en la Terminal
}

// ✅ Teclas de navegación
document.addEventListener("keydown", (event) => {
  if (typingActive) return; // 🔹 Evita interacciones mientras escribe

  if (!inFileView) { // 🔹 Solo permite navegación si el visor de texto NO está abierto
    if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
      updateSelection(-1);
    } else if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
      updateSelection(1);
    } else if (event.key === "Enter" || event.key === " ") {
      openFile();
    }
  }

  if (event.key === "Escape") {
    closeFile();
  }
});

// ✅ Cargar el directorio al iniciar la Terminal
document.addEventListener("DOMContentLoaded", loadDirectory);