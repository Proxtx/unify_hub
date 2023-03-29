/*document.getElementById("button").addEventListener("click", () => {
  document.documentElement.requestFullscreen();
});

document.getElementById("close").addEventListener("click", () => {
  document.exitFullscreen();
});

alert(window.innerWidth);
alert(window.innerHeight);
*/
import * as _ from "/lib/guiLoader.js";

window.screenOptions = {};

const next = document.getElementById("next");
const previous = document.getElementById("previous");
const content = document.getElementById("content");

await uiBuilder.ready(next);
await uiBuilder.ready(previous);

next.component.button.style.height = "100%";
previous.component.button.style.height = "100%";

next.component.textComponent.style.fontSize = "200%";
previous.component.textComponent.style.fontSize = "200%";

next.innerHTML = ">";
previous.innerHTML = "<";

let currentScreen = {};

const loadScreen = async (path, options) => {
  content.innerHTML = "";
  const id = Math.floor(Math.random() * 10000);
  let html = await (await fetch(path)).text();
  html.replace("$ID", id);
  options.isRunning = true;
  window.screenOptions[id] = options;
  let oW = document.createElement("div");
  let w = document.createElement("div");
  w.innerHTML = html;
  let shadow = oW.attachShadow({ mode: "open" });
  shadow.appendChild(w);
  content.appendChild(oW);
  options.document = shadow;

  currentScreen.isRunning = false;
};

loadScreen("/screens/hub_time/index.html", {});
