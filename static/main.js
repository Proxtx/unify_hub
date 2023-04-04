import * as _ from "/lib/guiLoader.js";

const password = document.getElementById("password");

await uiBuilder.ready(password);

const meta = await framework.load("meta.js");

if (cookie.pwd && (await meta.auth(cookie.pwd))) location.pathname = "/hub";

password.component.input.addEventListener("change", () => {
  cookie.pwd = password.component.value;
  location.reload();
});
