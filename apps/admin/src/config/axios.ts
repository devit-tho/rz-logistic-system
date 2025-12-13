import { AxiosResponse } from "axios";
import Bowser from "bowser";
import _capitalize from "lodash/capitalize";

export function getDevice() {
  const { browser, os, platform } = Bowser.parse(window.navigator.userAgent);
  const platformType = _capitalize(platform.type);
  const device = `${os.name} | ${platformType} | ${browser.name}`;
  return device;
}

export function getData<T>(response: AxiosResponse): T {
  return response.data;
}
