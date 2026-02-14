import apiClient from './client'
import { Board } from '../types'

export const getBoard = (id: string) =>
    apiClient.get<Board>(`/boards/${id}`).then((res) => res.data)

export const createBoard = (name: string) =>
    apiClient.post<Board>('/boards', { name }).then((res) => res.data)

export const updateBoard = (id: string, name: string) =>
    apiClient.put<Board>(`/boards/${id}`, { name }).then((res) => res.data)

export const deleteBoard = (id: string) =>
    apiClient.delete<void>(`/boards/${id}`)
