import { InitConfig, Mixpanel as IMixpanelServer } from "mixpanel";
import { Config, OverridedMixpanel as IMixpanelClient } from "mixpanel-browser";

const test = process.env.NEXT_PUBLIC_MIXPANEL_TEST_TOKEN;
const live = process.env.NEXT_PUBLIC_MIXPANEL_LIVE_TOKEN;

let token: string;
let options: Partial<Config | InitConfig> = {};
let mixpanel: IMixpanelClient & IMixpanelServer;

if (process.env.NODE_ENV === "development") {
  token = test as string;
  options = { debug: true };
} else {
  token = live as string;
}

if (typeof window === "undefined") {
  mixpanel = require("mixpanel");
  mixpanel.init(token, { ...options });
} else {
  mixpanel = require("mixpanel-browser");
  mixpanel.init(token, { ...options });
}

export default mixpanel;
