import { Request, Response } from 'express'
import { readFileSync } from 'fs'

function ExpressAdapterUploadParams (file: Express.Multer.File): { refId: string; content: string } {
  const refId = file.filename
  const content = readFileSync(file.path, 'utf-8') || ''

  return { refId, content }
}

export default class ExpressAdapter {
  static upload (controllerCallback: Function) {
    return async function (req: Request, res: Response) {
      try {
        if (!req.file) {
          throw new Error()
        }

        const { refId, content } = ExpressAdapterUploadParams(req.file)
        const isSuccess = await controllerCallback(refId, content)
        if (!isSuccess) {
          throw new Error()
        }

        return res
          .status(200)
          .json({ message: 'The file was uploaded successfully.' })

      } catch (error) {
        console.error("ExpressAdapter.upload:", error)

        return res
          .status(500)
          .json({ message: 'File upload failed.' })
      }
    }
  }

  static search (controllerCallback: Function) {
    return async function (req: Request, res: Response) {
      try {
        const { q: searchQuery } = req.query

        const results = await controllerCallback(searchQuery)
        if (results.length <= 0) {
          throw new Error()
        }

        return res
          .status(200)
          .json({ data: results })

      } catch (error) {
        console.error("ExpressAdapter.search:", error)

        return res
          .status(500)
          .json({ message: 'Error fetching search results' })
      }
    }
  }
}
