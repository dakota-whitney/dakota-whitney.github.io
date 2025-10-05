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

customElements.define(CustomTemplate.tag, CustomTemplate);
export { customTag, customPrefix };