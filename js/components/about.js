export class AboutPage extends HTMLElement {
    constructor(){
        super();
        AboutPage.shadowRoot = this.attachShadow({mode: "open"});
    }
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
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