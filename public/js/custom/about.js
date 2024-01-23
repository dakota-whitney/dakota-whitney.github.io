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
    constructor(){
        super();
        this._likes = [];
        customElements.define(LikeCard.tag, LikeCard);
    };
    get likes(){
        return this._likes;
    };
    set likes(likeCard){
        this._likes.push(likeCard);
    };
    connectedCallback(){
        const {name: pageName} = this.constructor;
        console.log(pageName + " connected to DOM");

        this.cloneTemplate(pageName);
        this.fetchLikes(10);
    };
    async fetchLikes(n){
        const {prefix} = AboutPage;
        const likeGroup = this.querySelector(".card-group");

        for(let i = 0; i < n; i++) {
            const likeCard = document.createElement(LikeCard.tag, {is: LikeCard.tag});
            this.likes = likeGroup.appendChild(likeCard);
        };

        return gFetch(prefix, {size: n, meta: "description"})
        .then(snippets => snippets.forEach((snippet, i) => this.likes[i].data = snippet));
    };
    stopCurrent(){
        const playing = this.likes.find(card => card.player && card.player.getPlayerState() == 1);
        if(playing) playing.togglePlayer();
        return playing;
    };
};

class LikeCard extends Card {
    static tag = customTag(this.name);
    static meta = new Map([
        ["title", ".card-title"],
        ["artist", ".card-subtitle"],
        ["thumbnails", ".card-img-top"],
    ]);
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
                document.querySelector(AboutPage.tag).stopCurrent();
                e.target.playVideo();
            },
        }
    };
    constructor(){
        super();
        this.card = this._prefix;
        this._player = null;
    };
    get player(){
        return this._player;
    };
    set player(vId){
        this._player = new YT.Player(vId, {videoId: vId, ...LikeCard.player});
    };
    connectedCallback(){
        console.log(this.constructor.name + " connected to DOM");
        this.cloneTemplate(this.card);
    };
    get data(){
        return this.dataset;
    };
    set data(snippet){
        console.log(snippet);
        this.children[0].id = snippet.videoId;

        for(const [metaId, metaClass] of LikeCard.meta){
            const metaEl = this.querySelector(metaClass);

            if(metaId == "thumbnails"){
                metaEl.src = snippet[metaId].medium.url;
                metaEl.alt = snippet.description;
            } else {
                metaEl.innerText = snippet[metaId];
                this.dataset[metaId] = snippet[metaId];
            };
        };

        this.onclick = () => this.togglePlayer();
        this.loaded();
    };
    togglePlayer(){
        if(!yt) return yt;

        if(!this.player){
            this.card = this.innerHTML;
            this.player = this.children[0].id;
        } else {
            this._player = null;
            this.innerHTML = this.card;
        };

        return true;
    };
};

export { gFetch };