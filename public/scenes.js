import config from "@proxtx/config";
import { auth } from "./meta.js";

export const scenes = (pwd) => {
  if (!auth(pwd)) return;
  return { scenes: config.scenes, order: config.order };
};
