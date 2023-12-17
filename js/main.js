import { Slider } from "./slider.js";

const carouselItems = document.querySelector('.carousel-inner');
const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');

Object.entries(Slider.content).forEach(([id, content], i) => {
    const tag = Slider.tag(content.name);
    customElements.define(tag, content);

    const contentTitle = id[0].toUpperCase() + id.substring(1);

    const contentNav = document.createElement('li');
    contentNav.classList.add('nav-item');
    contentNav.innerHTML = `<a class="nav-link" aria-current="page">${contentTitle}</a>`;
    document.querySelector('ul.navbar-nav').append(contentNav);

    const contentPage = document.createElement(tag);
    contentPage.id = tag;
    contentPage.classList.add('carousel-item');
    console.log(contentPage.tagName);

    styleSheets.forEach(styleSheet => contentPage.shadowRoot.prepend(styleSheet.cloneNode(false)));

    const template = document.getElementById(`${id}-template`).content;
    contentPage.shadowRoot.appendChild(template.cloneNode(true));

    carouselItems.append(contentPage);
    contentNav.addEventListener('click', () => Slider.carousel.to(i));
});

carouselItems.children[0].classList.add('active');