export class Pages extends HTMLElement {
  static tag(className){
    const camelCase = /(?<=[a-z])[A-Z]/g;
    const snakeCase = className.replace(camelCase, m => '-' + m);
    return snakeCase.toLowerCase();
  };
  constructor(navItems = [], ...pages){
    super();
    if(!navItems.length || !pages.length) return;

    this.root = document.querySelector('.carousel');
    this.carousel = bootstrap.Carousel.getOrCreateInstance(this.root);

    const innerRoot = this.root.querySelector('.carousel-inner');

    for(const page of pages){
      const carouselPage = document.createElement(page.tag, {is: page.tag});
      carouselPage.classList.add('carousel-item');
      innerRoot.append(carouselPage);
    };
    
    navItems[0].addEventListener('click', () => this.carousel.to(0));
    navItems.slice(1).forEach((nav, i) => nav.addEventListener('click', () => this.carousel.to(i + 1)));
    
    innerRoot.children[0].classList.add('active');
  };
  cloneTemplate(customTag){
    console.log(customTag + " connected to DOM");
    const template = document.getElementById(customTag);
    const templateClone = template.content.cloneNode(true);
    this.append(templateClone);
  };
};

customElements.define('page-elements', Pages);