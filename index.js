import { getRepos } from "./repos.js";

document.querySelector(".brand-text").innerText = document.title;

window.spinner = document.querySelector(".spinner-border");
window.repoAlert = document.querySelector(".alert");

const repoLinks = document.querySelector(".sidebar-menu");

getRepos()
    .then(repos => {
        spinner.classList.add("d-none");
        repos.forEach((repo, i) => {
            console.log(repo);
            const repoLink = document.createElement("li", {is: "repo-link"});
            repoLink.dataset.repoName = repo.name;
            repoLinks.append(repoLink);
            if(!i) repoLink.displayReadMe();
        });
    })
    .catch(error => {
        spinner.classList.add("d-none");
        repoAlert.classList.remove("d-none");
        console.error(error);
    });