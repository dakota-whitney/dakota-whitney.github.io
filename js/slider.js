import { AboutPage } from "./components/about.js"
import { ProjectsPage } from "./components/projects.js"
import { ResumePage } from "./components/resume.js"
import { CredentialsPage } from "./components/credentials.js"
import { ContactPage } from "./components/contact.js"

export class Slider extends HTMLElement {
  static content = new Map([
    ["about", AboutPage],
    ["projects", ProjectsPage],
    ["resume", ResumePage],
    ["credentials", CredentialsPage],
    ["contact", ContactPage]
  ])
  static customPrefix(customName){
    return customName.replace(/(?<=[a-z])[A-Z]\w+/, "").toLowerCase();
  }
  static customTag(customName) {
    return customName.replace(/(?<=[a-z])[A-Z]/, m => "-" + m).toLowerCase();
  }
  static customTemplate(customName){
    const templateId = this.customPrefix(customName) + "-template";
    const template = document.getElementById(templateId).content.cloneNode(true);
    return(template);
  }
  static {
    const nav = document.querySelector("ul.navbar-nav");

    for(const [page, custom] of this.content){
      const pageNav = document.createElement("li");
      pageNav.classList.add("nav-item");
      pageNav.innerHTML = `<a class="nav-link" aria-current="page">${page[0].toUpperCase() + page.substring(1)}</a>`;
      nav.append(pageNav);

      const tag = this.customTag(custom.name);
      customElements.define(tag, custom)
      const customPage = document.createElement(tag, {is: tag});

      const template = this.customTemplate(custom.name);
      customPage.append(template);

      customPage.id = tag;
      customPage.classList.add("carousel-item");
      console.log(customPage);

      this.content.set(page, customPage);
    };

    this.nav = [...nav.children];
    this.prefix = this.name.toLowerCase();
    this.tag = "dw-" + this.prefix;
    this.template = document.getElementById(`${this.prefix}-template`).content;
  }
  static observedAttributes = ["children"];
  constructor(){
    const root = super();
    this._root = root;
    this._content = new Map()
  }
  get root(){
    return this._root;
  }
  set root(domEl){
    this._root = domEl;
  }
  get content(){
    return this._content;
  }
  set content(contentCard = {contentId: String, contentEl: HTMLElement}){
    const {contentId, contentEl} = contentCard;
    this._content.set(contentId, contentEl);
  }
  connectedCallback(){
    console.log(this.root.nodeName + " connected to DOM");
    const {prefix, template, nav} = Slider;

    this.root.append(template.cloneNode(true));
    [this.root] = this.root.children;
    this.root.id = document.getElementById(prefix) ? `${this.parentElement.id}-${prefix}`: prefix;

    const controls = this.root.querySelectorAll("button[class*='carousel-control']");
    for(const control of controls) control.setAttribute("data-bs-target", "#" + this.root.id);

    const innerRoot = this.root.querySelector(".carousel-inner");
    const content = this.root.id === prefix ? Slider.content : this.content;

    for(const [,contentEl] of content) innerRoot.append(contentEl);
    const carousel = bootstrap.Carousel.getOrCreateInstance(this.root);

    if(this.root.id === prefix){
      Slider.carousel = carousel;
      nav.forEach((pageNav, i) => pageNav.addEventListener("click", () => Slider.carousel.to(i)));
    };

    innerRoot.children[0].classList.add("active");
    this.carousel = carousel;
  }

  attributeChangedCallback(name, oldValue, newValue){
    console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}`);
  }
}