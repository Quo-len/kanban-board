import { Box, Divider, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Board from './components/Board'
import SearchBar from './components/SearchBar'
import {
    fetchBoard,
    clearBoardData,
    createNewBoard,
} from './store/slices/boardSlice'
import { RootState, AppDispatch } from './store'
import { loadBoardId, deleteBoardId } from './utils/storage'

function App() {
    const dispatch = useDispatch<AppDispatch>()
    const {
        data: board,
        loading,
        error,
    } = useSelector((state: RootState) => state.board)

    useEffect(() => {
        const savedBoardId = loadBoardId()
        if (savedBoardId) {
            dispatch(fetchBoard(savedBoardId))
        }
    }, [dispatch])

    const handleLoadBoard = (boardId: string) => {
        if (!boardId) {
            return
        }
        dispatch(fetchBoard(boardId))
            .unwrap()
            .catch(() => {
                dispatch(clearBoardData())
                deleteBoardId()
            })
    }

    const handleCreateBoard = async (name: string) => {
        return dispatch(createNewBoard(name)).unwrap()
    }

    return (
        <Box
            className="App"
            overflow="hidden"
            height="100vh"
            display="flex"
            flexDirection="column"
        >
            <SearchBar
                onLoadBoard={handleLoadBoard}
                onCreate={handleCreateBoard}
                loading={loading}
                creatingBoard={loading}
            />
            <Divider />
            <Box padding={2}>
                {error && (
                    <Typography color="error" mb={2}>
                        {error}
                    </Typography>
                )}
                {board ? (
                    <Board board={board} />
                ) : (
                    <Typography
                        variant="h5"
                        fontWeight={400}
                        color="text.secondary"
                        textAlign="center"
                    >
                        Enter a board ID to load its columns and cards.
                    </Typography>
                )}
            </Box>
        </Box>
    )
}

export default App
