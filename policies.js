// Add Trusted Types tinyfill
if(typeof trustedTypes === "undefined") trustedTypes = { createPolicy: (name, rules) => rules };

// Use DOMPurify to sanitize HTML from Octokit
export const sanitize = trustedTypes.createPolicy("dom-purify", {
  createHTML: html => DOMPurify.sanitize(html)
});