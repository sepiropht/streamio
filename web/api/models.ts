import { Schema, model, Document } from "mongoose";

interface IVideo {
  uuid: string;
  name: string;
}
const videoSchemaField: Record<keyof IVideo, any> = {
  uuid: String,
  name: String,
};
interface IVideoDoc extends IVideo, Document {}
const videoSchema = new Schema(videoSchemaField);
const Video = model<IVideoDoc>("video", videoSchema);

export default Video;
