document.addEventListener('DOMContentLoaded', () => {
    const username = 'nataferreiradev';

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
            title: "My DBMS",
            description: "A relational database written from scratch in Go for study: parser, slotted pages, B+tree indexes, transactions and a TCP server.",
            descriptionPt: "Um banco de dados relacional escrito do zero em Go para estudo: parser, páginas com slots, índices B+tree, transações e servidor TCP.",
            stack: ["Go", "SQL"],
            link: "src/pages/projects/my_dbms.html",
            working: true,
        },
        {
            title: "Chess Notation Parser",
            description: "A Go parser that turns chess algebraic notation (e.g. Bxe4) into structured moves.",
            descriptionPt: "Um parser em Go que transforma a notação algébrica de xadrez (ex.: Bxe4) em lances estruturados.",
            stack: ["Go", "Parser"],
            link: "src/pages/projects/chess_notation_parser.html",
            working: true,
        }
    ];

    renderProjects(projects, username);
    renderPosts(posts);
    renderTabNewsPosts(username);
    startTerminal();
    startParallax();

    if (window.i18nApply) window.i18nApply();
});

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function translatable(node, en, pt) {
    node.textContent = en;
    if (pt) {
        node.setAttribute('data-en', en);
        node.setAttribute('data-pt', pt);
    }
    return node;
}

function renderProjects(projects, username) {
    const container = document.getElementById('projects-container');

    projects.forEach((project, i) => {
        const card = el('a', 'card');
        card.href = project.link;

        const top = el('div', 'card-top');
        top.appendChild(el('span', '', String(i + 1).padStart(2, '0')));
        if (project.working) {
            top.appendChild(translatable(el('span', 'status'), 'In progress', 'Em andamento'));
        }

        const chips = el('div', 'chips');
        project.stack.forEach(s => chips.appendChild(el('span', 'chip', s)));

        card.appendChild(top);
        card.appendChild(el('h3', '', project.title));
        card.appendChild(translatable(el('p'), project.description, project.descriptionPt));
        card.appendChild(chips);
        container.appendChild(card);
    });

    const more = el('a', 'card card-more');
    more.href = `https://github.com/${username}`;
    more.target = '_blank';
    more.rel = 'noopener';
    more.appendChild(translatable(el('h3'), 'More on GitHub →', 'Mais no GitHub →'));
    more.appendChild(translatable(el('p'), 'Experiments, tools and everything else I am building.', 'Experimentos, ferramentas e tudo mais que estou construindo.'));
    container.appendChild(more);
}

function postRow({ href, external, meta, title, titlePt, desc, descPt, src, srcPt }) {
    const row = el('a', 'row');
    row.href = href;
    if (external) {
        row.target = '_blank';
        row.rel = 'noopener';
    }

    const body = el('span', 'row-body');
    body.appendChild(translatable(el('span', 'row-title'), title, titlePt));
    if (desc) body.appendChild(translatable(el('span', 'row-desc'), desc, descPt));

    row.appendChild(el('span', 'row-meta', meta));
    row.appendChild(body);
    row.appendChild(translatable(el('span', 'row-src'), src, srcPt));
    return row;
}

function renderPosts(posts) {
    const container = document.getElementById('posts-container');
    posts.forEach((post, i) => {
        container.appendChild(postRow({
            href: post.link,
            meta: `my_dbms · ${String(i + 1).padStart(2, '0')}`,
            title: post.title,
            titlePt: post.titlePt,
            desc: post.content,
            descPt: post.contentPt,
            src: 'Article →',
            srcPt: 'Artigo →',
        }));
    });
}

function renderTabNewsPosts(username) {
    const container = document.getElementById('posts-container');

    getTabNewsPosts(username).then(posts => {
        if (posts.length === 0) {
            if (container.children.length > 0) return;
            container.appendChild(translatable(el('p', 'empty'), 'No posts to show.', 'Nenhum post para mostrar.'));
        }

        posts.forEach(post => {
            container.appendChild(postRow({
                href: post.link,
                external: true,
                meta: post.date || 'TabNews',
                title: post.title,
                desc: post.content,
                src: 'TabNews ↗',
            }));
        });

        if (window.i18nApply) window.i18nApply();
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
                    date: post.published_at ? post.published_at.slice(0, 10) : '',
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

function prefersReducedMotion() {
    try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
        return false;
    }
}

// Terminal do hero: digita alguns comandos e termina numa chuva em ASCII.
function startTerminal() {
    const body = document.getElementById('term-body');
    if (!body) return;

    const isPt = () => document.documentElement.lang.startsWith('pt');
    const script = [
        { k: 'cmd', t: 'whoami' },
        { k: 'out', t: 'Natã Ferreira' },
        { k: 'out', t: () => isPt() ? 'desenvolvedor full stack' : 'full stack developer' },
        { k: 'cmd', t: 'ls ~/stack' },
        { k: 'out', t: 'mobile/   api/   web/   db/' },
        { k: 'cmd', t: './rain.sh' },
        { k: 'anim' }
    ];
    const text = s => typeof s.t === 'function' ? s.t() : s.t;

    let st = { lines: [], cur: '', step: 0, chars: 0, wait: 0, frame: -1 };

    function draw(typing) {
        body.textContent = '';
        st.lines.forEach(l => body.appendChild(el('pre', 'l-' + l.k, l.t)));
        if (typing) {
            const pre = el('pre', 'l-cmd');
            pre.appendChild(el('span', 'prompt', '$ '));
            pre.appendChild(document.createTextNode(st.cur));
            pre.appendChild(el('span', 'blk'));
            body.appendChild(pre);
        }
    }

    if (prefersReducedMotion()) {
        st.lines = script.map(s => {
            if (s.k === 'cmd') return { k: 'cmd', t: '$ ' + s.t };
            if (s.k === 'out') return { k: 'out', t: text(s) };
            return { k: 'art', t: rainFrame(0) };
        });
        draw(false);
        return;
    }

    function reset(wait) {
        st = { lines: [], cur: '', step: 0, chars: 0, wait: wait, frame: -1 };
    }

    function tick() {
        if (st.wait > 0) { st.wait--; return; }
        const s = script[st.step];
        if (!s) { reset(6); draw(false); return; }

        if (s.k === 'cmd') {
            if (st.chars < s.t.length) {
                st.chars++;
                st.cur = s.t.slice(0, st.chars);
                draw(true);
            } else {
                st.lines.push({ k: 'cmd', t: '$ ' + s.t });
                st.cur = '';
                st.chars = 0;
                st.step++;
                st.wait = 4;
                draw(false);
            }
            return;
        }

        if (s.k === 'out') {
            st.lines.push({ k: 'out', t: text(s) });
            st.step++;
            st.wait = 3;
            draw(false);
            return;
        }

        st.frame++;
        if (st.frame > 74) { reset(8); draw(false); return; }
        if (st.lines.length && st.lines[st.lines.length - 1].k === 'art') st.lines.pop();
        st.lines.push({ k: 'art', t: rainFrame(st.frame) });
        draw(false);
    }

    setInterval(tick, 55);
}

function rainFrame(f) {
    const rows = 9, cols = 32, chars = ['█', '▓', '▒', '░'];
    const grid = [];
    for (let r = 0; r < rows; r++) grid.push(new Array(cols).fill(' '));

    for (let j = 0; j < cols; j++) {
        const tail = 2 + ((j * 17) % 3);
        const cycle = rows + tail + 4 + ((j * 23) % 13);
        const speed = 0.26 + ((j * 37) % 11) / 24;
        const p = Math.floor((f * speed + ((j * 53) % 41)) % cycle);
        for (let k = 0; k < tail; k++) {
            const y = p - k;
            if (y >= 0 && y < rows) grid[y][j] = chars[Math.min(k, chars.length - 1)];
        }
    }
    return grid.map(r => r.join('')).join('\n');
}

// Partículas do hero seguem o mouse em duas profundidades.
function startParallax() {
    if (prefersReducedMotion()) return;
    const layers = document.querySelectorAll('.layer');
    if (!layers.length) return;

    let frame = 0;
    window.addEventListener('mousemove', e => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
            frame = 0;
            const mx = e.clientX / (window.innerWidth || 1) - 0.5;
            const my = e.clientY / (window.innerHeight || 1) - 0.5;
            layers.forEach(layer => {
                const dx = Math.round(mx * Number(layer.dataset.depthX));
                const dy = Math.round(my * Number(layer.dataset.depthY));
                layer.style.transform = `translate(${dx}px, ${dy}px)`;
            });
        });
    });
}
