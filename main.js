window.onload = async function () {
    const API = {
        getUsers: () => {
            return fetchAPI('users');
        },
        getPosts: (userId) => {
            return fetchAPI('posts', {userId});
        }
    };

    let userList = document.getElementsByClassName('user-list')[0];
    let postList = document.getElementsByClassName('post-list')[0];
    let users = await API.getUsers();

    postList.querySelector('.title .back-btn').addEventListener('click', () => showUsers());
    appendUsers(users);

    function fetchAPI(path, params) {
        const API_URL = 'https://jsonplaceholder.typicode.com';
        let sp = new URLSearchParams();

        if (params) {
            for (key in params) {
                sp.append(key, params[key]);
            }

            path += `?${sp.toString()}`;
        }

        let url = new URL(path, API_URL);

        return fetch(url)
            .then(res => res.json())
            .catch(err => console.log('Error fetching response:', err));
    }

    function appendUsers(users) {
        let userContent = userList.getElementsByClassName('container')[0];

        if (users.length) {
        userContent.innerText = null;

            for (const user of users) {
                let userDiv = createElement('div', null, 'user');
                let name = createElement('p', user.name, 'name');
                let phone = createElement('p', user.phone, 'phone');
                let showPostBtn = createElement('button', 'Show Posts', 'show-post');

                showPostBtn.addEventListener('click', () => showPosts(user.id));

                userDiv.append(name, phone, showPostBtn);
                userContent.appendChild(userDiv);
            }
        }
    }

    function appendPosts(posts, userId) {
        let user = users.filter(user => user.id == userId)[0];
        let postTitle = postList.getElementsByClassName('title')[0];
        let postContent = postList.getElementsByClassName('container')[0];

        postTitle.children[1].innerText = `${user.name}'s Posts`;

        if (posts.length) {
            postContent.innerText = null;

            for (const post of posts) {
                let postDiv = createElement('div', null, 'post');
                let title = createElement('h4', post.title, 'title');
                let content = createElement('p', post.body, 'content');

                postDiv.append(title, content);
                postContent.appendChild(postDiv);
            }
        }
    }

    function showUsers() {
        toggleElement(postList);
        toggleElement(userList);
    }

    async function showPosts(userId) {
        toggleElement(userList);

        let posts = await API.getPosts(userId);

        appendPosts(posts, userId);
        toggleElement(postList);
    }

    function toggleElement(elem) {
        if (elem.classList.contains('hidden')) {
            elem.classList.add('on-hide');
            elem.classList.remove('hidden');

            setTimeout(() => {
                elem.classList.remove('on-hide');
            }, 500);
        } else {
            elem.classList.add('on-hide');

            setTimeout(() => {
                elem.classList.add('hidden');
                elem.classList.remove('on-hide');
            }, 500);
        }
    }

    function createElement(type, text, cssClasses) {
        let element = document.createElement(type);

        if (text) {
            element.innerText = text;
        }

        if (cssClasses) {
            if (Array.isArray(cssClasses)) {
                element.classList.add(...cssClasses);
            } else {
                element.classList.add(cssClasses);
            }
        }

        return element;
    }
};
