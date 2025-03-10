// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const reposContainer = document.getElementById('repos');
    const themeToggle = document.getElementById('theme-toggle');
    const scrollProgress = document.createElement('div');
    let isLightMode = localStorage.getItem('lightMode') === 'true';
    let allRepos = [];
    let displayedRepos = 0;
    const reposPerPage = 6;

    // 🌙 Modo Claro/Oscuro
    const applyTheme = () => {
        document.body.classList.toggle('light-mode', isLightMode);
        themeToggle.textContent = isLightMode ? '🌞' : '🌙';
        localStorage.setItem('lightMode', isLightMode);
    };

    themeToggle.addEventListener('click', () => {
        isLightMode = !isLightMode;
        applyTheme();
    });

    applyTheme();

    // 🔄 Función para obtener los repositorios de GitHub
    const fetchRepos = async () => {
        try {
            const response = await fetch('https://api.github.com/users/elsantiwg/repos');
            if (!response.ok) throw new Error('Error al cargar los repositorios.');
            const repos = await response.json();
            allRepos = repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            displayRepos();
        } catch (error) {
            console.error(error);
            reposContainer.innerHTML = '<p>Error al cargar los repositorios. Inténtalo de nuevo más tarde.</p>';
        }
    };

    // 📄 Función para mostrar los repositorios
    const displayRepos = () => {
        const fragment = document.createDocumentFragment();
        const slicedRepos = allRepos.slice(displayedRepos, displayedRepos + reposPerPage);

        slicedRepos.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.classList.add('repo-card');
            repoCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'Sin descripción disponible.'}</p>
                <a href="${repo.html_url}" target="_blank">Ver en GitHub</a>
            `;
            fragment.appendChild(repoCard);
        });

        reposContainer.appendChild(fragment);
        displayedRepos += slicedRepos.length;

        displayedRepos < allRepos.length ? showViewMoreButton() : hideViewMoreButton();
    };

    // 🔘 Mostrar botón "Ver más"
    const showViewMoreButton = () => {
        let viewMoreBtn = document.getElementById('view-more-btn');
        if (!viewMoreBtn) {
            viewMoreBtn = document.createElement('button');
            viewMoreBtn.id = 'view-more-btn';
            viewMoreBtn.textContent = 'Ver más';
            viewMoreBtn.classList.add('view-more-btn');
            viewMoreBtn.addEventListener('click', displayRepos);
            reposContainer.parentElement.appendChild(viewMoreBtn);
        }
    };

    // 🚫 Ocultar botón "Ver más"
    const hideViewMoreButton = () => {
        const viewMoreBtn = document.getElementById('view-more-btn');
        if (viewMoreBtn) viewMoreBtn.remove();
    };

    // 🌌 Fondo de partículas
    particlesJS.load('particles-js', 'particles.json', () => {
        console.log('Partículas cargadas!');
    });

    // 📊 Barra de progreso en el scroll
    scrollProgress.id = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = `${scrollPercent}%`;
    });

    // 🔄 Cargar repositorios al iniciar
    fetchRepos();
});
// 🌟 Efecto de "typing" en la descripción
const text = [
    "Desarrollador Full-Stack",
    "Apasionado por la tecnología",
    "Resolviendo problemas con código",
    "Siempre aprendiendo 🚀"
];
let i = 0, j = 0;
let isDeleting = false;
const speed = 100;
const typingElement = document.getElementById("typing");

function type() {
    const currentText = text[i];
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, j--);
        if (j < 0) {
            isDeleting = false;
            i = (i + 1) % text.length;
        }
    } else {
        typingElement.textContent = currentText.substring(0, j++);
        if (j > currentText.length) {
            isDeleting = true;
            setTimeout(type, 1000);  // Pausa antes de borrar
            return;
        }
    }
    setTimeout(type, isDeleting ? speed / 2 : speed);
}

type();
