// https://kenwheeler.github.io/slick/

//CAROUSEL EFFECT

// Fetch projects asynchronously and update the #projects-container
async function loadProjects() {
    try {
        const response = await fetch('/api/projects'); // Change the API endpoint accordingly
        const projects = await response.json();

        // Clear existing content
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';

        // Render each project
        projects.forEach(project => {
            const projectHtml = `
                <div class="carousel-project">
                    <div class="project-image">
                        <img src="${project.image}" alt="Project Image">
                        <a href="${project.demo}" class="project-title shadow" target="_blank">${project.title}</a>
                    </div>
                    <div class="project-description">${project.description}</div>
                    <div class="stack">
                        <a href="${project.github}" target="_blank">
                            <i class="fa-brands fa-github fa-beat-fade" style="--fa-beat-fade-opacity: 0.80; --fa-beat-fade-scale: 1.075;"></i>
                        </a>
                        <div>${project.technologies}</div>
                    </div>
                </div>
            `;
            projectsContainer.innerHTML += projectHtml;
        });

        // Initialize slick carousel after projects are loaded
        $(document).ready(function(){
            $('.carousel').slick({
                autoplay: true,
                centerMode: true,
                arrows: true,
                dots: true,
                initialSlide: 1,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1
            });
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Call loadProjects after the initial page load
window.addEventListener('load', loadProjects);

