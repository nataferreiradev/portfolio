document.addEventListener('DOMContentLoaded', () => {
    typeHeroName();

    const username = 'nataferreiradev';
    let tabNewsPostsCount = renderTabNewsPosts(username);

    const posts = [];

    const projects = [
        {
            title: "My DMBS",
            description: "A free DBMS made with Go for study purposes.",
            descriptionPt: "Um DBMS gratuito feito em Go para fins de estudo.",
            link: "src/pages/projects/my_dbms.html",
            working: true,
        },
        {
            title: "Chess Notation Parser",
            description: "A Go parser that turns chess algebraic notation (e.g. Bxe4) into structured moves.",
            descriptionPt: "Um parser em Go que transforma a notação algébrica de xadrez (ex.: Bxe4) em lances estruturados.",
            link: "src/pages/projects/chess_notation_parser.html",
            working: true,
        }
    ];

    const postsContainer = document.getElementById('posts-container');
    if((posts.length+tabNewsPostsCount) === 0) {
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
        noProjects.setAttribute('data-pt', 'Nenhum projeto para mostrar.');
        projectsSection.appendChild(noProjects);
    }
    projects.forEach(project => {
        const projectLink = document.createElement('a');
        const projectDiv = document.createElement('div');
        const projectTitle = document.createElement('h3');
        const projectDescription = document.createElement('p');

        projectTitle.textContent = project.title;
        projectDescription.textContent = project.description;
        if (project.descriptionPt) {
            projectDescription.setAttribute('data-en', project.description);
            projectDescription.setAttribute('data-pt', project.descriptionPt);
        }
        projectLink.href = project.link;

     if (project.working) {
            const workingContainer = document.createElement('span');
            const workingIcon = document.createElement('i');
            const workingText = document.createElement('span');

            workingIcon.className = 'fas fa-tools';
            workingText.textContent = 'In Progress';
            workingText.setAttribute('data-en', 'In Progress');
            workingText.setAttribute('data-pt', 'Em andamento');

            workingContainer.appendChild(workingText);
            workingContainer.appendChild(workingIcon);
            projectTitle.appendChild(workingContainer);
        }

        projectDiv.appendChild(projectTitle);
        projectDiv.appendChild(projectDescription);
        projectLink.appendChild(projectDiv);
        projectsSection.appendChild(projectLink);
    });

    if (window.i18nApply) window.i18nApply();
});
function renderTabNewsPosts(username) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // limpa o container

    getTabNewsPosts(username).then(posts => {
        if (posts.length === 0) {
            const noPosts = document.createElement('p');
            noPosts.textContent = 'No posts to show.';
            noPosts.setAttribute('data-pt', 'Nenhum post para mostrar.');
            postsContainer.appendChild(noPosts);
            if (window.i18nApply) window.i18nApply();
            return;
        }

        posts.forEach(post => {
            const postLink = document.createElement('a');
            postLink.href = post.link;
            postLink.target = '_blank';
            postLink.style.textDecoration = 'none';
            postLink.style.color = 'inherit';

            const postDiv = document.createElement('div');
            postDiv.className = 'post';

            const postTitle = document.createElement('h3');
            postTitle.textContent = post.title;

            const postContent = document.createElement('p');
            postContent.textContent = post.content;

            const tag = document.createElement('span');
            tag.textContent = 'TabNews post';
            tag.className = 'tabnews-tag';

            postDiv.appendChild(postTitle);
            postDiv.appendChild(postContent);
            postDiv.appendChild(tag);

            postLink.appendChild(postDiv);
            postsContainer.appendChild(postLink);
        });
    });
}


function getTabNewsPosts(username) {
    return fetch(`https://www.tabnews.com.br/api/v1/contents/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            return data
                .filter(post => post.parent_id === null)
                .map(post => ({
                    title: captalize(post.title),
                    content: post.body ? post.body.substring(0, 100) + '...' : '',
                    link: `https://www.tabnews.com.br/${post.owner_username}/${post.slug}`
                }));
        })
        .catch(error => {
            console.error('Erro:', error);
            return [];
        });
}

function captalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function typeHeroName() {
    const heading = document.querySelector('.home-header h1');
    if (!heading) return;

    const fullText = heading.textContent.trim();
    heading.textContent = '';

    let i = 0;
    const speed = 70;
    (function type() {
        if (i <= fullText.length) {
            heading.textContent = fullText.slice(0, i);
            i++;
            setTimeout(type, speed);
        }
    })();
}
