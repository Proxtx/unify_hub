import { auth } from "./meta.js";

let devices = {};

global.handler = async (module) => {
  const id = await module.id;
  let func = async (method, value) => {
    try {
      let result = await module[method](value);
      if (!result.success) delete devices[id];
      return result;
    } catch {}
  };
  devices[id] = func;
};

export const getDevices = (pwd) => {
  if (!auth(pwd)) return false;
  return Object.keys(devices);
};

export const switchScene = (pwd, device, scene) => {
  if (!auth(pwd)) return;
  devices[device]("switchScene", scene);
};

export const darken = (pwd, device, enable) => {
  if (!auth(pwd)) return;
  devices[device]("darken", enable);
};

export const info = async (pwd, device) => {
  if (!auth(pwd)) return;
  return await devices[device]("info");
};
