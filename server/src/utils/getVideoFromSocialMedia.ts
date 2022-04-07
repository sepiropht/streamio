import youtubedl from 'youtube-dl'
const ffmpeg = require('fluent-ffmpeg')
import fs from 'fs'
import s3 from './awsConf'
import generateThumbnail from './generateThumbnail'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export default async (
  url: string,
  key: string,
  client: any
): Promise<{ fileName: string }> => {
  console.log('FROM GET SOCIAL MEDIA')
  console.log({ url, key })
  return new Promise((resolve, reject) => {
    const video = youtubedl(url, [], {})
    let fileName: string
    // Will be called when the download starts.
    const videoTempPath = '/tmp/' + uuidv4()
    const { name } = path.parse(key)
    const newKey = name + '.mp4'
    console.log({ videoTempPath, newKey })
    const uploadParams = {
      Bucket: 'streamio/test',
      Key: newKey,
    }

    const filePath = `/tmp/${key}`
    const process = async () => {
      try {
        await generateThumbnail(videoTempPath, name, client)
      } catch (err) {
        console.log(err)
        console.log("il n' aura pas d'image")
      }
      ffmpeg(videoTempPath)
        .on('progress', (progress: any) => {
          console.log('progress', JSON.stringify(progress))
          client.send(JSON.stringify({ progress, Key: newKey }))
        })
        .duration(10 * 60)
        .format('ogg')
        .save(filePath)
        .on('error', (err: any) => reject(err))
        .on('end', async () => {
          client.send(JSON.stringify({ done: 'done', Key: newKey }))
          await s3
            .upload({
              Body: fs.createReadStream(filePath),
              ...uploadParams,
            })
            .promise()
          resolve({ fileName })
        })
    }
    video
      .on('info', (info) => {
        console.log('Download started')
        console.log('filename: ' + info._filename)
        fileName = info._filename
        let { name } = path.parse(info._filename)
        fileName = name
        console.log('size: ' + info.size)
      })
      .on('error', (err) => reject(err))
      .pipe(fs.createWriteStream(videoTempPath).on('close', process))
  })
}
