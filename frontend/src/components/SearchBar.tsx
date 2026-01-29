import { Box, Button, TextField, Stack } from '@mui/material'
import { useRef } from 'react'

export default function SearchBar() {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        if (!inputRef.current) return
        const boardId = inputRef.current.value
        console.log('Loading board with ID:', boardId)
        // Add logic to load the board using the entered ID
    }

    return (
        <Box padding={2}>
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                maxWidth={800}
                margin="0 auto"
            >
                <TextField
                    inputRef={inputRef}
                    onFocus={(e) => e.target.select()}
                    placeholder="Enter board ID..."
                    variant="outlined"
                    size="small"
                    fullWidth
                />
                <Button onClick={handleClick} variant="contained" size="medium">
                    Load
                </Button>
            </Stack>
        </Box>
    )
}
