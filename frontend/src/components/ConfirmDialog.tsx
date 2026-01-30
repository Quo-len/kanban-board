import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material'

type ConfirmDialogProps = {
    open: boolean
    onClose: () => void
    title: string
    message: string
    onConfirm: () => void
    isLoading: boolean
    confirmLabel?: string
    color?: 'error' | 'primary'
}

export default function ConfirmDialog({
    open,
    onClose,
    title,
    message,
    onConfirm,
    isLoading,
    confirmLabel = 'Confirm',
    color = 'primary',
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={color}
                    disabled={isLoading}
                >
                    {isLoading ? 'Please wait...' : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
