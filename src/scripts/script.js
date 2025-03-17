document.addEventListener('DOMContentLoaded', () => {
    const posts = [];

    const projects = [
        {
            title: "My DMBS",
            description: "A free DBMS made with Go for study purposes.",
            link: "../pages/projects/my_dbms.html",
            working: true,
        }
    ];

    const postsContainer = document.getElementById('posts-container');
    if(posts.length === 0) {
        const noPosts = document.createElement('p');
        noPosts.textContent = 'No posts to show.';
        postsContainer.appendChild(noPosts);
    }
    posts.forEach(post => {
        const postLink = document.createElement('a');
        const postDiv = document.createElement('div');
        const postTitle = document.createElement('h3');
        const postContent = document.createElement('p');

        postTitle.textContent = post.title;
        postContent.textContent = post.content;
        postLink.href = post.link;

        postDiv.appendChild(postTitle);
        postDiv.appendChild(postContent);
        postLink.appendChild(postDiv);
        postsContainer.appendChild(postLink);
    });

    const projectsSection = document.getElementById('projetos');
    if(projects.length === 0) {
        const noProjects = document.createElement('p');
        noProjects.textContent = 'No projects to show.';
        projectsSection.appendChild(noProjects);
    }
    projects.forEach(project => {
        const projectLink = document.createElement('a');
        const projectDiv = document.createElement('div');
        const projectTitle = document.createElement('h3');
        const projectDescription = document.createElement('p');

        projectTitle.textContent = project.title;
        projectDescription.textContent = project.description;
        projectLink.href = project.link;

     if (project.working) {
            const workingContainer = document.createElement('span');
            const workingIcon = document.createElement('i');
            const workingText = document.createElement('span');

            workingIcon.className = 'fas fa-tools'; 
            workingText.textContent = 'In Progress';

            workingContainer.appendChild(workingText);
            workingContainer.appendChild(workingIcon);
            projectTitle.appendChild(workingContainer);
        }

        projectDiv.appendChild(projectTitle);
        projectDiv.appendChild(projectDescription);
        projectLink.appendChild(projectDiv);
        projectsSection.appendChild(projectLink);
    });
});