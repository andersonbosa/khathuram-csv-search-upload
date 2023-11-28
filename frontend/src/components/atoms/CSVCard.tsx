import { Component } from 'react'
import { FileCard } from '../../types'
import { toast } from 'react-toastify'

interface CSVCardProps {
  card: FileCard
  highlightTerm: string | undefined
}

class CSVCard extends Component<CSVCardProps, {}> {

  getSingleRow = (card: FileCard): Object => {
    const rowIndex = 0
    const singleContentRow = card.content[rowIndex]
    return singleContentRow ? singleContentRow : this.getSingleRow(card)
  }

  tryHighlight = (key: string): JSX.Element => {
    const { highlightTerm } = this.props

    const highlightIndex = highlightTerm ? key.toLowerCase().indexOf(highlightTerm.toLowerCase()) : -1
    if (highlightTerm && highlightIndex > -1) {
      return (
        <>
          <span>{key.substring(0, highlightIndex)}</span>
          <span className="highlight_term">{key.substring(highlightIndex, highlightIndex + highlightTerm.length)}</span>
          <span>{key.substring(highlightIndex + highlightTerm.length)}</span>
        </>
      )
    }

    return <>{key}</>
  }

  handlePreviousSingleRow = () => {
    toast.info('Not implemented yet.')
  }
  handleNextSingleRow = () => {
    toast.info('Not implemented yet.')
  }

  render (): JSX.Element {
    const { card } = this.props

    const slicedCardId = card.refId.slice(0, 16)
    const singleRow = this.getSingleRow(card)
    const singleRowValues = Object.values(singleRow)

    return (
      <li id="csv-card" title={card.refId}>
        <div>
          <div>
            <p>Card</p>
            <p>{slicedCardId}...</p>
          </div>
          <hr />
          <div className="card_row_list_container">
            <ul className="card_row_list">
              {singleRowValues.map((key, index) => (
                <li key={key + index}>{this.tryHighlight(key)}</li>
              ))}
            </ul>
            <div className='card_row_list_slide_button_container'>
              <span onClick={this.handlePreviousSingleRow} className="card_row_list_slide_button">&uarr;</span>
              <span onClick={this.handleNextSingleRow} className="card_row_list_slide_button">&darr;</span>
            </div>
          </div>
        </div>
      </li>
    )
  }
}

export default CSVCard