export function customTag(customName) {
    return customName.replace(/(?<=[a-z])[A-Z]/, m => "-" + m).toLowerCase()
};
export function customPrefix(customName) {
    return customName.replace(/(?<=[a-z])[A-Z]\w+/, "").toLowerCase()
};
export function customTemplate(customName){
  const templateId = customPrefix(customName) + "-template";
  const template = document.getElementById(templateId).content.cloneNode(true);
  return(template);
};