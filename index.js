// Import Repo and NavBar classes
import { Repo } from "./repos.js";
import { NavBar } from "./nav.js";

// Get all repositories and instantiate navbar
// Return undefined if a failure occurs
Repo.getRepos().then(repos => {
    if(!repos.length) return;
    const navbar = new NavBar(repos);
    console.log(navbar);
});