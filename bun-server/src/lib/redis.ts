import { Redis } from "@upstash/redis";

const redisURL = process.env.REDIS_URL || "";
const redisToken = process.env.REDIS_TOKEN || "";

const redis = new Redis({
	url: redisURL,
	token: redisToken,
});

export default redis;
