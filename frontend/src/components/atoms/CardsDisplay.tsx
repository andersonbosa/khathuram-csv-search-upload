import { Component } from 'react'
import { FileCard } from '../../types'
import CSVCard from './CSVCard'

interface CardsDisplayProps {
  cards: FileCard[]
  filterTerm: string | undefined
}


class CardsDisplay extends Component<CardsDisplayProps, {}> {

  filterCards = (cards: FileCard[], filterTerm: string | undefined): FileCard[] => {
    // if (!cards || cards.length === 0) {
    //   return []
    // }
    const normalizedFilterTerm = filterTerm?.trim().toLowerCase()
    if (!normalizedFilterTerm) {
      return cards
    }
    return cards.filter(card => JSON.stringify(card.content).toLowerCase().includes(normalizedFilterTerm))
  }

  render (): JSX.Element {
    const { cards, filterTerm } = this.props
    const displayedCards = this.filterCards(cards, filterTerm)

    return (
      <>
        <div>
          <h3 className='underline'>Displayed cards</h3>
          <ul className="csv-cards-list" style={{ listStyle: 'none' }}>
            {displayedCards.map((card, index) => (
              <CSVCard key={index} card={card} highlightTerm={filterTerm} />
            ))}
          </ul>
        </div>
      </>
    )
  }
}

export default CardsDisplay