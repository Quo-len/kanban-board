export type Card = {
    id: string
    columnId: string
    title: string
    description: string
    position: number
    targetIndex?: number
}

export type Column = {
    id: string
    boardId: string
    title: string
    position: number
    cards: Card[]
}

export type Board = {
    id: string
    name: string
    columns: Column[]
}
