import { Octokit } from "https://esm.sh/@octokit/rest";
import { Pages } from "./pages.js";

export class ProjectsPage extends HTMLElement {
    static title = Pages.title(this.name);
    static tag = Pages.tag(this.name);
    constructor(){
        super();
        this.gh = new Octokit({});
        this.username = 'dakota-whitney';
        this.query = {
            owner: this.username,
            headers: {'X-GitHub-Api-Version': '2022-11-28'}
        }
        this._repos = new Map();
        customElements.define(RepoTab.tag, RepoTab);
    }
    async connectedCallback(){
        console.log(this.constructor.name + ' connected to DOM');
        
        try {
            const repoNames = await this.fetchRepos();
            const thisRepo = repoNames.find(repoName => repoName.includes(this.username));
        
            const repoFiles = await this.fetchFiles(thisRepo);
            this.repos = [thisRepo, repoFiles];
        }
        catch(e) {
            this.querySelector('.nav').remove();

            const alert = document.createElement('div');
            alert.classList.add('alert', 'alert-warning');
            alert.role = 'alert';
            alert.innerText = 'Cannot load repositories from GitHub at this time. Please try again later.';

            this.querySelector("#projects").append(alert);
        }
    }
    async fetchRepos(n = 0){
        let {data: repos} = await this.gh.repos.listForUser({username: this.username});

        repos = repos
            .sort(({updated_at: a}, {updated_at: b}) => new Date(b) - new Date(a))
            .map(({name}) => name)
        
        return n > 0 ? repos.slice(0, n) : repos;
    }
    async fetchFiles(repo, branch = "main"){
        const query = {...this.query, repo: repo};

        let {data: {tree}} = await this.gh.git.getTree({
            ...query,
            tree_sha: branch,
            recursive: "true"
        });

        const includeExts = /\.(html|css|js|py)$/
        tree = tree
            .filter(({type, path}) => type == "blob" && path.match(includeExts))
            .map(({path}) => path);

        const repoFiles = new Map();

        for(const file of tree){
            const {data: {content}} = await this.gh.repos.getContent({...query, path: file});
            repoFiles.set(file, atob(content));
        };

        return repoFiles;
    }
    get repos(){
        return this._repos;
    }
    set repos([repo, code]){
        const repoTabs = this.querySelector(".nav-tabs");
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
};

class RepoTab extends HTMLElement {
    static tag = Pages.tag(this.name);
    constructor(){
        super();
    };
    connectedCallback(){
        console.log(this.constructor.name + ' created');
    };
};