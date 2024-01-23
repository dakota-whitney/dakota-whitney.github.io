import { CustomTemplate, customPrefix } from "./custom.js";
import { rId } from "../../../src/config.js";

export class ResumePage extends CustomTemplate {
    static prefix = customPrefix(this.name);
    static base = new URL("https://docs.google.com");
    constructor(){
        super();
        const {base} = ResumePage;
        this.rURL = new URL(`document/d/e/${rId}/pub`, base.href);
        this.rURL.search = new URLSearchParams({embedded: true});
    }
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        this.cloneTemplate(this.constructor.name);
        this.querySelector("#resume").src = this.rURL;
    }
}