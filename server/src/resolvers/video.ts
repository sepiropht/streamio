import {
  Arg,
  Ctx,
  // Field,
  //Field,
  //FieldResolver,
  // InputType,
  Int,
  Mutation,
  //ObjectType,
  Query,
  Resolver,
  //Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Video } from "../entities/Video";
// import { Updoot } from "../entities/Updoot";
// import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

import { GraphQLUpload, FileUpload } from "graphql-upload";

// import path from "path";
// import s3 from "../utils/aws";

// @ObjectType()
// class PaginatedVideos {
//   @Field(() => [Video])
//   Videos: Video[];
//   @Field()
//   hasMore: boolean;
// }

@Resolver(Video)
export class VideoResolver {
  // @FieldResolver(() => String)
  // textSnippet(@Root() Video: Video) {
  //   return Video.text.slice(0, 50);
  // }

  // @FieldResolver(() => User)
  // creator(@Root() Video: Video, @Ctx() { userLoader }: MyContext) {
  //   return userLoader.load(Video.creatorId);
  // }

  // @FieldResolver(() => Int, { nullable: true })
  // async voteStatus(
  //   @Root() Video: Video,
  //   @Ctx() { updootLoader, req }: MyContext
  // ) {
  //   if (!req.session.userId) {
  //     return null;
  //   }

  //   const updoot = await updootLoader.load({
  //     VideoId: Video.id,
  //     userId: req.session.userId,
  //   });

  //   return updoot ? updoot.value : null;
  // }

  // @Mutation(() => Boolean)
  // @UseMiddleware(isAuth)
  // async vote(
  //   @Arg("VideoId", () => Int) VideoId: number,
  //   @Arg("value", () => Int) value: number,
  //   @Ctx() { req }: MyContext
  // ) {
  //   const isUpdoot = value !== -1;
  //   const realValue = isUpdoot ? 1 : -1;
  //   const { userId } = req.session;

  //   const updoot = await Updoot.findOne({ where: { VideoId, userId } });

  //   // the user has voted on the Video before
  //   // and they are changing their vote
  //   if (updoot && updoot.value !== realValue) {
  //     await getConnection().transaction(async (tm) => {
  //       await tm.query(
  //         `
  //   update updoot
  //   set value = $1
  //   where "VideoId" = $2 and "userId" = $3
  //       `,
  //         [realValue, VideoId, userId]
  //       );

  //       await tm.query(
  //         `
  //         update Video
  //         set points = points + $1
  //         where id = $2
  //       `,
  //         [2 * realValue, VideoId]
  //       );
  //     });
  //   } else if (!updoot) {
  //     // has never voted before
  //     await getConnection().transaction(async (tm) => {
  //       await tm.query(
  //         `
  //   insert into updoot ("userId", "VideoId", value)
  //   values ($1, $2, $3)
  //       `,
  //         [userId, VideoId, realValue]
  //       );

  //       await tm.query(
  //         `
  //   update Video
  //   set points = points + $1
  //   where id = $2
  //     `,
  //         [realValue, VideoId]
  //       );
  //     });
  //   }
  //   return true;
  // }

  // @Query(() => PaginatedVideos)
  // async Videos(
  //   @Arg("limit", () => Int) limit: number,
  //   @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  // ): Promise<PaginatedVideos> {
  //   // 20 -> 21
  //   const realLimit = Math.min(50, limit);
  //   const reaLimitPlusOne = realLimit + 1;

  //   const replacements: any[] = [reaLimitPlusOne];

  //   if (cursor) {
  //     replacements.push(new Date(parseInt(cursor)));
  //   }

  //   const Videos = await getConnection().query(
  //     `
  //   select p.*
  //   from Video p
  //   ${cursor ? `where p."createdAt" < $2` : ""}
  //   order by p."createdAt" DESC
  //   limit $1
  //   `,
  //     replacements
  //   );

  //   // const qb = getConnection()
  //   //   .getRepository(Video)
  //   //   .createQueryBuilder("p")
  //   //   .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
  //   //   .orderBy('p."createdAt"', "DESC")
  //   //   .take(reaLimitPlusOne);

  //   // if (cursor) {
  //   //   qb.where('p."createdAt" < :cursor', {
  //   //     cursor: new Date(parseInt(cursor)),
  //   //   });
  //   // }

  //   // const Videos = await qb.getMany();
  //   // console.log("Videos: ", Videos);

  //   return {
  //     Videos: Videos.slice(0, realLimit),
  //     hasMore: Videos.length === reaLimitPlusOne,
  //   };
  // }

  @Query(() => Video, { nullable: true })
  Video(@Arg("id", () => Int) id: number): Promise<Video | undefined> {
    return Video.findOne(id);
  }

  @Mutation(() => Video)
  //@UseMiddleware(isAuth)
  async uploadVideo(
    @Arg("file", () => GraphQLUpload) file: FileUpload,
    @Ctx() {}: MyContext
  ): Promise<Video> {
    console.log("FFFFFFFFFFFILE", file);
    //res.status(200).json({ m: "1" });

    //const suffix = "test";
    //const Bucket = `streamio/${suffix}`;
    //const video = file;
    //const Key = path.basename(video.title);
    // const uploadParams = {
    //   Bucket,
    //   Key,
    //   Body: video.createReadStream(),
    // };
    // s3.upload(uploadParams, async function (err: any, data: any) {
    //   if (err) {
    //     console.log("Error", err);
    //   }
    //   if (data) {
    //     await Video.create({
    //       ...file
    //       extention: path.extname(Key),
    //       name,
    //     });
    //     console.log("Upload Success", data.Location);
    //     res.status(200).json({ uuid, name });
    //   }
    // });

    return Video.create({
      title: "yeah",
      extention: ".mp4",
    }).save();
  }

  @Mutation(() => Video, { nullable: true })
  @UseMiddleware(isAuth)
  async updateVideo(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Arg("text") extention: string,
    @Ctx() { req }: MyContext
  ): Promise<Video | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Video)
      .set({ title, extention })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteVideo(
    @Arg("id", () => Int) id: number,
    @Ctx() {}: MyContext
  ): Promise<boolean> {
    // not cascade way
    // const Video = await Video.findOne(id);
    // if (!Video) {
    //   return false;
    // }
    // if (Video.creatorId !== req.session.userId) {
    //   throw new Error("not authorized");
    // }

    // await Updoot.delete({ VideoId: id });
    // await Video.delete({ id });

    await Video.delete({ id });
    return true;
  }
}
