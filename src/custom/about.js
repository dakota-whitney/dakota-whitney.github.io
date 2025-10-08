import { Pages } from "./pages.js";

export class AboutPage extends HTMLElement {
    static title = Pages.title(this.name);
    static tag = Pages.tag(this.name);
    constructor(){
        super();
        this.contactLinks = {
            "envelope-fill": "mailto:whitneydakota@gmail.com",
            "github": "https://github.com/dakota-whitney",
            "linkedin": "https://www.linkedin.com/in/dakotawhitney/"
        };
    };
    connectedCallback(){
        console.log(this.constructor.name + ' connected to DOM');
        Object.entries(this.contactLinks).forEach(this.addContactLink, this);
    };
    addContactLink([icon, link], i){
        const contactElements = this.querySelector(".contact-items");
        const contactIcons = contactElements.querySelectorAll("i");
        contactIcons[i].classList.add("bi", `bi-${icon}`)
        
        const contactLinks = contactElements.querySelectorAll("a");
        contactLinks[i].href = link;
    };
};