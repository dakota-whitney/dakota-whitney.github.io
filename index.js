import { Repo, titleCase } from "./repos.js";

const nav = document.querySelector('nav');
const navToggle = document.querySelector('i');

navToggle.onclick = e => {
    e.target.classList.toggle('dsg');
    nav.firstElementChild.classList.toggle('d-none');
    nav.classList.toggle('w-0');
};

Repo.repos().then(async repos => {
    if(!repos) {
        const alert = document.createElement('div');
        alert.classList.add('alert', 'alert-danger');
        alert.role = 'alert';

        alert.innerText = 'Failed to load repositories. Please try again later';
        return document.querySelector('.repo').innerHTML = alert.innerHTML;
    };

    for(const repo of repos){
        console.log(repo.name);

        const navItem = document.createElement('li');
        navItem.classList.add('nav-item');
        navItem.innerHTML = `<a class="nav-link">${titleCase(repo.name)}</a>`;

        navItem.onclick = () => new Repo(repo.name);
        nav.firstElementChild.append(navItem);
    };

    new Repo(repos[0].name);
});