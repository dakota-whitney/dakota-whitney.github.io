import { Pages } from "./pages.js";

export class ResumePage extends Pages {
    static tag = Pages.tag(this.name);
    constructor(){
        super();
    };
    connectedCallback(){
        this.cloneTemplate(ResumePage.tag);
    };
};

customElements.define(ResumePage.tag, ResumePage);