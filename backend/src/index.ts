import { AppConfig, IExternalServer } from '../types'
import { appConfig } from './config'
import { createExpressApp } from './external/http/express'
import { createNativeServer } from './external/http/native'

export function createServerWithConfig (config: AppConfig): IExternalServer {
  switch (config.server) {
    case 'native':
      return createNativeServer(config)

    case 'express':
      return createExpressApp(config)

    default:
      throw new Error(`Environment ${config.server} not supported.`)
  }
}

export function runServerWithConfig (config: AppConfig): void {
  const server = createServerWithConfig(config)

  server.listen(config.port, () => {
    console.log(`🚀 Running on http://localhost:${config.port}`)
  })
}

runServerWithConfig(appConfig)