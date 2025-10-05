import { Pages } from "./pages.js";

export class ContactPage extends Pages {
    static tag = Pages.tag(this.name);
    constructor(){
        super();
    }
    connectedCallback(){
        this.cloneTemplate(ContactPage.tag)
    };
};

customElements.define(ContactPage.tag, ContactPage);