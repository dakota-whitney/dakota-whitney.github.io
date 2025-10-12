export class NavBar {
    constructor(pages){
        const brand = document.querySelector('.navbar-brand');
        const navBar = document.querySelector('ul.navbar-nav');

        for(const page of pages.slice(1)){
            const pageNav = document.createElement('li');
            pageNav.classList.add('nav-item');
            pageNav.innerHTML = `<a class='nav-link' aria-current='page'>${page.title}</a>`;
            navBar.append(pageNav);
        };

        return [brand, ...navBar.children]
    };
};