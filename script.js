// script.js
document.addEventListener('DOMContentLoaded', async function () {
    const DOM = {
        themeToggle: document.getElementById('theme-toggle'),
        body: document.body,
        langButtons: document.querySelectorAll('.lang-btn'),
        i18nElements: document.querySelectorAll('[data-i18n]'),
        i18nPlaceholders: document.querySelectorAll('[data-i18n-placeholder]'),
        profileContainer: document.querySelector('.profile-img-container'),
        projectsGrid: document.querySelector('.grid-proyectos'),
        filterButtons: document.querySelectorAll('.filter-btn'),
        searchInput: document.getElementById('project-search'),
        noResultsMessage: document.getElementById('no-results'),
        modal: document.getElementById('modal-proyecto'),
        closeButton: document.querySelector('.close-button'),
        modalTitle: document.getElementById('modal-titulo-proyecto'),
        modalImage: document.getElementById('modal-img-proyecto'),
        modalDescription: document.getElementById('modal-descripcion-proyecto'),
        modalGallery: document.getElementById('modal-galeria-proyecto'),
        modalTags: document.getElementById('modal-etiquetas-proyecto'),
        modalLinks: document.getElementById('modal-links'),
        gameOverlay: document.getElementById('game-demo-overlay'),
        gameFrame: document.getElementById('game-frame'),
        closeGame: document.getElementById('close-game'),
        contactForm: document.getElementById('contact-form'),
        formSuccess: document.getElementById('form-success'),
        backToTop: document.getElementById('back-to-top'),
        skillLevels: document.querySelectorAll('.skill-level')
    };

    const state = {
        portfolioData: null,
        currentFilter: 'all',
        currentLang: 'es',
        currentTheme: localStorage.getItem('theme') || 'light',
        searchQuery: '',
        activeProject: null
    };

    // Sistema de partículas
    function createParticleEffect(x, y) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.background = `hsl(${Math.random() * 360}, 70%, 50%)`;
            particle.style.setProperty('--x', `${Math.random() * 100 - 50}px`);
            particle.style.setProperty('--y', `${Math.random() * 100 - 50}px`);
            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 1000);
        }
    }

    // Cargar datos del portfolio
    async function loadPortfolioData() {
        try {
            const response = await fetch('portfolioData.json');
            const data = await response.json();
            data.games.forEach(game => game.demoUrl = game.links.itch || '');
            return data;
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            return { games: [], projects: [] };
        }
    }

    // Filtrar proyectos
    function filterProjects() {
        const { portfolioData, currentFilter, searchQuery } = state;
        let filtered = [...portfolioData.games.map(g => ({ ...g, type: 'game' })), 
                        ...portfolioData.projects.map(p => ({ ...p, type: 'project' }))];
    
        if (currentFilter !== 'all') {
            filtered = filtered.filter(p => p.type === currentFilter);
        }
    
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.tags.some(t => t.toLowerCase().includes(query))
            );
        }
    
        renderProjects(filtered);
        DOM.noResultsMessage.style.display = filtered.length ? 'none' : 'block';
    }

    // Renderizar proyectos
    function renderProjects(projects) {
        DOM.projectsGrid.innerHTML = '';
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'tarjeta-proyecto';
            card.dataset.type = project.type;

            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${project.thumbnail}" alt="${project.title}" class="img-proyecto">
                    ${project.type === 'game' && project.demoUrl ?
                    `<button class="play-demo-btn" data-demo="${project.demoUrl}">
                            <i class="fas fa-play"></i>
                        </button>` : ''}
                </div>
                <div class="card-content">
                    <h3>${project.title}</h3>
                    <ul class="etiquetas-tecnologias">
                        ${project.tags.slice(0, 3).map(t => `<li>${t}</li>`).join('')}
                    </ul>
                    <div class="botones-proyecto">
                        ${project.links.itch ? `<a href="${project.links.itch}" target="_blank" class="boton-icono">
                            <i class="fab fa-itch-io"></i></a>` : ''}
                        ${project.links.github ? `<a href="${project.links.github}" target="_blank" class="boton-icono">
                            <i class="fab fa-github"></i></a>` : ''}
                        <button class="boton-ampliar" data-project="${project.title}">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                </div>
            `;

            DOM.projectsGrid.appendChild(card);
        });
    }

    // Sistema de temas
    function applyTheme(theme) {
        DOM.body.classList.remove('light-theme', 'dark-theme');
        DOM.body.classList.add(`${theme}-theme`);
        localStorage.setItem('theme', theme);
        state.currentTheme = theme;
    }

    // Cambiar idioma
    function applyTranslations(lang) {
        DOM.i18nElements.forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang]?.[key]) el.textContent = translations[lang][key];
        });
        DOM.i18nPlaceholders.forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (translations[lang]?.[key]) el.placeholder = translations[lang][key];
        });
    }

    // Modal de proyectos
    function openProjectModal(project) {
        state.activeProject = project;
        DOM.modalTitle.textContent = project.title;
        DOM.modalImage.src = project.image;
        DOM.modalDescription.textContent = project.description;

        // Galería
        DOM.modalGallery.innerHTML = project.gallery?.map((img, i) => `
            <img src="${img}" alt="Gallery image ${i + 1}" 
                 class="${i === 0 ? 'active' : ''}" 
                 onclick="this.classList.add('active'); 
                          document.getElementById('modal-img-proyecto').src = this.src">
        `).join('') || '';

        // Tecnologías
        DOM.modalTags.innerHTML = project.tags?.map(t => `<li>${t}</li>`).join('') || '';

        // Enlaces
        DOM.modalLinks.innerHTML = `
            ${project.links.itch ? `<a href="${project.links.itch}" target="_blank">
                <i class="fab fa-itch-io"></i> Itch.io</a>` : ''}
            ${project.links.github ? `<a href="${project.links.github}" target="_blank">
                <i class="fab fa-github"></i> GitHub</a>` : ''}
            ${project.demoUrl ? `<button onclick="openGameDemo('${project.demoUrl}')">
                <i class="fas fa-play"></i> Demo</button>` : ''}
        `;

        DOM.modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    function closeProjectModal() {
        DOM.modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        state.activeProject = null;
    }

    // Demo de juegos
    function openGameDemo(url) {
        DOM.gameFrame.src = url;
        DOM.gameOverlay.style.display = 'flex';
    }

    function closeGameDemo() {
        DOM.gameFrame.src = '';
        DOM.gameOverlay.style.display = 'none';
    }

    // Formulario de contacto
    async function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(DOM.contactForm);

        try {
            // Simular envío
            await new Promise(resolve => setTimeout(resolve, 1000));
            DOM.formSuccess.style.display = 'block';
            DOM.contactForm.reset();
            setTimeout(() => DOM.formSuccess.style.display = 'none', 3000);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    // Event listeners
    function initializeEventListeners() {
        // Tema
        DOM.themeToggle.addEventListener('click', () =>
            applyTheme(state.currentTheme === 'light' ? 'dark' : 'light'));

        // Idioma
        DOM.langButtons.forEach(btn => btn.addEventListener('click', () => {
            state.currentLang = btn.dataset.lang;
            DOM.langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyTranslations(state.currentLang);
            localStorage.setItem('language', state.currentLang);
        }));

        // Filtros
        DOM.filterButtons.forEach(btn => btn.addEventListener('click', () => {
            state.currentFilter = btn.dataset.filter;
            DOM.filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProjects();
        }));

        // Búsqueda
        DOM.searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value.toLowerCase();
            filterProjects();
        });

        // Modal
        DOM.closeButton.addEventListener('click', closeProjectModal);
        window.addEventListener('click', (e) => e.target === DOM.modal && closeProjectModal());
        document.addEventListener('keydown', (e) => e.key === 'Escape' && closeProjectModal());

        // Delegación de eventos
        document.addEventListener('click', (e) => {
            if (e.target.closest('.boton-ampliar')) {
                const title = e.target.closest('.boton-ampliar').dataset.project;
                const project = [...state.portfolioData.games, ...state.portfolioData.projects]
                    .find(p => p.title === title);
                openProjectModal(project);
            }

            if (e.target.closest('.play-demo-btn')) {
                openGameDemo(e.target.closest('.play-demo-btn').dataset.demo);
            }
        });

        // Demo juego
        DOM.closeGame.addEventListener('click', closeGameDemo);

        // Contacto
        DOM.contactForm.addEventListener('submit', handleFormSubmit);

        // Botón volver arriba
        DOM.backToTop.addEventListener('click', () =>
            window.scrollTo({ top: 0, behavior: 'smooth' }));

        // Efectos de partículas
        document.addEventListener('click', (e) => {
            if (e.target.closest('.boton-cv, .boton-icono, .play-demo-btn')) {
                createParticleEffect(e.clientX, e.clientY);
            }
        });
    }

    // Inicialización
    async function initialize() {
        try {
            state.portfolioData = await loadPortfolioData();
            applyTheme(localStorage.getItem('theme') || 'light');
            applyTranslations(localStorage.getItem('language') || 'es');
            filterProjects();
            initializeEventListeners();

            // Animación de habilidades
            DOM.skillLevels.forEach(bar => {
                bar.style.width = `${bar.dataset.level}%`;
            });

            // Efecto hover tarjetas
            document.querySelectorAll('.tarjeta-proyecto').forEach(card => {
                card.addEventListener('mouseenter', () =>
                    card.style.transform = 'rotate(1deg) scale(1.05)');
                card.addEventListener('mouseleave', () =>
                    card.style.transform = 'none');
            });

        } catch (error) {
            console.error('Error initializing:', error);
        }
    }

    initialize();
});