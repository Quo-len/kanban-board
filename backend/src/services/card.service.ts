import { Op, Transaction } from 'sequelize';
import { Column, Card } from '../models';
import { CreateCardInput, UpdateCardInput } from '../schemas/card.schema';
import { NotFoundError } from '../utils/errors';
import sequelize from '../db';

const POSITION_STEP = 5120;
const MIN_GAP = 1;

const getHighestPositionCard = async (columnId: string) => {
  const card = await Card.findOne({
    where: { columnId },
    order: [['position', 'DESC']],
  });
  return card;
};

const rebalanceColumn = async (
  columnId: string,
  transaction: Transaction,
  excludeCardId?: string,
) => {
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

  return cards.filter((card) => card.id !== excludeCardId);
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

    if (cards.length > 1) {
      let minGap = Infinity;
      for (let i = 1; i < cards.length; i++) {
        const gap = cards[i].position - cards[i - 1].position;
        if (gap < minGap) minGap = gap;
      }

      if (minGap < MIN_GAP) {
        console.log('Rebalancing column due to global insufficient gap');
        cards = await rebalanceColumn(columnId, transaction, id);
      }
    }

    const safeTargetIndex = Math.min(Math.max(targetIndex, 0), cards.length);

    const prev = cards[safeTargetIndex - 1];
    const next = cards[safeTargetIndex];

    let newPosition: number;

    if (prev && next) {
      newPosition = (prev.position + next.position) / 2;

      if (next.position - prev.position < MIN_GAP) {
        console.log('Rebalancing column due to insufficient gap');
        const refreshed = await rebalanceColumn(columnId, transaction, id);

        const newPrev = refreshed[safeTargetIndex - 1];
        const newNext = refreshed[safeTargetIndex];

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
