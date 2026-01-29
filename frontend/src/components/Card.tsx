import { Box, IconButton, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

type CardProps = {
    title: string
    description: string
}

export default function Card({ title, description }: CardProps) {
    return (
        <Box
            border="1px solid"
            borderColor="grey.300"
            borderRadius={2}
            padding={2}
            bgcolor="background.paper"
            boxShadow={1}
            width={450}
        >
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
                {title}
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={2}>
                {description}
            </Typography>

            <Box display="flex" justifyContent="flex-end" gap={1}>
                <IconButton size="small" color="primary">
                    <EditIcon fontSize="small" />
                </IconButton>

                <IconButton size="small" color="error">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    )
}
