import { Octokit } from "https://esm.sh/octokit";
import { CustomTemplate, customTag } from "./custom.js";

export class ProjectsPage extends CustomTemplate {
    static gh = new Octokit({}).rest
    static username = "dakota-whitney"
    static get repos(){
        return this.gh.repos.listForUser({username: this.username});
    }
    static ghQuery = {
        owner: this.username,
        headers: {
            "X-GitHub-Api-Version": "2022-11-28"
        }
    }
    constructor(){
        super();
        this._repos = new Map();
        customElements.define(RepoTab.tag, RepoTab);
    }
    async connectedCallback(){
        const {name} = this.constructor;
        console.log(name + " connected to DOM");
        this.cloneTemplate(name);

        const [repo] = await this.fetchRepos(1);
        await this.fetchCode(repo);
        console.log(this.repos);
    }
    async fetchRepos(n){
        const {data: repos} = await ProjectsPage.repos;
        return repos
            .sort(({updated_at: a}, {updated_at: b}) => new Date(b) - new Date(a))
            .map(({name}) => name)
            .slice(0, n);
    }
    async fetchCode(repo, branch = "main"){
        const {gh, ghQuery} = ProjectsPage;
        const query = {...ghQuery, repo: repo};

        let {data: {tree}} = await gh.git.getTree({...query, tree_sha: branch, recursive: "true"});
        tree = tree
            .filter(({type, path}) => type == "blob" && path.match(/\.html|css|js$/) && !path.match(/config|\.json/))
            .map(({path}) => path);

        const codeMap = new Map()
        for(const file of tree){
            const {data: {content}} = await gh.repos.getContent({...query, path: file});
            codeMap.set(file, atob(content));
        };

        this.repos = [repo, codeMap];
        this.showCode(repo, tree[0]);
        return codeMap;
    }
    get repos(){
        return this._repos;
    }
    set repos([repo, code]){
        const repoTabs = this.querySelector(".nav-tabs")
        const repoTab = document.createElement(RepoTab.tag, {is: RepoTab.tag});

        repoTabs.append(repoTab);
        repoTab.id = repo;
        repoTab.querySelector(".nav-link").innerText = repoTab.id;

        const listGroup = repoTab.querySelector(".list-group");
        for(const filePath of code.keys()){
            const fileItem = document.createElement("li");
            fileItem.classList.add("list-group-item");
            fileItem.onclick = () => this.showCode(repo, filePath);
            fileItem.innerText = filePath.split("/").pop();
            listGroup.append(fileItem);
        };

        this._repos.set(repo, code);
    }
    showCode(repo, filePath){
        const repoTab = document.getElementById(repo);
        repoTab.querySelector("ol.breadcrumb").innerHTML = filePath.split("/")
            .map(path => `<li class="breadcrumb-item" aria-current="page">${path}`)
            .join("</li>") + "</li>";
        repoTab.querySelector("code").innerText = this.repos.get(repo).get(filePath);
    }
}

class RepoTab extends CustomTemplate {
    static tag = customTag(this.name);
    constructor(){
        super();
    }
    connectedCallback(){
        const {name} = this.constructor;
        this.cloneTemplate(name);
    }
  };