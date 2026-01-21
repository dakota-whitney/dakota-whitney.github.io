import { Octokit } from "https://esm.sh/octokit";

export const titleCase = repoName => {
    const title = repoName.slice(1).replaceAll(/[-|_|A-Z][a-z]/g, m => " " + m[1].toUpperCase());
    return repoName[0].toUpperCase() + title;
};

const spinner = document.querySelector('.spinner-border');

export class Repo {
    static gh = new Octokit();
    static username = "dakota-whitney"
    static async repos(){
        console.log('Loading repositories');
        spinner.classList.toggle('d-none');
        let repos;
        
        try {
            const query = {username: this.username, type: "public", sort: "updated_at"};
            repos = await this.gh.rest.repos.listForUser(query);
            repos = repos.data;
        } catch(e) {
            repos = null;
        };

        spinner.classList.toggle('d-none');
        return repos;
    };
    static query = {
        owner: this.username,
        mediaType: {format: "html"},
        headers: {
            "Accept": "application/vnd.github.html+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    };
    static element = document.querySelector('.repo');
    constructor(repoName){
        spinner.classList.toggle('d-none');

        Repo.element.innerHTML = "";
        const query = {...Repo.query, repo: repoName}

        Repo.gh.rest.repos.getReadme(query).then(rm => {
            console.log(rm);

            spinner.classList.toggle('d-none');
            Repo.element.innerHTML = `<h1>${titleCase(repoName)}</h1><br/>${rm}`;
        });
    };
};