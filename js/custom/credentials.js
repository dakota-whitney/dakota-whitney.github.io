import { CustomTemplate } from "./custom.js";

export class CredentialsPage extends CustomTemplate {
    constructor(){
        super();
    }
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        this.cloneTemplate(this.constructor.name);
    }
    disconnectedCallback() {
        console.log(this.constructor.name + " removed from DOM");
    }
    adoptedCallback() {
        console.log(this.constructor.name + " moved from DOM");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}`);
    }
}