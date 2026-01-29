import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import { Board } from './board.model';

export class Column extends Model {
  public id!: string;
  public boardId!: string;
  public title!: string;
  public position!: number;
}

Column.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    boardId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Board,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: 'columns',
  },
);

export default Column;
