document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for sections
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

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll for navigation links
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
});

// Project loading functions
async function loadProjects() {
    try {
        const response = await fetch('portfolioData.json');
        const data = await response.json();
        displayProjects(data.projects);
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function displayProjects(projects) {
    const projectsList = document.getElementById('projectsList');
    
    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'projectBox';
        
        // Make the entire project box clickable
        const projectLink = document.createElement('a');
        projectLink.href = project.link;
        projectLink.target = "_blank";
        projectLink.rel = "noopener noreferrer";
        
        const techTags = project.technologies
            .map(tech => `<span class="techTag">${tech}</span>`)
            .join(' ');

        projectLink.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="techTags">${techTags}</div>
        `;

        projectDiv.appendChild(projectLink);
        projectsList.appendChild(projectDiv);
    });
}

loadProjects();
