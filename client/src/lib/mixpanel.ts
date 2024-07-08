import mixpanelClient, { Config } from "mixpanel-browser";
import mixpanelServer, { InitConfig } from "mixpanel";

const test = process.env.NEXT_PUBLIC_MIXPANEL_TEST_TOKEN;
const live = process.env.NEXT_PUBLIC_MIXPANEL_LIVE_TOKEN;
let token = "";
let options: Partial<Config | InitConfig> = {};

if (process.env.NODE_ENV === "development") {
  token = test as string;
  options = {
    debug: true,
  };
} else {
  token = live as string;
}

if (typeof window === "undefined") {
  console.log("Using Server Side Mixpanel");
  mixpanelServer.init(token as string, { ...options });
} else {
  console.log("Using Client Side Mixpanel");
  mixpanelClient.init(token as string, {
    ...options,
    track_pageview: true,
    persistence: "localStorage",
  });
}

export { mixpanelServer, mixpanelClient };
