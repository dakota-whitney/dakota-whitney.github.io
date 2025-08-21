import { CustomTemplate } from "./custom.js";
export class CredentialsPage extends CustomTemplate {
    static base = new URL();
    constructor(){
        super();
    }
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        this.cloneTemplate(this.constructor.name);
    }
}