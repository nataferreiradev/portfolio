document.addEventListener('DOMContentLoaded', () => {
    typeHeroName();

    const username = 'nataferreiradev';
    let tabNewsPostsCount = renderTabNewsPosts(username);

    // Artigos técnicos sobre o my_dbms (src/pages/articles/my_dbms).
    const posts = [
        {
            title: "From text to AST: a hand-written lexer and recursive descent parser",
            titlePt: "Do texto à AST: um lexer escrito à mão e um parser descendente recursivo",
            content: "How my_dbms turns select nome from p where id=1; into a typed Go value, without parser generators, and how fuzzing keeps it from crashing.",
            contentPt: "Como o my_dbms transforma select nome from p where id=1; num valor Go tipado, sem gerador de parser, e como o fuzzing impede que ele quebre.",
            link: "src/pages/articles/my_dbms/01-lexer-parser.html",
        },
        {
            title: "Slotted pages and stable row ids: the on-disk format",
            titlePt: "Páginas com slots e endereços estáveis: o formato em disco",
            content: "Why the project moved from CSV files to fixed-size pages, how a row becomes bytes, and why a deleted row leaves a hole instead of shifting its neighbors.",
            contentPt: "Por que o projeto trocou arquivos CSV por páginas de tamanho fixo, como uma linha vira bytes, e por que apagar uma linha deixa um buraco em vez de empurrar as vizinhas.",
            link: "src/pages/articles/my_dbms/02-pages-and-records.html",
        },
        {
            title: "A B+tree from scratch, and keys that sort as bytes",
            titlePt: "Uma B+tree do zero, e chaves que se ordenam como bytes",
            content: "How indexes are stored, why the root never moves, and the byte-encoding trick that lets the tree compare keys without knowing column types.",
            contentPt: "Como os índices são guardados, por que a raiz nunca muda de lugar, e o truque de codificação que deixa a árvore comparar chaves sem conhecer os tipos das colunas.",
            link: "src/pages/articles/my_dbms/03-btree-and-keys.html",
        },
        {
            title: "All or nothing: transactions and a rollback journal",
            titlePt: "Tudo ou nada: transações e um rollback journal",
            content: "How a multi-row INSERT that fails halfway leaves no trace, and how the database recovers if the process dies in the middle of writing pages to disk.",
            contentPt: "Como um INSERT de várias linhas que falha no meio não deixa rastro, e como o banco se recupera se o processo morrer no meio da gravação das páginas.",
            link: "src/pages/articles/my_dbms/04-transactions-journal.html",
        },
        {
            title: "Three-valued logic and a rule-based query planner",
            titlePt: "Lógica de três valores e um planner baseado em regras",
            content: "Compiling a WHERE clause into closures, why NULL = NULL is not true, and how the planner decides between a full scan and an index range.",
            contentPt: "Compilando o WHERE em closures, por que NULL = NULL não é verdadeiro, e como o planner decide entre varredura completa e um intervalo de índice.",
            link: "src/pages/articles/my_dbms/05-where-and-planner.html",
        },
        {
            title: "A TCP server with a JSON-lines protocol and a readers-writer lock",
            titlePt: "Um servidor TCP com protocolo de linhas JSON e trava de leitores e escritor",
            content: "Exposing the database over the network in about 140 lines of Go: one goroutine per connection, a protocol you can test with nc, and why the lock is per command.",
            contentPt: "Expondo o banco pela rede em cerca de 140 linhas de Go: uma goroutine por conexão, um protocolo que dá para testar com nc, e por que a trava é por comando.",
            link: "src/pages/articles/my_dbms/06-tcp-server.html",
        }
    ];

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
        if (post.titlePt) {
            postTitle.setAttribute('data-en', post.title);
            postTitle.setAttribute('data-pt', post.titlePt);
        }
        if (post.contentPt) {
            postContent.setAttribute('data-en', post.content);
            postContent.setAttribute('data-pt', post.contentPt);
        }
        const tag = document.createElement('span');
        tag.textContent = 'my_dbms';
        tag.className = 'tabnews-tag';
        postDiv.className = 'post';
        postLink.href = post.link;

        postDiv.appendChild(postTitle);
        postDiv.appendChild(postContent);
        postDiv.appendChild(tag);
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
            if (postsContainer.children.length > 0) return;
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
