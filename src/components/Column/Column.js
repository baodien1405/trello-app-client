import Card from 'components/Card/Card'
import ConfirmModal from 'components/Common/ConfirmModal'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Container, Draggable } from 'react-smooth-dnd'
import { mapOrder } from 'utils/sorts'
import './Column.scss'
import { MODAL_ACTION_CONFIRM } from 'utils/constants'
import {
  saveContentAfterPressEnter,
  selectAllInlineText
} from 'utils/contentEditable'

function Column({ column, onCardDrop, onUpdateColum }) {
  const cards = mapOrder(column.cards, column.cardOrder, 'id')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [columnTitle, setColumnTitle] = useState('')

  const handleColumnTitleChange = (e) => {
    setColumnTitle(e.target.value)
  }

  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

  const toggleShowConfirmModal = () => {
    setShowConfirmModal(!showConfirmModal)
  }

  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true
      }
      onUpdateColum(newColumn)
    }
    toggleShowConfirmModal()
  }

  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle
    }
    onUpdateColum(newColumn)
  }

  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <input
            type="text"
            placeholder="Enter column title..."
            className="trello-content-editable"
            value={columnTitle}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onKeyDown={saveContentAfterPressEnter}
            onClick={selectAllInlineText}
            onMouseDown={(e) => e.preventDefault()}
            spellCheck="false"
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              size="sm"
              className="dropdown-btn"
            />

            <Dropdown.Menu>
              <Dropdown.Item>Add card...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>
                Remove column...
              </Dropdown.Item>
              <Dropdown.Item>
                Move all cards in this column (beta)...
              </Dropdown.Item>
              <Dropdown.Item>
                Archive all cards in this column (beta)...
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          orientation="vertical"
          groupName="col"
          onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
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
      <footer>
        <div className="footer-actions">
          <i className="fa fa-plus icon" />
          Add another card
        </div>
      </footer>

      <ConfirmModal
        title="Remove column"
        content={`Are you sure you want to remove <strong>${column.title}</strong>. <br /> All related cards will also be remove!`}
        show={showConfirmModal}
        onAction={onConfirmModalAction}
      />
    </div>
  )
}

export default Column
