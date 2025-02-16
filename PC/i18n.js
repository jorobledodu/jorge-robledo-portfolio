const translations = {
  en: {
    terminal: "Terminal",
    games: "Games",
    projects: "Projects",
    fileExplorer: "File Explorer",
    navigationInstructions: "Use ↑↓ to navigate, Enter to open folders, Backspace to go back",
    status: "Status",
    year: "Year",
    technologies: "Technologies",
    released: "Released",
    inDevelopment: "In Development",
    beta: "Beta",
    viewResume: "View Resume"
  },
  es: {
    terminal: "Terminal",
    games: "Juegos",
    projects: "Proyectos",
    fileExplorer: "Explorador de Archivos",
    navigationInstructions: "Usa ↑↓ para navegar, Enter para abrir carpetas, Retroceso para volver",
    status: "Estado",
    year: "Año",
    technologies: "Tecnologías",
    released: "Lanzado",
    inDevelopment: "En Desarrollo",
    beta: "Beta",
    viewResume: "Ver Currículum"
  }
};

let currentLanguage = 'en';

function setLanguage(lang) {
  currentLanguage = lang;
  document.getElementById('langToggle').querySelector('span').textContent = lang.toUpperCase();
  updateTranslations();
}

function t(key) {
  return translations[currentLanguage][key] || key;
}

function updateTranslations() {
  document.querySelectorAll('.i18n').forEach(element => {
    const key = element.dataset.i18n;
    if (key) {
      element.textContent = t(key);
    }
  });
  updateFileTree(); // Refresh file tree with new translations
}