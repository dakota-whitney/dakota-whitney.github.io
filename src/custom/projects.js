import { Pages } from "./pages.js";

export class ProjectsPage extends HTMLElement {
    static title = Pages.title(this.name);
    static tag = Pages.tag(this.name);
    constructor(){
        super();
        this.projects = {
            "Higgins-Whitney": "https://higgins-whitney.web.app/",
            "NerdStats": "https://nerd-stats.vercel.app/",
            "FCC-Projects": "https://fcc-projects-dakota-whitneys-projects.vercel.app/"
        };
    };
    connectedCallback(){
        console.log(this.constructor.name + ' connected to DOM');
        const mobile = Pages.mobile.matches;
        const projects = this.querySelector('#projects');

        if(mobile) projects.classList.add('d-flex', 'flex-column', 'justify-content-center');
        else {
            projects.innerHTML += `<ul class="nav nav-tabs nav-fill" role="tablist" data-bs-theme="light"></ul>`;
            projects.innerHTML += `<div class="tab-content"></div>`
        };

        Object.entries(this.projects).forEach(([img, url], i) => {
            if(mobile){
                projects.innerHTML += `<h2 class="lead">${img}</h2>`;
                return projects.append(this.projectImg(img, url));
            };

            const projTab = this.projectTab(img, i);
            projects.querySelector('.nav-tabs').append(projTab);
            const projPane = this.projectPane(img, url, i);
            projects.querySelector('.tab-content').append(projPane);
        });
    };
    projectTab(img, i){
        const projTab = document.createElement('li');
        projTab.classList.add('nav-item');
        projTab.role = 'presentation';

        const navBtn = document.createElement('button');
        navBtn.classList.add('nav-link');
        if(i == 0) navBtn.classList.add('active');
        navBtn.id = img.toLowerCase();
        navBtn.setAttribute('data-bs-toggle', 'tab');
        navBtn.setAttribute('data-bs-target', `#${img.toLowerCase()}-pane`);
        navBtn.type = 'button';
        navBtn.role = 'tab';
        navBtn.setAttribute('aria-controls', img.toLowerCase() + '-pane');
        navBtn.setAttribute('aria-selected', i == 0);
        navBtn.innerText = img;

        projTab.append(navBtn);
        return projTab;
    };
    projectPane(img, url, i){
        const projPane = document.createElement('div');
        projPane.classList.add('tab-pane', 'fade');
        if(i == 0) projPane.classList.add('show', 'active');
        projPane.id = img.toLowerCase() + '-pane';
        projPane.setAttribute('aria-labelledby', img.toLowerCase());
        projPane.tabIndex = 0;

        const projLink = this.projectImg(img, url);
        projPane.append(projLink);
        return projPane;
    };
    projectImg(img, url){
        const projLink = document.createElement('a');
        projLink.href = url;
        projLink.target = '_blank';
        img = `public/img/${img.toLowerCase()}.png`;
        projLink.innerHTML = `<img src="${img}" class="img-fluid project-img" alt="${img}"/>`;
        return projLink;
    };
};