import { CustomTemplate, Card, customTag, customPrefix } from "./custom.js";
import { gId } from "../../../src/config.js"; //Import Google Apps Script public endpoint ID from local config.js file

//Query my public Apps Script endpoint!
async function gFetch(pageId, query = {}){
  const gURL = new URL(`macros/s/${gId}/exec`, "https://script.google.com");
  gURL.search = new URLSearchParams({page: pageId, ...query});
  
  const gRes = await fetch(gURL);
  return await gRes.json();
};

export class AboutPage extends CustomTemplate {
    static prefix = customPrefix(this.name);
    static tag = customTag(this.name);
    static _likes = [];
    static get likes(){
        return this._likes;
    };
    static set likes(snippets){
        const likeGroup = document.getElementById(this.tag).querySelector(".card-group");
        this._likes = snippets.map(snippet => {
            let likeCard = document.createElement(LikeCard.tag, {is: LikeCard.tag});
            likeCard = likeGroup.appendChild(likeCard);
            likeCard.data = snippet;
            return likeCard;
        });
    };
    static stopCurrent(){
        const playing = this.likes.find(card => card.player && card.player.getPlayerState() == 1);
        if(playing) playing.togglePlayer();
    };
    constructor(){
        super();
        customElements.define(LikeCard.tag, LikeCard);
    };
    connectedCallback(){
        const {name: pageName} = this.constructor;
        console.log(pageName + " connected to DOM");
        this.cloneTemplate(pageName);
        this.fetchLikes(10);
    };
    async fetchLikes(n){
        const {prefix} = AboutPage;
        AboutPage.likes = await gFetch(prefix, {size: n});
        return AboutPage.likes;
    };
};

class LikeCard extends Card {
    static tag = customTag(this.name);
    static meta = new Map([
        ["title", ".card-title"],
        ["artist", ".card-subtitle"],
        ["thumbnail", ".card-img-top"]
    ])
    static player = {
        height: "175",
        width: "300",
        playerVars: {
            "enablejsapi": 1,
            "origin": location.origin,
            "playsinline": 1
        },
        events: {
            "onReady": e => {
                AboutPage.stopCurrent();
                e.target.playVideo();
            },
        }
    }
    constructor(){
        super();
        this.card = this._prefix;
        this._player = null;
    }
    get player(){
        return this._player;
    }
    set player(vId){
        this._player = new YT.Player(vId, {videoId: vId, ...LikeCard.player});
    }
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        this.cloneTemplate(this.card);
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
            this.player = vId;
        } else {
            this._player = null;
            this.innerHTML = this.card;
        };
    }
};

export {gFetch}