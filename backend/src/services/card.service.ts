import { Op, Transaction } from 'sequelize';
import { Column, Card } from '../models';
import { CreateCardInput, UpdateCardInput } from '../schemas/card.schema';
import { NotFoundError } from '../utils/errors';
import sequelize from '../db';

const POSITION_STEP = 1024;
const MIN_GAP = 1;

const getHighestPositionCard = async (columnId: string) => {
  const card = await Card.findOne({
    where: { columnId },
    order: [['position', 'DESC']],
  });
  return card;
};

const rebalanceColumn = async (columnId: string, transaction: Transaction) => {
  const cards = await Card.findAll({
    where: { columnId },
    order: [['position', 'ASC']],
    transaction,
  });

  for (let i = 0; i < cards.length; i++) {
    await cards[i].update(
      { position: (i + 1) * POSITION_STEP },
      { transaction },
    );
  }
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

    const cards = await Card.findAll({
      where: {
        columnId,
        id: { [Op.ne]: id },
      },
      order: [['position', 'ASC']],
      transaction,
    });

    const prev = cards[targetIndex - 1];
    const next = cards[targetIndex];

    let newPosition: number;

    if (prev && next) {
      newPosition = (prev.position + next.position) / 2;

      if (next.position - prev.position < MIN_GAP) {
        await rebalanceColumn(columnId, transaction);

        const refreshed = await Card.findAll({
          where: { columnId },
          order: [['position', 'ASC']],
          transaction,
        });

        const newPrev = refreshed[targetIndex - 1];
        const newNext = refreshed[targetIndex];

        newPosition =
          newPrev && newNext
            ? (newPrev.position + newNext.position) / 2
            : POSITION_STEP;
      }
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
