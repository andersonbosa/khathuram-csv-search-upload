import { Component } from 'react'
import type { IFileInfo } from 'react-csv-reader'
import CSVReader from 'react-csv-reader'
import { toast } from 'react-toastify'
import { FileCard, SelectedFile } from '../../types'
import { FileCardManager } from '../../utils'

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? 'http://localhost:3000'

interface FileUploaderProps {
  onFileUpload: (fileCard: FileCard) => void
}

interface FileUploaderState {
  selectedFile: SelectedFile | undefined
}

class FileUploader extends Component<FileUploaderProps, FileUploaderState> {
  fileCardManager: FileCardManager

  constructor(props: FileUploaderProps) {
    super(props)
    this.fileCardManager = new FileCardManager()
    this.state = {
      selectedFile: undefined,
    }
  }

  isFiletypeValid = (filetype: string): boolean => {
    if (filetype === 'text/csv') return true
    this.clearFileInput()
    return false
  }

  clearFileInput = () => {
    const inputElement = document.getElementById('react_csv_reader_input') as HTMLInputElement
    if (inputElement) inputElement.value = ''
    this.setState({ selectedFile: undefined })
  }

  handleError = (msg: string) => {
    toast.error(msg)
  }

  handleFileSelect = (data: any[], fileInfo: IFileInfo, originalFile?: File | undefined): void => {
    if (!this.isFiletypeValid(fileInfo.type)) {
      return
    }
    this.setState({ selectedFile: { data, fileInfo, originalFile } })
  }

  handleOnFileUpload = async () => {
    const { selectedFile } = this.state

    if (!selectedFile || !selectedFile.originalFile) {
      this.handleError('No file selected.')
      return
    }

    if (!this.isFiletypeValid(selectedFile.fileInfo.type)) {
      this.handleError('File must be a CSV.')
      return
    }

    try {
      const card = await this.fileCardManager.createFileCard(selectedFile)

      const formData = new FormData()
      formData.append('file', selectedFile.originalFile, card.refId)
      const response = await fetch(`${BACKEND_API_URL}/api/files`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        // this.clearFileInput()
        this.props.onFileUpload(card)
        toast.success('File uploaded successfully.')

      } else {
        this.handleError('Failed to upload CSV. Please try again.')
      }
    } catch (error) {
      console.error(error)
      this.handleError('An error occurred. Please try again later.')
    }
  }

  render (): JSX.Element {
    return (
      <div title="Use me to upload the CSV files">
        <h3 className='underline'>Upload</h3>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <button id='upload-button' onClick={this.handleOnFileUpload}>Upload</button>
          <CSVReader
            inputId="react_csv_reader_input"
            onFileLoaded={this.handleFileSelect}
            parserOptions={{ header: true }}
          />
        </div>
      </div>
    )
  }
}

export default FileUploader