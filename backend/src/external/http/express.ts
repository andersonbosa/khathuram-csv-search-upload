import { WriteStream, createWriteStream } from 'fs'
import { join } from 'path'

import cors from 'cors'
import Express from 'express'
import morgan from 'morgan'

import { AppConfig, IExternalServer } from '../../../types'
import ExpressAdapter from '../../adapter/ExpressAdapter'
import FileDrawerController from '../../controller/FileDrawerController'
import { ApiEndpoints } from '../../utils'
import { MulterMiddlewareWrapper } from '../../utils/multer'

function createMorganWriteStream (): WriteStream {
  return createWriteStream(join(__dirname, '../../internal/access.log'), { flags: 'a' })
}

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:4000'

export function createExpressApp (_: AppConfig): IExternalServer {
  const app = Express()

  app.use(cors({ origin: FRONTEND_URL }))
  app.use(morgan('dev'))
  app.use(morgan('combined', { stream: createMorganWriteStream() }))
  app.use(Express.json())
  app.use(Express.urlencoded({ extended: true }))

  app.post(
    ApiEndpoints.upload,
    MulterMiddlewareWrapper,
    ExpressAdapter.upload(FileDrawerController.storeFile)
  )

  app.get(
    ApiEndpoints.search,
    ExpressAdapter.search(FileDrawerController.searchInAllFiles)
  )

  return app
}
