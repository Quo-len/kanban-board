import { Box, Divider } from '@mui/material'
import Card from './components/Card'
import Board from './components/Board'
import SearchBar from './components/SearchBar'

const board = {
    id: '332ba9b9-ef4c-4853-95d6-8884679b7d98',
    name: 'test name',
    columns: [
        {
            id: '5b0904d6-1bff-42f2-b929-90326a4079ab',
            boardId: '332ba9b9-ef4c-4853-95d6-8884679b7d98',
            title: 'To Do',
            position: 1000,
            cards: [
                {
                    id: '7784ecd4-d51d-42e1-ac5b-91769c5b4b84',
                    columnId: '5b0904d6-1bff-42f2-b929-90326a4079ab',
                    title: 'move card',
                    description:
                        'test descriptiontest descriptiontest descriptiontest descriptiontest descriptiontest description',
                    position: 512,
                },
                {
                    id: 'e6c45c24-bb25-40e2-9658-29eb3ecb787e',
                    columnId: '5b0904d6-1bff-42f2-b929-90326a4079ab',
                    title: 'test card 1',
                    description: 'test description',
                    position: 1024,
                },
                {
                    id: 'f9bc586c-3f77-4b04-a031-badf49e56707',
                    columnId: '5b0904d6-1bff-42f2-b929-90326a4079ab',
                    title: 'test card 2',
                    description: 'test description',
                    position: 2048,
                },
                {
                    id: '4af72218-6b65-4240-b505-d1894ab09383',
                    columnId: '5b0904d6-1bff-42f2-b929-90326a4079ab',
                    title: 'test card 3',
                    description: 'test description',
                    position: 3072,
                },
                {
                    id: '4af72218-6b65-4240-b505-d1894ab09383',
                    columnId: '5b0904d6-1bff-42f2-b929-90326a4079ab',
                    title: 'test card 3',
                    description: 'test description',
                    position: 3072,
                },
            ],
        },
        {
            id: '1c62678a-ce46-4c8f-aced-b43468acad5c',
            boardId: '332ba9b9-ef4c-4853-95d6-8884679b7d98',
            title: 'In Progress',
            position: 2000,
            cards: [],
        },
        {
            id: 'fb4cdf77-45ea-47e1-8dfc-2927fe623a07',
            boardId: '332ba9b9-ef4c-4853-95d6-8884679b7d98',
            title: 'Done',
            position: 3000,
            cards: [
                {
                    id: '0d6ee57d-de20-4106-9e00-7e170d3adfab',
                    columnId: 'fb4cdf77-45ea-47e1-8dfc-2927fe623a07',
                    title: 'test card 2',
                    description: 'test description',
                    position: 1024,
                },
            ],
        },
    ],
}

function App() {
    return (
        <Box className="App">
            <SearchBar />
            <Divider />
            <Board board={board} />
        </Box>
    )
}

export default App
