import { CustomTemplate, Card, customTag, customPrefix } from "./custom.js";
import { isMobile, gId } from "./config.js";

async function gFetch(pageId, query = {}){
  const gURL = new URL(`macros/s/${gId}/exec`, "https://script.google.com");
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
            let likeCard = document.createElement(LikeCard.tag, {is: LikeCard.tag});
            likeCard = likeGroup.appendChild(likeCard);
            likeCard.data = snippet;
            return likeCard;
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
    static size = {
        height: "175",
        width: "300"
    }
    constructor(){
        super();
        this.card = "";
        this.player = null;
    }
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        this.cloneTemplate(this._prefix);
    }
    get data(){
        return this.dataset;
    }
    set data(snippet){
        console.log(snippet);
        this.children[0].id = snippet.videoId;
        
        snippet.thumbnail = snippet.thumbnails.medium.url;
        delete snippet.thumbnails;

        for(const [metaId, metaClass] of LikeCard.meta){
            this.dataset[metaId] = snippet[metaId];
            const metaEl = this.querySelector(metaClass);

            if(metaId == "thumbnail") metaEl.src = this.dataset[metaId];
            else metaEl.innerText = this.dataset[metaId];
        };

        this.onclick = () => this.togglePlayer();
    }
    togglePlayer(){
        if(!yt) return;
        const [{id: vId}] = this.children;
        console.log(vId);

        if(!this.player){
            this.card = this.innerHTML;
            this.player = new YT.Player(vId, {
                ...LikeCard.size,
                videoId: vId,
                playerVars: {
                    "enablejsapi": 1,
                    "origin": location.origin,
                    "playsinline": 1
                },
                events: {
                    "onReady": e => e.target.playVideo()
                }
            })
        }
        else this.reset();
    }
    reset(){
        this.player = null;
        this.innerHTML = this.card;
    }
};

export {gFetch}