import { Op, Transaction } from 'sequelize';
import { Column, Card } from '../models';
import { CreateCardInput, UpdateCardInput } from '../schemas/card.schema';
import { NotFoundError } from '../utils/errors';
import sequelize from '../db';

const POSITION_STEP = 5120;

const getHighestPositionCard = async (columnId: string) => {
  const card = await Card.findOne({
    where: { columnId },
    order: [['position', 'DESC']],
  });
  return card;
};

export const createCard = async (cardData: CreateCardInput) => {
  const column = await Column.findByPk(cardData.columnId);
  if (!column) {
    throw new NotFoundError('Column');
  }
  const highestCard = await getHighestPositionCard(cardData.columnId);
  const newPosition = highestCard
    ? highestCard.position + POSITION_STEP
    : POSITION_STEP;

  return await Card.create({
    ...cardData,
    position: newPosition,
  });
};

export const updateCard = async (id: string, cardData: UpdateCardInput) => {
  const card = await Card.findByPk(id);
  if (!card) {
    throw new NotFoundError('Card');
  }
  return await card.update(cardData);
};

export const moveCard = async (
  id: string,
  data: { columnId: string; targetIndex: number },
) => {
  return sequelize.transaction(async (transaction) => {
    const { columnId, targetIndex } = data;

    if (targetIndex < 0) {
      throw new Error('Invalid targetIndex');
    }

    const card = await Card.findByPk(id, { transaction });
    if (!card) {
      throw new NotFoundError('Card');
    }

    let cards = await Card.findAll({
      where: {
        columnId,
        id: { [Op.ne]: id },
      },
      order: [['position', 'ASC']],
      transaction,
    });

    const safeTargetIndex = Math.min(Math.max(targetIndex, 0), cards.length);

    const prev = cards[safeTargetIndex - 1];
    const next = cards[safeTargetIndex];

    let newPosition: number;

    if (prev && next) {
      newPosition = (prev.position + next.position) / 2;
    } else if (prev) {
      newPosition = prev.position + POSITION_STEP;
    } else if (next) {
      newPosition = next.position / 2;
    } else {
      newPosition = POSITION_STEP;
    }

    return card.update(
      {
        columnId,
        position: newPosition,
      },
      { transaction },
    );
  });
};

export const deleteCard = async (id: string) => {
  const card = await Card.findByPk(id);
  if (!card) {
    throw new NotFoundError('Card');
  }
  return await card.destroy();
};
