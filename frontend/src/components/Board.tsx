import {
    Box,
    Divider,
    IconButton,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import {
    updateBoardName,
    deleteCurrentBoard,
    clearBoard,
} from '../store/slices/boardSlice'
import Column from './Column'
import { Board as BoardType } from '../types'
import Popup from './Popup'
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { moveCardPosition } from '../store/slices/cardSlice'

type BoardProps = {
    board: BoardType
}

export default function Board({ board }: BoardProps) {
    const dispatch = useAppDispatch()
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        })
    )
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [newName, setNewName] = useState(board.name)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleEditName = () => {
        setNewName(board.name)
        setEditDialogOpen(true)
    }

    const handleSaveName = async () => {
        if (!newName.trim()) {
            return
        }
        setIsUpdating(true)
        try {
            await dispatch(
                updateBoardName({ id: board.id, name: newName.trim() })
            ).unwrap()
            setEditDialogOpen(false)
        } catch (error) {
            // Error is handled by Redux state and displayed in App component
            console.error('Failed to update board name:', error)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteBoard = () => {
        setDeleteConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        setIsDeleting(true)
        try {
            await dispatch(deleteCurrentBoard(board.id)).unwrap()
            dispatch(clearBoard())
        } catch (error) {
            // Error is handled by Redux state and displayed in App component
            console.error('Failed to delete board:', error)
        } finally {
            setIsDeleting(false)
            setDeleteConfirmOpen(false)
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return

        const activeData = active.data.current as
            | { cardId: string; columnId: string }
            | undefined
        if (!activeData?.cardId) return

        const overData = over.data.current as
            | { cardId?: string; columnId?: string }
            | undefined

        let targetColumnId = overData?.columnId
        let targetIndex: number | null = null

        const findColumnById = (columnId?: string) =>
            board.columns.find((col) => col.id === columnId)

        const findCardLocation = (cardId?: string) => {
            if (!cardId) return null
            for (const col of board.columns) {
                const index = col.cards.findIndex((c) => c.id === cardId)
                if (index !== -1) return { columnId: col.id, index }
            }
            return null
        }

        const overCard = overData?.cardId
            ? findCardLocation(overData.cardId)
            : null

        if (overCard) {
            targetColumnId = overCard.columnId
            const column = findColumnById(targetColumnId)
            if (!column) return
            const activeLoc = findCardLocation(activeData.cardId)
            if (!activeLoc) return

            if (targetColumnId === activeLoc.columnId) {
                targetIndex =
                    activeLoc.index < overCard.index
                        ? overCard.index - 1
                        : overCard.index
            } else {
                targetIndex = overCard.index
            }
        } else if (targetColumnId) {
            const column = findColumnById(targetColumnId)
            if (!column) return
            const activeLoc = findCardLocation(activeData.cardId)
            if (!activeLoc) return
            targetIndex =
                targetColumnId === activeLoc.columnId
                    ? Math.max(column.cards.length - 1, 0)
                    : column.cards.length
        }

        if (!targetColumnId || targetIndex === null) return

        try {
            await dispatch(
                moveCardPosition({
                    id: activeData.cardId,
                    payload: { columnId: targetColumnId, targetIndex },
                })
            ).unwrap()
        } catch (error) {
            console.error('Failed to move card:', error)
        }
    }

    return (
        <Box padding={2}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box flex={1}></Box>
                <Typography variant="h4" fontWeight={400}>
                    {board.name}
                </Typography>
                <Box flex={1} display="flex" justifyContent="flex-end" gap={1}>
                    <IconButton
                        onClick={handleEditName}
                        size="large"
                        color="primary"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleDeleteBoard}
                        size="large"
                        color="error"
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>
            <Divider />
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <Stack
                    direction="row"
                    marginTop={1}
                    spacing={2}
                    width="100%"
                    flex={1}
                    minWidth={300}
                >
                    {board.columns &&
                        board.columns.map((column) => (
                            <Box key={column.id} flex={1}>
                                <Column column={column} />
                            </Box>
                        ))}
                </Stack>
            </DndContext>

            <Popup
                title="Edit Board Name"
                createDialogOpen={editDialogOpen}
                setCreateDialogOpen={setEditDialogOpen}
                boardName={newName}
                setBoardName={setNewName}
                handleBoardAction={handleSaveName}
                isUpdating={isUpdating}
            />

            {/* Delete Board Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Delete Board</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{board.name}"? This
                        action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
