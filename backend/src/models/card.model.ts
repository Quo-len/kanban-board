import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import { Column } from './column.model';
import { Board } from './board.model';

export class Card extends Model {
  public id!: string;
  public columnId!: string;
  public title!: string;
  public description?: string;
  public position!: number;
}

Card.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    columnId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Column,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: 'cards',
  },
);

export default Card;
