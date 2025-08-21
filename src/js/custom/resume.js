import { CustomTemplate, customPrefix } from "./custom.js";

export class ResumePage extends CustomTemplate {
    static prefix = customPrefix(this.name);
    constructor(){
        super();
    }
    connectedCallback(){
        const {name} = this.constructor;
        console.log(name + " connected to DOM");
        this.cloneTemplate(name);
    }
}