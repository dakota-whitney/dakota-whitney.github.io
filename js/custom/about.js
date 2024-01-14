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
    static prefix = customPrefix(this.name);
    constructor(){
        super();
        this._likes = [];
        customElements.define(LikeCard.tag, LikeCard);
    };
    get likes(){
        return this._likes;
    };
    set likes(snippets){
        const likeGroup = this.querySelector(".card-group");
        this._likes = snippets.map(snippet => {
            const likeCard = document.createElement(LikeCard.tag, {is: LikeCard.tag});
            likeCard.data = snippet;
            return likeGroup.appendChild(likeCard);
        });
    };
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        this.cloneTemplate(this.constructor.name);
        this.fetchLikes(10);
    };
    async fetchLikes(n){
        const {prefix} = AboutPage;
        this.likes = await gFetch(prefix, {size: n});
        console.log(this.likes);
        return this.likes;
    };
};

class LikeCard extends Card {
    static tag = customTag(this.name);
    static meta = new Map([
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
  
        for(const [dataId, cardClass] of LikeCard.meta){
            const cardMeta = this.querySelector(cardClass);
            if(dataId == "thumbnail") cardMeta.src = this.data[dataId];
            else cardMeta.innerText = this.data[dataId];
            cardMeta.id = this.id + "-" + dataId;
        };
    }
    get data(){
        return this.dataset;
    }
    set data(snippet){
        this.id = snippet.resourceId.videoId;
        delete snippet.resourceId;
        
        snippet.thumbnail = snippet.thumbnails.medium.url;
        delete snippet.thumbnails;
        delete snippet.description;
  
        for(const dataId in snippet) this.dataset[dataId] = snippet[dataId];
    }
  };

export {gFetch}