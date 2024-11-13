import { config } from "dotenv";

config();

export const MONGODB_URI =
  process.env === "test"
    ? process.env.TEST_MONGODV_URI
    : process.env.MONGODB_URI;

export const PORT = process.env.PORT;