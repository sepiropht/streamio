import "reflect-metadata";
import "dotenv-safe/config";
import { __prod__, COOKIE_NAME } from "./constants";
import express from "express";
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

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot, Video],
  });
  conn.runMigrations();

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
  app.get("/getVideo", async (req: any, res: any) => {
    console.log("GETVIDEO", req.query);
    const { id, key } = req.query;
    const { ext } = path.parse(key);
    const video = await Video.findOne(id);
    if (ext === ".mkv") {
      console.log({ video });
      if (video?.isConvertionPending) {
        return res.json({ processing: true });
      }
      const changeStatus = async (
        isPending: boolean,
        oldK: string,
        newK: string
      ) => {
        console.log("before status");
        await getConnection()
          .createQueryBuilder()
          .update(Video)
          .set({ isConvertionPending: isPending, key: newK })
          .where("key = :key", {
            key: oldK,
          })
          .returning("*")
          .execute();

        console.log("after status");
      };
      console.log({ video }, "YYYYYYYYYYYYYYYYYYYYYYYYY");
      await changeStatus(false, key, key);
      console.log("before send");
      res.json({ processing: true });
      console.log("after send");
      console.log("beafroe convert send");

      const { oldKey, newKey } = await convert(key);
      console.log("RETURNE CONVERT", { oldKey, newKey });
      console.log("after convert");

      try {
        await changeStatus(false, oldKey, newKey);
      } catch (err) {
        console.log(err);
      }
    }
    const uploadParams = {
      Bucket: "streamio/test",
      Key: key,
    };
    s3.getObject(uploadParams);
  });
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
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".sepiropht.com" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
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

  app.listen(parseInt(process.env.PORT), () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
