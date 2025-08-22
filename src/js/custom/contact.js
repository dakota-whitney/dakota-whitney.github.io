import { CustomTemplate } from "./custom.js";

export class ContactPage extends CustomTemplate {
    constructor(){
        super();
    }
    connectedCallback(){
        const {name} = this.constructor;
        console.log(name + " connected to DOM");
        this.cloneTemplate(name);
    }
}