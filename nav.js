// Import Repo class
import { Repo } from "./repos.js";

// Get references to DOM elements
const navToggle = document.querySelector("i");
const nav = document.querySelector("nav");
const repoNavs = nav.firstElementChild;
const repoDisplay = document.getElementById("repo");

/**
 * Click handler for nav toggler icon
 * Toggle icon colors
 * Toggle display: none on nav links
 * Toggle width: 0 on navbar
 * @param {*} event Click event
 */
function toggleNav(event){
    event.target.classList.toggle("text-white");
    event.target.classList.toggle("text-dark");
    repoNavs.classList.toggle("d-none");
    nav.classList.toggle("w-0");
};

// Custom NavBar class
export class NavBar {

    /**
     * Add click handler to nav toggler
     * Set retrieved repository ojects as instances of the custom Repo class
     * Append associated nav items to the nav element
     * Call display method on first fetched repository
     * @param {*} repos Array of repository objects from Octokit
     */
    constructor(repos){
        navToggle.addEventListener("click", toggleNav);
        this.repos = repos.map(repo => new Repo(repo));
        this.navs = this.repos.map(repo => this.appendNav(repo));
        this.displayRepo(this.navs[0], this.repos[0]);
    };

    /**
     * Append nav list items for each retrieved repository
     * Set click handler for each nav item to display associated repository
     * @param {*} repo Repo instance
     * @returns Nav item element reference
     */
    appendNav(repo){
        const navItem = document.createElement("li");
        navItem.classList.add("nav-item");
        const navLink = document.createElement("a");
        navLink.classList.add(
            "nav-link",
            "d-flex",
            "flex-column",
            "justify-content-center",
            "text-break",
            "text-center",
            "text-white"
        );
        navLink.innerText = repo.title;
        navItem.append(navLink);
        navItem.onclick = ({currentTarget}) => this.displayRepo(currentTarget, repo);
        return repoNavs.appendChild(navItem);
    };

    /**
     * Clear repo container of existing content
     * If the repository instance hasn't retrieved its Read Me, do so now
     * Add Read Me content to the repo container
     * If there is an active nav link, remove the active class
     * Set new active nav link
     * @param {*} navItem Reference to the repository's nav item
     * @param {*} repo Reference to the repository instance
     * @returns Reference to the repository's nav item
     */
    async displayRepo(navItem, repo){
        repoDisplay.innerHTML = "";
        if(!repo.readMe) await repo.getReadMe();
        repoDisplay.innerHTML = repo.readMe;
        if(this.active) this.active.classList.remove("nav-active");
        const [ newActive ] = navItem.children;
        newActive.classList.add("nav-active");
        this.active = newActive;
        return navItem;
    };
};