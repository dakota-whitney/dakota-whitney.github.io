import { customTag } from "./custom/custom.js"
import { AboutPage } from "./custom/about.js"
import { ProjectsPage } from "./custom/projects.js"
import { ResumePage } from "./custom/resume.js"
import { CredentialsPage } from "./custom/credentials.js"

class CustomPages extends HTMLElement {
  static tag = customTag(this.name);
  static pages = new Map([
    ["About", AboutPage],
    ["Projects", ProjectsPage],
    ["Resume", ResumePage],
    ["Credentials", CredentialsPage]
  ])
  static {
    const navBar = document.querySelector("ul.navbar-nav");
    const root = document.querySelector(".carousel");
    const innerRoot = root.querySelector(".carousel-inner");

    for(const [page, custom] of this.pages){
      const pageNav = document.createElement("li");
      pageNav.classList.add("nav-item");
      pageNav.innerHTML = `<a class="nav-link" aria-current="page">${page}</a>`;
      navBar.append(pageNav);

      const tag = customTag(custom.name);
      customElements.define(tag, custom);

      const customPage = document.createElement(tag, {is: tag});
      // customPage.id = tag;
      customPage.classList.add("carousel-item");
      this.pages.set(page, innerRoot.appendChild(customPage));
    };

    this.root = bootstrap.Carousel.getOrCreateInstance(root);
    [...navBar.children].forEach((pageNav, i) => pageNav.addEventListener("click", () => this.root.to(i)));
    innerRoot.children[0].classList.add("active");
  }
};

customElements.define(CustomPages.tag, CustomPages);