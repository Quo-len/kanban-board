import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Card } from '../../types'
import * as api from '../../api'

export interface CardState {
    creatingCard: boolean
    error: string | null
}

const initialState: CardState = {
    creatingCard: false,
    error: null,
}

export const addCard = createAsyncThunk(
    'card/createCard',
    async (
        payload: {
            columnId: string
            title: string
            description: string
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.createCard(payload)
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const editCard = createAsyncThunk(
    'card/updateCard',
    async (
        { id, payload }: { id: string; payload: Partial<Card> },
        { rejectWithValue }
    ) => {
        try {
            return await api.updateCard(id, payload)
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const moveCardPosition = createAsyncThunk(
    'card/moveCard',
    async (
        { id, payload }: { id: string; payload: Partial<Card> },
        { rejectWithValue }
    ) => {
        try {
            return await api.moveCard(id, payload)
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const removeCard = createAsyncThunk(
    'card/deleteCard',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.deleteCard(id)
            return id
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const cardSlice = createSlice({
    name: 'card',
    initialState,
    reducers: {
        clearCardError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addCard.pending, (state) => {
                state.creatingCard = true
                state.error = null
            })
            .addCase(addCard.fulfilled, (state) => {
                state.creatingCard = false
            })
            .addCase(addCard.rejected, (state, action) => {
                state.creatingCard = false
                state.error = action.payload as string
            })
            .addCase(editCard.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(moveCardPosition.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(removeCard.rejected, (state, action) => {
                state.error = action.payload as string
            })
    },
})

export const { clearCardError } = cardSlice.actions
export default cardSlice.reducer
