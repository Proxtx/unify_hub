import { listen } from "@proxtx/framework";
import config from "@proxtx/config";
import { setConfig } from "@proxtx/framework/static.js";

setConfig({ ignoreParseHtml: ["/screens"] });

let result = await listen(config.port);
let combineHandler = await result.combineHandler(result.server);
combineHandler.onCombine("sceneDisplay", async (module) => {
  try {
    await global.handler(module);
  } catch (e) {
    console.log("websocket error", e);
  }
});

console.log("Server started. Port:", config.port);
