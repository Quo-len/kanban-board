import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Board } from '../../types'
import * as api from '../../api'
import { saveBoardId, deleteBoardId } from '../../utils/storage'

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
    },
})

export const { clearBoard, clearBoardData } = boardSlice.actions
export default boardSlice.reducer
