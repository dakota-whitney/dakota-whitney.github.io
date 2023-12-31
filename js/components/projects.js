import { Octokit } from "https://esm.sh/octokit";

export class ProjectsPage extends HTMLElement {
    static gh = new Octokit({}).rest;
    static username = "dakota-whitney"
    static ghQuery = {
        owner: this.username,
        headers: {
            "X-GitHub-Api-Version": "2022-11-28"
        }
    }
    constructor(){
        super();
        this.repos = new Map();
    }
    async connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        const {gh, username} = ProjectsPage;

        let {data: repos} = await gh.repos.listForUser({username: username});
        repos = repos.sort(({updated_at: a}, {updated_at: b}) => new Date(b) - new Date(a))
            .map(({name}) => name)
            .slice(0,3);

        for(const repo of repos) await this.fetchCode(repo);
        console.log(this.repos)
    }
    async fetchCode(repo, tree_sha = "main"){
        const {gh, ghQuery} = ProjectsPage;
        const query = {...ghQuery, repo: repo}

        let {data: {tree}} = await gh.git.getTree({...query, tree_sha: tree_sha, recursive: "true"});
        tree = tree.filter(({type}) => type == "blob").map(({path}) => path);

        for(const file of tree){
            const {data: {content}} = await gh.repos.getContent({...query, path: file});
            this.repos.set(repo, atob(content));
        };
        
        return this.repos;
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