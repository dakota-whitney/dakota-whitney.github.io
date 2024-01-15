import { CustomTemplate, Card, customTag, customPrefix } from "./custom.js";
import { isMobile, gId } from "./config.js";

async function gFetch(pageId, query = {}){
  const gURL = new URL("https://script.google.com");
  gURL.pathname = `macros/s/${gId}/exec`;
  gURL.search = new URLSearchParams({page: pageId, ...query});
  
  const gRes = await fetch(gURL);
  return await gRes.json();
};

export class AboutPage extends CustomTemplate {
    static prefix = customPrefix(this.name);
    static _yt = {
        url: "",
        popup: null
    }
    static get yt(){
        return this._yt;
    }
    static set yt(vURL){
        const {url, popup} = this._yt;

        if(vURL == url) return popup.focus();
        this._yt = {
            url: vURL,
            popup: open(vURL, isMobile ? "_blank" : "youtubePopup", "width=600,height=500")
        };
    }
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
    static base = "https://youtube.com/watch?"
    constructor(){
        super();
    }
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        this.cloneTemplate(this._prefix);
        const {meta, base} = LikeCard;

        const vURL = new URL(base);
        vURL.search = new URLSearchParams({v: this.id});

        const vLink = document.createElement("a");
        vLink.href = vURL;
        vLink.target = "youtubePopup";
        vLink.onclick = () => AboutPage.yt = vURL;
  
        for(const [dataId, cardClass] of meta){
            const cardMeta = this.querySelector(cardClass);

            if(dataId == "thumbnail"){
                cardMeta.src = this.data[dataId];
                vLink.append(cardMeta.cloneNode(false));
                cardMeta.replaceWith(vLink);
            }
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