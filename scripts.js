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

    // 🔄 Obtener repositorios de GitHub
    const fetchRepos = async () => {
        try {
            const response = await fetch('https://api.github.com/users/elsantiwg/repos');
            if (!response.ok) throw new Error('Error al cargar los repositorios.');
            allRepos = (await response.json()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            displayRepos();
        } catch (error) {
            console.error(error);
            reposContainer.innerHTML = '<p>Error al cargar los repositorios. Inténtalo de nuevo más tarde.</p>';
        }
    };

    // 📄 Mostrar repositorios
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

    // 🔘 Botón "Ver más"
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

    const hideViewMoreButton = () => {
        const viewMoreBtn = document.getElementById('view-more-btn');
        if (viewMoreBtn) viewMoreBtn.remove();
    };

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

// 🌟 Efecto de "typing"
const textArray = ["Desarrollador Full-Stack", "Apasionado por la tecnología", "Resolviendo problemas con código", "Siempre aprendiendo 🚀"];
let textIndex = 0, charIndex = 0, isDeleting = false;
const typingElement = document.getElementById("typing");

function typeEffect() {
    const currentText = textArray[textIndex];
    typingElement.textContent = isDeleting ? currentText.substring(0, charIndex--) : currentText.substring(0, charIndex++);

    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => isDeleting = true, 1000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
    }

    setTimeout(typeEffect, isDeleting ? 50 : 100);
}

typeEffect();

// 🎨 Animación de barras de progreso
document.addEventListener("DOMContentLoaded", () => {
    const progressBars = document.querySelectorAll(".progress");

    function animateProgressBars() {
        progressBars.forEach(bar => {
            const width = bar.getAttribute("data-width");
            bar.style.width = width;
        });
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                observer.disconnect(); // Solo se ejecuta una vez
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector("#skills"));
});

// 📩 Formulario de contacto con validación
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    alert("📩 ¡Mensaje enviado correctamente! Me pondré en contacto contigo pronto.");
    this.reset();
});
