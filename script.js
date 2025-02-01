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

        const techTags = project.technologies.map(x => `<span class="techTag">${x}</span>`).join(' ');

        projectDiv.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div>${techTags}</div>
        `;

        projectsList.appendChild(projectDiv);
    });
}

loadProjects();
