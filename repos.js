// Import Octokit and trusted HTML types
import { Octokit } from "https://esm.sh/octokit";

// Instantiate new octokit and set user name
const octokit = new Octokit();
const username = "dakota-whitney";

// Set base query for fetching all repositories
const repoQuery = {
    username: username,
    type: "public",
    sort: "updated_at"
};

// Set base query for fetching read me files
const readMeQuery = {
    owner: username,
    mediaType: {
        format: "html"
    },
    headers: {
        "Accept": "application/vnd.github.html+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }
};

const sidebar = document.querySelector(".sidebar-menu");
const spinner = document.querySelector(".spinner-border");
const alert = document.querySelector(".alert");
const repo = document.getElementById("repo");

// Instantiate new DOM parser for the read me file
const parser = new DOMParser();

export class RepoLink extends HTMLElement {
    static async getRepos(){
        this.loading(true);
        try {
            const { data: repos } = await octokit.rest.repos.listForUser(repoQuery);
            repos.forEach(this.append);
            history.replaceState({repo: repos[0].name}, "");
        } catch(error) {
            alert.classList.remove("d-none");
            console.error(error);
        };
        this.loading(false);
    };
    static append(repo, i){
        const repoLink = document.createElement("repo-link");
        repoLink.dataset.repoName = repo.name;
        sidebar.append(repoLink);
        if(!i) repoLink.render();
    };
    static loading(show = true){
        if(show) spinner.classList.remove("d-none");
        else spinner.classList.add("d-none");
    };
    static onNavigate(event){
        if(!event.state) return;
        const repo = event.state.repo;
        const selector = `repo-link[data-repo-name="${repo}"]`;
        sidebar.querySelector(selector).render();
    };
    constructor(){
        super();
        this.onclick = () => this.render();
    };
    connectedCallback(){
        const a = document.createElement("a");
        a.classList.add("nav-link");
        a.href = "#" + this.dataset.repoName;
        a.innerHTML = "<i class='nav-icon bi bi-git'></i>";
        a.innerHTML += `<p>${this.dataset.repoName}</p>`;
        const li = document.createElement("li");
        li.classList.add("nav-item");
        li.append(a);
        this.append(li);
    };
    async render(){
        document.querySelector(".nav-item.active")?.classList.remove("active");
        this.querySelector("a").classList.add("active");
        if(this.readMe) return repo.innerHTML = this.readMe;
        repo.innerHTML = "";

        RepoLink.loading(true);
        try {
            await this.getReadMe();
            repo.innerHTML += this.readMe;
            history.pushState({repo: this.dataset.repoName}, "")
        } catch(e) {
            alert.classList.remove("d-none");
            console.error(error);
        };
        RepoLink.loading(false);
    };
    async getReadMe(){
        const rmQuery = {...readMeQuery, repo: this.dataset.repoName}
        const { data } = await octokit.rest.repos.getReadme(rmQuery);
        const readMe = DOMPurify.sanitize(data);
        this._readMe = parser.parseFromString(readMe, "text/html");
        const readMeRoot = this._readMe.getElementById("readme");
        this._readMe.querySelector("article").classList.replace("container-lg", "container-fluid");
        this._readMe.querySelectorAll(".anchor").forEach(anchor => anchor.remove());
    };
    get readMe(){
        return this._readMe?.getElementById("readme").outerHTML;
    };
};

customElements.define("repo-link", RepoLink);