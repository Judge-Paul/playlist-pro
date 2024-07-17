import { InitConfig, PropertyDict } from "mixpanel";
import { Config, OverridedMixpanel as IMixpanelClient } from "mixpanel-browser";

interface IMixpanelServer {
  track: (eventName: string, properties: PropertyDict) => Promise<void>;
}

const test = process.env.NEXT_PUBLIC_MIXPANEL_TEST_TOKEN;
const live = process.env.NEXT_PUBLIC_MIXPANEL_LIVE_TOKEN;

let token: string;
let options: Partial<Config | InitConfig> = {};
let mixpanel;

if (process.env.NODE_ENV === "development") {
  token = test as string;
  options = { debug: true };
} else {
  token = live as string;
}

if (typeof window === "undefined") {
  const mixpanelServer = require("mixpanel");
  const Mixpanel = mixpanelServer.init(token, { ...options });

  class mixpanelClass {
    constructor(token: string) {
      mixpanelServer.init(token);
    }

    track(eventName: string, properties: PropertyDict) {
      return new Promise((resolve, reject) => {
        try {
          Mixpanel.track(eventName, properties);
          resolve(void 0);
        } catch (error) {
          reject(error);
        }
      });
    }
  }

  mixpanel = new mixpanelClass(token);
} else {
  mixpanel = require("mixpanel-browser");
  mixpanel.init(token, { ...options });
}

export default mixpanel as IMixpanelClient & IMixpanelServer;
