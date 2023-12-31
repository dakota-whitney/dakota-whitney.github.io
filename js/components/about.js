import { customTag, customPrefix, gFetch } from "../utils.js";

export class AboutPage extends HTMLElement {
    static prefix = customPrefix(this.name)
    constructor(){
        super();
        customElements.define(Card.tag, Card);
        customElements.define(LikeCard.tag, LikeCard);
    }
    connectedCallback(){
        const { name } = this.constructor;
        console.log(name + " connected to DOM");
        this.fetchLikes();
    }
    async fetchLikes(size = 10){
        const { prefix } = AboutPage;
        const likeGroup = this.querySelector(".card-group")

        let likes = await gFetch(prefix, {size: size});
        console.log(likes);

        likes = likes.map(snippet => {
            const likeCard = document.createElement(LikeCard.tag, {is: LikeCard.tag});
            likeCard.data = snippet;
            likeGroup.append(likeCard);
            return likeCard;
        });

        return likes;
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

class Card extends HTMLElement {
    static prefix = customPrefix(this.name);
    static tag = "bs-" + this.prefix;
    static _template = document.getElementById(`${this.prefix}-template`).content;
    constructor(){
        super();
        this.template = Card._template.cloneNode(true);
    }
};

class LikeCard extends Card {
    static tag = customTag(this.name);
    static bsMap = new Map([
        ["title", ".card-title"],
        ["artist", ".card-subtitle"],
        ["thumbnail", ".card-img-top"]
    ])
    constructor(){
        const card = super();
        this.card = card;
    }
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        this.append(this.card.template);

        for(const [dataId, bsClass] of LikeCard.bsMap){
            const bsEl = this.querySelector(bsClass);

            if(dataId == "thumbnail") bsEl.src = this.data[dataId];
            else bsEl.innerText = this.data[dataId];

            bsEl.id = this.id + "-" + dataId;
        };
    }
    get data(){
        return this.dataset;
    }
    set data(snippet){
        const {thumbnails: {medium: {url: thumbnail}}, resourceId: {videoId: likeId}} = snippet;
        snippet.thumbnail = thumbnail;
        delete snippet.thumbnails;
        console.log(snippet);

        this.id = likeId;
        for(const dataId in snippet) this.dataset[dataId] = snippet[dataId];
    }
};