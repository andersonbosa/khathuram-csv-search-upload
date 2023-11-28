import formidable from 'formidable'
import http from 'node:http'
import slugify from 'slugify'

import { IExternalServer } from '../../../types'
import { appConfig } from '../../config'
import { ApiEndpoints } from '../../utils'
import { AppConfig } from './../../../types'

const DefaultHTTPHeaders = { 'Content-Type': 'application/json' }

export function createNativeServer (config: AppConfig): IExternalServer {
  const server: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    req.on('error', console.error)
    res.on('error', console.error)

    const isUpload = req.url === ApiEndpoints.upload && req.method === 'POST'
    if (isUpload) {
      const filepath = uploadFileWithFormidable(req, res)
      return
    }

    const isSearch = req.url === ApiEndpoints.search && req.method === 'GET'
    if (isSearch) {
      searchInAllFromReq(req, res)
      return
    }
  })

  return server
}

function searchInAllFromReq (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
  try {
    const query = new URLSearchParams(req.url)

    return res
      .writeHead(200, DefaultHTTPHeaders)
      .end(JSON.stringify({ message: 'File upload failed.' }))

  } catch (error) {
    console.error('searchInAllFromReq', error)
    return res
      .writeHead(500, DefaultHTTPHeaders)
      .end(JSON.stringify({ data: [] }))
  }
}

/* IMPROVEMENT: manually parse the buffer */
// function uploadFileManually (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
//   try {

//     return res
//       .writeHead(200, DefaultHTTPHeaders)
//       .end(JSON.stringify({ message: "The file was uploaded successfully." }))

//   } catch (error) {
//     console.error(error)
//     return res
//       .writeHead(500, DefaultHTTPHeaders)
//       .end(JSON.stringify({ message: 'File upload failed.' }))
//   }
// }

function uploadFileWithFormidable (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) {
  const form = formidable({
    uploadDir: appConfig.uploadDir,
    keepExtensions: true,
    createDirsFromUploads: true,
    allowEmptyFiles: true,
    minFileSize: 0,
    maxTotalFileSize: 4000,
    maxFileSize: 1000,
    filename (name: string, ext: string) {
      const slugifyiedName = slugify(name, { strict: true, lower: true, trim: true })
      const fileName = `${Date.now()}-${Math.random().toString(36)}-${slugifyiedName}${ext}`
      return fileName
    },
    filter ({ mimetype }) {
      return Boolean(mimetype?.includes('text/csv'))
    }
  })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      throw err
    }

    if (files.file) {
      const filepath = files.file && files.file[0].filepath

      return filepath
      // const repository = new StoredFileRepositoryMemory()
      // const fileContent = readFileSync(filepath, 'utf8')
      // const storedFile = await new UploadFile(repository).execute(fileContent)
    }
  })

  // try {
  //   res
  //     .writeHead(200, DefaultHTTPHeaders)
  //     .end(JSON.stringify({ message: "The file was uploaded successfully." }))

  // } catch (error) {
  //   console.error(error)
  //   return res
  //     .writeHead(500, DefaultHTTPHeaders)
  //     .end(JSON.stringify({ message: 'File upload failed.' }))
  // }
} 