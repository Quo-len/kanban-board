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
import Popup from './Popup'

type Column = {
    id: string | number
    [key: string]: any
}

type BoardProps = {
    board: {
        id: string
        name: string
        columns: Column[]
    }
}

export default function Board({ board }: BoardProps) {
    const dispatch = useAppDispatch()
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
