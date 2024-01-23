import { CustomTemplate } from "./custom.js";
import { cId, isMobile } from "../../../src/config.js";

export class CredentialsPage extends CustomTemplate {
    static base = new URL("https://drive.google.com");
    constructor(){
        super();
        const {base} = CredentialsPage;
        this.cURL = new URL(`file/d/${cId}/preview`, base.href);
    }
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        this.cloneTemplate(this.constructor.name);
        const fsWeb = this.querySelector("#fs-web")
        fsWeb.src = this.cURL;
        if(!isMobile) fsWeb.width = "700";
    }
}