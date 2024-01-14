import { CustomTemplate } from "./custom.js";

export class ResumePage extends CustomTemplate {
    constructor(){
        super();
    }
    connectedCallback(){
        //console.log(this.constructor.name + " connected to DOM");
        this.cloneTemplate(this.constructor.name);
    }
}