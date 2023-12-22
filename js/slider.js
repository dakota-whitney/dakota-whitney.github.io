import { AboutPage } from "./components/about.js"
import { ProjectsPage } from "./components/projects.js"
import { ResumePage } from "./components/resume.js"
import { CredentialsPage } from "./components/credentials.js"
import { ContactPage } from "./components/contact.js"

export class Slider {
  static custom = {
    about: AboutPage,
    projects: ProjectsPage,
    resume: ResumePage,
    credentials: CredentialsPage,
    contact: ContactPage
  }
  static customTag(customName) {
    return customName.replace(/(?<=[a-z])[A-Z]/, m => "-" + m).toLowerCase();
  }
  static customTemplate(customName){
    const templateId = customName.replace(/(?<=[a-z])[A-Z]\w+/, "").toLowerCase() + "-template";
    const template = document.getElementById(templateId).content;
    return(template);
  }
  static {
    const nav = document.querySelector("ul.navbar-nav");

    for(const [page, custom] of Object.entries(this.custom)){
      const tag = this.customTag(custom.name);
      customElements.define(tag, custom)

      const pageNav = document.createElement("li");
      pageNav.classList.add("nav-item");
      pageNav.innerHTML = `<a class="nav-link" aria-current="page">${page[0].toUpperCase() + page.substring(1)}</a>`;
      nav.append(pageNav);

      const customPage = document.createElement(tag);
      const template = this.customTemplate(custom.name);

      customPage.shadowRoot.append(template.cloneNode(true));
      customPage.id = tag;
      customPage.classList.add("carousel-item");

      this.custom[page] = customPage;
    };

    this.nav = [...nav.children];
    this.prefix = this.name.toLowerCase();
    this.template = document.getElementById(`${this.prefix}-template`).content;
  }
  constructor(root = "main", id = Slider.prefix, content = Slider.custom){
    root = document.querySelector(root);
    root.append(Slider.template.cloneNode(true));
    [ root ] = root.children;
    root.id = id;

    const controls = root.querySelectorAll("button[class*='carousel-control']");
    for(const control of controls) control.setAttribute("data-bs-target", "#" + id);

    const styleSheets = document.querySelectorAll("link[rel='stylesheet']");
    const innerRoot = root.querySelector(".carousel-inner");

    for(const [contentId, contentEl] of Object.entries(content)){
      if(id === Slider.prefix){
        for(const styleSheet of styleSheets){
          contentEl.shadowRoot.prepend(styleSheet.cloneNode(false));
        };
      }
      else contentEl.id = contentId;
      content[contentId] = innerRoot.appendChild(contentEl);
    };

    this.carousel = bootstrap.Carousel.getOrCreateInstance(root);

    if(id === Slider.prefix){
      Slider.carousel = this.carousel;
      Slider.nav.forEach((pageNav, i) => {
        pageNav.addEventListener("click", () => Slider.carousel.to(i));
      });
    };

    innerRoot.children[0].classList.add("active");
  }
}