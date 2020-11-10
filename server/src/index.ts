import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from 'redis';
import session from "express-session";
import connectRedis from 'connect-redis';
import { MyContext } from "./types";


const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: 'qid', // name of cookie
      store: new RedisStore({ 
        client: redisClient,  // telling express-session we're using redis
        disableTouch: true, // reduces number of requests to redis, stops resaving.
       }),
       cookie: {
         maxAge: 315569520000, // 10 years
         httpOnly: true, // cannot access cookie in JS frontend code
         sameSite: 'lax', // csrf
         secure: __prod__ // cookie only works in https
       },
      saveUninitialized: false, // stops storing of data if nothing is created in the session
      secret: "adsadsadsadadsad", // how we're signing the cookie, should make this env variable
      resave: false, // stops continuous pings to redis
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({req, res}): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`server started on 4000`)
  })

}

main()
.catch(err => console.log(err));
