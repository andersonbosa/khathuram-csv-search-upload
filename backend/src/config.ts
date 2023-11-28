import { join } from 'path'
import { AppConfig } from '../types'

export const UploadDirPath = join(__dirname, './internal', 'uploads')

export const appConfig: AppConfig = {
  port: 3000,
  server: 'express',
  uploadDir: UploadDirPath
}
