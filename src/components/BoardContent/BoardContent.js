import React, { useEffect, useState } from "react";
import "./BoardContent.scss";
import Column from "components/Column/Column";
import { isEmpty } from "lodash";

import { initialData } from "./../../actions/initialData";
import { mapOrder } from "./../../utils/sorts";

function BoardContent(props) {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === "board-1"
    );
    if (boardFromDB) {
      setBoard(boardFromDB);

      // sort column
      const columnsSorted = mapOrder(
        boardFromDB.columns,
        boardFromDB.columnOrder,
        "id"
      );
      setColumns(columnsSorted);
    }
  }, []);

  if (isEmpty(board)) {
    return (
      <div className="not-found" style={{ padding: "10px", color: "white" }}>
        Board not found
      </div>
    );
  }

  return (
    <div className="board-content">
      {columns.map((column) => (
        <Column key={column.id} column={column} />
      ))}
    </div>
  );
}

export default BoardContent;
