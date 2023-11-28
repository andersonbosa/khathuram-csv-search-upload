import StoredFileRepository from '../repository/StoredFileRepository'

export default class SearchAllFiles {
  storeFileRepository: StoredFileRepository

  constructor(storeFileRepository: StoredFileRepository) {
    this.storeFileRepository = storeFileRepository
  }

  async execute (query: string) {
    return await this.storeFileRepository.searchAllFiles(query)
  }
}