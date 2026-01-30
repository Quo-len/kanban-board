import { Box, Button, TextField, Stack, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useEffect, useRef, useState } from 'react'
import { loadBoardId } from '../utils/storage'
import Popup from './Popup'

type SearchBarProps = {
    onLoadBoard: (boardId: string) => void
    onCreate: (name: string) => Promise<any>
    loading?: boolean
    creatingBoard?: boolean
}

export default function SearchBar({
    onLoadBoard,
    onCreate,
    loading,
    creatingBoard,
}: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [inputValue, setInputValue] = useState('')
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [newBoardName, setNewBoardName] = useState('')

    useEffect(() => {
        const savedBoardId = loadBoardId()
        if (savedBoardId && inputRef.current) {
            setInputValue(savedBoardId)
            inputRef.current.value = savedBoardId
        }
    }, [])

    const handleClick = () => {
        if (!inputRef.current) return
        const boardId = inputRef.current.value.trim()
        onLoadBoard(boardId)
    }

    const handleOpenCreateDialog = () => {
        setNewBoardName('')
        setCreateDialogOpen(true)
    }

    const handleCreateBoard = async () => {
        if (!newBoardName.trim()) return
        try {
            await onCreate(newBoardName.trim())
            setCreateDialogOpen(false)
        } catch (error) {
            // Error is handled in parent component
        }
    }

    return (
        <Box padding={1}>
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                maxWidth={800}
                margin="0 auto"
            >
                <TextField
                    inputRef={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    placeholder="Enter board ID..."
                    variant="outlined"
                    size="small"
                    fullWidth
                />
                <Button
                    onClick={handleClick}
                    variant="contained"
                    size="medium"
                    disabled={loading || creatingBoard}
                >
                    {loading ? 'Loading...' : 'Load'}
                </Button>
                <IconButton
                    onClick={handleOpenCreateDialog}
                    size="large"
                    color="primary"
                    title="Create new board"
                    disabled={creatingBoard}
                >
                    <AddIcon />
                </IconButton>
            </Stack>

            <Popup
                title="Create New Board"
                createDialogOpen={createDialogOpen}
                setCreateDialogOpen={setCreateDialogOpen}
                boardName={newBoardName}
                setBoardName={setNewBoardName}
                handleBoardAction={handleCreateBoard}
                isUpdating={creatingBoard || false}
            />
        </Box>
    )
}
