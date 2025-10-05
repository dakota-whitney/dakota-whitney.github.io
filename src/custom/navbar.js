export class NavBar {
    constructor(...navLinks){
        const brand = document.querySelector('.navbar-brand');
        const navBar = document.querySelector('ul.navbar-nav');

        for(const link of navLinks){
            const pageNav = document.createElement('li');
            pageNav.classList.add('nav-item');
            pageNav.innerHTML = `<a class='nav-link' aria-current='page'>${link}</a>`;
            navBar.append(pageNav);
        };

        return [brand, ...navBar.children]
    };
}