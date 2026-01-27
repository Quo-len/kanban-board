import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export class Card extends Model {
  public id!: string;
  public boardId!: string;
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
    boardId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    columnId: {
      type: DataTypes.UUID,
      allowNull: false,
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
