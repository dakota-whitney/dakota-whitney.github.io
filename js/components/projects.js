import { Octokit } from "https://esm.sh/octokit";

export class ProjectsPage extends HTMLElement {
    static octokit = new Octokit({});
    constructor(){
        super();
    }
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        this.fetchCode();
    }
    async fetchCode(){
        const ghReq = {
            owner: "dakota-whitney",
            repo: "dakota-whitney.github.io",
            tree_sha: "main",
            headers: {
                "X-GitHub-Api-Version": "2022-11-28"
            }
        }

        const { data } = await ProjectsPage.octokit.rest.git.getTree(ghReq)
        console.log(data);
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