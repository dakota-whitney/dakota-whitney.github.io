import { AboutPage } from "./components/about.js"
import { ProjectsPage } from "./components/projects.js"
import { ResumePage } from "./components/resume.js"
import { CredentialsPage } from "./components/credentials.js"
import { ContactPage } from "./components/contact.js"
import { customTag, customTemplate } from "./components/utils.js"

export class PageSlider extends HTMLElement {
  static tag = customTag(this.name);
  static pages = new Map([
    ["about", AboutPage],
    ["projects", ProjectsPage],
    ["resume", ResumePage],
    ["credentials", CredentialsPage],
    ["contact", ContactPage]
  ])
  static {
    const navBar = document.querySelector("ul.navbar-nav");

    for(const [page, custom] of this.pages){
      const pageNav = document.createElement("li");
      pageNav.classList.add("nav-item");
      pageNav.innerHTML = `<a class="nav-link" aria-current="page">${page[0].toUpperCase() + page.substring(1)}</a>`;
      navBar.append(pageNav);

      const tag = customTag(custom.name);
      customElements.define(tag, custom);

      const customPage = document.createElement(tag, {is: tag});
      const template = customTemplate(custom.name);
      customPage.append(template);

      customPage.id = tag;
      customPage.classList.add("carousel-item");
      this.pages.set(page, customPage);
    };

    this.navBar = [...navBar.children];
    this.root = document.querySelector(".carousel");
  }
  connectedCallback(){
    console.log(this.nodeName + " connected to DOM");
    const {root, navBar, id: mainId} = PageSlider;

    const innerRoot = root.querySelector(".carousel-inner");
    for(const [,contentCard] of PageSlider.pages) innerRoot.append(contentCard);

    PageSlider.root = bootstrap.Carousel.getOrCreateInstance(root);
    this.id = mainId;

    navBar.forEach((pageNav, i) => pageNav.addEventListener("click", () => PageSlider.root.to(i)));
    innerRoot.children[0].classList.add("active");
  }
  attributeChangedCallback(name, oldValue, newValue){
    console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}`);
  }
};