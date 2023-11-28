import { FileCard, SelectedFile } from './types'


interface IFileCardManager {
  createFileCard (selectedFile: SelectedFile): Promise<FileCard>
  generateFileID (): Promise<string>
  isFiletypeValid (filetype: string): boolean
}

export class FileCardManager implements IFileCardManager {
  async createFileCard (selectedFile: SelectedFile): Promise<FileCard> {
    const refId: string = await this.generateFileID()
    const fileCard: FileCard = { refId, content: selectedFile.data }
    return fileCard
  }

  async generateFileID (): Promise<string> {
    const timestamp: string = Date.now().toString()
    const random: string = Math.floor(Math.random() * 100000).toString()
    const message: string = `${timestamp}-${random}`
    const encoder: TextEncoder = new TextEncoder()
    const data: Uint8Array = encoder.encode(message)
    const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray: number[] = Array.from(new Uint8Array(hashBuffer))
    const hashHex: string = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  isFiletypeValid = (filetype: string): boolean => {
    return filetype === 'text/csv' ? true : false
  }
}



export const fileCardMock: FileCard = {
  "refId": "3538053a015af2572ca466465b4725a1e55f2e5f8f8fd88998152b5a85ba57d8",
  "content": [
    {
      "name": "Lucas Silva",
      "city": "São Paulo",
      "country": "Brazil",
      "favorite_sport": "Surfing"
    },
    {
      "name": "Isabella Chen",
      "city": "Shanghai",
      "country": "China",
      "favorite_sport": "Table Tennis"
    },
    {
      "name": "Noah Kowalski",
      "city": "Warsaw",
      "country": "Poland",
      "favorite_sport": "Swimming"
    },
    {
      "name": "Mia Khan",
      "city": "Mumbai",
      "country": "India",
      "favorite_sport": "Cricket"
    },
    {
      "name": "Elijah Schmidt",
      "city": "Chicago",
      "country": "USA",
      "favorite_sport": "Basketball"
    },
    {
      "name": "Jane Rossi",
      "city": "Rome",
      "country": "Italy",
      "favorite_sport": "Soccer"
    },
    {
      "name": ""
    }
  ]
}

export function parseCSVContent (csvString: string): Object {
  const rows = csvString.trim().split('\n')
  const headers = rows[0].split(',')
  const dataRows = rows.slice(1)

  const parsedData = dataRows.map(row => {
    const values = row.split(',')
    const obj: { [key: string]: string } = {}
    headers.forEach((header, index) => {
      obj[header] = values[index]
    })
    return obj
  })

  return parsedData
}

type StoredFileResult = {
  refId: string
  content: string
}

export function parseSearchResults (fileCards: StoredFileResult[]): FileCard[] {
  const mappedResults = fileCards.map(
    (storedFileResult: StoredFileResult): FileCard => {
      const mappedItem = {
        refId: storedFileResult.refId,
        content: parseCSVContent(storedFileResult.content)
      }
      return mappedItem as FileCard
    }
  )

  return mappedResults
}