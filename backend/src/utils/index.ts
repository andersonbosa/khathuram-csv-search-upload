import * as fs from 'fs'
import { join } from 'path'
import * as readline from 'readline'
import * as stream from 'stream'
import * as util from 'util'

// Promisify the 'pipeline' function from the 'stream' module
const pipeline = util.promisify(stream.pipeline)

// Type for a single CSV row
export type CSVRow = {
  [key: string]: string | number
}

// Function to read a CSV file and return its contents as an array of objects
export async function readCSV (filePath: string): Promise<CSVRow[]> {
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  const header: string[] = []
  const data: CSVRow[] = []

  // Read the header line
  for await (const line of rl) {
    header.push(...line.split(','))
    break
  }

  // Read and parse data lines
  for await (const line of rl) {
    const rowValues = line.split(',')
    const row: CSVRow = {}

    for (let i = 0; i < header.length; i++) {
      row[header[i]] = isNaN(Number(rowValues[i])) ? rowValues[i] : Number(rowValues[i])
    }

    data.push(row)
  }

  return data
}

// Function to write data to a CSV file
export async function writeCSV (filePath: string, data: CSVRow[]): Promise<void> {
  const fileStream = fs.createWriteStream(filePath)
  const header = Object.keys(data[0])
  const headerRow = header.join(',') + '\n'

  // Write the header
  await pipeline(stream.Readable.from(headerRow), fileStream)

  // Write the data rows
  for (const row of data) {
    const rowValues = header.map((key) => (row[key] || '').toString())
    const rowString = rowValues.join(',') + '\n'

    await pipeline(stream.Readable.from(rowString), fileStream)
  }
}

export const ApiEndpoints = {
  upload: "/api/files",
  search: "/api/users"
}


