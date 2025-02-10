// Initialization and Global State Management
let showTerminal = false;    // Controls terminal visibility
let selectedIndex = 0;       // Currently selected item in file tree
let currentPath = [];        // Current navigation path in file tree
let maximized = false;       // Terminal maximization state

// DOM Element References
const terminal = document.getElementById('terminal');
const fileTree = document.getElementById('fileTree');
const navIcon = document.getElementById('navIcon');
const mobileNav = document.getElementById('mobileNav');
const pdfViewer = document.getElementById('pdfViewer');

// Initialize Lucide icons on page load
lucide.createIcons();

/**
 * Toggle terminal visibility and update file tree when opened
 * @param {boolean} show - Whether to show or hide the terminal
 */
function toggleTerminal(show) {
  showTerminal = show;
  terminal.style.display = show ? 'block' : 'none';

  if (show) {
    updateFileTree();  // Refresh file tree content when terminal opens
  }
}

/**
 * Toggle mobile navigation bar visibility
 * @param {boolean} show - Whether to show or hide mobile navigation
 */
function toggleMobileNav(show) {
  mobileNav.style.display = show ? 'flex' : 'none';
}

/**
 * Dynamically check and adjust mobile navigation based on screen size
 */
function checkMobileNavigation() {
  const isMobileScreen = window.innerWidth <= 768;

  // Si es una pantalla pequeña, activar de inicio
  if (isMobileScreen) {
    toggleMobileNav(true);
  }
}

// Initial mobile navigation setup
checkMobileNavigation();

// Recheck mobile navigation on window resize
window.addEventListener('resize', checkMobileNavigation);

// Navigation Icon Click Event
navIcon.addEventListener('click', () => {
  const isCurrentlyVisible = mobileNav.style.display === 'flex';
  toggleMobileNav(!isCurrentlyVisible);
});

/**
 * Retrieve current items based on navigation path
 * @returns {Array} Current navigation items
 */
function getCurrentItems() {
  return currentPath.length === 0
    ? menuStructure
    : currentPath[currentPath.length - 1].children || [];
}

/**
 * Update file tree display with current navigation state
 */
function updateFileTree() {
  const items = getCurrentItems();
  fileTree.innerHTML = '';

  items.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = `file-item ${index === selectedIndex ? 'selected' : ''}`;

    let prefix = index === selectedIndex ? '▶ ' : '  ';
    let content = '';

    // Determine item display based on type
    if (item.type === 'directory') {
      content = `📁 ${item.name === 'games' ? t('games') : item.name === 'projects' ? t('projects') : item.name}/`;
    } else if (item.type === 'game') {
      content = `🎮 ${item.name}`;
    } else {
      content = `📄 ${item.name}`;
    }

    div.textContent = prefix + content;

    // Add detailed information for selected items
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

// Keyboard Navigation Event Listener
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

// Mobile Navigation Button Event Listeners
document.getElementById('mobileArrowUp').addEventListener('click', () => {
  selectedIndex = Math.max(0, selectedIndex - 1);
  updateFileTree();
});

document.getElementById('mobileArrowDown').addEventListener('click', () => {
  selectedIndex = Math.min(getCurrentItems().length - 1, selectedIndex + 1);
  updateFileTree();
});

document.getElementById('mobileEnter').addEventListener('click', () => {
  const selectedItem = getCurrentItems()[selectedIndex];
  if (selectedItem?.type === 'directory') {
    currentPath.push(selectedItem);
    selectedIndex = 0;
    updateFileTree();
  }
});

document.getElementById('mobileBackspace').addEventListener('click', () => {
  if (currentPath.length > 0) {
    currentPath.pop();
    selectedIndex = 0;
    updateFileTree();
  }
});

// Additional Event Listeners
document.getElementById('terminalIcon').addEventListener('click', () => toggleTerminal(true));
document.getElementById('closeBtn').addEventListener('click', () => toggleTerminal(false));
document.getElementById('minimizeBtn').addEventListener('click', () => toggleTerminal(false));
document.getElementById('closePdfBtn').addEventListener('click', () => {
  pdfViewer.classList.remove('active');
});

// Language Switcher
document.getElementById('langToggle').addEventListener('click', () => {
  setLanguage(currentLanguage === 'en' ? 'es' : 'en');
});