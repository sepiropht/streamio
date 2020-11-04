import {
  Arg,
  Ctx,
  Field,
  //FieldResolver,
  InputType,
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
import path from "path";
//import convert from "src/utils/convert";
//import convert from "../utils/convert";

@InputType()
class VideoInput {
  @Field()
  title: string;
  @Field()
  Key: string;
}

@Resolver(Video)
export class VideoResolver {
  @Query(() => Video, { nullable: true })
  Video(@Arg("id", () => Int) id: number): Promise<Video | undefined> {
    return Video.findOne(id);
  }

  @Mutation(() => Video)
  //@UseMiddleware(isAuth)
  async uploadVideo(
    @Arg("input") input: VideoInput,
    @Ctx() {}: MyContext
  ): Promise<Video> {
    console.log("FFFFFFFFFFFI", input);
    const { title, Key } = input;
    const { name } = path.parse(title);

    return Video.create({
      title: name,
      key: Key,
    }).save();
  }

  @Mutation(() => Video, { nullable: true })
  @UseMiddleware(isAuth)
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
