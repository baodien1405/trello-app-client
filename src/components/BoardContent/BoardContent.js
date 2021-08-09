import React, { useEffect, useState } from 'react'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { isEmpty } from 'lodash'
import { Container, Draggable } from 'react-smooth-dnd'

import { initialData } from './../../actions/initialData'
import { mapOrder } from './../../utils/sorts'

function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])

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

  if (isEmpty(board)) {
    return (
      <div className="not-found" style={{ padding: '10px', color: 'white' }}>
        Board not found
      </div>
    )
  }

  const onColumnDrop = (dropResult) => {
    console.log(dropResult)
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
            <Column column={column} />
          </Draggable>
        ))}
      </Container>
    </div>
  )
}

export default BoardContent
