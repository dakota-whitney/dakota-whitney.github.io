import { CustomTemplate, customTag, customPrefix } from "./custom.js";

export class AboutPage extends CustomTemplate {
    static prefix = customPrefix(this.name);
    static tag = customTag(this.name);
    static contactLinks = {
        "envelope-fill": "mailto:whitneydakota@gmail.com",
        "github": "https://github.com/dakota-whitney",
        "linkedin": "https://www.linkedin.com/in/dakotawhitney/"
    };
    constructor(){
        super();
    };
    connectedCallback(){
        const {name: pageName} = this.constructor;
        this.cloneTemplate(pageName);
        const {contactLinks} = AboutPage;
        Object.entries(contactLinks).forEach(this.addContactLink, this);
    };
    addContactLink([icon, link], i){
        const contactElements = this.querySelector(".contact-items");
        const contactIcons = contactElements.querySelectorAll("i");
        contactIcons[i].classList.add("bi", `bi-${icon}`)
        
        const contactLinks = contactElements.querySelectorAll("a");
        contactLinks[i].href = link
    };
};