import { Component } from 'react'
import { toast } from 'react-toastify'
import { FileCard } from '../../types'
import { parseSearchResults } from '../../utils'

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? 'http://localhost:3000'

interface SearchBarProps {
  onSearchType (filterTerm: string): void
  onSearchSuccess (fileCards: FileCard[]): void
}

interface SearchBarState {
  searchTerm: string
  searchResults: any[]
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props)
    this.state = {
      searchTerm: '',
      searchResults: [],
    }
  }

  handleError = (msg: string) => {
    toast.error(msg)
  }

  fetchSearchResults = async (searchTerm: string): Promise<FileCard[]> => {
    const apiUrl = `${BACKEND_API_URL}/api/users?q=${searchTerm}`
    try {
      const response = await fetch(apiUrl)
      if (response.ok) {
        const { data } = await response.json()
        return parseSearchResults(data) ?? []
      }
      // this.handleError('Error fetching search results')
    } catch (error) {
      this.handleError('Network error! Details in console.')
      console.error(error)
    }
    return []
  }

  handleSearchTrigger = async (event: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
    const { searchTerm } = this.state
    if (event.key !== 'Enter' || searchTerm === '') {
      return
    }
    const results = await this.fetchSearchResults(searchTerm)

    this.props.onSearchSuccess(results)
  }

  handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const searchTerm = event?.target?.value ?? ''
    this.setState({ searchTerm })
    this.props.onSearchType(searchTerm)
  }

  render (): JSX.Element {
    return (
      <div id='search-bar' title="Use me to look between the files uploaded to the server.">
        <h3 className='underline'>Search</h3>
        <input
          type="text"
          placeholder="Press Enter to search"
          onChange={this.handleInputChange}
          onKeyDown={this.handleSearchTrigger}
        />
      </div>
    )
  }
}

export default SearchBar