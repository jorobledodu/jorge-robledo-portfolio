// script.js
// Import SVG icons
import svgIcons from './svg-icons.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Elementos del DOM
    const DOM = {
        themeToggle: document.getElementById('theme-toggle'),
        body: document.body,
        langButtons: document.querySelectorAll('.lang-btn'),
        i18nElements: document.querySelectorAll('[data-i18n]'),
        i18nPlaceholders: document.querySelectorAll('[data-i18n-placeholder]'),
        projectsGrid: document.querySelector('.grid-proyectos'),
        filterButtons: document.querySelectorAll('.filter-btn'),
        // searchInput: document.getElementById('project-search'), // ELIMINADO
        noResultsMessage: document.getElementById('no-results'),
        modal: document.getElementById('modal-proyecto'),
        closeModal: document.querySelector('.close-button'),
        modalTitle: document.getElementById('modal-titulo-proyecto'),
        modalImage: document.getElementById('modal-img-proyecto'),
        modalDescription: document.getElementById('modal-descripcion-proyecto'),
        modalGallery: document.getElementById('modal-galeria-proyecto'),
        modalTags: document.getElementById('modal-etiquetas-proyecto'),
        modalLinks: document.getElementById('modal-links'),
        contactForm: document.getElementById('contact-form'),
        formSuccess: document.getElementById('form-success'),
        backToTop: document.getElementById('back-to-top'),
        skillLevels: document.querySelectorAll('.skill-level'), //Se usará luego
        gameOverlay: document.getElementById('game-demo-overlay'),
        gameFrame: document.getElementById('game-frame'),
        herramientasContainer: document.querySelector('.herramientas .etiquetas-tecnologias') // Contenedor de herramientas

    };

    // Estado de la aplicación
    const state = {
        portfolioData: null,
        currentFilter: 'all',
        currentLang: localStorage.getItem('language') || 'es',
        currentTheme: localStorage.getItem('theme') || 'light',
        // searchQuery: '',  // ELIMINADO
        activeProject: null
    };

    // Lista de habilidades (fuera de las funciones, para que sea accesible globalmente)
    const allSkills = [
        { name: "Unity", iconClass: "fab fa-unity", level: 90 },
        { name: "C#", iconClass: "fas fa-code", level: 85 },
        { name: "HTML", iconClass: "fab fa-html5", level: 80 },
        { name: "CSS", iconClass: "fab fa-css3-alt", level: 80 },
        { name: "GitHub", iconClass: "fab fa-github", level: 70 },
        { name: "Unreal Engine", iconClass: "fab fa-unreal-engine", level: 60 }
    ];

    // Cargar datos del portfolio
    async function loadPortfolioData() {
        try {
            const response = await fetch('portfolioData.json');
            const data = await response.json();
            return {
                games: data.games.map(game => ({ ...game, type: 'game' })),
                projects: data.projects.map(project => ({ ...project, type: 'project' }))
            };
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            // Mostrar mensaje de error al usuario
            const errorDiv = document.createElement('div');
            errorDiv.textContent = translations[state.currentLang]["load-error"]; // Usa la traducción
            errorDiv.style.color = 'red';
            DOM.projectsGrid.parentElement.insertBefore(errorDiv, DOM.projectsGrid);
            return { games: [], projects: [] }; // Usar datos vacíos
        }
    }

    // Sistema de temas
    function applyTheme(theme) {
        DOM.body.classList.remove('light-theme', 'dark-theme');
        DOM.body.classList.add(`${theme}-theme`);
        localStorage.setItem('theme', theme);
        state.currentTheme = theme;

        // Actualizar colores específicos (simplificado)
        const root = document.documentElement;
        root.style.setProperty('--current-text', theme === 'dark' ? '#F8F9FA' : '#2D3436');
        root.style.setProperty('--current-bg', theme === 'dark' ? '#1a1a1a' : '#F8F9FA');
    }

    // Sistema de traducción
    function applyTranslations(lang) {
        DOM.i18nElements.forEach(element => {
            const key = element.dataset.i18n;
            element.textContent = translations[lang][key];
        });

        DOM.i18nPlaceholders.forEach(element => {
            const key = element.dataset.i18nPlaceholder;
            element.placeholder = translations[lang][key];
        });
    }

    // Filtrado y búsqueda  (MODIFICADO:  Se elimina la parte de búsqueda)
    function filterProjects() {
        const allProjects = [...state.portfolioData.games, ...state.portfolioData.projects];
        let filtered = allProjects;

        // Aplicar filtro
        if (state.currentFilter !== 'all') {
            filtered = filtered.filter(project => project.type === state.currentFilter);
        }

        //  (Se elimina la parte de búsqueda)

        renderProjects(filtered);
        DOM.noResultsMessage.style.display = filtered.length ? 'none' : 'block';
    }

    // Renderizar proyectos
    function renderProjects(projects) {
        DOM.projectsGrid.innerHTML = projects.map(project => `
            <div class="tarjeta-proyecto" data-type="${project.type}" data-project="${project.title}">
                <div class="card-img-container">
                <img src="${project.thumbnail}" alt="${project.altThumbnail || project.title}" class="img-proyecto" loading="lazy">
                </div>
                <div class="card-content">
                    <h3>${project.title}</h3>
                    <p class="project-description">${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
                    
                    <div class="project-meta">
                        <div class="project-release-date">
                            <i class="fas fa-calendar-alt"></i> ${project.releaseDate || 'En desarrollo'}
                        </div>
                        ${project.type === 'game' ? `
                        <div class="project-status ${project.playable ? 'playable' : 'not-playable'}">
                            <i class="fas ${project.playable ? 'fa-gamepad' : 'fa-code'}">
                            </i> ${project.playable ? translations[state.currentLang]["playable"] : translations[state.currentLang]["not-playable"]}
                        </div>` : ''}
                    </div>
                    
                    <ul class="etiquetas-tecnologias">
                     ${project.tags.slice(0, 3).map(tag => `<li><i class="${tag.iconClass}"></i> ${tag.name}</li>`).join('')}
                    </ul>
                    
                    <div class="botones-proyecto">
                        ${project.type === 'game' && project.links.itch ? `
                        <button class="play-demo-btn-card" data-demo="${project.links.itch || '#'}" aria-label="Jugar demo de ${project.title}">
                            <i class="fas fa-play"></i>
                        </button>` : ''}
                        ${project.links.itch ? `
                        <a href="${project.links.itch}" target="_blank" class="boton-icono" aria-label="Ir a ${project.title} en Itch.io">
                            <i class="fab fa-itch-io"></i>
                        </a>` : ''}
                        ${project.links.github ? `
                        <a href="${project.links.github}" target="_blank" class="boton-icono" aria-label="Ir a ${project.title} en GitHub">
                            <i class="fab fa-github"></i>
                        </a>` : ''}
                    </div>
                </div>
          </div>
        `).join('');

        // Añadir event listeners a las tarjetas DESPUÉS de renderizarlas
        document.querySelectorAll('.tarjeta-proyecto').forEach(card => {
            card.addEventListener('click', () => openProjectModal(card.dataset.project));
        });

        // Event listeners para los botones de demo (si existen)
        document.querySelectorAll('.play-demo-btn-card').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Evita que el clic se propague al contenedor de la tarjeta
                openGameDemo(button.dataset.demo);
            });
        });
    }

    function openGameDemo(demoUrl) {
        if (!demoUrl || demoUrl === '#') {
            alert(translations[state.currentLang]["demo-unavailable"]);
            return;
        }
        // Establecer la URL del iframe y mostrar el overlay
        DOM.gameFrame.src = demoUrl;
        DOM.gameOverlay.style.display = 'flex';
    }

    function createGalleryItem(image) {
        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.alt = image.alt;
        imgElement.loading = "lazy";
        imgElement.addEventListener('click', () => {
            DOM.modalImage.src = image.src;
            DOM.modalImage.alt = image.alt;
            // Remover la clase 'active' de todas las imágenes
            document.querySelectorAll('#modal-galeria-proyecto img').forEach(img => img.classList.remove('active'));
            // Añadir la clase 'active' a la imagen clickeada
            imgElement.classList.add('active');
        });
        return imgElement;
    }

    // Abrir modal de proyecto
    function openProjectModal(projectName) {
        const project = [...state.portfolioData.games, ...state.portfolioData.projects].find(p => p.title === projectName);
        if (!project) return;

        state.activeProject = project;
        DOM.modalTitle.textContent = project.title;
        DOM.modalImage.src = project.thumbnail;
        DOM.modalImage.alt = project.altThumbnail || project.title;
        DOM.modalDescription.textContent = project.description;

        // Limpiar galería y enlaces anteriores
        DOM.modalGallery.innerHTML = '';
        DOM.modalTags.innerHTML = '';
        DOM.modalLinks.innerHTML = '';

        // Llenar la galería
        if (project.gallery && project.gallery.length > 0) {
            project.gallery.forEach(image => {
                DOM.modalGallery.appendChild(createGalleryItem(image));
            });
            // Establecer la primera imagen de la galería como activa por defecto
            if (project.gallery.length > 0) {
                DOM.modalImage.src = project.gallery[0].src;
                DOM.modalImage.alt = project.gallery[0].alt;
                DOM.modalGallery.firstChild.classList.add('active');
            }
        }
        // Llenar etiquetas (tags)
        project.tags.forEach(tag => {
            const li = document.createElement('li');
            const tagKey = tag.name.toLowerCase().replace(/[\s\/]+/g, '');
            
            if (svgIcons[tagKey]) {
                li.innerHTML = `${svgIcons[tagKey]} ${tag.name}`;
            } else {
                li.innerHTML = `<i class="${tag.iconClass}"></i> ${tag.name}`;
            }
            
            DOM.modalTags.appendChild(li);
        });


        // Llenar enlaces con los mismos botones que aparecen en las tarjetas
        DOM.modalLinks.innerHTML = `
            ${project.type === 'game' && project.links.itch ? `
            <button class="play-demo-btn-card" data-demo="${project.links.itch || '#'}" aria-label="Jugar demo de ${project.title}">
                <i class="fas fa-play"></i>
            </button>` : ''}
            ${project.links.itch ? `
            <a href="${project.links.itch}" target="_blank" class="boton-icono" aria-label="Ir a ${project.title} en Itch.io">
                <i class="fab fa-itch-io"></i>
            </a>` : ''}
            ${project.links.github ? `
            <a href="${project.links.github}" target="_blank" class="boton-icono" aria-label="Ir a ${project.title} en GitHub">
                <i class="fab fa-github"></i>
            </a>` : ''}
        `;
        
        // Añadir event listener al botón de demo en el modal
        const modalPlayButton = DOM.modalLinks.querySelector('.play-demo-btn-card');
        if (modalPlayButton) {
            modalPlayButton.addEventListener('click', () => {
                openGameDemo(modalPlayButton.dataset.demo);
            });
        }

        DOM.modal.style.display = 'block';
    }

    function renderSkills() {
        // Primero, limpiamos cualquier contenido previo para evitar duplicados
        DOM.herramientasContainer.innerHTML = '';

        // Creamos las etiquetas de las herramientas
        allSkills.forEach(skill => {
            const li = document.createElement('li');
            
            // Usar SVG icons de SVGL si están disponibles, sino usar Font Awesome
            const skillKey = skill.name.toLowerCase().replace(/[\s\/]+/g, '');
            if (svgIcons[skillKey]) {
                li.innerHTML = `${svgIcons[skillKey]} ${skill.name}`;
            } else {
                li.innerHTML = `<i class="${skill.iconClass}"></i> ${skill.name}`;
            }
            
            DOM.herramientasContainer.appendChild(li);
        });
    }


    // Función para copiar email al portapapeles
    function setupEmailCopy() {
        const copyEmailBtn = document.getElementById('copy-email');
        if (copyEmailBtn) {
            copyEmailBtn.addEventListener('click', function() {
                const email = 'contacto@jorodu.com';
                navigator.clipboard.writeText(email).then(() => {
                    // Mostrar tooltip
                    this.classList.add('copied');
                    
                    // Ocultar tooltip después de 2 segundos
                    setTimeout(() => {
                        this.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Error al copiar email: ', err);
                });
            });
        }
    }

    // Event listeners
    function setupEventListeners() {
        DOM.themeToggle.addEventListener('click', () => {
            const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });

        DOM.langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const newLang = btn.dataset.lang;
                if (newLang !== state.currentLang) {
                    applyTranslations(newLang);
                    state.currentLang = newLang;
                    localStorage.setItem('language', newLang);
                    // Remover la clase 'active' de todos los botones
                    DOM.langButtons.forEach(b => b.classList.remove('active'));
                    // Añadir la clase 'active' al botón clickeado
                    btn.classList.add('active');

                    // Actualizar otros elementos si es necesario
                    renderSkills();
                }
            });
        });

        DOM.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                state.currentFilter = btn.dataset.filter;
                filterProjects();
                // Remover clase 'active'
                DOM.filterButtons.forEach(b => b.classList.remove('active'));
                // Añadir clase 'active' al botón clickeado
                btn.classList.add('active');
            });
        });

        /*  ELIMINADO event listener del buscador
        DOM.searchInput.addEventListener('input', () => {
            state.searchQuery = DOM.searchInput.value;
            filterProjects();
        });
        */

        DOM.closeModal.addEventListener('click', () => {
            DOM.modal.style.display = 'none';
        });

        // Cerrar el modal si se hace clic fuera de él
        window.addEventListener('click', (event) => {
            if (event.target === DOM.modal) {
                DOM.modal.style.display = 'none';
            }
        });

        DOM.contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Recolectar datos del formulario
            const formData = new FormData(DOM.contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            try {
                const response = await fetch('URL_DEL_BACKEND', { // Reemplaza con tu URL
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'  // Importante para Formspree
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // Mostrar mensaje de éxito
                    DOM.formSuccess.style.display = 'block';
                    DOM.contactForm.reset(); // Limpiar el formulario

                } else {
                    // Mostrar mensaje de error.  Podrías crear un div para errores también.
                    console.error('Error al enviar el formulario:', response.status, response.statusText);
                    alert(translations[state.currentLang]["contact-error"]);
                }

            } catch (error) {
                console.error('Error en la petición:', error);
                alert(translations[state.currentLang]["contact-error"]); // Traducido
            }
        });

        DOM.backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            // Mostrar/ocultar botón "Volver arriba"
            DOM.backToTop.style.display = (window.pageYOffset > 300) ? 'flex' : 'none';
        });

        // Cerrar el overlay de la demo
        DOM.gameOverlay.addEventListener('click', (event) => {
            if (event.target === DOM.gameOverlay || event.target.closest('#close-game')) {
                DOM.gameOverlay.style.display = 'none';
                DOM.gameFrame.src = ''; // Detener la carga del iframe
            }
        });

    }

    // Inicialización
    async function init() {
        applyTheme(state.currentTheme);
        applyTranslations(state.currentLang);
        setupEventListeners();
        state.portfolioData = await loadPortfolioData();
        filterProjects(); // Llama a filterProjects en lugar de renderProjects
        renderSkills(); // Llamar a renderSkills para mostrar las habilidades al inicio.
        setupEmailCopy(); // Configurar funcionalidad de copiar email
    }

    init();
});