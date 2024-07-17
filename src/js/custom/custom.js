const customTag = customName => customName.replace(/(?<=[a-z])[A-Z]/, m => "-" + m).toLowerCase();
const customPrefix = customName => customName.replace(/(?<=[a-z])[A-Z]\w+/, "").toLowerCase();

export class CustomTemplate extends HTMLElement {
  static tag = customTag(this.name);
  constructor(){
    super();
  }
  cloneTemplate(customName){
    const templateId = customPrefix(customName) + "-template";
    const template = document.getElementById(templateId).content.cloneNode(true);
    this.append(template);
  }
};

export class Card extends CustomTemplate {
  static prefix = customPrefix(this.name);
  static tag = "bs-" + this.prefix;
  constructor(){
      super();
      this._prefix = Card.prefix;
  }
  loaded(){
    this.querySelector(".spinner-border").remove();
    this.querySelector("img").classList.remove("d-none");
  }
};

customElements.define(CustomTemplate.tag, CustomTemplate);
customElements.define(Card.tag, Card);

export { customTag, customPrefix };