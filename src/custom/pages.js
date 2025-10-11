export class Pages {
  static tag(className){
    const camelCase = /(?<=[a-z])[A-Z]/g;
    const snakeCase = className.replace(camelCase, m => '-' + m);
    return snakeCase.toLowerCase();
  };
  static title(className){
    const [title] = className.match(/[A-Z][a-z]+/);
    return title;
  };
  static mobile = window.matchMedia("(width < 768px)");
  constructor(navItems, pages){
    this.root = document.querySelector('.carousel');
    this.carousel = bootstrap.Carousel.getOrCreateInstance(this.root);
    
    const innerRoot = this.root.querySelector('.carousel-inner');
    const templates = document.querySelectorAll('template[id$="page"]');

    pages.forEach((page, i) => {
      customElements.define(page.tag, page);
      const carouselPage = document.createElement(page.tag, {is: page.tag});
      carouselPage.classList.add('carousel-item');
      carouselPage.append(templates[i].content.cloneNode(true));
      innerRoot.append(carouselPage);
    });
    
    navItems[0].addEventListener('click', () => this.carousel.to(0));
    navItems.slice(1).forEach((nav, i) => nav.addEventListener('click', () => this.carousel.to(i + 1)));
    
    innerRoot.children[0].classList.add('active');
  };
};