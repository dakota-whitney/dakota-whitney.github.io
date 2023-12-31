import config from "./components/config.json" assert {type: 'json'};

export function customTag(customName) {
    return customName.replace(/(?<=[a-z])[A-Z]/, m => "-" + m).toLowerCase();
};
export function customPrefix(customName) {
    return customName.replace(/(?<=[a-z])[A-Z]\w+/, "").toLowerCase();
};
export function customTemplate(customName){
  const templateId = customPrefix(customName) + "-template";
  const template = document.getElementById(templateId).content.cloneNode(true);
  return(template);
};
export async function gFetch(pageId, query = {}){
  const gURL = new URL("https://script.google.com");
  gURL.pathname = `macros/s/${config.gId}/exec`;
  gURL.search = new URLSearchParams({page: pageId, ...query});
  
  const gRes = await fetch(gURL);
  return await gRes.json();
};