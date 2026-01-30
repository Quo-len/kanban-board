import { Box, IconButton, Stack, Typography } from '@mui/material'
import Card from './Card'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { Column as ColumnType } from '../types'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addCard } from '../store/slices/cardSlice'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import CardDialog from './CardDialog'

type ColumnProps = {
    column: ColumnType
}

export default function Column({ column }: ColumnProps) {
    const dispatch = useAppDispatch()
    const creatingCard = useAppSelector((state) => state.card.creatingCard)
    const [createOpen, setCreateOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const { setNodeRef, isOver } = useDroppable({
        id: `column-${column.id}`,
        data: { columnId: column.id },
    })
    const cardIds = (column.cards || []).map((card) => `card-${card.id}`)

    const handleNewCard = () => {
        setTitle('')
        setDescription('')
        setCreateOpen(true)
    }

    const handleCreate = async () => {
        if (!title.trim()) {
            return
        }
        try {
            await dispatch(
                addCard({
                    columnId: column.id,
                    title: title.trim(),
                    description: description.trim(),
                })
            ).unwrap()
            setCreateOpen(false)
        } catch (error) {
            console.error('Failed to create card:', error)
        }
    }

    return (
        <Box data-column-id={column.id}>
            <Typography textAlign="center" variant="h6" mb={1}>
                {column.title}
            </Typography>
            <Stack
                ref={setNodeRef}
                border="1px solid"
                borderRadius={2}
                bgcolor="grey.300"
                direction="column"
                spacing={1.5}
                height="calc(90vh - 145px)"
                minWidth={300}
                width="100%"
                alignItems="center"
                paddingTop={2}
                paddingBottom={2}
                overflow="auto"
                sx={{
                    outline: isOver ? '2px dashed' : 'none',
                    outlineColor: isOver ? 'primary.main' : 'transparent',
                    transition: 'outline-color 0.2s ease',
                }}
            >
                <SortableContext
                    items={cardIds}
                    strategy={verticalListSortingStrategy}
                >
                    {(column.cards || []).map((card) => (
                        <Card key={card.id} {...card} />
                    ))}
                </SortableContext>
                <IconButton
                    onClick={handleNewCard}
                    size="large"
                    color="primary"
                >
                    <AddIcon fontSize="large" />
                </IconButton>
            </Stack>

            <CardDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                title="Add Card"
                titleValue={title}
                onTitleChange={setTitle}
                descriptionValue={description}
                onDescriptionChange={setDescription}
                onSubmit={handleCreate}
                isLoading={creatingCard}
                submitLabel="Add"
            />
        </Box>
    )
}
