
export type ServerType = "native" | "express"

export type RequestParams = {
  [key: string]: string
}

export type RequestBody = {
  [key: string]: any
}

export type RequestHandler = (params: RequestParams, body: RequestBody) => Promise<any>

export type AppConfig = {
  port: number
  server: ServerType
  uploadDir: string | 'uploads'
}

export interface IExternalServer {
  listen: (port: number, cb: () => void) => void
}

export type UploadFileSuccessResponse = {
  status: 200
  message: string
}

export type UploadFileFailResponse = {
  status: 500
  message?: string
}

export type SearchFileSuccessResponse = {
  status: 200
  data: string[]
}

export type SearchFileFailResponse = {
  status: 500
  data: string[]
}
