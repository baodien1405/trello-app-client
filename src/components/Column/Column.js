import Card from 'components/Card/Card'
import React from 'react'
import './Column.scss'
import { mapOrder } from 'utils/sorts'
import { Container, Draggable } from 'react-smooth-dnd'

function Column({ column }) {
  const { title } = column
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const onCardDrop = () => {}

  return (
    <div className="column">
      <header className="column-drag-handle">{title}</header>
      <div className="card-list">
        <Container
          orientation="vertical"
          groupName="col"
          onDrop={onCardDrop}
          getChildPayload={(index) => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'cards-drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card) => (
            <Draggable key={card.id}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
      </div>
      <footer>Add another card</footer>
    </div>
  )
}

export default Column
