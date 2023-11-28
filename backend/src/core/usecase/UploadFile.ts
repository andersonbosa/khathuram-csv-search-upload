import StoredFile from '../entity/StoredFile'
import StoredFileRepository from '../repository/StoredFileRepository'

export default class UploadFile {
  storedFileRepository: StoredFileRepository

  constructor(storedFileRepository: StoredFileRepository) {
    this.storedFileRepository = storedFileRepository
  }

  async execute (refId: string, content: string): Promise<StoredFile> {
    return await this.storedFileRepository.storeFile(refId, content)
  }
}