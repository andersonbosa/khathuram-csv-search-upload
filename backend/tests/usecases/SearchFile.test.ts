import { readFileSync } from 'fs'
import { join } from 'path'
import SearchAllFiles from '../../src/core/usecase/SearchAllFiles'
import UploadFile from '../../src/core/usecase/UploadFile'
import StoredFileRepositoryMemory from '../../src/external/repository/StoredFileRepositoryMemory'

const csvMockFilepath1 = join(__dirname, '../mocks/data.csv')
const csvMockFilepath2 = join(__dirname, '../mocks/data2.csv')
const csvMockFilepath3 = join(__dirname, '../mocks/data3.csv')
const refIdMock = `b94d27b99efcde9.mock`

describe('searchAllFiles usecase', () => {

  describe('Using Memory repository', () => {
    it("Should found 3 results with australia", async () => {
      /* Populate repository */
      const repository = new StoredFileRepositoryMemory()
      const uploadUsecase = new UploadFile(repository)
      await uploadUsecase.execute(`1.${refIdMock}`, readFileSync(csvMockFilepath1, 'utf8'))
      await uploadUsecase.execute(`2.${refIdMock}`, readFileSync(csvMockFilepath2, 'utf8'))
      await uploadUsecase.execute(`3.${refIdMock}`, readFileSync(csvMockFilepath3, 'utf8'))

      /* Search */
      const searchUsecase = new SearchAllFiles(repository)
      const results = await searchUsecase.execute('jane')

      expect(results.length).toEqual(3)
    })
  })
  // TODO describe('Using Disk repository', () => { })
})