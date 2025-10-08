import { Pages } from "./pages.js";

export class ContactPage extends HTMLElement {
    static title = Pages.title(this.name);
    static tag = Pages.tag(this.name);
    constructor(){
        super();
    }
    connectedCallback(){
        console.log(this.constructor.name + ' connected to DOM');
    };
};