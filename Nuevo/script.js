const translations = {
    'es': {
        welcome: [
            'Portfolio de Desarrollo de Videojuegos'
        ]
    },
    'en': {
        welcome: [
            'Game Development Portfolio'
        ]
    }
};

let currentLanguage = 'es';
const output = document.getElementById('terminal-output'); // Aunque no se usa directamente, podría ser útil mantenerlo por ahora
const commandLine = document.getElementById('command-line'); //  Ídem, aunque ya no hay entrada de comandos
const commandPrompt = document.getElementById('command-prompt'); // Ídem
let welcomeMessage = translations[currentLanguage].welcome;


function changeLanguage(lang) {
    currentLanguage = lang;
    welcomeMessage = translations[currentLanguage].welcome;
    // No necesitamos escribir mensaje de bienvenida en la terminal en esta versión
    // output.innerHTML = '';
    // writeToTerminal(welcomeMessage);
    // commandPrompt.textContent = welcomeMessage[0];
}

function mostrarImagen(nombreImagen) {
    const modal = document.createElement('div');
    modal.id = 'imagen-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const imagenElement = document.createElement('img');
    imagenElement.src = nombreImagen;
    imagenElement.style.maxWidth = '80%';
    imagenElement.style.maxHeight = '80%';
    imagenElement.style.boxShadow = '0 0 10px #00ff41';

    modal.appendChild(imagenElement);
    document.body.appendChild(modal);

    modal.addEventListener('click', function () {
        document.body.removeChild(modal);
    });
}

function mostrarVideo(nombreVideo) {
    const modal = document.createElement('div');
    modal.id = 'video-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const videoElement = document.createElement('video');
    videoElement.src = nombreVideo;
    videoElement.controls = true;
    videoElement.style.maxWidth = '80%';
    videoElement.style.maxHeight = '80%';
    videoElement.style.boxShadow = '0 0 10px #00ff41';

    modal.appendChild(videoElement);
    document.body.appendChild(modal);

    modal.addEventListener('click', function () {
        document.body.removeChild(modal);
    });
}

function abrirPDF(nombrePDF) {
    window.open(nombrePDF, '_blank');
}

function ejecutarWebGL(rutaJuegoHTML) {
    const modal = document.createElement('div');
    modal.id = 'webgl-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const iframeElement = document.createElement('iframe');
    iframeElement.src = rutaJuegoHTML;
    iframeElement.width = '800';
    iframeElement.height = '600';
    iframeElement.style.border = 'none';
    iframeElement.style.boxShadow = '0 0 10px #00ff41';

    modal.appendChild(iframeElement);
    document.body.appendChild(modal);

    modal.addEventListener('click', function () {
        document.body.removeChild(modal);
    });
}

function mostrarTexto(nombreTexto) {
    fetch(nombreTexto)
        .then(response => response.text())
        .then(text => {
            const modal = document.createElement('div');
            modal.id = 'texto-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '1000';
            modal.style.overflow = 'auto'; // Scroll si el texto es largo

            const textoElement = document.createElement('pre'); // <pre> para mantener formato de texto
            textoElement.textContent = text;
            textoElement.style.color = 'var(--text-color)'; // Color de texto terminal
            textoElement.style.backgroundColor = 'var(--bg-color)'; // Fondo terminal
            textoElement.style.padding = '20px';
            textoElement.style.boxSizing = 'border-box';
            textoElement.style.maxWidth = '80%';
            textoElement.style.maxHeight = '80%';
            textoElement.style.border = 'none';
            textoElement.style.boxShadow = '0 0 10px #00ff41';


            modal.appendChild(textoElement);
            document.body.appendChild(modal);

            modal.addEventListener('click', function () {
                document.body.removeChild(modal);
            });
        })
        .catch(error => {
            console.error('Error al cargar el archivo de texto:', error);
            alert('Error al cargar el archivo de texto.'); // O mostrar un mensaje en la "terminal" si decides mantenerla visible
        });
}


function toggleFolder(folderSpan) {
    const subList = folderSpan.nextElementSibling; // El <ul> hermano siguiente
    if (subList) {
        subList.classList.toggle('hidden'); // Muestra/oculta la sublista
        folderSpan.classList.toggle('open'); // Cambia el estado de "abierto" para el icono
    }
}

document.getElementById('file-tree').addEventListener('click', function (event) {
    const listItem = event.target.closest('li'); // Obtiene el <li> clicado o uno superior si se hizo clic en el icono
    if (listItem) {
        const type = listItem.dataset.type; // Obtiene el tipo de archivo del atributo data-type
        const file = listItem.dataset.file; // Obtiene la ruta del archivo del atributo data-file

        if (type === 'image') {
            mostrarImagen(file);
        } else if (type === 'video') {
            mostrarVideo(file);
        } else if (type === 'pdf') {
            abrirPDF(file);
        } else if (type === 'webgl') {
            ejecutarWebGL(file);
        } else if (type === 'text') {
            mostrarTexto(file);
        } else if (type === 'contact') {
            // Aquí podrías mostrar la información de contacto en un modal,
            // o de la forma que prefieras.  Por ahora, un alert simple:
            alert("Email: gamedev@portfolio.com\nGitHub: @gamedevportfolio\nLinkedIn: Game Developer Portfolio");
        }
    }
});


// No necesitamos la inicialización de la terminal ni los event listeners de la línea de comandos en esta versión
// Inicialización
// writeToTerminal(welcomeMessage);

// Event Listeners
// commandLine.addEventListener('keydown', (e) => { ... });