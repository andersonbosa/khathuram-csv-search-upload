import StoredFile from '../entity/StoredFile'

export default interface StoredFileRepository {
  storeFile (refId: string, content: string): Promise<StoredFile>
  restoreFile (refId: string): Promise<StoredFile | undefined>
  searchAllFiles (query: string): Promise<StoredFile[]>
}