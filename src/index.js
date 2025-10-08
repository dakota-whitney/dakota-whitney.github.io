import { NavBar } from './custom/navbar.js';
import { Pages } from './custom/pages.js';
import { AboutPage } from './custom/about.js';
import { ProjectsPage } from './custom/projects.js';
import { ResumePage } from './custom/resume.js';
import { CredentialsPage } from './custom/credentials.js';

const pages = [
    AboutPage,
    ProjectsPage,
    ResumePage,
    CredentialsPage
];

const navItems = new NavBar(pages);
new Pages(navItems, pages);