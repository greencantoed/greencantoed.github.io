// Fetch projects from the server
async function fetchProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        return projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Render project cards
function renderProjects(projects) {
    const projectList = document.getElementById('project-list');
    const template = document.getElementById('project-card-template');

    projectList.innerHTML = '';

    projects.forEach(project => {
        const card = template.content.cloneNode(true);
        
        card.querySelector('.project-image').src = project.imageUrl;
        card.querySelector('.project-title').textContent = project.title;
        card.querySelector('.project-description').textContent = project.description;
        card.querySelector('.current-funding').textContent = `$${project.currentFunding}`;
        card.querySelector('.funding-goal').textContent = `$${project.fundingGoal}`;
        
        const progress = (project.currentFunding / project.fundingGoal) * 100;
        card.querySelector('.funding-progress').value = progress;
        
        card.querySelector('.invest-button').href = `/project/${project.id}`;

        projectList.appendChild(card);
    });
}

// Handle search and filtering
function handleSearch(event) {
    event.preventDefault();
    
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const projectType = document.getElementById('project-type').value;
    const investmentRange = document.getElementById('investment-range').value;

    // Filter projects based on search criteria
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm) || 
                              project.description.toLowerCase().includes(searchTerm);
        const matchesType = projectType === '' || project.type === projectType;
        const matchesRange = investmentRange === '' || 
                             (investmentRange === '0-1000' && project.minimumInvestment <= 1000) ||
                             (investmentRange === '1001-5000' && project.minimumInvestment > 1000 && project.minimumInvestment <= 5000);
        
        return matchesSearch && matchesType && matchesRange;
    });

    renderProjects(filteredProjects);
}

// Initialize the page
async function init() {
    const projects = await fetchProjects();
    renderProjects(projects);

    document.getElementById('search-filter-form').addEventListener('submit', handleSearch);
}

init();
