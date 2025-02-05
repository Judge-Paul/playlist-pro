import * as Mixpanel from "mixpanel";

const test = process.env.NEXT_PUBLIC_MIXPANEL_TEST_TOKEN;
const live = process.env.NEXT_PUBLIC_MIXPANEL_LIVE_TOKEN;

let token: string;

if (process.env.NODE_ENV === "development") {
	token = test as string;
} else {
	token = live as string;
}

const mixpanel = Mixpanel.init(token);

export default mixpanel;
