import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
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
        builder
            .addCase(fetchBoard.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchBoard.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                saveBoardId(action.payload.id)
            })
            .addCase(fetchBoard.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(createNewBoard.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createNewBoard.fulfilled, (state, action) => {
                state.loading = false
                saveBoardId(action.payload.id)
                state.data = action.payload
            })
            .addCase(createNewBoard.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(updateBoardName.fulfilled, (state, action) => {
                if (state.data) {
                    saveBoardId(state.data.id)
                    state.data.name = action.payload.name
                }
            })
            .addCase(deleteCurrentBoard.fulfilled, (state) => {
                deleteBoardId()
                state.data = null
            })
            .addCase(addCard.fulfilled, (state, action) => {
                if (!state.data) return
                const card = action.payload
                const column = state.data.columns.find(
                    (col) => col.id === card.columnId
                )
                if (!column) return
                column.cards.push(card)
                column.cards.sort((a, b) => a.position - b.position)
            })
            .addCase(editCard.fulfilled, (state, action) => {
                if (!state.data) return
                const updated = action.payload
                for (const col of state.data.columns) {
                    const index = col.cards.findIndex(
                        (c) => c.id === updated.id
                    )
                    if (index !== -1) {
                        if (col.id !== updated.columnId) {
                            col.cards.splice(index, 1)
                        } else {
                            col.cards[index] = {
                                ...col.cards[index],
                                ...updated,
                            }
                            col.cards.sort((a, b) => a.position - b.position)
                        }
                        break
                    }
                }
                const target = state.data.columns.find(
                    (col) => col.id === updated.columnId
                )
                if (target && !target.cards.find((c) => c.id === updated.id)) {
                    target.cards.push(updated)
                    target.cards.sort((a, b) => a.position - b.position)
                }
            })
            .addCase(moveCardPosition.fulfilled, (state, action) => {
                if (!state.data) return
                const moved = action.payload
                for (const col of state.data.columns) {
                    const index = col.cards.findIndex((c) => c.id === moved.id)
                    if (index !== -1) {
                        col.cards.splice(index, 1)
                        break
                    }
                }
                const target = state.data.columns.find(
                    (col) => col.id === moved.columnId
                )
                if (!target) return
                target.cards.push(moved)
                target.cards.sort((a, b) => a.position - b.position)
            })
            .addCase(removeCard.fulfilled, (state, action) => {
                if (!state.data) return
                const id = action.payload
                for (const col of state.data.columns) {
                    const index = col.cards.findIndex((c) => c.id === id)
                    if (index !== -1) {
                        col.cards.splice(index, 1)
                        break
                    }
                }
            })
    },
})

export const { clearBoard, clearBoardData } = boardSlice.actions
export default boardSlice.reducer
