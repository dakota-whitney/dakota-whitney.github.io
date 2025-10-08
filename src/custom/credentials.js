import { Pages } from "./pages.js";

export class CredentialsPage extends HTMLElement {
    static title = Pages.title(this.name);
    static tag = Pages.tag(this.name);
    constructor(){
        super();
        this.credentials = {
            "public/img/sps.png": "https://basno.com/users/dakotawhitney",
            "public/img/codecademy.png": "https://www.codecademy.com/profiles/dakota-whitney",
            "public/img/fcc.png": "https://www.freecodecamp.org/dakota-whitney"
        };
    };
    connectedCallback(){
        console.log(this.constructor.name + ' connected to DOM');
        const credLinks = this.querySelector('#credential-links');
        
        for(const img in this.credentials){
            const credLink = document.createElement('a');
            credLink.classList.add('credential');
            credLink.target = '_blank';
            credLink.href = this.credentials[img];

            const alt = img.split("/").pop();
            credLink.innerHTML = `<img src="${img}" class="credential-img" alt="${alt}" />`
            credLinks.append(credLink);
        };
    };
};