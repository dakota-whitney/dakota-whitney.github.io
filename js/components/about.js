import config from "./config.json" assert {type: 'json'};

export class AboutPage extends HTMLElement {
    constructor(){
        super();
        AboutPage.shadowRoot = this.attachShadow({mode: "open"});
    }
    async connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");

        // const response = await fetch(`https://script.google.com/macros/s/${config.gId}/exec?page=about`);
        // const likes = await response.json();
        // console.log(likes);
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