import {
    Box,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { editCard, removeCard } from '../store/slices/cardSlice'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edit Card</DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        minWidth: 360,
                        mt: 1,
                    }}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        margin="dense"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        multiline
                        minRows={3}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Delete Card</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{title}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
