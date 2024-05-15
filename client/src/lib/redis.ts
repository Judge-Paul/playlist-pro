import { Redis } from "@upstash/redis";

const redisURL = process.env.REDIS_URL || "";
const redisToken = process.env.REDIS_TOKEN || "";

export const redis = new Redis({
	url: redisURL,
	token: redisToken,
});
