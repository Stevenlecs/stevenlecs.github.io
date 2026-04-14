export function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'group relative p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-accent transition-all duration-300';
    
    const link = document.createElement('a');
    link.href = project.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'block h-full';

    const techTags = project.technologies
        .map(tech => `<span class="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-primary border border-accent mr-2 mb-2 inline-block hover:bg-accent transition-colors">${tech}</span>`)
        .join('');

    link.innerHTML = `
        <h3 class="text-xl font-medium italic mb-3 group-hover:text-gray-600 transition-colors">${project.title}</h3>
        <p class="text-gray-600 mb-4 leading-relaxed">${project.description}</p>
        <div class="flex flex-wrap">${techTags}</div>
    `;

    card.appendChild(link);
    return card;
}
