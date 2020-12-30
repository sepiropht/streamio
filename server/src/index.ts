import "reflect-metadata";
import "dotenv-safe/config";
import { __prod__, COOKIE_NAME } from "./constants";
import express from "express";
import http from "http";
import WebSocket from "ws";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { getConnection, createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { Video } from "./entities/Video";
import path from "path";
//import convert from "./utils/convert";
import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { VideoResolver } from "./resolvers/video";
import convert from "./utils/convert";
import s3 from "./utils/aws";
import { v4 as uuidv4 } from "uuid";
import getVideoFromSocialMedia from "./utils/getVideoFromSocialMedia";
//import streamify from "./utils/streamify";
//import fs from "fs";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: process.env.NODE_ENV !== "production",
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot, Video],
  });
  conn.runMigrations();

  // await Video.delete({ id: 163 });

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  const server = http.createServer(app);
  const websocketServer = new WebSocket.Server({ server });
  websocketServer.on("connection", (webSocketClient: any) => {
    const id = uuidv4();
    webSocketClient.send('{"connection" : "ok"}');
    const client = webSocketClient;
    webSocketClient.on("message", (message: any) => {
      console.log("message :", message);
      const res = JSON.parse(message);
      if (res.hasOwnProperty("processVideo")) {
        console.log("PROCESSVIDEO", res);
        processVideo(client, res.key, { url: res.url, duration: res.duration });
      } else {
        client.send(JSON.stringify({ id, message }));
      }
    });
  });

  app.get("/getVideo", async (req: any, res: any) => {
    console.log("getVideo");
    let { key } = req.query;
    console.log({ key });
    if (key.length) {
      const video = await getConnection()
        .getRepository(Video)
        .createQueryBuilder("video")
        .where("video.key like :key", { key: `%${key}%` })
        .getOne();
      console.log({ video });
      // const video = await Video.findOne(id);
      if (video?.isConvertionPending) {
        return res.json({ processing: true });
      }
      if (video) {
        const uploadParams = {
          Bucket: "streamio/test",
          Key: video.key,
        };

        const s3Stream = s3.getObject(uploadParams).createReadStream();

        s3Stream.on("error", (err: any) => {
          console.log(err);
        });

        s3Stream.pipe(res);
      }
    }
  });

  app.use(express.static("images"));
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "none", // csrf
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".sepiropht.com" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver, VideoResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  server.listen(parseInt(process.env.PORT as string), () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});

async function processVideo(client: any, key: string, option: any) {
  console.log("processVideo");
  const video = await getConnection()
    .getRepository(Video)
    .createQueryBuilder("video")
    .where("video.key like :key", { key: `%${key}%` })
    .getOne();

  console.log(video?.isAlreadyConvert, video?.isConvertionPending);
  // if (video?.isAlreadyConvert) {
  //   return client.send(JSON.stringify({ isAlreadyConvert: true }));
  // }
  if (video?.isConvertionPending) {
    return client.send(JSON.stringify({ processing: true }));
  }
  const changeStatus = async (
    isPending: boolean,
    key: string,
    isAlreadyConvert: boolean
  ) => {
    console.log("before status");
    await getConnection()
      .createQueryBuilder()
      .update(Video)
      .set({ isConvertionPending: isPending, isAlreadyConvert })
      .where("key = :key", {
        key,
      })
      .returning("*")
      .execute();

    console.log("after status");
  };
  await changeStatus(true, key, false);
  client.send(JSON.stringify({ processing: true }));
  if (option.url) {
    try {
      const { fileName } = await getVideoFromSocialMedia(
        option.url,
        key,
        client
      );

      await getConnection()
        .createQueryBuilder()
        .update(Video)
        .set({
          isConvertionPending: false,
          isAlreadyConvert: true,
          title: fileName,
        })
        .where("key = :key", {
          key,
        })
        .returning("*")
        .execute();
    } catch (err) {
      await Video.delete({ key });
      client.send(JSON.stringify({ delete: "true", key }));
    }
  } else {
    try {
      await convert(key, option.duration, client);
      await changeStatus(false, key, true);
    } catch (err) {
      await Video.delete({ key });
      const uploadParams = {
        Bucket: "streamio/test",
        Key: key,
      };
      await s3.deleteObject(uploadParams).promise();
      client.send(JSON.stringify({ delete: "true", key }));
    }
  }
}
