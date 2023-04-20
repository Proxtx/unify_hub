window.guiLoaded = [];

import { loadPack } from "/modules/uibuilder/main.js";

cookie.default =
  "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; SameSite=None; Secure";

await loadPack("/modules/material/components/pack.json", {
  urlPrefix: "/modules/material/",
  customStyleSheets: ["../../lib/main.css"],
});

document.body.style.opacity = 1;

for (let i of guiLoaded) {
  i();
}

window.guiLoaded = null;
