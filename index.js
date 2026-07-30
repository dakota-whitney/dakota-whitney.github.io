import { RepoLink } from "./repos.js";
document.querySelector(".brand-text").innerText = document.title;
RepoLink.getRepos().then(() => window.addEventListener('popstate', e => RepoLink.onNavigate(e)))