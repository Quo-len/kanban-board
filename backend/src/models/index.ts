import { Board } from './board.model';
import { Column } from './column.model';
import { Card } from './card.model';

Board.hasMany(Column, {
  foreignKey: 'boardId',
  as: 'columns',
  onDelete: 'CASCADE',
});
Column.belongsTo(Board, { foreignKey: 'boardId' });

Column.hasMany(Card, {
  foreignKey: 'columnId',
  as: 'cards',
  onDelete: 'CASCADE',
});
Card.belongsTo(Column, { foreignKey: 'columnId' });

export { Board, Column, Card };
