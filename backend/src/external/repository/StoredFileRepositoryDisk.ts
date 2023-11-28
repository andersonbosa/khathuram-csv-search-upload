import fs from 'fs'
import readline from 'readline'
import stream from 'stream'

import { appConfig } from '../../config'
import StoredFile from '../../core/entity/StoredFile'
import StoredFileRepository from '../../core/repository/StoredFileRepository'

/* 
function searchWordInFile (filename: string, searchWord: string): boolean {
  const fileContent = fs.readFileSync(filename, 'utf8')
  return fileContent.includes(searchWord)
}

async function searchFilesInDirectory (directoryPath: string, searchWord: string): Promise<string[]> {
  const matchingFiles: string[] = []

  fs.readdirSync(directoryPath).forEach((file) => {
    const filePath = path.join(directoryPath, file)
    if (fs.statSync(filePath).isFile() && searchWordInFile(filePath, searchWord)) {
      matchingFiles.push(file)
    }
  })

  return matchingFiles
}
*/


interface SearchResults {
  fileName: string
}

function searchFilesForTerm (directoryPath: string, searchTerm: string): Promise<SearchResults[]> {
  return new Promise<SearchResults[]>((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(err)
      }

      const results: SearchResults[] = []

      files.forEach((file) => {
        const fileStream = fs.createReadStream(`${directoryPath}/${file}`)
        const rl = readline.createInterface({
          input: fileStream,
          output: new stream.Writable(),
        })

        rl.on('line', (line: string) => {
          if (line.includes(searchTerm)) {
            results.push({ fileName: file })
            rl.close()
          }
        })

        rl.on('close', () => {
          if (file === files[files.length - 1]) {
            resolve(results)
          }
        })
      })
    })
  })
}

async function saveFileOnDisk (fileName: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function readFileFromDisk (fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export default class StoredFileRepositoryDisk implements StoredFileRepository {
  async storeFile (refId: string, content: string): Promise<StoredFile> {
    const storedFile = new StoredFile(refId, content)
    const absolutePath = `${appConfig.uploadDir}/${storedFile.refId}`

    await saveFileOnDisk(absolutePath, storedFile.content)

    return Promise.resolve(storedFile)
  }

  async restoreFile (refId: string): Promise<StoredFile | undefined> {
    const fileContent = await readFileFromDisk(`${appConfig.uploadDir}/${refId}`)

    return new StoredFile(refId, fileContent)
  }

  async searchAllFiles (query: string): Promise<StoredFile[]> {
    throw new Error('Method not implemented.')
  }
}