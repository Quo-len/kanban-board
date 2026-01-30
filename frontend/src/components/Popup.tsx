import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material'

type PopupProps = {
    title: string
    createDialogOpen: boolean
    setCreateDialogOpen: (open: boolean) => void
    boardName: string
    setBoardName: (name: string) => void
    handleBoardAction: () => void
    isUpdating: boolean
}

export default function Popup({
    title,
    createDialogOpen,
    setCreateDialogOpen,
    boardName,
    setBoardName,
    handleBoardAction,
    isUpdating,
}: PopupProps) {
    return (
        <Dialog
            open={createDialogOpen}
            onClose={() => setCreateDialogOpen(false)}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Board Name"
                    fullWidth
                    variant="outlined"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleBoardAction()
                        }
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                </Button>
                <Button
                    onClick={handleBoardAction}
                    variant="contained"
                    disabled={isUpdating || !boardName.trim()}
                >
                    {isUpdating ? 'Creating...' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
