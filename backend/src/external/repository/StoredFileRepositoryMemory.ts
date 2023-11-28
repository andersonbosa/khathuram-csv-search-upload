import StoredFile from '../../core/entity/StoredFile'
import StoredFileRepository from '../../core/repository/StoredFileRepository'

export default class StoredFileRepositoryMemory implements StoredFileRepository {
  MemoryStorage: StoredFile[] = []

  async storeFile (refId: string, content: string): Promise<StoredFile> {
    const storedFile = new StoredFile(refId, content)
    this.MemoryStorage.push(storedFile)
    return Promise.resolve(storedFile)
  }

  async restoreFile (refId: string): Promise<StoredFile | undefined> {
    const storedFile = this.MemoryStorage.find((file) => file.refId === refId)
    return Promise.resolve(storedFile)
  }

  /* time complexity of the searchAllFiles function is O(n),
   since it depends linearly on the number of files in the MemoryStorage array. */
  async searchAllFiles (query: string): Promise<StoredFile[]> {
    const regex = new RegExp(query, 'i')

    const results = this.MemoryStorage.reduce(
      (acc: StoredFile[], storedFile: StoredFile) => {
        if (regex.test(storedFile.content)) {
          acc.push(storedFile)
        }

        return acc
      },
      []
    )

    return Promise.resolve(results)
  }
}

