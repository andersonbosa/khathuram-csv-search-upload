import { readFileSync } from 'fs'
import { join } from 'path'

import UploadFile from '../../src/core/usecase/UploadFile'
import StoredFileRepositoryDisk from '../../src/external/repository/StoredFileRepositoryDisk'
import StoredFileRepositoryMemory from '../../src/external/repository/StoredFileRepositoryMemory'

const csvMockFilepath = join(__dirname, '../mocks/data.csv')
const refIdMock = `b94d27b99efcde9.mock`
const fileContentMock = readFileSync(csvMockFilepath, 'utf8')

describe('UploadFile usecase', () => {

  describe('Using Memory repository', () => {
    it("Should store file on server", async () => {
      const repository = new StoredFileRepositoryMemory()
      const usecase = new UploadFile(repository)
      const storedFile = await usecase.execute(refIdMock, fileContentMock)
      expect(storedFile).toHaveProperty('refId')
      expect(storedFile).toHaveProperty('content')
      expect(storedFile).toHaveProperty('createdAt')
    })

    it("Should restore file on server", async () => {
      const repository = new StoredFileRepositoryMemory()
      const usecase = new UploadFile(repository)

      const storedFile = await usecase.execute(`${refIdMock}.1`, fileContentMock)
      const recoveredFile = await repository.restoreFile(storedFile.refId)

      expect(storedFile.refId).toEqual(recoveredFile?.refId)
    })

    it("Should create 3 files on server", async () => {
      const repository = new StoredFileRepositoryMemory()
      const usecase = new UploadFile(repository)
      await usecase.execute(`${refIdMock}.1`, fileContentMock)
      await usecase.execute(`${refIdMock}.2`, fileContentMock)
      await usecase.execute(`${refIdMock}.3`, fileContentMock)
      expect(repository.MemoryStorage.length).toEqual(3)
    })
  })

  describe('Using Disk repository', () => {
    it("Should store file on server", async () => {
      const repository = new StoredFileRepositoryDisk()
      const usecase = new UploadFile(repository)
      const storedFile = await usecase.execute(refIdMock, fileContentMock)
      expect(storedFile).toHaveProperty('refId')
      expect(storedFile).toHaveProperty('content')
      expect(storedFile).toHaveProperty('createdAt')
    })

    it("Should restore file from server", async () => {
      const repository = new StoredFileRepositoryDisk()
      const usecase = new UploadFile(repository)
      const storedFile = await usecase.execute(refIdMock, fileContentMock)
      const recoveredFile = await repository.restoreFile(storedFile.refId)
      expect(storedFile.refId).toEqual(recoveredFile?.refId)
      expect(storedFile.content).toEqual(recoveredFile?.content)
    })
  })
})
