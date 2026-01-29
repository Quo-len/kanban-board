import { Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Column from './Column'

type Column = {
    id: string | number
    [key: string]: any
}

type BoardProps = {
    board: {
        name: string
        columns: Column[]
    }
}

export default function Board({ board }: BoardProps) {
    return (
        <Box padding={2}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box flex={1} />
                <Typography variant="h4" fontWeight={400}>
                    {board.name}
                </Typography>
                <Box flex={1} display="flex" justifyContent="flex-end" gap={1}>
                    <IconButton size="large" color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton size="large" color="error">
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
                {board.columns.map((column) => (
                    <Box key={column.id} flex={1}>
                        <Column column={column} />
                    </Box>
                ))}
            </Stack>
        </Box>
    )
}
