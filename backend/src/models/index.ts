import { Board } from './board.model';
import { Column } from './column.model';
import { Card } from './card.model';

Board.hasMany(Column, { foreignKey: 'boardId', onDelete: 'CASCADE' });
Column.belongsTo(Board, { foreignKey: 'boardId' });

Column.hasMany(Card, { foreignKey: 'columnId', onDelete: 'CASCADE' });
Card.belongsTo(Column, { foreignKey: 'columnId' });

Board.hasMany(Card, { foreignKey: 'boardId', onDelete: 'CASCADE' });
Card.belongsTo(Board, { foreignKey: 'boardId' });

export { Board, Column, Card };
