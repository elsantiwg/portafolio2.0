document.addEventListener('DOMContentLoaded', () => {
    // Variables globales
    const reposContainer = document.getElementById('repos');
    const themeToggle = document.getElementById('theme-toggle');
    const scrollProgress = document.createElement('div');
    const typingElement = document.getElementById('typing');
    const contactForm = document.getElementById('contact-form');
    const techFilter = document.getElementById('tech-filter');

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

    themeToggle.addEventListener('dblclick', () => {
        document.body.classList.toggle('hacker-mode');
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

    // 📄 Mostrar repositorios con paginación
    const displayRepos = () => {
        const fragment = document.createDocumentFragment();
        const slicedRepos = allRepos.slice(displayedRepos, displayedRepos + reposPerPage);

        slicedRepos.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.classList.add('repo-card');
            repoCard.dataset.tech = repo.language || 'Otros';
            repoCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'Sin descripción disponible.'}</p>
                <a href="${repo.html_url}" target="_blank">Ver en GitHub</a>
            `;
            fragment.appendChild(repoCard);
        });

        reposContainer.appendChild(fragment);
        displayedRepos += slicedRepos.length;

        if (displayedRepos < allRepos.length) {
            showViewMoreButton();
        } else {
            hideViewMoreButton();
        }
    };

    // 🎨 Filtro de tecnologías en proyectos
    techFilter.addEventListener('change', function () {
        const selectedTech = this.value;
        document.querySelectorAll('.repo-card').forEach(card => {
            card.style.display = (card.dataset.tech.includes(selectedTech) || selectedTech === 'all') ? 'block' : 'none';
        });
    });

    // ✨ Efecto de "typing"
    const textArray = [
        'Desarrollador Full-Stack',
        'Apasionado por la tecnología',
        'Resolviendo problemas con código',
        'Siempre aprendiendo 🚀'
    ];
    let textIndex = 0, charIndex = 0, isDeleting = false;

    const typeEffect = () => {
        const currentText = textArray[textIndex];
        typingElement.textContent = isDeleting ? currentText.substring(0, charIndex--) : currentText.substring(0, charIndex++);

        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => isDeleting = true, 1000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
        }

        setTimeout(typeEffect, isDeleting ? 50 : 100);
    };

    typeEffect();

    // 🟢 Animación de barras de progreso
    const animateProgressBars = () => {
        const progressBars = document.querySelectorAll('.progress');
        progressBars.forEach(bar => bar.style.width = bar.getAttribute('data-width'));
    };

    new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) animateProgressBars();
        });
    }, { threshold: 0.5 }).observe(document.querySelector('#skills'));

    // 📩 Formulario de contacto con animación al enviar
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const btn = this.querySelector('button');
        btn.textContent = 'Enviando...';
        btn.disabled = true;

        setTimeout(() => {
            alert('📩 ¡Mensaje enviado correctamente!');
            this.reset();
            btn.textContent = 'Enviar Mensaje';
            btn.disabled = false;
        }, 2000);
    });

    // 🎮 Animación 3D en Header con Three.js
    const initThreeJS = () => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('backgroundCanvas').appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xf97316, wireframe: true });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        camera.position.z = 10;

        const animate = () => {
            requestAnimationFrame(animate);
            sphere.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        animate();
    };

    // Inicialización
    fetchRepos();
    initThreeJS();
});