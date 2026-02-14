import apiClient from './client'
import { Card } from '../types'

export const createCard = (payload: {
    columnId: string
    title: string
    description: string
}) => apiClient.post<Card>('/cards', payload).then((res) => res.data)

export const updateCard = (id: string, payload: Partial<Card>) =>
    apiClient.put<Card>(`/cards/${id}`, payload).then((res) => res.data)

export const moveCard = (id: string, payload: Partial<Card>) =>
    apiClient.patch<Card>(`/cards/${id}/move`, payload).then((res) => res.data)

export const deleteCard = (id: string) =>
    apiClient.delete<void>(`/cards/${id}`).then((res) => res.data)
