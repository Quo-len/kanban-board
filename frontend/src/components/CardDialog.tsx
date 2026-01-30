import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material'

type CardDialogProps = {
    open: boolean
    onClose: () => void
    title: string
    titleValue: string
    onTitleChange: (value: string) => void
    descriptionValue: string
    onDescriptionChange: (value: string) => void
    onSubmit: () => void
    isLoading: boolean
    submitLabel?: string
}

export default function CardDialog({
    open,
    onClose,
    title,
    titleValue,
    onTitleChange,
    descriptionValue,
    onDescriptionChange,
    onSubmit,
    isLoading,
    submitLabel = 'Save',
}: CardDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
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
                    value={titleValue}
                    onChange={(e) => onTitleChange(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Description"
                    margin="dense"
                    value={descriptionValue}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    multiline
                    minRows={3}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={isLoading || !titleValue.trim()}
                >
                    {isLoading ? 'Saving...' : submitLabel}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
