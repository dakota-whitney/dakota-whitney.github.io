import { CustomTemplate, Card, customTag, customPrefix } from "./custom.js";
import config from "./config.json" assert {type: 'json'};

async function gFetch(pageId, query = {}){
  const gURL = new URL("https://script.google.com");
  gURL.pathname = `macros/s/${config.gId}/exec`;
  gURL.search = new URLSearchParams({page: pageId, ...query});
  
  const gRes = await fetch(gURL);
  return await gRes.json();
};

export class AboutPage extends CustomTemplate {
    static prefix = customPrefix(this.name)
    constructor(){
        super();
        this._likes = [];
        customElements.define(LikeCard.tag, LikeCard);
    }
    get likes(){
        return this._likes;
    }
    set likes(snippets){
        const likeGroup = this.querySelector(".card-group");
        this._likes = snippets.map(snippet => {
            const likeCard = document.createElement(LikeCard.tag, {is: LikeCard.tag});
            likeCard.data = snippet;
            return likeGroup.appendChild(likeCard);
        });
    }
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        this.cloneTemplate(this.constructor.name);
        this.fetchLikes(10);
    }
    async fetchLikes(n){
        const {prefix} = AboutPage;
        this.likes = await gFetch(prefix, {size: n});
        console.log(this.likes);
        return this.likes;
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

class LikeCard extends Card {
    static tag = customTag(this.name);
    static bsMap = new Map([
        ["title", ".card-title"],
        ["artist", ".card-subtitle"],
        ["thumbnail", ".card-img-top"]
    ])
    constructor(){
        super();
    }
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        this.cloneTemplate(this._prefix);
  
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
        snippet.thumbnail = snippet.thumbnails.medium.url;
        delete snippet.thumbnails;
        console.log(snippet);
  
        this.id = snippet.resourceId.videoId;
        for(const dataId in snippet) this.dataset[dataId] = snippet[dataId];
    }
  };

export {gFetch}