import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";
import mongoose from "mongoose";
import { MONGODB_URI, PORT } from "./utils/config.js";
import { User } from "./models/user.js";
import jwt from "jsonwebtoken";
import { schema } from "./graphql/schema.js";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import http from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import { loaders } from "./libs/loaders.js";

mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_URI).then(() => console.log("Connected to MongoDB"));

export const pubsub = new PubSub();

const app = express();
const httpServer = http.createServer(app);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/",
});

const serverCleanup = useServer({ schema }, wsServer);

const apolloServer = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      serverWillStart: async () => {
        return {
          drainServer: async () => {
            serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await apolloServer.start();

app.use(
  "/",
  cors(),
  express.json(),
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const authHeader = req ? req.headers.authorization : null;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "");
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decodedToken.id);

        return { currentUser, loaders };
      }
    },
  })
);

await new Promise((resolve) => {
  httpServer.listen({ port: PORT }, resolve);
});

console.log(`Server ready at port ${PORT}`);

// server version with startStandaloneServer()
// const { url } = await startStandaloneServer(server, {
//   listen: { port: PORT },
// context: async ({ req }) => {
//   const authHeader = req ? req.headers.authorization : null;

//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     const token = authHeader.replace("Bearer ", "");
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

//     const currentUser = await User.findById(decodedToken.id);

//     return { currentUser };
//   }
// },
// });
// console.log(`Server running at ${url}`);
