import axios, { AxiosInstance } from 'axios'
import { Board, Card } from '../types'

const BASE_URL =
    process.env.REACT_APP_API_URL?.replace(/\/$/, '') ||
    'http://localhost:4000/api'

const client: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Error interceptor
client.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.error?.message ||
            error.response?.data?.message ||
            error.message ||
            'Request failed'
        return Promise.reject(new Error(message))
    }
)

export const getBoard = (id: string) =>
    client.get<Board>(`/boards/${id}`).then((res) => res.data)

export const createBoard = (name: string) =>
    client.post<Board>('/boards', { name }).then((res) => res.data)

export const updateBoard = (id: string, name: string) =>
    client.put<Board>(`/boards/${id}`, { name }).then((res) => res.data)

export const deleteBoard = (id: string) => client.delete<void>(`/boards/${id}`)

export const createCard = (payload: {
    columnId: string
    title: string
    description: string
}) => client.post<Card>('/cards', payload).then((res) => res.data)

export const updateCard = (id: string, payload: Partial<Card>) =>
    client.put<Card>(`/cards/${id}`, payload).then((res) => res.data)

export const moveCard = (id: string, payload: Partial<Card>) =>
    client.patch<Card>(`/cards/${id}/move`, payload).then((res) => res.data)

export const deleteCard = (id: string) =>
    client.delete<void>(`/cards/${id}`).then((res) => res.data)
