import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit'
import { Board } from '../../types'
import * as api from '../../api'
import { saveBoardId, deleteBoardId } from '../../utils/storage'
import { addCard, editCard, removeCard, moveCardPosition } from './cardSlice'

export interface BoardState {
    data: Board | null
    loading: boolean
    error: string | null
}

const initialState: BoardState = {
    data: null,
    loading: false,
    error: null,
}

const sortCards = (cards: Board['columns'][number]['cards']) =>
    cards.sort((a, b) => a.position - b.position)

const removeCardFromColumns = (columns: Board['columns'], cardId: string) => {
    for (const column of columns) {
        const cards = column.cards || []
        const index = cards.findIndex((card) => card.id === cardId)
        if (index !== -1) {
            return cards.splice(index, 1)[0]
        }
    }

    return null
}

const upsertCardInColumn = (
    column: Board['columns'][number],
    card: Board['columns'][number]['cards'][number]
) => {
    if (!column.cards) {
        column.cards = []
    }
    const index = column.cards.findIndex((item) => item.id === card.id)
    if (index === -1) {
        column.cards.push(card)
    } else {
        column.cards[index] = { ...column.cards[index], ...card }
    }
    sortCards(column.cards)
}

export const fetchBoard = createAsyncThunk(
    'board/fetchBoard',
    async (id: string, { rejectWithValue }) => {
        try {
            return await api.getBoard(id)
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const createNewBoard = createAsyncThunk(
    'board/createBoard',
    async (name: string, { rejectWithValue }) => {
        try {
            return await api.createBoard(name)
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateBoardName = createAsyncThunk(
    'board/updateBoard',
    async ({ id, name }: { id: string; name: string }, { rejectWithValue }) => {
        try {
            return await api.updateBoard(id, name)
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const deleteCurrentBoard = createAsyncThunk(
    'board/deleteBoard',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.deleteBoard(id)
            return null
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        clearBoard: (state) => {
            state.data = null
            state.error = null
        },
        clearBoardData: (state) => {
            state.data = null
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updateBoardName.fulfilled, (state, action) => {
            if (state.data) {
                saveBoardId(state.data.id)
                state.data.name = action.payload.name
            }
        })
        builder.addCase(deleteCurrentBoard.fulfilled, (state) => {
            deleteBoardId()
            state.data = null
        })
        builder.addCase(addCard.fulfilled, (state, action) => {
            if (!state.data) return
            const card = action.payload
            const column = state.data.columns.find(
                (col) => col.id === card.columnId
            )
            if (!column) return
            upsertCardInColumn(column, card)
        })
        builder.addCase(editCard.fulfilled, (state, action) => {
            if (!state.data) return
            const updated = action.payload
            removeCardFromColumns(state.data.columns, updated.id)
            const target = state.data.columns.find(
                (col) => col.id === updated.columnId
            )
            if (!target) return
            upsertCardInColumn(target, updated)
        })
        builder.addCase(moveCardPosition.fulfilled, (state, action) => {
            if (!state.data) return
            const moved = action.payload
            removeCardFromColumns(state.data.columns, moved.id)
            const target = state.data.columns.find(
                (col) => col.id === moved.columnId
            )
            if (!target) return
            upsertCardInColumn(target, moved)
        })
        builder.addCase(removeCard.fulfilled, (state, action) => {
            if (!state.data) return
            const id = action.payload
            removeCardFromColumns(state.data.columns, id)
        })
        builder.addMatcher(
            isAnyOf(fetchBoard.pending, createNewBoard.pending),
            (state) => {
                state.loading = true
                state.error = null
            }
        )
        builder.addMatcher(
            isAnyOf(fetchBoard.fulfilled, createNewBoard.fulfilled),
            (state, action) => {
                state.loading = false
                state.data = action.payload
                saveBoardId(action.payload.id)
            }
        )
        builder.addMatcher(
            isAnyOf(fetchBoard.rejected, createNewBoard.rejected),
            (state, action) => {
                state.loading = false
                state.error = action.payload as string
            }
        )
    },
})

export const { clearBoard, clearBoardData } = boardSlice.actions
export default boardSlice.reducer
