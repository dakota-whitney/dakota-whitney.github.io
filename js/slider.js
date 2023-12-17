import { AboutPage } from "./components/about.js"
import { ProjectsPage } from "./components/projects.js"
import { ResumePage } from "./components/resume.js"
import { CredentialsPage } from "./components/credentials.js"
import { ContactPage } from "./components/contact.js"

export class Slider {
  static content = {
    about: AboutPage,
    projects: ProjectsPage,
    resume: ResumePage,
    credentials: CredentialsPage,
    contact: ContactPage
  }
  static tag(customName) {
    return customName.replace(/(?<=[a-z])[A-Z]/, m => "-" + m).toLowerCase();
  }
  static {
    const carousel = document.getElementById(this.name.toLowerCase());
    this.carousel = bootstrap.Carousel.getOrCreateInstance(carousel);
  }
}