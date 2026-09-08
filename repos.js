// Import Octokit and trusted HTML types
import { Octokit } from "https://esm.sh/octokit";

// Instantiate new octokit and set user name
const octokit = new Octokit();
const username = "dakota-whitney";

// Set base query for fetching all repositories
const repoQuery = {
  username: username,
  type: "public",
  sort: "updated_at",
};

// Set base query for fetching read me files
const readMeQuery = {
  owner: username,
  mediaType: {
    format: "html",
  },
  headers: {
    Accept: "application/vnd.github.html+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
};

// Set references to DOM elements
const sidebar = document.querySelector(".sidebar ul.nav");
const spinner = document.querySelector(".spinner-border");
const alert = document.querySelector(".alert");
const repo = document.getElementById("repo");

// Instantiate new DOM parser for the read me file
const parser = new DOMParser();

// Define new custom element for repository links
export class RepoLink extends HTMLElement {
  #readMe;

  // Define static method for fetching all repositories
  // Append them to the sidebar
  static async getRepos() {
    this.loading(true);

    try {
      const { data: repos } = await octokit.rest.repos.listForUser(repoQuery);
      const repoLinks = repos.map((repo) => this.create(repo));
      repoLinks.forEach((repoLink) => sidebar.append(repoLink));
      repoLinks[0].render(false);
      history.replaceState({ repo: repos[0].name }, "", `#${repos[0].name}`);
    } catch (error) {
      alert.classList.remove("d-none");
      console.error(error);
    }

    this.loading(false);
  }

  // Define static method for creating repository links
  static create(repo) {
    const repoLink = document.createElement("repo-link");
    repoLink.dataset.repoName = repo.name;
    return repoLink;
  }

  // Define static method for showing/hiding loading spinner
  static loading(show = true) {
    if (show) spinner.classList.remove("d-none");
    else spinner.classList.add("d-none");
  }

  // Define static method for handling navigation events
  static async onNavigate(event) {
    if (!event.state) return;
    const repo = event.state.repo;
    const selector = `repo-link[data-repo-name="${repo}"]`;
    await sidebar.querySelector(selector).render(false);
  }

  // Define constructor for the custom element
  // Set click handler when link is clicked
  constructor() {
    super();
    this.onclick = async () => await this.render();
  }

  // Define connected callback for the custom element
  // Create AdminLTE sidebar elements using DOM APIs
  connectedCallback() {
    const a = document.createElement("a");
    a.classList.add(
      "nav-link",
      "d-flex",
      "align-items-center",
      "gap-2",
      "active",
    );
    a.ariaCurrent = "page";
    a.innerHTML = `
      <svg class="bi" aria-hidden="true">
        <use xlink:href="#git"></use>
      </svg>
    `;
    a.innerHTML += this.dataset.repoName;
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.style.cursor = "pointer";
    li.append(a);
    this.append(li);
  }

  // Define render method for the dispaying the README
  // Add repo to history if a different one was clicked
  async render(addHistory = true) {
    document.querySelector(".nav-item.active")?.classList.remove("active");
    this.querySelector("a").classList.add("active");

    if (addHistory && this.dataset.repoName !== history.state.repo)
      history.pushState(
        { repo: this.dataset.repoName },
        "",
        `#${this.dataset.repoName}`,
      );

    RepoLink.loading(true);

    try {
      if (!this.readMe) await this.getReadMe();
      repo.innerHTML = this.readMe;
    } catch (error) {
      alert.classList.remove("d-none");
      console.error(error);
    }

    RepoLink.loading(false);
  }

  // Define method for fetching README content
  async getReadMe() {
    const rmQuery = { ...readMeQuery, repo: this.dataset.repoName };
    const { data } = await octokit.rest.repos.getReadme(rmQuery);
    const readMe = DOMPurify.sanitize(data);
    this.#readMe = parser.parseFromString(readMe, "text/html");
    this.#readMe
      .querySelector("article")
      .classList.replace("container-lg", "container-fluid");
    this.#readMe
      .querySelectorAll(".anchor")
      .forEach((anchor) => anchor.remove());
  }

  // Define getter for accessing the README content
  get readMe() {
    return this.#readMe?.getElementById("readme").outerHTML;
  }
}

// Define the repo-link custom element
customElements.define("repo-link", RepoLink);

// Fetch all repositories and set up navigation event listener
RepoLink.getRepos().then(() =>
  window.addEventListener("popstate", (e) => RepoLink.onNavigate(e)),
);
