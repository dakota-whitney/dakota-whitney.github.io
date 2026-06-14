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

export async function getRepos(){
    const { data: repos } = await octokit.rest.repos.listForUser(repoQuery);
    return repos;
};

// const spinner = document.querySelector(".spinner-border");
// const alert = document.querySelector(".alert");
const repo = document.getElementById("repo");

// Instantiate new DOM parser for the read me file
const parser = new DOMParser();

class RepoLink extends HTMLLIElement {
    constructor(){
        super();
        this.onclick = () => this.displayReadMe();
    };

    connectedCallback(){
        console.log(this.dataset.repoName + " connected to DOM");
        this.classList.add("nav-item");
        const navAnchor = document.createElement("a");
        navAnchor.classList.add("nav-link");
        navAnchor.href = "#" + this.dataset.repoName;
        navAnchor.innerHTML = "<i class='nav-icon bi bi-git'></i>";
        navAnchor.innerHTML += `<p>${this.dataset.repoName}</p>`
        this.append(navAnchor);
    };

    displayReadMe(){
        document.querySelector(".nav-item.active")?.classList.remove("active");
        this.classList.add("active");

        if(this.readMe) return repo.innerHTML = this.readMe;

        repo.innerHTML = "";
        spinner.classList.remove("d-none");

        this.getReadMe()
            .then(() => {
                spinner.classList.add("d-none");
                repo.innerHTML += this.readMe;
            })
            .catch(error => {
                spinner.classList.add("d-none");
                repoAlert.classList.remove("d-none");
                console.error(error);
            });
    };

    async getReadMe(){
        const rmQuery = {...readMeQuery, repo: this.dataset.repoName}
        const { data } = await octokit.rest.repos.getReadme(rmQuery);
        const readMe = DOMPurify.sanitize(data);
        this._readMe = parser.parseFromString(readMe, "text/html");
        const header = document.createElement("h1");
        header.classList.add("text-decoration-underline");
        header.innerText = this.dataset.repoName;
        const readMeRoot = this._readMe.getElementById("readme");
        readMeRoot.insertBefore(header, readMeRoot.children[0]);
        this._readMe.querySelector("article").classList.replace("container-lg", "container-fluid");
        this._readMe.querySelectorAll(".anchor").forEach(anchor => anchor.remove());
    };

    get readMe(){
        return this._readMe?.getElementById("readme").outerHTML;
    };
};

customElements.define("repo-link", RepoLink, {extends: "li"});