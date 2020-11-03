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
//import convert from "../utils/convert";
import s3 from "../utils/aws";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { v4 as uuidv4 } from "uuid";
import { createWriteStream } from "fs";

@Resolver(Video)
export class VideoResolver {
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
    console.log("FFFFFFFFFFFI", file);
    const { createReadStream, filename } = file;

    const suffix = "test";
    const Bucket = `streamio/${suffix}`;
    const Key = uuidv4() + "mp4";
    // const updateVideoStatus = () => {
    //   console.log("updateVideoStauts");
    //   getConnection()
    //     .createQueryBuilder()
    //     .update(Video)
    //     .set({ isConvertionPending: false })
    //     .where('"Key" = :Key', {
    //       Key,
    //     })
    //     .returning("*")
    //     .execute();
    //   console.log("conversiotn done");
    // };

    const uploadParams = {
      Bucket,
      Key,
      Body: createReadStream(),
    };
    createReadStream().pipe(createWriteStream("output.mkv"));
    console.log("to awsss");
    s3.upload(uploadParams, (err: any, data: any) => {
      if (err) return console.log(err);
      console.log(data);
    });
    return Video.create({
      title: filename,
      Key,
    }).save();
  }

  @Mutation(() => Video, { nullable: true })
  @UseMiddleware(isAuth)
  async updateVideo(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Arg("text") Key: string,
    @Ctx() { req }: MyContext
  ): Promise<Video | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Video)
      .set({ title, Key })
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
