import { Box, IconButton, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { editCard, removeCard } from '../store/slices/cardSlice'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CardDialog from './CardDialog'
import ConfirmDialog from './ConfirmDialog'

type CardProps = {
    id: string
    columnId: string
    title: string
    description: string
}

export default function Card({ id, columnId, title, description }: CardProps) {
    const dispatch = useAppDispatch()
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `card-${id}`,
        data: { cardId: id, columnId },
    })
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [editTitle, setEditTitle] = useState(title)
    const [editDescription, setEditDescription] = useState(description || '')
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleOpenEdit = () => {
        setEditTitle(title)
        setEditDescription(description || '')
        setEditOpen(true)
    }

    const handleSave = async () => {
        if (!editTitle.trim()) {
            return
        }
        setIsUpdating(true)
        try {
            await dispatch(
                editCard({
                    id,
                    payload: {
                        title: editTitle.trim(),
                        description: editDescription.trim(),
                        columnId,
                    },
                })
            ).unwrap()
            setEditOpen(false)
        } catch (error) {
            console.error('Failed to update card:', error)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await dispatch(removeCard(id)).unwrap()
            setDeleteOpen(false)
        } catch (error) {
            console.error('Failed to delete card:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Box
            ref={setNodeRef}
            border="1px solid"
            borderColor="grey.300"
            borderRadius={2}
            padding={2}
            bgcolor="background.paper"
            boxShadow={1}
            width="100%"
            maxWidth={450}
            boxSizing="border-box"
            data-card-id={id}
            data-column-id={columnId}
            {...attributes}
            {...listeners}
            sx={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.6 : 1,
                cursor: 'grab',
                touchAction: 'none',
            }}
        >
            <Typography
                variant="subtitle1"
                fontWeight={600}
                mb={1}
                sx={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
            >
                {title}
            </Typography>

            {description && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                    sx={{
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {description}
                </Typography>
            )}

            <Box display="flex" justifyContent="flex-end" gap={1}>
                <IconButton
                    size="small"
                    color="primary"
                    onClick={handleOpenEdit}
                >
                    <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteOpen(true)}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>

            <CardDialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                title="Edit Card"
                titleValue={editTitle}
                onTitleChange={setEditTitle}
                descriptionValue={editDescription}
                onDescriptionChange={setEditDescription}
                onSubmit={handleSave}
                isLoading={isUpdating}
                submitLabel="Save"
            />

            <ConfirmDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                title="Delete Card"
                message={`Are you sure you want to delete "${title}"?`}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                confirmLabel="Delete"
                color="error"
            />
        </Box>
    )
}
