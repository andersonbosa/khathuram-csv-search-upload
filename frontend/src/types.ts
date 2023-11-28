import type { IFileInfo } from 'react-csv-reader'

export type SelectedFile = {
  data: string[]
  fileInfo: IFileInfo
  originalFile?: File
}

export type FileCard = {
  refId: string
  content: Object[]
}