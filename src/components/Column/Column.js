import Card from "components/Card/Card";
import React from "react";
import "./Column.scss";
import { mapOrder } from "utils/sorts";

function Column({ column }) {
  const { title } = column;
  const cards = mapOrder(column.cards, column.cardOrder, "id");

  return (
    <div className="column">
      <header>{title}</header>
      <ul className="card-list">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </ul>
      <footer>Add another card</footer>
    </div>
  );
}

export default Column;
