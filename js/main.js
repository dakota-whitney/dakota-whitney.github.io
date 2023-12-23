import { Slider } from "./slider.js";
import { Octokit, App } from "https://esm.sh/octokit";

customElements.define(Slider.tag, Slider);
const slider = document.createElement(Slider.tag, {is: Slider.tag});
document.querySelector("main").append(slider);