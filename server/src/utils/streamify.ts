const { Readable } = require('stream')

export default async function (
  videoStream: typeof Readable,
  req: any,
  res: any,
  fileSize: number
) {
  const range = req.headers.range

  console.log({ fileSize })

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-')

    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

    const chunksize = end - start + 1

    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    console.log('yeah accept range')
    res.writeHead(200, head)
    videoStream.pipe(res)
  } else {
    console.log('without range')
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
  }

  videoStream.pipe(res)
}
