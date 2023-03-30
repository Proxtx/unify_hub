import * as _ from "/lib/guiLoader.js";
import { connect } from "../lib/wsConnectionHandler.js";

const scenesAPI = await framework.load("scenes.js");

const id = localStorage.id
  ? localStorage.id
  : Math.floor(Math.random() * 100000);
localStorage.id = id;

const meta = await framework.load("meta.js");

while (!(await meta.auth(cookie.pwd))) {
  cookie.pwd = prompt("pwd");
}

let pwd = cookie.pwd;

const config = await scenesAPI.scenes(pwd);
const order = config.order;
const scenes = config.scenes;
let index = 0;

window.screenOptions = {};

const next = document.getElementById("next");
const previous = document.getElementById("previous");
const content = document.getElementById("content");
const darken = document.getElementById("darken");
const title = document.getElementById("title");

content.addEventListener("click", () => {
  document.documentElement.requestFullscreen();
});

await uiBuilder.ready(next);
await uiBuilder.ready(previous);

next.component.button.style.height = "100%";
previous.component.button.style.height = "100%";

next.component.textComponent.style.fontSize = "200%";
previous.component.textComponent.style.fontSize = "200%";

next.innerHTML = ">";
previous.innerHTML = "<";

next.addEventListener("click", () => {
  index++;
  loadActiveScene();
});

previous.addEventListener("click", () => {
  index--;
  loadActiveScene();
});

let currentScreen = {};

const loadScreen = async (path, options) => {
  content.innerHTML = "";
  const id = Math.floor(Math.random() * 10000);
  let html = await (await fetch(path)).text();
  html = html.replace("$ID", id);
  options.isVisible = true;
  window.screenOptions[id] = options;
  let oW = document.createElement("div");
  let w = document.createElement("div");
  let styleLink = document.createElement("link");
  styleLink.href = "/lib/main.css";
  styleLink.rel = "stylesheet";

  w.style.height = "100%";
  oW.style.height = "100%";

  w.innerHTML = html;
  w.appendChild(styleLink);

  w.querySelectorAll("script").forEach((elem) => {
    let text = document.createTextNode(elem.innerHTML);
    let newScript = document.createElement("script");

    Array.from(elem.attributes).forEach((attr) => {
      newScript.setAttribute(attr.name, attr.value);
    });

    newScript.appendChild(text);

    elem.parentNode.replaceChild(newScript, elem);
  });
  let shadow = oW.attachShadow({ mode: "open" });
  shadow.appendChild(w);
  content.appendChild(oW);
  options.document = shadow;

  currentScreen.isVisible = false;
};

let currentTimeout;

const loadActiveScene = async () => {
  if (index <= -1) index = order.length + index;
  if (index >= order.length) index = index - order.length;
  title.innerText = order[index];
  await loadScreen(
    "/screens/" + scenes[order[index]].app + "/index.html",
    scenes[order[index]].config ? scenes[order[index]].config : {}
  );

  renewTimeout();
};

const renewTimeout = () => {
  if (currentTimeout) window.clearTimeout(currentTimeout);

  currentTimeout = window.setTimeout(() => {
    index = 0;
    loadActiveScene();
  }, 1000 * 60 * 5);
};

document.addEventListener("click", () => {
  if (currentTimeout) renewTimeout();
});

loadActiveScene();

framework.ws.addModule(
  {
    id,

    switchScene: async (scene) => {
      if (typeof scene == "string") {
        index = order.indexOf(scene);
        await loadActiveScene();
      } else {
        title.innerText = scene.title;
        await loadScreen("/screens/" + scene.app + "/index.html", scene);

        renewTimeout();
      }
    },

    darken: async (enable) => {
      if (enable) darken.style.display = "unset";
      else darken.style.display = "none";
    },
  },
  "sceneDisplay"
);

await connect();
