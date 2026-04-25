// Import Octokit and trusted HTML types
import { Octokit } from "https://esm.sh/octokit";
import { sanitize } from "./policies.js";

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

// Set references to DOM elements
const alert = document.querySelector(".alert");
const spinner = document.querySelector(".spinner-border");

/**
 * Change repository base name to title case
 * Replace dashes and underscores with a space
 * Change first letter after spaces to upper case
 * @param {*} repoName 
 * @returns 
 */
function titleCase(repoName){
    const regex = /[-|_|A-Z][a-z]/g;
    const addSpace = m => " " + m[1].toUpperCase();
    const title = repoName.slice(1).replaceAll(regex, addSpace);
    return repoName[0].toUpperCase() + title;
};

/**
 * Fetch all repositories using Octokit and base query
 * If fetch fails, display alert and log error
 * @returns Array of GitHub repository objects
 */
async function getRepos(){
    spinner.classList.toggle("d-none");
    const repos = [];

    try {
        const { data } = await octokit.rest.repos.listForUser(repoQuery);
        repos.push(...data);
    } catch(error) {
        alert.classList.remove("d-none");
        console.error(error);
    };

    spinner.classList.toggle("d-none");
    return repos;
};

// Custom Repo class
export class Repo {

    //Set getRepos as static function to use in index.js
    static getRepos = getRepos;

    /**
     * Sanitize and set retrieved repository name
     * @param {*} repo GitHub repository object
     */
    constructor(repo){
        this.name = sanitize.createHTML(repo.name).toString();
    };

    // Set getter for title-cased repository name
    get title(){
        return titleCase(this.name);
    };

    /**
     * Retrieve Read Me using Octokit and base query
     * Replace bootstrap container class and sanitize HTML
     * Set sanitized HTML as Read Me
     * @returns 
     */
    async getReadMe(){
        spinner.classList.toggle("d-none");
        const rmQuery = {...readMeQuery, repo: this.name}
        const { data } = await octokit.rest.repos.getReadme(rmQuery);
        const readMe = data.replace("container-lg", "container-fluid");
        this.readMe = sanitize.createHTML(readMe);
        spinner.classList.toggle("d-none");
        return this.readMe;
    };
};