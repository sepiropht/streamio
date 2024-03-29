import s3 from './awsConf'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import generateThumbnail from './generateThumbnail'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

export default async (
  Key: string,
  duration: any,
  client: any
): Promise<{ oldKey: string; newKey: string }> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('IIIIIIIIIII CONVERT')
      const videoTempPath = '/tmp/' + uuidv4()
      s3.getObject({
        Bucket: 'streamio/test',
        Key,
      })
        .createReadStream()
        .pipe(
          fs.createWriteStream(videoTempPath).on('close', async () => {
            console.log('ON CLOSE')
            const { name } = path.parse(Key)
            const newKey = name + '.mp4'

            const uploadParams = {
              Bucket: 'streamio/test',
              Key: newKey,
            }
            const filePath = `/tmp/${newKey}`
            duration ? '' : await generateThumbnail(videoTempPath, name, client)
            ;(duration
              ? ffmpeg(videoTempPath)
                  .setStartTime(duration.start)
                  .duration(duration.duration)
              : ffmpeg(videoTempPath)
            )
              .on('progress', (progress) => {
                console.log('progress', JSON.stringify(progress))
                client.send(JSON.stringify({ progress, Key }))
              })
              .audioCodec('libvorbis')
              .format('ogg')
              .addOption('-movflags', 'faststart')
              .save(filePath)
              .on('error', (err) => {
                console.log(err)
                reject(err)
              })
              .on('end', async () => {
                client.send(JSON.stringify({ done: 'done', Key }))
                await s3
                  .upload({
                    Body: fs.createReadStream(filePath),
                    ...uploadParams,
                  })
                  .promise()
                resolve({ oldKey: Key, newKey })
              })
          })
        )
    } catch (err) {
      reject(err)
    }
  })
}
