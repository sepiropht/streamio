import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Video } from "../entities/Video";
// import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import path from "path";
import s3 from "../utils/aws";
//import convert from "src/utils/convert";
//import convert from "../utils/convert";

@InputType()
class VideoInput {
  @Field()
  title: string;
  @Field()
  Key: string;
  @Field()
  size: number;
}
@ObjectType()
class PaginatedVideos {
  @Field(() => [Video])
  videos: Video[];
  @Field()
  hasMore: boolean;
}

@Resolver(Video)
export class VideoResolver {
  @Query(() => Video, { nullable: true })
  Video(@Arg("id", () => Int) id: number): Promise<Video | undefined> {
    return Video.findOne(id);
  }
  @FieldResolver(() => User)
  creator(@Root() video: Video, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(video.creatorId);
  }
  @Mutation(() => Video)
  async uploadVideo(
    @Arg("input") input: VideoInput,
    @Ctx() { req }: MyContext
  ): Promise<Video> {
    console.log("FFFFFFFFFFFI", input);
    const { title, Key, size } = input;
    const { name } = path.parse(title);

    return Video.create({
      title: name,
      key: Key,
      creatorId: req.session.userId || 1,
      size,
    }).save();
  }

  @Mutation(() => Video, { nullable: true })
  async updateVideo(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Arg("text") key: string,
    @Ctx() { req }: MyContext
  ): Promise<Video | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Video)
      .set({ title, key })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId || 1,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteVideo(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    // not cascade way
    const video = await Video.findOne(id);
    if (!video) {
      return false;
    }

    if (video.creatorId !== req.session.userId) {
      throw new Error("not authorized");
    }

    await Video.delete({ id });
    const uploadParams = {
      Bucket: "streamio/test",
      Key: video.key,
    };
    await s3.deleteObject(uploadParams).promise();
    return true;
  }
  @Query(() => PaginatedVideos)
  @UseMiddleware(isAuth)
  async videos(
    @Ctx() { req }: MyContext,
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedVideos> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const videos = await getConnection().query(
      `
    select p.*
    from video p
    ${cursor ? `where p."createdAt" < $2 and` : ""}
    where "creatorId" = ${req.session.userId}
    order by p."createdAt" DESC
    limit $1
    `,
      replacements
    );

    return {
      videos: videos.slice(0, realLimit),
      hasMore: videos.length === reaLimitPlusOne,
    };
  }
}
