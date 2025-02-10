// Initialize Lucide icons
lucide.createIcons();

// Terminal state
let showTerminal = false;
let selectedIndex = 0;
let currentPath = [];
let maximized = false;

// DOM Elements
const terminal = document.getElementById('terminal');
const fileTree = document.getElementById('fileTree');
// const pdfViewer = document.getElementById('pdfViewer');
const navIcon = document.getElementById("navIcon");

// Terminal visibility
function toggleTerminal(show) {
  showTerminal = show;
  terminal.style.display = show ? 'block' : 'none';
  if (show) {
    updateFileTree();
  }
}

// Mostrar/Ocultar la barra de navegación táctil
function toggleMobileNav(show) {
  mobileNav.style.display = show ? "flex" : "none";
}

// Si es móvil, activar la barra de navegación automáticamente
if (window.innerWidth <= 768) {
  toggleMobileNav(true);
}

// Evento del icono de navegación táctil
navIcon.addEventListener("click", () => {
  toggleMobileNav(mobileNav.style.display === "none");
});

// Terminal controls
document.getElementById('terminalIcon').addEventListener('click', () => toggleTerminal(true));
document.getElementById('closeBtn').addEventListener('click', () => toggleTerminal(false));
document.getElementById('minimizeBtn').addEventListener('click', () => toggleTerminal(false));
document.getElementById('maximizeBtn').addEventListener('click', () => {
  maximized = !maximized;
  terminal.classList.toggle('maximized');
});

// PDF viewer controls
document.getElementById('closePdfBtn').addEventListener('click', () => {
  pdfViewer.classList.remove('active');
});

// Language switcher
document.getElementById('langToggle').addEventListener('click', () => {
  setLanguage(currentLanguage === 'en' ? 'es' : 'en');
});

// File tree navigation
function getCurrentItems() {
  return currentPath.length === 0 
    ? menuStructure 
    : currentPath[currentPath.length - 1].children || [];
}

function updateFileTree() {
  const items = getCurrentItems();
  fileTree.innerHTML = '';
  
  items.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = `file-item ${index === selectedIndex ? 'selected' : ''}`;
    
    let prefix = index === selectedIndex ? '▶ ' : '  ';
    let content = '';
    
    if (item.type === 'directory') {
      content = `📁 ${item.name === 'games' ? t('games') : item.name === 'projects' ? t('projects') : item.name}/`;
    } else if (item.type === 'game') {
      content = `🎮 ${item.name}`;
    } else {
      content = `📄 ${item.name}`;
    }
    
    div.textContent = prefix + content;
    
    if (index === selectedIndex) {
      if (item.type === 'game' && item.game) {
        const details = document.createElement('div');
        details.className = 'file-item-details';
        details.innerHTML = `
          <div>${t('status')}: ${t(item.game.status)}</div>
          <div>${t('year')}: ${item.game.year}</div>
          <div>${t('technologies')}: ${item.game.technologies.join(', ')}</div>
          <div style="margin-top: 0.25rem">${item.game.description}</div>
        `;
        div.appendChild(details);
      } else if (item.type === 'file' && item.name === 'about.txt') {
        const viewButton = document.createElement('button');
        viewButton.className = 'file-item-details';
        viewButton.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.5rem; color: rgb(134, 239, 172);">
            <i data-lucide="file-text"></i>
            ${t('viewResume')}
          </div>
        `;
        viewButton.addEventListener('click', () => {
          pdfViewer.classList.add('active');
        });
        div.appendChild(viewButton);
        lucide.createIcons();
      }
    }
    
    fileTree.appendChild(div);
  });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!showTerminal) return;
  
  const items = getCurrentItems();
  
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      selectedIndex = Math.max(0, selectedIndex - 1);
      updateFileTree();
      break;
      
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex = Math.min(items.length - 1, selectedIndex + 1);
      updateFileTree();
      break;
      
    case 'Enter':
      const selectedItem = items[selectedIndex];
      if (selectedItem?.type === 'directory') {
        currentPath.push(selectedItem);
        selectedIndex = 0;
        updateFileTree();
      } else if (selectedItem?.type === 'file' && selectedItem.name === 'about.txt') {
        pdfViewer.classList.add('active');
      }
      break;
      
    case 'Backspace':
      if (currentPath.length > 0) {
        currentPath.pop();
        selectedIndex = 0;
        updateFileTree();
      }
      break;
      
    case 'Escape':
      if (pdfViewer.classList.contains('active')) {
        pdfViewer.classList.remove('active');
      }
      break;
  }
});

// Funcionalidad de los botones móviles
document.getElementById("mobileArrowUp").addEventListener("click", () => {
  selectedIndex = Math.max(0, selectedIndex - 1);
  updateFileTree();
});

document.getElementById("mobileArrowDown").addEventListener("click", () => {
  selectedIndex = Math.min(getCurrentItems().length - 1, selectedIndex + 1);
  updateFileTree();
});

document.getElementById("mobileEnter").addEventListener("click", () => {
  let selectedItem = getCurrentItems()[selectedIndex];
  if (selectedItem?.type === "directory") {
    currentPath.push(selectedItem);
    selectedIndex = 0;
    updateFileTree();
  }
});

document.getElementById("mobileBackspace").addEventListener("click", () => {
  if (currentPath.length > 0) {
    currentPath.pop();
    selectedIndex = 0;
    updateFileTree();
  }
});