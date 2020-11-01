import mongoose, { Schema, model, Document } from "mongoose";

const dbName = "test";
const url = `mongodb+srv://admin:admin@cluster0.vod8r.mongodb.net/${dbName}?retryWrites=true&w=majority`;

interface IVideo {
  uuid: string;
  extention: string;
  name: string;
}
const videoSchemaField: Record<keyof IVideo, any> = {
  uuid: String,
  extention: String,
  name: String,
};
interface IVideoDoc extends IVideo, Document {}
const videoSchema = new Schema(videoSchemaField);
const Video = model<IVideoDoc>("video", videoSchema);

(async () => {
  await mongoose.connect(url, { poolSize: 10, useNewUrlParser: true });
  mongoose.connection;
})();

export { Video };
