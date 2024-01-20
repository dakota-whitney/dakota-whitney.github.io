import { CustomTemplate, customPrefix } from "./custom.js";
import { rId } from "../../../src/config.js";

export class ResumePage extends CustomTemplate {
    static prefix = customPrefix(this.name);
    static base = new URL(`document/d/e/${rId}/pub`, "https://docs.google.com");
    constructor(){
        super();
    }
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        const {base, prefix} = ResumePage;
        this.cloneTemplate(this.constructor.name);
        
        const rURL = new URL(base.href);
        rURL.search = new URLSearchParams({embedded: true});
        this.querySelector("#resume").src = rURL;
    }
}