import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export class Board extends Model {
  public id!: string;
  public name!: string;
}

Board.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: 'boards',
  },
);

export default Board;
