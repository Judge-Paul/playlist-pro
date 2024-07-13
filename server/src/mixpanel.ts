import dotenv from "dotenv";
import Mixpanel, { InitConfig } from "mixpanel";

dotenv.config();

const test = process.env.MIXPANEL_TEST_TOKEN;
const live = process.env.MIXPANEL_LIVE_TOKEN;

let token = "";
let options: Partial<InitConfig> = {};

if (process.env.NODE_ENV === "development") {
	token = test as string;
	options = {
		debug: true,
	};
} else {
	token = live as string;
}

const mixpanel = Mixpanel.init(token, { ...options });

export default mixpanel;
