import './App.css'

import { Component } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import CardsDisplay from './components/atoms/CardsDisplay'
import FileUploader from './components/atoms/FileUploader'
import SearchBar from './components/atoms/SearchBar'
import { FileCard } from './types'
import { fileCardMock } from './utils'


interface AppProps { }

interface AppState {
  displayedCards: FileCard[]
  filterTerm: string | undefined
}

class App extends Component<AppProps, AppState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      filterTerm: undefined,
      displayedCards: [],
    }
  }

  setCardsDisplay = (fileCards: FileCard[]): void => {
    this.setState(
      (prevState) => ({
        displayedCards: fileCards
      })
    )
  }

  addFileCard = (fileCard: FileCard): void => {
    this.setState(
      (prevState) => ({
        displayedCards: prevState.displayedCards.concat(fileCard)
      })
    )
  }

  updateFilterTerm = (filterTerm: string): void => {
    this.setState(
      (_prevState) => ({
        filterTerm: filterTerm
      })
    )
  }

  render (): JSX.Element {
    const { displayedCards, filterTerm } = this.state

    return (
      <>
        <ToastContainer
          autoClose={2000}
          position='bottom-right'
          limit={5}
        />

        <header>
          <br />
          <img src="favicon.ico" alt="logo" />
          <h1 className='underline' >App</h1>
          <p>Full-stack test: CSV Upload & Search</p>
        </header>

        <main>
          <div className='features-container' >
            <FileUploader onFileUpload={this.addFileCard} />
            <br />
            <SearchBar onSearchType={this.updateFilterTerm} onSearchSuccess={this.setCardsDisplay} />
          </div>
          <CardsDisplay cards={displayedCards} filterTerm={filterTerm} />
        </main>

        <footer>
          <p>Copyleft © 2023 - <a href="https://github.com/andersonbosa"> Anderson Bosa</a></p>
        </footer>
      </>
    )
  }
}

export default App