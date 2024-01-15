import { CustomTemplate, customPrefix } from "./custom.js";

export class ResumePage extends CustomTemplate {
    static prefix = customPrefix(this.name);
    constructor(){
        super();
    }
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        this.cloneTemplate(this.constructor.name);
    }
}