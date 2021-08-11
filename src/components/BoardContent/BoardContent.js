import React, { useEffect, useRef, useState } from 'react'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { isEmpty } from 'lodash'
import { Container, Draggable } from 'react-smooth-dnd'

import { initialData } from './../../actions/initialData'
import { mapOrder } from './../../utils/sorts'
import { applyDrag } from 'utils/dragDrop'

function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const newColumnInputRef = useRef()
  const [newColumnTitle, setNewColumnTitle] = useState('')

  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === 'board-1'
    )
    if (boardFromDB) {
      setBoard(boardFromDB)

      // sort column
      const columnsSorted = mapOrder(
        boardFromDB.columns,
        boardFromDB.columnOrder,
        'id'
      )
      setColumns(columnsSorted)
    }
  }, [])

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()
    }
  }, [openNewColumnForm])

  if (isEmpty(board)) {
    return (
      <div className="not-found" style={{ padding: '10px', color: 'white' }}>
        Board not found
      </div>
    )
  }

  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map((c) => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns]
      let currentColumn = newColumns.find((c) => c.id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map((card) => card.id)

      setColumns(newColumns)
    }
  }

  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
  }

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus()
      return
    }

    const newColumnToAdd = {
      id: Math.random().toString(36).substr(2, 5),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: []
    }

    let newColumns = [...columns]
    newColumns.push(newColumnToAdd)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map((c) => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
    setNewColumnTitle('')
    toggleOpenNewColumnForm()
  }

  const onNewColumnTitleChange = (e) => {
    setNewColumnTitle(e.target.value)
  }

  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate.id

    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex(
      (col) => col.id === columnIdToUpdate
    )

    if (newColumnToUpdate._destroy) {
      // remove column
      newColumns.splice(columnIndexToUpdate, 1)
    } else {
      // update column info
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
    }

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map((c) => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }

  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        dragHandleSelector=".column-drag-handle"
        getChildPayload={(index) => columns[index]}
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}
      >
        {columns.map((column) => (
          <Draggable key={column.id}>
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateColumn={onUpdateColumn}
            />
          </Draggable>
        ))}
        <div className="action-container">
          {!openNewColumnForm ? (
            <div className="add-new-column" onClick={toggleOpenNewColumnForm}>
              <i className="fa fa-plus icon" />
              Add another column
            </div>
          ) : (
            <div className="enter-new-column">
              <input
                type="text"
                placeholder="Enter column title..."
                className="input-enter-new-column"
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                onKeyDown={(e) => e.key === 'Enter' && addNewColumn()}
              />
              <button className="add-column-btn" onClick={addNewColumn}>
                Add column
              </button>
              <span
                className="cancel-new-column"
                onClick={toggleOpenNewColumnForm}
              >
                <i className="fa fa-trash icon"></i>
              </span>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

export default BoardContent
