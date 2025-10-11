import { Pages } from "./pages.js";

export class CredentialsPage extends HTMLElement {
    static title = Pages.title(this.name);
    static tag = Pages.tag(this.name);
    constructor(){
        super();
        this.credentials = {
            sps: "https://basno.com/users/dakotawhitney",
            codecademy: "https://www.codecademy.com/profiles/dakota-whitney",
            fcc: "https://www.freecodecamp.org/dakota-whitney"
        };
    };
    connectedCallback(){
        console.log(this.constructor.name + ' connected to DOM');
        const credLinks = this.querySelector('#credential-links');
        
        for(let img in this.credentials){
            const credLink = document.createElement('a');
            credLink.classList.add('credential');
            credLink.target = '_blank';
            credLink.href = this.credentials[img];

            img = `public/img/${img}.png`;
            credLink.innerHTML = `<img src="${img}" class="img-fluid credential-img" alt="${img}" />`
            credLinks.append(credLink);
        };
    };
};