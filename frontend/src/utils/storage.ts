const STORAGE_KEY = 'boardId'

export const saveBoardId = (boardId: string) => {
    try {
        localStorage.setItem(STORAGE_KEY, boardId)
    } catch (error) {
        console.error('Failed to save board ID to localStorage:', error)
    }
}

export const loadBoardId = (): string | null => {
    try {
        return localStorage.getItem(STORAGE_KEY)
    } catch (error) {
        console.error('Failed to load board ID from localStorage:', error)
        return null
    }
}

export const deleteBoardId = () => {
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
        console.error('Failed to delete board ID from localStorage:', error)
    }
}
