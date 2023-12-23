import { Slider } from "../slider.js";
import config from "./config.json" assert {type: 'json'};

export class AboutPage extends HTMLElement {
    constructor(){
        super();
        customElements.define(Card.tag, Card, {extends: "div"});
        customElements.define(LikeCard.tag, LikeCard);
    }
    async connectedCallback(){
        const { name } = this.constructor;
        console.log(name + " connected to DOM");

        // const gRes = await fetch(`https://script.google.com/macros/s/${config.gId}/exec?page=about`);
        // let likes = await gRes.json();
        // console.log(likes);

        // likes = likes.map(snippet => {
        //     const likeCard = document.createElement(LikeCard.tag, {is: LikeCard.tag});
        //     likeCard.data = snippet;
        //     return {likeCardId: likeCard.id};
        // })

        // const likesSlider = document.createElement(Slider.tag, {is: Slider.tag})
        // for(const like of likes) likesSlider.data = like;

    }
    disconnectedCallback() {
        console.log(this.constructor.name + " removed from DOM");
    }
    adoptedCallback() {
        console.log(this.constructor.name + " moved from DOM");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}`);
    }
};

class Card extends HTMLDivElement {
    static prefix = this.name.toLowerCase();
    static tag = "bs-" + this.prefix;
    static template = document.getElementById(`${this.prefix}-template`).content;
    constructor(){
        super();
        const template = Card.template.cloneNode(true);
        this.attachShadow({mode: "open"}).append(template);
    }
};

class LikeCard extends Card {
    static tag = "like-card"
    static likeMap = new Map([
        ["title", ".card-title"],
        ["description", ".card-text"],
        ["thumbnail", ".card-img-top"]
    ])
    constructor(){
        super();
    }
    get like(){
        return this.dataset;
    }
    set like(snippet){
        snippet.thumbnail = snippet.thumbnails.medium.url;
        delete snippet.thumbnails;
        console.log(snippet);
        
        for(const [dataId, bsClass] of likeMap){
            const bsEl = this.shadowRoot.querySelector(bsClass);

            if(dataId == "thumbnail") bsEl.src = snippet[dataId];
            else bsEl.innerText = snippet[dataId];

            bsEl.id = snippet.resourceId.videoId + "-" + dataId;
            this.like[dataId] = bsEl.id;
        };
    }
};