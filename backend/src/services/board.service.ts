import { Card, Column, Board } from '../models';
import { CreateBoardInput, UpdateBoardInput } from '../schemas/board.schema';
import { NotFoundError } from '../utils/errors';

export const getBoard = async (id: string) => {
  const board = await Board.findByPk(id, {
    include: [
      {
        model: Column,
        as: 'columns',
        separate: true,
        order: [['position', 'ASC']],
        include: [
          {
            model: Card,
            as: 'cards',
            separate: true,
            order: [['position', 'ASC']],
          },
        ],
      },
    ],
  });
  if (!board) {
    throw new NotFoundError('Board');
  }
  return board;
};

export const createBoard = async (boardData: CreateBoardInput) => {
  const board = await Board.create(boardData);
  const defaultColumns = [
    { title: 'To Do', position: 1000, boardId: board.id },
    { title: 'In Progress', position: 2000, boardId: board.id },
    { title: 'Done', position: 3000, boardId: board.id },
  ];
  await Column.bulkCreate(defaultColumns);

  return await Board.findByPk(board.id, {
    include: [
      {
        model: Column,
        as: 'columns',
        separate: true,
        order: [['position', 'ASC']],
      },
    ],
  });
};

export const updateBoard = async (id: string, boardData: UpdateBoardInput) => {
  const board = await Board.findByPk(id);
  if (!board) {
    throw new NotFoundError('Board');
  }
  return await board.update(boardData);
};

export const deleteBoard = async (id: string) => {
  const board = await Board.findByPk(id);
  if (!board) {
    throw new NotFoundError('Board');
  }
  return await board.destroy();
};
