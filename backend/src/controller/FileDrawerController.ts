import StoredFile from '../core/entity/StoredFile'
import SearchAllFiles from '../core/usecase/SearchAllFiles'
import UploadFile from '../core/usecase/UploadFile'
import StoredFileRepositoryMemory from '../external/repository/StoredFileRepositoryMemory'

// const repository = new StoredFileRepositoryDisk()
const repository = new StoredFileRepositoryMemory()

export default class FileDrawerController {
  static async storeFile (refId: string, content: string): Promise<StoredFile | undefined> {
    try {
      const usecase = new UploadFile(repository)

      const result = await usecase.execute(refId, content)

      return result

    } catch (error) {
      console.error('FileDrawerController#storeFile', error)
      throw error
    }
  }

  static async restoreFile (refId: string): Promise<StoredFile | undefined> {
    return Promise.resolve(undefined)
  }

  static async searchInAllFiles (searchQuery: string): Promise<StoredFile[]> {
    try {
      const usecase = new SearchAllFiles(repository)

      const result = await usecase.execute(searchQuery.trim())

      return result

    } catch (error) {
      console.error('FileDrawerController#searchInAllFiles', error)
      throw error
    }
  }
}