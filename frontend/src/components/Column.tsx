import { Box, Stack, Typography } from '@mui/material'
import Card from './Card'

type ColumnProps = {
    column: any
}

export default function Column({ column }: ColumnProps) {
    return (
        <Box>
            <Typography textAlign="center" variant="h6" mb={1}>
                {column.title}
            </Typography>
            <Stack
                border="1px solid"
                borderRadius={2}
                bgcolor="grey.300"
                direction="column"
                spacing={1.5}
                height="calc(90vh - 120px)"
                minWidth={300}
                width="100%"
                alignItems="center"
                paddingTop={2}
                paddingBottom={2}
                overflow="auto"
            >
                {column.cards.map((card: any) => (
                    <Card key={card.id} {...card} />
                ))}
            </Stack>
        </Box>
    )
}
