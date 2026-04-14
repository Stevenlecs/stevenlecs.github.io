import './styles/main.css';
import { createProjectCard } from './components/ProjectCard';

async function loadProjects() {
    try {
        const response = await fetch('./src/data/portfolioData.json');
        const data = await response.json();
        const projectsList = document.getElementById('projectsList');
        
        projectsList.innerHTML = '';
        data.projects.forEach(project => {
            projectsList.appendChild(createProjectCard(project));
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.section-container').forEach(section => {
        observer.observe(section);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    initAnimations();
    initSmoothScroll();
});
