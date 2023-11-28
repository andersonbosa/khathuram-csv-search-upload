import { NextFunction, Request, Response } from "express"
import multer, { Multer, StorageEngine } from "multer"

import { appConfig } from '../config'
import slugify from 'slugify'

const maxSizeMegabytes: number = 100 * 1024 * 1024

const diskStorage: StorageEngine = multer.diskStorage({
  destination: (_: Request, file: Express.Multer.File, callback: Function) => {
    return callback(null, appConfig.uploadDir)
  },
  filename: (req: Request, file: Express.Multer.File, callback: Function) => {
    const fileName = slugify(file.originalname, { strict: true, lower: true, trim: true })
    return callback(null, fileName)
  },
})

const MulterService: Multer = multer({
  storage: diskStorage,
  limits: {
    fileSize: maxSizeMegabytes
  },
  fileFilter: (_: Request, file: Express.Multer.File, callback: Function) => {
    if (file.mimetype == 'text/csv') {
      return callback(null, true)
    }
    callback(null, false)
  },
})

const MulterMiddleware = MulterService.single("file")

export function MulterMiddlewareWrapper (req: Request, res: Response, next: NextFunction): void {
  return MulterMiddleware(req, res, (err: any) => {
    if (err) console.error('MulterMiddlewareWrapper', err)
    next()
  })
}

export default MulterMiddleware
