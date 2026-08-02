import { Queue } from "bullmq";
import redisConnection from "../config/redis";

export const taskQueue = new Queue("taskQueue", {
  connection: redisConnection,
});
